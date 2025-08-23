"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Users, UserPlus, Calendar, Crown, Medal, Award } from 'lucide-react';

// Types
interface CALeaderboardItem {
  id: string;
  name: string;
  email: string;
  registrations: number;
  rank: number;
  avatar?: string;
}

interface RecentRegistration {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  referredBy: string;
}

interface UserStats {
  totalRegistrations: number;
  rank: number;
  referralCode: string;
}

interface DashboardData {
  globalLeaderboard: CALeaderboardItem[];
  userStats: UserStats;
  recentRegistrations: RecentRegistration[];
}

// Mock data - replace with actual API calls
const mockData: DashboardData = {
  globalLeaderboard: [
    { id: '1', name: 'John Smith', email: 'john@example.com', registrations: 245, rank: 1 },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', registrations: 198, rank: 2 },
    { id: '3', name: 'Mike Chen', email: 'mike@example.com', registrations: 176, rank: 3 },
    { id: '4', name: 'Emily Davis', email: 'emily@example.com', registrations: 143, rank: 4 },
    { id: '5', name: 'Alex Wilson', email: 'alex@example.com', registrations: 127, rank: 5 },
    { id: '6', name: 'Lisa Brown', email: 'lisa@example.com', registrations: 109, rank: 6 },
    { id: '7', name: 'David Miller', email: 'david@example.com', registrations: 98, rank: 7 },
    { id: '8', name: 'Jessica Taylor', email: 'jessica@example.com', registrations: 87, rank: 8 },
    { id: '9', name: 'Ryan Anderson', email: 'ryan@example.com', registrations: 76, rank: 9 },
    { id: '10', name: 'Amanda White', email: 'amanda@example.com', registrations: 65, rank: 10 }
  ],
  userStats: {
    totalRegistrations: 87,
    rank: 8,
    referralCode: 'USER123REF'
  },
  recentRegistrations: [
    {
      id: '1',
      name: 'Michael Thompson',
      email: 'michael.t@example.com',
      registeredAt: '2024-08-21T14:30:00Z',
      referredBy: 'USER123REF'
    },
    {
      id: '2',
      name: 'Emma Rodriguez',
      email: 'emma.r@example.com',
      registeredAt: '2024-08-21T12:45:00Z',
      referredBy: 'USER123REF'
    },
    {
      id: '3',
      name: 'James Wilson',
      email: 'james.w@example.com',
      registeredAt: '2024-08-21T09:15:00Z',
      referredBy: 'USER123REF'
    }
  ]
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>(mockData);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/dashboard');
      // const dashboardData = await response.json();
      // setData(dashboardData);
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-500" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-300">#{rank}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(data.userStats.referralCode);
    alert('Referral code copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">CA Dashboard</h1>
          <p className="text-gray-300">Track your performance and see global rankings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Global Leaderboard Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center">
                  <Trophy className="w-6 h-6 text-yellow-400 mr-3" />
                  <h2 className="text-xl font-semibold text-white">Global Leaderboard</h2>
                </div>
                <p className="text-sm text-gray-300 mt-1">Top performing CAs by registration count</p>
              </div>
              
              <div className="overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {data.globalLeaderboard.map((ca) => (
                    <div key={ca.id} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getRankIcon(ca.rank)}
                        </div>
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {ca.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{ca.name}</p>
                          <p className="text-sm text-gray-300 truncate">{ca.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-white">{ca.registrations}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Stats and Recent Registrations */}
          <div className="space-y-6">
            {/* User Stats Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <UserPlus className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Your Performance</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-900/50 rounded-lg border border-blue-800">
                    <div>
                      <p className="text-sm font-medium text-blue-200">Total Registrations</p>
                      <p className="text-2xl font-bold text-blue-400">{data.userStats.totalRegistrations}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-900/50 rounded-lg border border-green-800">
                    <div>
                      <p className="text-sm font-medium text-green-200">Global Rank</p>
                      <p className="text-2xl font-bold text-green-400">#{data.userStats.rank}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-green-400" />
                  </div>
                  
                  <div className="p-3 bg-purple-900/50 rounded-lg border border-purple-800">
                    <p className="text-sm font-medium text-purple-200 mb-2">Your Referral Code</p>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 px-3 py-2 bg-gray-700 border border-purple-600 rounded text-sm font-mono text-purple-300">
                        {data.userStats.referralCode}
                      </code>
                      <button
                        onClick={copyReferralCode}
                        className="px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-500 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Registrations Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Recent Registrations</h3>
                </div>
                <p className="text-sm text-gray-300 mt-1">Last 3 people who used your referral code</p>
              </div>
              
              <div className="p-6">
                {data.recentRegistrations.length > 0 ? (
                  <div className="space-y-4">
                    {data.recentRegistrations.map((registration, index) => (
                      <div key={registration.id} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {registration.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{registration.name}</p>
                          <p className="text-xs text-gray-300 truncate">{registration.email}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(registration.registeredAt)}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300 border border-green-700">
                            New
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <UserPlus className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-300">No recent registrations</p>
                    <p className="text-xs text-gray-400 mt-1">Share your referral code to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;