import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Meeting {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'pending' | 'confirmed' | 'declined';
  requester: string;
  color?: string;
}

const initialMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Investor Meet - Ali Khan',
    start: new Date().toISOString().split('T')[0] + 'T10:00:00',
    end: new Date().toISOString().split('T')[0] + 'T11:00:00',
    status: 'confirmed',
    requester: 'Ali Khan',
    color: '#10b981',
  },
  {
    id: '2',
    title: 'Deal Discussion - Sara Ahmed',
    start: new Date().toISOString().split('T')[0] + 'T14:00:00',
    end: new Date().toISOString().split('T')[0] + 'T15:00:00',
    status: 'pending',
    requester: 'Sara Ahmed',
    color: '#f59e0b',
  },
];

export const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [showModal, setShowModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '', date: '', startTime: '', endTime: '', requester: '',
  });
  const [activeTab, setActiveTab] = useState<'calendar' | 'requests'>('calendar');

  const handleDateClick = (arg: { dateStr: string }) => {
    setNewMeeting({ ...newMeeting, date: arg.dateStr });
    setShowModal(true);
  };

  const handleAddMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.startTime) return;
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      start: `${newMeeting.date}T${newMeeting.startTime}:00`,
      end: `${newMeeting.date}T${newMeeting.endTime || newMeeting.startTime}:00`,
      status: 'pending',
      requester: newMeeting.requester || 'You',
      color: '#f59e0b',
    };
    setMeetings([...meetings, meeting]);
    setShowModal(false);
    setNewMeeting({ title: '', date: '', startTime: '', endTime: '', requester: '' });
  };

  const handleStatusChange = (id: string, status: 'confirmed' | 'declined') => {
    setMeetings(meetings.map(m =>
      m.id === id
        ? { ...m, status, color: status === 'confirmed' ? '#10b981' : '#ef4444' }
        : m
    ));
  };

  const pendingMeetings = meetings.filter(m => m.status === 'pending');
  const confirmedMeetings = meetings.filter(m => m.status === 'confirmed');

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Meeting Scheduler</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Manage your meetings and availability</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          + New Meeting
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5">
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{meetings.length}</p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Confirmed</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{confirmedMeetings.length}</p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-500">{pendingMeetings.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
            activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          📅 Calendar
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
            activeTab === 'requests' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          📋 Requests{' '}
          {pendingMeetings.length > 0 && (
            <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {pendingMeetings.length}
            </span>
          )}
        </button>
      </div>

      {/* Calendar View */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-4 overflow-x-auto">
          <div className="min-w-[300px]">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek',
              }}
              events={meetings.map(m => ({
                id: m.id,
                title: m.title,
                start: m.start,
                end: m.end,
                backgroundColor: m.color,
                borderColor: m.color,
              }))}
              dateClick={handleDateClick}
              height="auto"
              editable={true}
              selectable={true}
              contentHeight="auto"
              aspectRatio={1.5}
            />
          </div>
        </div>
      )}

      {/* Requests View */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {meetings.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400">
              No meeting requests
            </div>
          )}
          {meetings.map(meeting => (
            <div
              key={meeting.id}
              className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between"
            >
              {/* Info */}
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm sm:text-base">{meeting.title}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {new Date(meeting.start).toLocaleDateString()} &nbsp;|&nbsp;
                  {new Date(meeting.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' → '}
                  {new Date(meeting.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">By: {meeting.requester}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  meeting.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  meeting.status === 'declined' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                </span>
                {meeting.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(meeting.id, 'confirmed')}
                      className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-600 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(meeting.id, 'declined')}
                      className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-5 w-full sm:max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Schedule New Meeting</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Meeting Title</label>
                <input
                  type="text"
                  placeholder="e.g. Investment Discussion"
                  value={newMeeting.title}
                  onChange={e => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Date</label>
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={e => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Start Time</label>
                  <input
                    type="time"
                    value={newMeeting.startTime}
                    onChange={e => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">End Time</label>
                  <input
                    type="time"
                    value={newMeeting.endTime}
                    onChange={e => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Requester Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ali Khan"
                  value={newMeeting.requester}
                  onChange={e => setNewMeeting({ ...newMeeting, requester: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMeeting}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm hover:bg-blue-700 transition font-medium"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};