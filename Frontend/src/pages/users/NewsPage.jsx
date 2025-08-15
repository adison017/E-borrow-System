import { Announcement as AnnouncementIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getNews } from '../../utils/api';
import { MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md';

// Simple image carousel for news images
const ImageCarousel = ({ urls, altBase = 'image' }) => {
  const [index, setIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  if (!Array.isArray(urls) || urls.length === 0) return null;

  const total = urls.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="mt-4">
      <div className="relative h-64 md:h-80 w-fit max-w-full rounded-lg overflow-hidden bg-black shadow mx-auto">
        <img
          src={urls[index]}
          alt={`${altBase}-${index + 1}`}
          className="h-full w-auto max-w-full object-contain cursor-zoom-in"
          onClick={() => setIsPreviewOpen(true)}
        />
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="ก่อนหน้า"
            >
              <MdChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="ถัดไป"
            >
              <MdChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1">
          {urls.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full ${i === index ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-label={`ไปยังรูปที่ ${i + 1}`}
            />
          ))}
        </div>
      )}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setIsPreviewOpen(false)}>
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={urls[index]}
              alt={`${altBase}-preview-${index + 1}`}
              className="w-full h-full object-contain"
            />
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center"
                  aria-label="ก่อนหน้า"
                >
                  <MdChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center"
                  aria-label="ถัดไป"
                >
                  <MdChevronRight size={22} />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="ปิด"
            >
              <MdClose size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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
      const data = await getNews();
      if (Array.isArray(data)) {
        const flagTrue = (v) => v === 1 || v === '1' || v === true || v === 'true';
        // แสดงเฉพาะข่าวที่ตั้งค่า "แสดงให้ทุกบทบาท" เสมอ (ไม่ขึ้นกับ force_show)
        setNewsItems(data.filter(n => flagTrue(n.show_to_all)));
      } else {
        setNewsItems([]);
        if (data && data.message) setError(data.message); // Show backend error
      }
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
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">เกิดข้อผิดพลาด! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : Array.isArray(newsItems) && newsItems.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีข่าวสารในระบบ</p>
        ) : (
          Array.isArray(newsItems) && newsItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-blue-100/20 p-6 rounded-4xl shadow-md hover:shadow-xl transition-shadow"
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
              {item.image_url && (() => {
                let urls = [];
                try {
                  urls = Array.isArray(item.image_url) ? item.image_url : JSON.parse(item.image_url);
                  if (!Array.isArray(urls)) urls = item.image_url ? [item.image_url] : [];
                } catch (e) {
                  urls = item.image_url ? [item.image_url] : [];
                }
                return <ImageCarousel urls={urls} altBase={item.title} />;
              })()}
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

// Exporting the renamed component
export default NewsPage;