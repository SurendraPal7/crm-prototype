import { useState } from 'react';
import { MessageSquare, Phone, Send, MoreHorizontal, Check, CheckCheck, ArrowLeft } from 'lucide-react';
import { toast } from './Toast';

const CommunicationPanel = ({ sellerId, communications = [], pocList = [], currentUser = 'GC Surendra Pal', sellerName = 'Seller' }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    // Simulate sending message
    toast.success('Message sent successfully');
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getStatusIcon = (status, direction) => {
    if (direction === 'inbound') return null;
    
    switch (status) {
      case 'delivered': return <Check className="w-3 h-3 text-gray-400" />;
      case 'read': return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'sent': return <Check className="w-3 h-3 text-gray-400" />;
      default: return <Check className="w-3 h-3 text-gray-300" />;
    }
  };

  // Filter communications by active tab
  const filteredCommunications = communications.filter(comm => {
    return comm.type === activeTab;
  });

  // Group messages by date
  const groupedMessages = filteredCommunications.reduce((groups, msg) => {
    const date = formatDate(msg.timestamp);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="bg-white border-l border-gray-200 w-full lg:w-[480px] flex flex-col h-screen shadow-lg">
      {/* Header */}
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex-shrink-0">
        {/* Seller Name Header - WhatsApp Style */}
        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-200">
          <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium">
            {sellerName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {sellerName}
            </h3>
            <p className="text-xs text-gray-500">Seller Communication</p>
          </div>
        </div>
        
        {/* Simplified Tabs - Only Chat and Calls */}
        <div className="flex gap-0.5 bg-white rounded-md p-0.5 border border-gray-200">
          {[
            { key: 'chat', label: 'Chat', icon: MessageSquare },
            { key: 'call', label: 'Calls', icon: Phone }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === key 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-gray-50" style={{ scrollbarWidth: 'thin' }}>
        {activeTab === 'chat' ? (
          /* Chat Messages */
          Object.keys(groupedMessages).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="bg-gray-200 rounded-full p-3 mb-3">
                <MessageSquare className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-1">No messages yet</p>
              <p className="text-gray-400 text-sm">Start a conversation</p>
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedMessages).map(([date, messages]) => (
                <div key={date}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-2">
                    <div className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {date}
                    </div>
                  </div>
                  
                  {/* Messages for this date */}
                  <div className="space-y-1.5">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-sm px-3 py-2 rounded-2xl ${
                          msg.direction === 'outbound' 
                            ? 'bg-blue-600 text-white rounded-br-sm' 
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm'
                        }`}>
                          {/* Sender Name - Only for outbound messages or group-like feel */}
                          {msg.direction === 'outbound' && (
                            <p className="text-xs text-blue-100 mb-1 font-medium">
                              {msg.poc}
                            </p>
                          )}
                          {msg.direction === 'inbound' && (
                            <p className="text-xs text-gray-500 mb-1 font-medium">
                              {sellerName}
                            </p>
                          )}
                          <p className="text-sm leading-snug">{msg.message}</p>
                          <div className={`flex items-center justify-end gap-1 mt-0.5 ${
                            msg.direction === 'outbound' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">{formatTime(msg.timestamp)}</span>
                            {msg.direction === 'outbound' && getStatusIcon(msg.status, msg.direction)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Call History */
          filteredCommunications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="bg-gray-200 rounded-full p-3 mb-3">
                <Phone className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-1">No calls yet</p>
              <p className="text-gray-400 text-sm">Call history will appear here</p>
            </div>
          ) : (
            <div className="p-2 space-y-1.5">
              {filteredCommunications.map((call) => (
                <div key={call.id} className="bg-white rounded-lg border border-gray-200 p-2.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        call.direction === 'outbound' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <Phone className={`w-3.5 h-3.5 ${
                          call.direction === 'outbound' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-sm font-medium text-gray-900">
                            {call.direction === 'outbound' ? 'Outbound' : 'Incoming'}
                          </p>
                          <span className="text-xs text-gray-500">{call.duration}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-0.5 leading-tight">{call.summary}</p>
                        {call.notes && (
                          <p className="text-xs text-gray-500 italic leading-tight">{call.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{formatDate(call.timestamp)}</p>
                      <p className="text-xs text-gray-500">{formatTime(call.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Message Input - Only for Chat */}
      {activeTab === 'chat' && (
        <div className="bg-white border-t border-gray-200 p-2 flex-shrink-0">
          <div className="flex items-end gap-1 sm:gap-1.5">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message as ${currentUser}...`}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                rows={1}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-1.5 sm:p-2 rounded-full transition-all ${
                newMessage.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            </button>
          </div>
          
          {/* Current User Indicator */}
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600 truncate">Sending as {currentUser}</span>
            </div>
            <span className="text-xs text-gray-400 hidden sm:inline">Enter to send</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationPanel;