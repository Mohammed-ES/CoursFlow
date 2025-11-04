import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Plus,
  X,
  Edit,
  Trash2,
  Clock,
  MapPin,
  BookOpen,
  Award,
  User,
} from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import studentAPI from '../../services/studentAPI';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ToastContainer } from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: 'personal' | 'course' | 'quiz' | 'other';
  location?: string;
  color?: string;
}

interface EventFormData {
  title: string;
  description: string;
  start: string;
  end: string;
  type: 'personal' | 'course' | 'quiz' | 'other';
  location: string;
}

const Calendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const calendarRef = useRef<any>(null);
  const { toasts, removeToast, success, error: showError } = useToast();

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start: '',
    end: '',
    type: 'personal',
    location: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getCalendarEvents({});
      const formattedEvents = (response.data || []).map((event: any) => ({
        ...event,
        id: event.id.toString(),
        start: event.start,
        end: event.end,
        color: getEventColor(event.type || event.event_type),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      showError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'personal':
        return '#10b981'; // green
      case 'course':
        return '#3b82f6'; // blue
      case 'quiz':
        return '#8b5cf6'; // purple
      default:
        return '#6b7280'; // gray
    }
  };

  const handleCreateEvent = async () => {
    try {
      if (!formData.title || !formData.start || !formData.end) {
        showError('Please fill in all required fields');
        return;
      }

      await studentAPI.createCalendarEvent({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        start_date: formData.start,
        end_date: formData.end,
        location: formData.location,
      });

      await fetchEvents();
      closeModal();
      success('Event created successfully!');
    } catch (err: any) {
      console.error('Failed to create event:', err);
      showError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    try {
      await studentAPI.updateCalendarEvent(parseInt(selectedEvent.id), {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        start_date: formData.start,
        end_date: formData.end,
        location: formData.location,
      });

      await fetchEvents();
      closeModal();
      success('Event updated successfully!');
    } catch (err: any) {
      console.error('Failed to update event:', err);
      showError(err.response?.data?.message || 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setShowDeleteModal(false);
    
    try {
      await studentAPI.deleteCalendarEvent(parseInt(id));
      await fetchEvents();
      closeViewModal();
      success('Event deleted successfully!');
    } catch (err: any) {
      console.error('Failed to delete event:', err);
      showError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const openModal = (selectInfo?: any) => {
    if (selectInfo) {
      setFormData({
        title: '',
        description: '',
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        type: 'personal',
        location: '',
      });
    } else {
      const now = new Date();
      const startStr = now.toISOString().slice(0, 16);
      const endDate = new Date(now.getTime() + 60 * 60 * 1000);
      const endStr = endDate.toISOString().slice(0, 16);
      
      setFormData({
        title: '',
        description: '',
        start: startStr,
        end: endStr,
        type: 'personal',
        location: '',
      });
    }
    setSelectedEvent(null);
    setShowModal(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      start: new Date(event.start).toISOString().slice(0, 16),
      end: new Date(event.end).toISOString().slice(0, 16),
      type: event.type,
      location: event.location || '',
    });
    setShowViewModal(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      start: '',
      end: '',
      type: 'personal',
      location: '',
    });
  };

  const handleEventClick = (clickInfo: any) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setShowViewModal(true);
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedEvent(null);
  };

  const handleDateSelect = (selectInfo: any) => {
    openModal(selectInfo);
    const api = calendarRef.current?.getApi();
    if (api) {
      api.unselect();
    }
  };

  if (loading) {
    return (
      <StudentLayout title="Calendar" subtitle="Manage your schedule and events">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600 dark:text-gray-400">Loading calendar...</div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Calendar" subtitle="Manage your schedule and events">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {events.length}
                </p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Personal</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {events.filter((e) => e.type === 'personal').length}
                </p>
              </div>
              <User className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Course Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {events.filter((e) => e.type === 'course').length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Quiz Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {events.filter((e) => e.type === 'quiz').length}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Calendar
            </h2>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Event
            </button>
          </div>

          <div className="calendar-container">
            <style>{`
              /* Dark mode styles for FullCalendar */
              .dark .fc {
                color: #e5e7eb;
              }
              .dark .fc .fc-col-header-cell {
                background-color: #1f2937;
                color: #e5e7eb;
                border-color: #374151;
              }
              .dark .fc .fc-scrollgrid {
                border-color: #374151;
              }
              .dark .fc-theme-standard td,
              .dark .fc-theme-standard th {
                border-color: #374151;
              }
              .dark .fc-theme-standard .fc-scrollgrid {
                border-color: #374151;
              }
              .dark .fc .fc-daygrid-day {
                background-color: #1f2937;
              }
              .dark .fc .fc-daygrid-day-number {
                color: #e5e7eb;
              }
              .dark .fc .fc-daygrid-day.fc-day-today {
                background-color: #1e40af !important;
              }
              .dark .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
                color: #fff;
              }
              .dark .fc-button {
                background-color: #374151 !important;
                border-color: #4b5563 !important;
                color: #e5e7eb !important;
              }
              .dark .fc-button:hover {
                background-color: #4b5563 !important;
              }
              .dark .fc-button-active {
                background-color: #2563eb !important;
              }
              .dark .fc .fc-toolbar-title {
                color: #e5e7eb;
              }
              .dark .fc-daygrid-day-top {
                color: #e5e7eb;
              }
              .dark .fc-h-event {
                border-color: transparent;
              }
            `}</style>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={events}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="auto"
            />
          </div>
        </motion.div>
      </div>

      {/* Create/Edit Event Modal - Professional Design */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  {selectedEvent ? (
                    <>
                      <Edit className="w-6 h-6" />
                      Edit Event
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      Create Event
                    </>
                  )}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                {/* Titre */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <BookOpen className="w-4 h-4" />
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="Ex: Project Meeting, Math Class..."
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Event Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'personal', label: '👤 Personal', color: '#10b981' },
                      { value: 'course', label: '📚 Course', color: '#3b82f6' },
                      { value: 'quiz', label: '📝 Quiz', color: '#8b5cf6' },
                      { value: 'other', label: '📌 Other', color: '#6b7280' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            type: type.value as 'personal' | 'course' | 'quiz' | 'other',
                          })
                        }
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          formData.type === type.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <BookOpen className="w-4 h-4" />
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all resize-none"
                    placeholder="Add a detailed description of the event..."
                  />
                </div>

                {/* Dates and times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      Start *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.start}
                      onChange={(e) =>
                        setFormData({ ...formData, start: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      End *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.end}
                      onChange={(e) =>
                        setFormData({ ...formData, end: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="Ex: Room 201, Online, Library..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={selectedEvent ? handleUpdateEvent : handleCreateEvent}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transform"
                >
                  {selectedEvent ? (
                    <>
                      <Edit className="w-5 h-5" />
                      Update
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Event
                    </>
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Event Modal - Professional Design */}
      {showViewModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
          >
            {/* Header avec couleur de l'événement */}
            <div 
              className="h-2"
              style={{ backgroundColor: getEventColor(selectedEvent.type) }}
            />
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedEvent.title}
                  </h3>
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: getEventColor(selectedEvent.type) }}
                  >
                    {selectedEvent.type === 'personal' && '👤 Personal'}
                    {selectedEvent.type === 'course' && '📚 Course'}
                    {selectedEvent.type === 'quiz' && '📝 Quiz'}
                    {selectedEvent.type === 'other' && '📌 Other'}
                  </span>
                </div>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                {selectedEvent.description && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Description
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {/* Date and time */}
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Schedule
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Date(selectedEvent.start).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {new Date(selectedEvent.start).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(selectedEvent.end).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  {selectedEvent.location && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Location
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {selectedEvent.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => openEditModal(selectedEvent)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transform"
                >
                  <Edit className="w-5 h-5" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 transform"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Delete Event
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete the event <strong>"{selectedEvent.title}"</strong>?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </StudentLayout>
  );
};

export default Calendar;
