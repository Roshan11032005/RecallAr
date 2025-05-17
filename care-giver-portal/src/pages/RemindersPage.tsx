// RemindersPage.tsx - Save this file to ./pages/RemindersPage.tsx
import { useState } from 'react';
import { Clock, Calendar, Bell, Plus, X } from 'lucide-react';

export default function RemindersPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [recurring, setRecurring] = useState('none');
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Take Medication',
      description: 'Take the blue pill after breakfast',
      date: '2025-05-20',
      time: '09:00',
      recurring: 'daily'
    },
    {
      id: 2,
      title: 'Doctor Appointment',
      description: 'Visit Dr. Smith for check-up',
      date: '2025-05-25',
      time: '14:30',
      recurring: 'none'
    }
  ]);

  const handleAddReminder = () => {
    if (!title || !date || !time) return;

    const newReminder = {
      id: Date.now(),
      title,
      description,
      date,
      time,
      recurring
    };

    setReminders([...reminders, newReminder]);

    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setRecurring('none');
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  // Format date for display
  const formatDate = (dateStr: string | number | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Add Reminder</h2>

        <div className="space-y-5">
          {/* Reminder Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">Reminder Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="E.g., Take Medication"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white h-20"
              placeholder="Add helpful context or instructions"
            />
          </div>

          {/* Date and Time Row */}
          <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-4">
            {/* Date Input */}
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-white mb-1">Date</label>
              <div className="relative">
                <Calendar className="absolute top-3 left-3 text-gray-400" size={16} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>
            </div>

            {/* Time Input */}
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-white mb-1">Time</label>
              <div className="relative">
                <Clock className="absolute top-3 left-3 text-gray-400" size={16} />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>
            </div>
          </div>

          {/* Recurring Option */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">Recurring</label>
            <select
              value={recurring}
              onChange={(e) => setRecurring(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="none">Not Recurring</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAddReminder}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center"
          >
            <Plus size={16} className="mr-2" />
            Add Reminder
          </button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Your Reminders</h2>

        {reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No reminders added yet
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map(reminder => (
              <div key={reminder.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <Bell size={16} className="text-blue-400 mr-2" />
                    <h3 className="text-lg font-medium text-white">{reminder.title}</h3>
                  </div>

                  {reminder.description && (
                    <p className="text-gray-300 mt-1 text-sm">{reminder.description}</p>
                  )}

                  <div className="flex items-center mt-2 text-sm text-gray-400">
                    <Calendar size={14} className="mr-1" />
                    <span className="mr-3">{formatDate(reminder.date)}</span>
                    <Clock size={14} className="mr-1" />
                    <span>{reminder.time}</span>

                    {reminder.recurring !== 'none' && (
                      <span className="ml-3 px-2 py-1 bg-blue-900 text-blue-300 rounded-full text-xs">
                        {reminder.recurring.charAt(0).toUpperCase() + reminder.recurring.slice(1)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteReminder(reminder.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}