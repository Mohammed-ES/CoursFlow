<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Exception;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirectToGoogle()
    {
        try {
            return Socialite::driver('google')
                ->stateless()
                ->redirect();
        } catch (Exception $e) {
            Log::error('Google OAuth Redirect Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Unable to redirect to Google. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtain the user information from Google.
     *
     * @return \Illuminate\Http\Response
     */
    public function handleGoogleCallback()
    {
        try {
            // Get user info from Google
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Log the Google user data for debugging
            Log::info('Google OAuth User Data', [
                'id' => $googleUser->getId(),
                'email' => $googleUser->getEmail(),
                'name' => $googleUser->getName(),
            ]);

            // Check if user already exists
            $user = User::where('google_id', $googleUser->getId())
                       ->orWhere('email', $googleUser->getEmail())
                       ->first();

            if ($user) {
                // Update existing user with Google data
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'google_token' => $googleUser->token,
                    'avatar' => $googleUser->getAvatar(),
                ]);

                Log::info('Existing user logged in via Google', ['user_id' => $user->id]);
            } else {
                // Create new user
                $role = $this->determineUserRole($googleUser->getEmail());

                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'google_token' => $googleUser->token,
                    'avatar' => $googleUser->getAvatar(),
                    'role' => $role,
                    'email_verified_at' => now(), // Auto-verify email for Google users
                    'password' => null, // No password for OAuth users
                ]);

                // Create associated profile based on role
                $this->createUserProfile($user, $role);

                Log::info('New user created via Google', [
                    'user_id' => $user->id,
                    'role' => $role,
                    'email' => $user->email
                ]);
            }

            // Generate Sanctum token
            $token = $user->createToken('google-auth-token')->plainTextToken;

            // Determine dashboard redirect based on role
            $dashboardUrl = $this->getDashboardUrl($user->role);

            // Redirect to frontend with token and user data
            $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
            $redirectUrl = $frontendUrl . '/auth/callback?' . http_build_query([
                'token' => $token,
                'role' => $user->role,
                'user' => json_encode([
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar' => $user->avatar,
                ]),
                'dashboard' => $dashboardUrl,
            ]);

            return redirect($redirectUrl);

        } catch (Exception $e) {
            Log::error('Google OAuth Callback Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            // Redirect to frontend with error
            $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
            $errorUrl = $frontendUrl . '/login?error=' . urlencode('Google authentication failed. Please try again.');

            return redirect($errorUrl);
        }
    }

    /**
     * Determine user role based on email domain.
     *
     * @param string $email
     * @return string
     */
    private function determineUserRole(string $email): string
    {
        // Extract domain from email
        $domain = substr(strrchr($email, "@"), 1);

        // Role assignment logic
        if (str_contains($email, '@admin.edu')) {
            return 'admin';
        } elseif (str_contains($email, '@school.com')) {
            return 'teacher';
        } else {
            return 'student';
        }
    }

    /**
     * Create user profile based on role.
     *
     * @param User $user
     * @param string $role
     * @return void
     */
    private function createUserProfile(User $user, string $role): void
    {
        try {
            if ($role === 'teacher') {
                Teacher::create([
                    'user_id' => $user->id,
                    'bio' => 'Teacher profile created via Google OAuth',
                    'subject' => 'General',
                    'phone' => null,
                    'address' => null,
                ]);
            } elseif ($role === 'student') {
                Student::create([
                    'user_id' => $user->id,
                    'enrollment_date' => now(),
                    'status' => 'active',
                    'phone' => null,
                    'address' => null,
                    'date_of_birth' => null,
                ]);
            }
            // Admin users don't need additional profile
        } catch (Exception $e) {
            Log::error('Error creating user profile', [
                'user_id' => $user->id,
                'role' => $role,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get dashboard URL based on user role.
     *
     * @param string $role
     * @return string
     */
    private function getDashboardUrl(string $role): string
    {
        return match($role) {
            'admin' => '/admin/dashboard',
            'teacher' => '/teacher/dashboard',
            'student' => '/student/dashboard',
            default => '/student/dashboard',
        };
    }
}
