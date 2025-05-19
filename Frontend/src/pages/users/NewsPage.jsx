import { Announcement as AnnouncementIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import React from 'react';

// Renamed component from DashboardUser to NewsPage
const NewsPage = () => {
  // Placeholder data for news items
  const newsItems = [
    { 
      id: 1, 
      title: 'ปรับปรุงระบบครั้งใหญ่!', 
      date: '25/04/2025', 
      content: 'ระบบ E-borrow จะมีการปิดปรับปรุงเพื่อเพิ่มประสิทธิภาพและฟีเจอร์ใหม่ๆ ในวันที่ 30 เมษายน 2568 ตั้งแต่เวลา 00:00 ถึง 06:00 น. ขออภัยในความไม่สะดวก',
      category: 'การบำรุงรักษา' 
    },
    { 
      id: 2, 
      title: 'อุปกรณ์ใหม่: โดรนสำหรับการถ่ายภาพมุมสูง', 
      date: '22/04/2025', 
      content: 'เราได้เพิ่มโดรน DJI Mavic Air 3 เข้ามาในระบบ ท่านสามารถเริ่มยืมได้ตั้งแต่วันนี้เป็นต้นไป',
      category: 'อุปกรณ์ใหม่'
    },
    { 
      id: 3, 
      title: 'อบรมการใช้งานโปรเจกเตอร์รุ่นใหม่', 
      date: '20/04/2025', 
      content: 'ขอเชิญผู้ที่สนใจเข้าร่วมอบรมการใช้งานโปรเจกเตอร์ Epson EB-L200SW ในวันที่ 5 พฤษภาคม 2568 เวลา 13:00 - 15:00 น. ณ ห้องประชุมใหญ่',
      category: 'กิจกรรม'
    },
    {
      id: 4,
      title: 'ประกาศวันหยุดเทศกาลสงกรานต์',
      date: '10/04/2025',
      content: 'เนื่องในเทศกาลสงกรานต์ ระบบ E-borrow จะงดให้บริการในวันที่ 13-15 เมษายน 2568 และจะเปิดให้บริการตามปกติในวันที่ 16 เมษายน 2568',
      category: 'ประกาศ'
    }
  ];

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
        {newsItems.map((item, index) => (
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
            <p className="text-sm text-gray-500 mb-3">เผยแพร่เมื่อ: {item.date}</p>
            <p className="text-gray-700 leading-relaxed">{item.content}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

// Exporting the renamed component
export default NewsPage; 