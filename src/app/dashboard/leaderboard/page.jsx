"use client";
import React, { useState } from "react";
import {
  Search,
  Trophy,
  Star,
  TrendingUp,
  TrendingDown,
  Bell,
} from "lucide-react";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("Weekly");

  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah K.",
      initials: "S.M",
      points: 2840,
      xp: "+340 XP this weekly",
      courses: "2 courses completed",
      trend: "up",
      badge: "trophy",
    },
    {
      rank: 2,
      name: "Sarah K.",
      initials: "S.M",
      points: 2840,
      xp: "+300 XP this weekly",
      courses: "1 courses completed",
      trend: "down",
      badge: "star",
    },
    {
      rank: 3,
      name: "Sarah K.",
      initials: "S.M",
      points: 2840,
      xp: "+200 XP this weekly",
      courses: "3 courses completed",
      trend: "up",
      badge: "medal",
    },
    {
      rank: 4,
      name: "You (A.k)",
      initials: "S.M",
      points: 0,
      xp: "+200 XP this weekly",
      courses: "2 courses completed",
      trend: "down",
      isCurrentUser: true,
    },
    {
      rank: 5,
      name: "John D.",
      initials: "S.M",
      points: 0,
      xp: "+200 XP this weekly",
      courses: "2 courses completed",
      trend: "up",
    },
    {
      rank: 6,
      name: "User D.",
      initials: "S.M",
      points: 0,
      xp: "+200 XP this weekly",
      courses: "2 courses completed",
      trend: "down",
    },
    {
      rank: 7,
      name: "User A.",
      initials: "S.M",
      points: 0,
      xp: "+200 XP this weekly",
      courses: "2 courses completed",
      trend: "up",
    },
    {
      rank: 8,
      name: "User B.",
      initials: "S.M",
      points: 0,
      xp: "+200 XP this weekly",
      courses: "2 courses completed",
      trend: "up",
    },
  ];

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case "trophy":
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case "star":
        return <Star className="w-6 h-6 text-yellow-500 fill-current" />;
      case "medal":
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  const getRankCircle = (rank, isCurrentUser = false) => {
    if (rank <= 3) {
      const colors = {
        1: "bg-yellow-100",
        2: "bg-red-100",
        3: "bg-green-100",
      };
      return (
        <div
          className={`w-12 h-12 ${colors[rank]} rounded-full flex items-center justify-center relative`}
        >
          {getBadgeIcon(rank === 1 ? "trophy" : rank === 2 ? "star" : "medal")}
        </div>
      );
    }

    return (
      <div
        className={`w-12 h-12 ${
          isCurrentUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-600"
        } rounded-full flex items-center justify-center font-semibold`}
      >
        {rank}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Type a command or search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Bell className="w-6 h-6 text-gray-600 self-end sm:self-auto" />
        </div>

        {/* Title */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Leader Board
          </h1>
          <p className="text-gray-600">
            See how you rank against other learners
          </p>
        </div>

        {/* Report Type Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 items-center">
          <span className="text-gray-700 font-medium w-full sm:w-auto">
            Report Type:
          </span>
          {["Weekly", "Monthly", "Yearly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Leaderboard */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 overflow-x-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
              {activeTab} Rankings
            </h2>

            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg ${
                    user.isCurrentUser
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {getRankCircle(user.rank, user.isCurrentUser)}

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {user.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {user.points.toLocaleString()} points
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                    <div className="text-left sm:text-right mb-2 sm:mb-0">
                      <p className="text-sm font-medium text-gray-900">
                        {user.xp}
                      </p>
                      <p className="text-sm text-gray-600">{user.courses}</p>
                    </div>

                    <div className="flex items-center space-x-1">
                      {user.trend === "up" ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">Up</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500">Down</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Rank */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Rank
              </h3>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                  <span className="text-orange-500">🔥</span>
                  <span>Great job! you're in the top 10!</span>
                </div>
              </div>
            </div>

            {/* Your Performance */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Level</span>
                  <span className="font-semibold text-gray-900">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Study Streak</span>
                  <span className="font-semibold text-gray-900">0 Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weekly Progress</span>
                  <span className="font-semibold text-gray-900">20%</span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                      20%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
