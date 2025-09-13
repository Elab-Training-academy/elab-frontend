"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Trophy,
  Star,
  TrendingUp,
  Bell,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const Leaderboard = () => {
  const { url } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all_time");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  

  const timeFrames = ["daily", "weekly", "monthly", "all_time"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
    }
  }, []);

  // ✅ Fetch leaderboard data with filters
  const fetchLeaderboard = async (timeFrame) => {
    const newToken = localStorage.getItem("token");
    if (!newToken) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${url}/leaderboard?time_frame=${timeFrame}&limit=50`,
        {
          headers: { Authorization: `Bearer ${newToken}` },
        }
      );
      console.log(newToken);
      

      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      const data = await res.json();

      setLeaderboardData(data.leaderboard || []);
      setUserRank(data.user_rank || null);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const newToken = localStorage.getItem('token')
    if (newToken) fetchLeaderboard(activeTab);
  }, [activeTab, token]);

  const getBadgeIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Star className="w-6 h-6 text-yellow-500 fill-current" />;
      case 3:
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
          className={`w-12 h-12 ${colors[rank]} rounded-full flex items-center justify-center`}
        >
          {getBadgeIcon(rank)}
        </div>
      );
    }

    return (
      <div
        className={`w-12 h-12 ${
          isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
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
              placeholder="Search player..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Bell className="w-6 h-6 text-gray-600 self-end sm:self-auto" />
        </div>

        {/* Title */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Leaderboard
          </h1>
          <p className="text-gray-600">
            See how you rank against other learners
          </p>
        </div>

        {/* Tabs for timeframe */}
        <div className="mb-8 flex flex-wrap gap-2 items-center">
          <span className="text-gray-700 font-medium w-full sm:w-auto">
            Report Type:
          </span>
          {timeFrames.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Leaderboard */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 overflow-x-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 capitalize">
              {activeTab.replace("_", " ")} Rankings
            </h2>

            {loading ? (
              <p className="p-6 text-center text-gray-500">
                Loading leaderboard...
              </p>
            ) : (
              <div className="space-y-4">
                {leaderboardData.map((user) => (
                  <div
                    key={user.user_id}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg transition ${
                      userRank?.user_id === user.user_id
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {getRankCircle(
                        user.rank,
                        userRank?.user_id === user.user_id
                      )}

                      <div className="flex items-center space-x-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                            {user.username.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {user.username}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {user.total_points.toLocaleString()} points
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                      <div className="text-left sm:text-right mb-2 sm:mb-0">
                        <p className="text-sm font-medium text-gray-900">
                          Questions: {user.question_points}
                        </p>
                        <p className="text-sm text-gray-600">
                          Smart Practice: {user.smart_practice_points}
                        </p>
                        <p className="text-sm text-gray-600">
                          Case Study: {user.case_study_points}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {userRank && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Rank
                </h3>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-white">
                      {userRank.rank}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{userRank.username}</span> -{" "}
                    {userRank.total_points}pts
                  </div>
                </div>
              </div>
            )}

            {userRank && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Performance
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Question Points:{" "}
                    <span className="font-semibold">
                      {userRank.question_points}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Smart Practice Points:{" "}
                    <span className="font-semibold">
                      {userRank.smart_practice_points}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Case Study Points:{" "}
                    <span className="font-semibold">
                      {userRank.case_study_points}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
