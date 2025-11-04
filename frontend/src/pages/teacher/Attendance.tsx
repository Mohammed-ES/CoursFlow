import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, BookOpen, CheckCircle2, XCircle, Clock, 
  Save, Users, CheckCheck
} from 'lucide-react';
import TeacherLayout from '../../components/layout/TeacherLayout';
import teacherAPI from '../../services/teacherAPI';
import toast from '../../utils/toast';

interface Student {
  id: number;
  user: {
    name: string;
    email: string;
  };
  student_code: string;
}

interface AttendanceRecord {
  student_id: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes: string;
}

const Attendance: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<number, AttendanceRecord>>(new Map());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch students when course or date changes
  useEffect(() => {
    if (selectedCourse) {
      fetchStudentsAndAttendance();
    }
  }, [selectedCourse, selectedDate]);

  const fetchCourses = async () => {
    try {
      const response = await teacherAPI.getCourses({});
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0].id.toString());
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudentsAndAttendance = async () => {
    try {
      setLoading(true);
      
      // Fetch students enrolled in the course
      const studentsResponse = await teacherAPI.getStudents({
        course_id: selectedCourse,
      });
      setStudents(studentsResponse.data);

      // Fetch existing attendance records
      const attendanceResponse = await teacherAPI.getAttendance({
        course_id: selectedCourse,
        date: selectedDate,
      });

      console.log('Attendance response:', attendanceResponse);

      // Build attendance map - backend returns paginated data
      const attendanceMap = new Map<number, AttendanceRecord>();
      
      // Handle paginated response (response.data is the pagination object)
      const attendanceRecords = attendanceResponse.data?.data || attendanceResponse.data || [];
      
      attendanceRecords.forEach((record: any) => {
        // Backend returns student object with id inside
        const studentId = record.student?.id || record.student_id;
        if (studentId) {
          attendanceMap.set(studentId, {
            student_id: studentId,
            status: record.status,
            notes: record.notes || '',
          });
        }
      });

      console.log('Built attendance map:', Array.from(attendanceMap.entries()));

      // Initialize missing students as absent
      studentsResponse.data.forEach((student: Student) => {
        if (!attendanceMap.has(student.id)) {
          attendanceMap.set(student.id, {
            student_id: student.id,
            status: 'absent',
            notes: '',
          });
        }
      });

      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: number, status: AttendanceRecord['status']) => {
    const newAttendance = new Map(attendance);
    const record = newAttendance.get(studentId) || {
      student_id: studentId,
      status: 'absent',
      notes: '',
    };
    newAttendance.set(studentId, { ...record, status });
    setAttendance(newAttendance);
  };

  const handleNotesChange = (studentId: number, notes: string) => {
    const newAttendance = new Map(attendance);
    const record = newAttendance.get(studentId) || {
      student_id: studentId,
      status: 'absent',
      notes: '',
    };
    newAttendance.set(studentId, { ...record, notes });
    setAttendance(newAttendance);
  };

  const handleMarkAll = (status: AttendanceRecord['status']) => {
    const newAttendance = new Map<number, AttendanceRecord>();
    students.forEach((student) => {
      const existing = attendance.get(student.id);
      newAttendance.set(student.id, {
        student_id: student.id,
        status,
        notes: existing?.notes || '',
      });
    });
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    try {
      setSaving(true);

      const attendanceRecords = Array.from(attendance.values())
        .filter((record) => record.student_id) // Only include records with valid student_id
        .map((record) => ({
          student_id: record.student_id,
          status: record.status,
          notes: record.notes || '',
        }));

      if (attendanceRecords.length === 0) {
        toast.error('No attendance records to save');
        setSaving(false);
        return;
      }

      await teacherAPI.bulkMarkAttendance({
        course_id: parseInt(selectedCourse),
        date: selectedDate,
        attendances: attendanceRecords,
      });

      toast.success('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Failed to save attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStatistics = () => {
    const total = students.length;
    const present = Array.from(attendance.values()).filter((r) => r.status === 'present').length;
    const absent = Array.from(attendance.values()).filter((r) => r.status === 'absent').length;
    const late = Array.from(attendance.values()).filter((r) => r.status === 'late').length;
    const excused = Array.from(attendance.values()).filter((r) => r.status === 'excused').length;
    const rate = total > 0 ? ((present + late) / total) * 100 : 0;

    return { total, present, absent, late, excused, rate };
  };

  const stats = getStatistics();

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'bg-success-main hover:bg-success-dark text-white';
      case 'absent':
        return 'bg-error-main hover:bg-error-dark text-white';
      case 'late':
        return 'bg-warning-main hover:bg-warning-dark text-white';
      case 'excused':
        return 'bg-secondary-main hover:bg-secondary-dark text-white';
      default:
        return 'bg-gray-300 hover:bg-gray-400 text-gray-700';
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Attendance Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Mark student attendance for your courses
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                  focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all
                  dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Course Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <BookOpen className="inline w-4 h-4 mr-2" />
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                  focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all
                  dark:bg-gray-700 dark:text-white"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {/* Total */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 
            p-5 rounded-xl shadow-md border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          {/* Present */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 
            p-5 rounded-xl shadow-md border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Present</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.present}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>

          {/* Absent */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 
            p-5 rounded-xl shadow-md border border-red-200 dark:border-red-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Absent</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.absent}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          {/* Late */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 
            p-5 rounded-xl shadow-md border border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">Late</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.late}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-500" />
            </div>
          </div>

          {/* Rate */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 
            p-5 rounded-xl shadow-md border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Rate</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.rate.toFixed(0)}%</p>
              </div>
              <CheckCheck className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </motion.div>

        {/* Attendance List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-main border-t-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No students enrolled
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                There are no students in this course yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {students.map((student, index) => {
                    const record = attendance.get(student.id);
                    return (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        {/* Student Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-primary-main to-secondary-main
                              flex items-center justify-center text-white font-bold text-lg shadow-md">
                              {student.user?.name?.charAt(0).toUpperCase() || student.name?.charAt(0).toUpperCase() || 'S'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {student.user?.name || student.name || 'Unknown Student'}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {student.student_code || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status Buttons */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleStatusChange(student.id, 'present')}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105
                                ${record?.status === 'present'
                                  ? 'bg-green-500 text-white shadow-lg'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                                }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleStatusChange(student.id, 'absent')}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105
                                ${record?.status === 'absent'
                                  ? 'bg-red-500 text-white shadow-lg'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                                }`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => handleStatusChange(student.id, 'late')}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105
                                ${record?.status === 'late'
                                  ? 'bg-orange-500 text-white shadow-lg'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                                }`}
                            >
                              Late
                            </button>
                            <button
                              onClick={() => handleStatusChange(student.id, 'excused')}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105
                                ${record?.status === 'excused'
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                                }`}
                            >
                              Excused
                            </button>
                          </div>
                        </td>

                        {/* Notes */}
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={record?.notes || ''}
                            onChange={(e) => handleNotesChange(student.id, e.target.value)}
                            placeholder="Add notes..."
                            className="w-full px-4 py-2 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-lg
                              focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all
                              dark:bg-gray-700 dark:text-white placeholder-gray-400"
                          />
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Save Button */}
        {students.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-end"
          >
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-main to-secondary-main 
                text-white rounded-xl font-semibold shadow-lg hover:shadow-xl
                transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed 
                disabled:hover:scale-100"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Saving Attendance...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Attendance
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default Attendance;
