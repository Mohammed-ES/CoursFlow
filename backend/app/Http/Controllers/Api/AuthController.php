<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login admin and return API token
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $admin = User::where('email', $request->email)->first();

            if (!$admin || !Hash::check($request->password, $admin->password)) {
                throw ValidationException::withMessages([
                    'email' => ['Les identifiants fournis sont incorrects.'],
                ]);
            }

            // Create token
            $token = $admin->createToken('admin-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Connexion reussie',
                'token' => $token,
                'user' => [
                    'id' => $admin->id,
                    'name' => $admin->name ?? ($admin->first_name . ' ' . $admin->last_name),
                    'email' => $admin->email,
                    'role' => $admin->role,
                    'phone' => $admin->phone,
                    'avatar' => $admin->avatar,
                ]
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la connexion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout admin (revoke token)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            // Revoke current token
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la déconnexion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get authenticated admin info
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request)
    {
        try {
            $admin = $request->user();

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $admin->id,
                    'first_name' => $admin->first_name,
                    'last_name' => $admin->last_name,
                    'email' => $admin->email,
                    'phone' => $admin->phone,
                    'avatar' => $admin->avatar,
                    'full_name' => $admin->full_name,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des informations',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
