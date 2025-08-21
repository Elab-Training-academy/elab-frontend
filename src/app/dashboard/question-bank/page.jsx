"use client"
import React from 'react';
import { Search, Bell, Clock } from 'lucide-react';

const QuestionBank = () => {
  const practiceMode = [
    {
      title: 'Study Mode',
      description: 'Learn with Explanation',
      color: 'blue'
    },
    {
      title: 'Exam Mode',
      description: 'Timed Practice',
      color: 'blue'
    },
    {
      title: 'Review Mode',
      description: 'Incorrect answers',
      color: 'blue'
    },
    {
      title: 'Random',
      description: 'Mixed Question',
      color: 'blue'
    }
  ];

  const notifications = [
    {
      mode: 'Study Mode',
      subject: 'Fundamentals',
      questions: 25,
      timeAgo: '40 mins ago',
      type: 'study'
    },
    {
      mode: 'Exam Mode',
      subject: 'Fundamentals',
      questions: 15,
      timeAgo: '20 mins ago',
      type: 'exam'
    }
  ];

  const getCardIcon = (type) => {
    return (
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <div className="w-4 h-4 bg-blue-600 rounded"></div>
      </div>
    );
  };

  const getNotificationIcon = (type) => {
    return (
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <Clock className="w-5 h-5 text-blue-600" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Type a command or search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <Bell className="w-6 h-6 text-gray-600" />
        </div>

        {/* Title and Description */}
        <div className="mb-12">
          <p className="text-gray-600 mb-2">{}</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Question bank</h1>
          <p className="text-gray-600 text-lg max-w-4xl">
            Select a practice mode to match your learning style. Whether you want to study at your own pace or challenge yourself under pressure, the choice is yours.
          </p>
        </div>

        {/* Practice Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {practiceMode.map((mode, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
            >
              {getCardIcon(mode.title)}
              <h3 className="text-xl font-semibold text-blue-600 mb-2 group-hover:text-blue-700">
                {mode.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {mode.description}
              </p>
            </div>
          ))}
        </div>

        {/* All Notifications Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All notifications</h2>
          
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getNotificationIcon(notification.type)}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-blue-600 font-medium text-sm">
                        {notification.mode}
                      </span>
                      <span className="text-gray-600 text-sm">
                        - {notification.subject}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {notification.questions} Questions
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-gray-500 text-sm">
                    {notification.timeAgo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;