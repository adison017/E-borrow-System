import { Announcement as AnnouncementIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Renamed component from DashboardUser to NewsPage
const NewsPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/news');
      setNewsItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Helper function to get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'การบำรุงรักษา':
        return 'bg-orange-100 text-orange-800';
      case 'อุปกรณ์ใหม่':
        return 'bg-green-100 text-green-800';
      case 'กิจกรรม':
        return 'bg-blue-100 text-blue-800';
      case 'ประกาศ':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex-grow text-black">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex-grow text-black">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">เกิดข้อผิดพลาด! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 flex-grow text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-8 flex items-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnnouncementIcon className="mr-3 text-blue-500" style={{ fontSize: '2.5rem' }} />
        ข่าวสารและประกาศ
      </motion.h1>

      {/* News Items List */}
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {newsItems.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีข่าวสารในระบบ</p>
        ) : (
          newsItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-semibold text-blue-600">{item.title}</h2>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">เผยแพร่เมื่อ: {new Date(item.date).toLocaleDateString('th-TH')}</p>
              <p className="text-gray-700 leading-relaxed">{item.content}</p>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

// Exporting the renamed component
export default NewsPage;