import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Plus,
  X,
  Save,
  Edit,
  Trash2,
  Clock,
  MapPin,
  BookOpen,
  Repeat,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import TeacherLayout from '../../components/layout/TeacherLayout';
import teacherAPI from '../../services/teacherAPI';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface CalendarEvent {
  id: string; // FullCalendar requires string ID
  title: string;
  fullTitle?: string; // Original full title for modal display
  description?: string;
  start: string;
  end?: string;
  allDay?: boolean;
  originalStart?: string; // Original start time from API
  originalEnd?: string; // Original end time from API
  type: 'class' | 'exam' | 'meeting' | 'deadline' | 'holiday' | 'other';
  location?: string;
  course_id?: number;
  course?: {
    id: number;
    title: string;
  };
  is_recurring: boolean;
  recurrence_frequency?: 'daily' | 'weekly' | 'monthly';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
}

interface Course {
  id: number;
  title: string;
}

interface EventFormData {
  title: string;
  description: string;
  start: string;
  end: string;
  type: 'class' | 'exam' | 'meeting' | 'deadline' | 'holiday' | 'other';
  location: string;
  course_id: string;
  is_recurring: boolean;
  recurrence_frequency: 'daily' | 'weekly' | 'monthly';
}

const Calendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarApi, setCalendarApi] = useState<any>(null);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start: '',
    end: '',
    type: 'class',
    location: '',
    course_id: '',
    is_recurring: false,
    recurrence_frequency: 'weekly',
  });

  useEffect(() => {
    fetchEvents();
    fetchCourses();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getCalendarEvents({});
      console.log('📅 Events received:', response);
      
      // Group events by date to number them
      const eventsByDate: { [key: string]: any[] } = {};
      (response || []).forEach((event: any) => {
        const dateKey = new Date(event.start_time || event.start).toISOString().split('T')[0];
        if (!eventsByDate[dateKey]) {
          eventsByDate[dateKey] = [];
        }
        eventsByDate[dateKey].push(event);
      });
      
      // Format events for FullCalendar with numbered titles
      const formattedEvents = (response || []).map((event: any) => {
        const dateKey = new Date(event.start_time || event.start).toISOString().split('T')[0];
        const eventsOnSameDate = eventsByDate[dateKey];
        const eventNumber = eventsOnSameDate.findIndex((e: any) => e.id === event.id) + 1;
        
        return {
          id: event.id.toString(), // FullCalendar needs string ID
          title: `Event ${eventNumber}`, // Short display title
          fullTitle: event.title, // Keep original title for modal
          description: event.description,
          start: dateKey, // Use only date (no time) to make it all-day event
          allDay: true, // Mark as all-day event to prevent spanning
          type: event.type,
          location: event.location,
          course_id: event.course_id,
          course: event.course,
          is_recurring: event.is_recurring,
          recurrence_frequency: event.recurrence_frequency || event.recurring_pattern,
          color: getEventColor(event.type),
          backgroundColor: getEventColor(event.type),
          borderColor: getEventColor(event.type),
          // Store original times for modal display
          originalStart: event.start_time || event.start,
          originalEnd: event.end_time || event.end,
        };
      });
      
      console.log('📅 Formatted events for calendar:', formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await teacherAPI.getCourses({});
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'class':
        return '#3B82F6'; // blue
      case 'exam':
        return '#EF4444'; // red
      case 'meeting':
        return '#10B981'; // green
      case 'deadline':
        return '#F59E0B'; // orange
      case 'holiday':
        return '#8B5CF6'; // purple
      default:
        return '#6B7280'; // gray
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    resetForm();
    setFormData({
      ...formData,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    });
    setShowModal(true);
  };

  const handleDateClick = (dateClickInfo: any) => {
    // Show events for this specific date
    const clickedDate = dateClickInfo.dateStr;
    setSelectedDate(clickedDate);
    
    // Find events on this date
    const eventsOnDate = events.filter(event => {
      const eventDate = new Date(event.start).toISOString().split('T')[0];
      return eventDate === clickedDate;
    });
    
    // If no events, open create modal
    if (eventsOnDate.length === 0) {
      resetForm();
      setFormData({
        ...formData,
        start: clickedDate + 'T09:00:00',
        end: clickedDate + 'T10:00:00',
      });
      setShowModal(true);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id.toString();
    const event = events.find((e) => e.id.toString() === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowViewModal(true);
    }
  };

  const handleEventDrop = async (dropInfo: any) => {
    try {
      const eventId = parseInt(dropInfo.event.id);
      await teacherAPI.updateCalendarEvent(eventId, {
        start_time: dropInfo.event.startStr,
        end_time: dropInfo.event.endStr || dropInfo.event.startStr,
      });
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      dropInfo.revert();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: any = {
        title: formData.title,
        description: formData.description,
        start_time: formData.start,
        end_time: formData.end || formData.start,
        type: formData.type,
        location: formData.location,
        is_recurring: formData.is_recurring,
      };

      if (formData.course_id) data.course_id = parseInt(formData.course_id);
      if (formData.is_recurring) data.recurring_pattern = formData.recurrence_frequency;

      if (selectedEvent) {
        await teacherAPI.updateCalendarEvent(parseInt(selectedEvent.id), data);
      } else {
        await teacherAPI.createCalendarEvent(data);
      }

      setShowModal(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = () => {
    if (!selectedEvent) return;
    setFormData({
      title: selectedEvent.fullTitle || selectedEvent.title,
      description: selectedEvent.description || '',
      start: selectedEvent.originalStart || selectedEvent.start,
      end: selectedEvent.originalEnd || selectedEvent.end || '',
      type: selectedEvent.type,
      location: selectedEvent.location || '',
      course_id: selectedEvent.course_id?.toString() || '',
      is_recurring: selectedEvent.is_recurring,
      recurrence_frequency: selectedEvent.recurrence_frequency || 'weekly',
    });
    setShowViewModal(false);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;
    try {
      await teacherAPI.deleteCalendarEvent(parseInt(selectedEvent.id));
      setShowViewModal(false);
      setShowDeleteModal(false);
      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start: '',
      end: '',
      type: 'class',
      location: '',
      course_id: '',
      is_recurring: false,
      recurrence_frequency: 'weekly',
    });
    setSelectedEvent(null);
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter((event) => new Date(event.originalStart || event.start) >= now)
      .sort((a, b) => new Date(a.originalStart || a.start).getTime() - new Date(b.originalStart || b.start).getTime())
      .slice(0, 5);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class':
        return <BookOpen className="w-4 h-4" />;
      case 'exam':
        return <AlertCircle className="w-4 h-4" />;
      case 'meeting':
        return <CalendarIcon className="w-4 h-4" />;
      case 'deadline':
        return <Clock className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'exam':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'meeting':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'deadline':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'holiday':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-primary-main" />
              Calendar
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your schedule, classes, exams, and events
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
                </div>
              ) : (
                <FullCalendar
                  ref={(el) => el && setCalendarApi(el.getApi())}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                  }}
                  events={events}
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={true}
                  select={handleDateSelect}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  eventDrop={handleEventDrop}
                  height="auto"
                  displayEventTime={false}
                  displayEventEnd={false}
                  eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                  }}
                />
              )}
            </div>
          </div>

          {/* Sidebar: Upcoming Events */}
          <div className="space-y-6">
            {/* Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Event Types
              </h3>
              <div className="space-y-2">
                {[
                  { type: 'class', label: 'Class', color: '#3B82F6' },
                  { type: 'exam', label: 'Exam', color: '#EF4444' },
                  { type: 'meeting', label: 'Meeting', color: '#10B981' },
                  { type: 'deadline', label: 'Deadline', color: '#F59E0B' },
                  { type: 'holiday', label: 'Holiday', color: '#8B5CF6' },
                  { type: 'other', label: 'Other', color: '#6B7280' },
                ].map((item) => (
                  <div key={item.type} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {getUpcomingEvents().length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No upcoming events
                  </p>
                ) : (
                  getUpcomingEvents().map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowViewModal(true);
                      }}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${event.color}20` }}
                        >
                          {getTypeIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {event.fullTitle || event.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(event.originalStart || event.start).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            at{' '}
                            {new Date(event.originalStart || event.start).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {event.course && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {event.course.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedEvent ? 'Edit Event' : 'Create Event'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                      placeholder="Enter event title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                      placeholder="Enter event description"
                    />
                  </div>

                  {/* Start and End DateTime */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.start}
                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.end}
                        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                      />
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Event Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                    >
                      <option value="class">Class</option>
                      <option value="exam">Exam</option>
                      <option value="meeting">Meeting</option>
                      <option value="deadline">Deadline</option>
                      <option value="holiday">Holiday</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                      placeholder="Enter location"
                    />
                  </div>

                  {/* Course */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course (Optional)
                    </label>
                    <select
                      value={formData.course_id}
                      onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                    >
                      <option value="">No specific course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Recurring */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_recurring}
                        onChange={(e) =>
                          setFormData({ ...formData, is_recurring: e.target.checked })
                        }
                        className="w-4 h-4 text-primary-main border-gray-300 rounded focus:ring-primary-main"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Repeat className="w-4 h-4 inline mr-1" />
                        Recurring Event
                      </span>
                    </label>

                    {formData.is_recurring && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Frequency
                        </label>
                        <select
                          value={formData.recurrence_frequency}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              recurrence_frequency: e.target.value as any,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {selectedEvent ? 'Update' : 'Create'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Modal */}
        <AnimatePresence>
          {showViewModal && selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowViewModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full"
              >
                <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedEvent.fullTitle || selectedEvent.title}
                      </h2>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(
                          selectedEvent.type
                        )}`}
                      >
                        {getTypeIcon(selectedEvent.type)}
                        {selectedEvent.type}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {selectedEvent.description && (
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Clock className="w-5 h-5" />
                      <div>
                        <p className="font-medium">
                          {new Date(selectedEvent.originalStart || selectedEvent.start).toLocaleString('en-US', {
                            dateStyle: 'full',
                            timeStyle: 'short',
                          })}
                        </p>
                        {(selectedEvent.originalEnd || selectedEvent.end) && (
                          <p className="text-xs">
                            to{' '}
                            {new Date(selectedEvent.originalEnd || selectedEvent.end || selectedEvent.start).toLocaleString('en-US', {
                              dateStyle: 'full',
                              timeStyle: 'short',
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    {selectedEvent.location && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-5 h-5" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    )}

                    {selectedEvent.course && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <BookOpen className="w-5 h-5" />
                        <span>{selectedEvent.course.title}</span>
                      </div>
                    )}

                    {selectedEvent.is_recurring && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Repeat className="w-5 h-5" />
                        <span>
                          Repeats {selectedEvent.recurrence_frequency || 'weekly'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEdit}
                    className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Delete Event?
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to delete this event? This action cannot be undone.
                  </p>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={confirmDelete}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TeacherLayout>
  );
};

export default Calendar;
