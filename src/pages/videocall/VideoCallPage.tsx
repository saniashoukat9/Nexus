import React, { useState, useRef, useEffect } from 'react';
import {
  Video, VideoOff, Mic, MicOff, PhoneOff, Phone,
  Monitor, MonitorOff, MessageCircle, Users, MoreVertical
} from 'lucide-react';

export const VideoCallPage: React.FC = () => {
  const [callActive, setCallActive] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Ali Khan', message: 'Hello! Ready for the meeting?', time: '10:00 AM' },
    { id: 2, sender: 'You', message: 'Yes, let us start!', time: '10:01 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callActive]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages([...chatMessages, {
      id: Date.now(),
      sender: 'You',
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setNewMessage('');
  };

  const participants = [
    { id: 1, name: 'Ali Khan', role: 'Investor', initials: 'AK', color: 'bg-blue-500' },
    { id: 2, name: 'Sara Ahmed', role: 'Entrepreneur', initials: 'SA', color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Call</h1>
          <p className="text-gray-500 text-sm mt-1">Connect face-to-face with investors & entrepreneurs</p>
        </div>
        {callActive && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-700 text-sm font-medium">Live — {formatDuration(callDuration)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Video Area */}
        <div className={`${showChat ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-4`}>

          {/* Video Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Remote Video */}
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center col-span-2 lg:col-span-1">
              {callActive ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl font-bold">AK</span>
                    </div>
                    <p className="text-white text-sm">Ali Khan</p>
                    <p className="text-gray-400 text-xs">Investor</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Video className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Waiting for participant...</p>
                </div>
              )}
              {callActive && (
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-md">
                  Ali Khan — Investor
                </div>
              )}
            </div>

            {/* Local Video */}
            <div className="relative bg-gray-800 rounded-2xl overflow-hidden aspect-video flex items-center justify-center col-span-2 lg:col-span-1">
              {videoOn && callActive ? (
                <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-xl font-bold">You</span>
                    </div>
                    <p className="text-white text-sm">You</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  {!callActive ? (
                    <>
                      <VideoOff className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Your camera</p>
                    </>
                  ) : (
                    <>
                      <VideoOff className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Camera Off</p>
                    </>
                  )}
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-md">
                You {!audioOn && '(Muted)'}
              </div>
            </div>
          </div>

          {/* Screen Share Banner */}
          {screenShare && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
              <Monitor className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-700 text-sm font-medium">Screen sharing is active — participants can see your screen</p>
              <button
                onClick={() => setScreenShare(false)}
                className="ml-auto text-xs bg-yellow-200 text-yellow-800 px-3 py-1 rounded-lg hover:bg-yellow-300 transition"
              >
                Stop Sharing
              </button>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center gap-4">

              {/* Mic Toggle */}
              <div className="text-center">
                <button
                  onClick={() => setAudioOn(!audioOn)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                    audioOn ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {audioOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
                <p className="text-xs text-gray-500 mt-1">{audioOn ? 'Mute' : 'Unmute'}</p>
              </div>

              {/* Camera Toggle */}
              <div className="text-center">
                <button
                  onClick={() => setVideoOn(!videoOn)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                    videoOn ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>
                <p className="text-xs text-gray-500 mt-1">{videoOn ? 'Stop Video' : 'Start Video'}</p>
              </div>

              {/* Start / End Call */}
              <div className="text-center">
                <button
                  onClick={() => setCallActive(!callActive)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition shadow-lg ${
                    callActive
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {callActive ? <PhoneOff size={24} /> : <Phone size={24} />}
                </button>
                <p className="text-xs text-gray-500 mt-1">{callActive ? 'End Call' : 'Start Call'}</p>
              </div>

              {/* Screen Share */}
              <div className="text-center">
                <button
                  onClick={() => setScreenShare(!screenShare)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                    screenShare ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {screenShare ? <MonitorOff size={20} /> : <Monitor size={20} />}
                </button>
                <p className="text-xs text-gray-500 mt-1">{screenShare ? 'Stop Share' : 'Share Screen'}</p>
              </div>

              {/* Chat Toggle */}
              <div className="text-center">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                    showChat ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <MessageCircle size={20} />
                </button>
                <p className="text-xs text-gray-500 mt-1">Chat</p>
              </div>

              {/* Participants */}
              <div className="text-center">
                <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition">
                  <Users size={20} />
                </button>
                <p className="text-xs text-gray-500 mt-1">Participants</p>
              </div>

            </div>
          </div>

          {/* Participants List */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Users size={16} /> Participants ({participants.length})
            </h3>
            <div className="flex gap-3">
              {participants.map(p => (
                <div key={p.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <div className={`w-8 h-8 ${p.color} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{p.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-96 lg:h-auto">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">In-Call Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                  <p className="text-xs text-gray-400 mb-1">{msg.sender} · {msg.time}</p>
                  <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] ${
                    msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};