import React from 'react';
import { FaBox, FaUsers, FaHistory, FaChartLine, FaArrowUp, FaArrowDown, FaEye } from 'react-icons/fa';

const DashboardAdmin = () => {
  // Mock data - replace with actual data from your backend
  const stats = [
    {
      id: 1,
      title: 'Total Equipment',
      value: 150,
      change: 12,
      isPositive: true,
      icon: FaBox,
      color: 'blue',
      status: 'Active',
      details: 'View inventory'
    },
    {
      id: 2,
      title: 'Active Users',
      value: 45,
      change: -3,
      isPositive: false,
      icon: FaUsers,
      color: 'green',
      status: 'Online',
      details: 'View users'
    },
    {
      id: 3,
      title: 'Total Borrowings',
      value: 280,
      change: 8,
      isPositive: true,
      icon: FaHistory,
      color: 'purple',
      status: 'This Month',
      details: 'View history'
    },
    {
      id: 4,
      title: 'Available Equipment',
      value: 120,
      change: 5,
      isPositive: true,
      icon: FaChartLine,
      color: 'yellow',
      status: 'In Stock',
      details: 'View available'
    }
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'borrowed', item: 'Laptop', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', action: 'returned', item: 'Projector', time: '3 hours ago' },
    { id: 3, user: 'Mike Johnson', action: 'borrowed', item: 'Camera', time: '5 hours ago' },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                  </div>
                </div>
                <div className={`flex items-center text-sm ${
                  stat.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.isPositive ? <FaArrowUp className="w-3 h-3 mr-1" /> : <FaArrowDown className="w-3 h-3 mr-1" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">{stat.status}</span>
                  <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center transition-colors">
                    <FaEye className="w-3 h-3 mr-1" />
                    {stat.details}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.action === 'borrowed' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-800">{activity.user}</p>
                    <p className="text-sm text-gray-500">
                      {activity.action} {activity.item}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;