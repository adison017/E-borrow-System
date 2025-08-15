import React, { useEffect, useMemo, useState } from 'react';
import { getNews } from '../utils/api';
import { MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md';

// Mark a news item as hidden for a user so it won't be shown again
// v2: include news date in the key so republished/updated news shows again
const STORAGE_HIDE_PREFIX = 'news_hide_v2_';

// Category color mapping (same as ManageNews.jsx)
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

export default function FirstVisitNewsModal({ userId }) {
  const [open, setOpen] = useState(false);
  const [newsItems, setNewsItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const storageUser = userId || 'anon';

  const getHideKey = (news) => {
    try {
      const ts = news?.date ? new Date(news.date).getTime() : 'nodate';
      return `${STORAGE_HIDE_PREFIX}${storageUser}_${news?.id}_${ts}`;
    } catch {
      return `${STORAGE_HIDE_PREFIX}${storageUser}_${news?.id}_nodate`;
    }
  };
  const isHiddenFor = (news) => !!localStorage.getItem(getHideKey(news));
  const hideNewsFor = (news) => localStorage.setItem(getHideKey(news), '1');

  useEffect(() => {
    const run = async () => {
      try {
        const data = await getNews();
        if (!Array.isArray(data) || data.length === 0) return;
        // Helper to normalize truthy flags (1, '1', true, 'true')
        const flagTrue = (v) => v === 1 || v === '1' || v === true || v === 'true';
        // Filter to items flagged show_to_all only (เห็นทุกบทบาท)
        let list = data.filter(n => flagTrue(n.show_to_all));
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
        list = list.slice(0, 8);
        // Always show items flagged show_to_all (ignore hidden state)
        const visible = list;
        setNewsItems(visible);
        if (visible.length > 0) {
          setCurrentIndex(0);
          setOpen(true); // Always open on mount if there is at least one visible news
        }
      } catch (e) {
        // ignore errors
      }
    };
    run();
    // Re-open on each mount (login/refresh) by design
  }, [storageUser]);

  const current = useMemo(() => newsItems[currentIndex], [newsItems, currentIndex]);

  useEffect(() => {
    // Reset image index when switching news item
    setImageIndex(0);
  }, [currentIndex]);

  if (!open || !current) return null;

  const moveNext = () => setCurrentIndex((i) => (i + 1) % newsItems.length);
  const movePrev = () => setCurrentIndex((i) => (i - 1 + newsItems.length) % newsItems.length);

  const handleCloseForNow = () => {
    // อนุญาตให้ปิดชั่วคราวเสมอ แม้ force_show จะเป็น 1
    // (ยังคงแสดงอีกครั้งเมื่อเข้าใหม่ตามพฤติกรรมเดิม)
    setOpen(false);
  };

  const handleDontShowAgain = () => {
    const flagTrue = (v) => v === 1 || v === '1' || v === true || v === 'true';
    // If current is force_show, do not allow hiding
    if (flagTrue(current?.force_show)) return;
    // Remove from current session only (show_to_all always shows next time)
    const remaining = newsItems.filter((n, idx) => idx !== currentIndex);
    if (remaining.length === 0) {
      setOpen(false);
      setNewsItems([]);
      return;
    }
    setNewsItems(remaining);
    setCurrentIndex((idx) => (idx >= remaining.length ? 0 : idx));
  };

  return (
    <div className="modal modal-open">
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-blue-900">ประกาศ</h3>
              {current?.category && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getCategoryColor(current.category)}`}>
                  {current.category}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-outline" onClick={handleCloseForNow}>ปิดชั่วคราว</button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <button className="btn btn-ghost" onClick={movePrev} aria-label="ก่อนหน้า"><MdChevronLeft size={20} /></button>
              <div className="flex-1">
                <h4 className="text-2xl font-semibold text-blue-700 mb-2 tracking-tight">{current.title}</h4>
                <div className="text-xs md:text-sm text-gray-500 mb-3 flex items-center justify-between">
                  <span>เผยแพร่เมื่อ: {new Date(current.date).toLocaleDateString('th-TH')}</span>
                  {current?.category && (
                    <span className={`text-[10px] md:text-xs font-semibold px-2 py-1 rounded-full ${getCategoryColor(current.category)}`}>
                      {current.category}
                    </span>
                  )}
                </div>
                {current.image_url && (() => {
                  let urls = [];
                  try {
                    urls = Array.isArray(current.image_url) ? current.image_url : JSON.parse(current.image_url);
                    if (!Array.isArray(urls)) urls = current.image_url ? [current.image_url] : [];
                  } catch (e) {
                    urls = current.image_url ? [current.image_url] : [];
                  }
                  if (!urls || urls.length === 0) return null;
                  const total = urls.length;
                  const prevImg = () => setImageIndex((i) => (i - 1 + total) % total);
                  const nextImg = () => setImageIndex((i) => (i + 1) % total);
                  return (
                    <div className="mb-4">
                      <div className="relative h-56 md:h-72 w-fit max-w-full rounded-lg overflow-hidden bg-black shadow mx-auto">
                        <img src={urls[imageIndex]} alt={`${current.title}-${imageIndex}`} className="h-full w-auto max-w-full object-contain cursor-zoom-in" onClick={() => setIsPreviewOpen(true)} />
                        {total > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={prevImg}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                              aria-label="ก่อนหน้า"
                            >
                              <MdChevronLeft size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={nextImg}
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
                              onClick={() => setImageIndex(i)}
                              className={`w-2 h-2 rounded-full ${i === imageIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                              aria-label={`ไปยังรูปที่ ${i + 1}`}
                            />
                          ))}
                        </div>
                      )}
                      {isPreviewOpen && (
                        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setIsPreviewOpen(false)}>
                          <div className="relative w-full h-full max-w-6xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                            <img src={urls[imageIndex]} alt={`${current.title}-preview-${imageIndex}`} className="w-full h-full object-contain" />
                            {total > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={prevImg}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center"
                                  aria-label="ก่อนหน้า"
                                >
                                  <MdChevronLeft size={22} />
                                </button>
                                <button
                                  type="button"
                                  onClick={nextImg}
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
                })()}
                <p className="text-gray-700 whitespace-pre-wrap">{current.content}</p>
              </div>
              <button className="btn btn-ghost" onClick={moveNext} aria-label="ถัดไป"><MdChevronRight size={20} /></button>
            </div>
            {/* indicators */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {newsItems.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full ${idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`ไปยังข่าวที่ ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="p-4 border-t flex justify-between">
            <span className="text-sm text-gray-500">{currentIndex + 1} / {newsItems.length}</span>
            <div className="flex gap-2">
              <button className={`btn btn-outline ${(current && (current.force_show === 1 || current.force_show === '1' || current.force_show === true)) ? 'btn-disabled opacity-50 cursor-not-allowed' : ''}`} onClick={handleDontShowAgain} disabled={(current && (current.force_show === 1 || current.force_show === '1' || current.force_show === true))}>ไม่ต้องแสดงอีก</button>
              <button className="btn btn-primary" onClick={moveNext}>ข่าวถัดไป</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


