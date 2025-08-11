import React, { useEffect, useState } from "react";
import { MdSettings, MdNotifications, MdAssignment, MdFactCheck, MdLocalShipping, MdUndo, MdBuild, MdErrorOutline, MdPayment, MdWarningAmber, MdCheckCircle, MdSchedule, MdChevronRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import { getAllBorrows, authFetch } from '../utils/api';
import { useBadgeCounts } from '../hooks/useSocket';
// import { Avatar } from "@material-tailwind/react"; // ไม่ใช้ Avatar แล้ว

function Header({ userRole, changeRole }) {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState('/logo_it.png');
  const roleNames = {
    admin: "ผู้ดูแลระบบ",
    user: "ผู้ใช้งาน",
    executive: "ผู้บริหาร"
  };
  const role = roleNames[userRole] || "ผู้ใช้งาน";
  const [currentTime, setCurrentTime] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  // Admin counts
  const [adminCounts, setAdminCounts] = useState({ pending: 0, carry: 0, returns: 0 });
  // Executive counts
  const [execCounts, setExecCounts] = useState({ borrowApproval: 0, repairApproval: 0 });
  // User counts
  const [userCounts, setUserCounts] = useState({
    pending: 0,
    approved: 0,
    carry: 0,
    waiting_payment: 0,
    overdue: 0,
    rejected: 0,
  });
  // Per-item notifications and read tracking
  const [notifItems, setNotifItems] = useState([]);
  const [readIds, setReadIds] = useState(new Set());
  const [readAtMap, setReadAtMap] = useState({}); // id -> timestamp when read
  const [firstSeenMap, setFirstSeenMap] = useState({}); // id -> timestamp
  const [lastUnreadCount, setLastUnreadCount] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const originalTitleRef = React.useRef('');
  const titleBlinkIntervalRef = React.useRef(null);
  const prevItemIdsRef = React.useRef(new Set());
  const audioRef = React.useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('notifSound') === '1');
  const { subscribeToBadgeCounts } = useBadgeCounts();
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.clear();
    setShowLogoutConfirm(false);
    navigate('/login');
  };
  const cancelLogout = () => setShowLogoutConfirm(false);

  // ฟังก์ชันสำหรับคลิกโลโก้
  const handleLogoClick = () => {
    if (userRole === 'admin') navigate('/DashboardAd');
    else if (userRole === 'executive') navigate('/DashboardEx');
    else navigate('/DashboardUs');
  };

  useEffect(() => {
    // โหลด user info จาก localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUsername(userData.Fullname || userData.username);
      } catch (e) {}
    }
  }, [userRole]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " น.";
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // โหลด avatar เริ่มต้นจาก localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.avatar) {
          setAvatar(user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000/uploads/user/${user.avatar}`);
        }
      } catch {}
    }
    // ฟัง event profileImageUpdated
    const handleProfileImageUpdate = (event) => {
      if (event.detail && event.detail.imagePath) {
        setAvatar(event.detail.imagePath); // setState ด้วย path ใหม่
      }
    };
    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);
    return () => {
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
    };
  }, []);

  // Initialize original title
  useEffect(() => {
    if (!originalTitleRef.current) {
      originalTitleRef.current = document.title || 'e-Borrow';
    }
  }, []);

  // Init notification sound
  useEffect(() => {
    try {
      audioRef.current = new Audio('/notification.mp');
      audioRef.current.preload = 'auto';
      audioRef.current.volume = 1.0;
    } catch {}
  }, []);

  // Stop blinking on focus or when menu is opened
  useEffect(() => {
    const onFocus = () => stopTitleBlink();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  useEffect(() => {
    if (showNotifMenu) stopTitleBlink();
  }, [showNotifMenu]);

  const stopTitleBlink = () => {
    if (titleBlinkIntervalRef.current) {
      clearInterval(titleBlinkIntervalRef.current);
      titleBlinkIntervalRef.current = null;
    }
    setIsBlinking(false);
    if (originalTitleRef.current) document.title = originalTitleRef.current;
  };

  const startTitleBlink = (count) => {
    if (isBlinking) return;
    setIsBlinking(true);
    let toggle = false;
    const base = originalTitleRef.current || 'e-Borrow';
    titleBlinkIntervalRef.current = setInterval(() => {
      toggle = !toggle;
      document.title = toggle ? `(${count}) \u{1F514} ${base}` : base;
    }, 1000);
    // Auto-stop after 20s
    setTimeout(() => stopTitleBlink(), 20000);
  };

  const requestBrowserPermission = async () => {
    try {
      if (!('Notification' in window)) return;
      if (Notification.permission === 'default') await Notification.requestPermission();
    } catch {}
  };

  const showBrowserNotification = (text) => {
    try {
      if (!('Notification' in window)) return;
      if (Notification.permission === 'granted') {
        const n = new Notification('e-Borrow แจ้งเตือน', { body: text, icon: '/logo_it.png' });
        setTimeout(() => n.close(), 8000);
      }
    } catch {}
  };

  const playNotificationSound = async () => {
    try {
      if (!soundEnabled || !audioRef.current) return;
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      if ('vibrate' in navigator) navigator.vibrate([200]);
    } catch {}
  };

  // Notifications by role
  useEffect(() => {
    let unsubscribe = () => {};

    const getRoleStorageKey = () => {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const uid = user?.user_id ? String(user.user_id) : 'unknown';
        return `notif.read.${userRole}.${uid}`;
      } catch {
        return `notif.read.${userRole}.unknown`;
      }
    };
    const getSeenStorageKey = () => {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const uid = user?.user_id ? String(user.user_id) : 'unknown';
        return `notif.seen.${userRole}.${uid}`;
      } catch {
        return `notif.seen.${userRole}.unknown`;
      }
    };

    const getReadAtStorageKey = () => {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const uid = user?.user_id ? String(user.user_id) : 'unknown';
        return `notif.readAt.${userRole}.${uid}`;
      } catch {
        return `notif.readAt.${userRole}.unknown`;
      }
    };

    const loadRead = () => {
      try {
        const key = getRoleStorageKey();
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        setReadIds(new Set(arr));
      } catch { setReadIds(new Set()); }
      try {
        const keyAt = getReadAtStorageKey();
        const rawAt = localStorage.getItem(keyAt);
        const mapAt = rawAt ? JSON.parse(rawAt) : {};
        setReadAtMap(mapAt && typeof mapAt === 'object' ? mapAt : {});
      } catch { setReadAtMap({}); }
    };

    const saveRead = (setObj) => {
      try {
        const key = getRoleStorageKey();
        localStorage.setItem(key, JSON.stringify(Array.from(setObj)));
      } catch {}
      try {
        const keyAt = getReadAtStorageKey();
        localStorage.setItem(keyAt, JSON.stringify(readAtMap));
      } catch {}
    };

    const loadSeen = () => {
      try {
        const key = getSeenStorageKey();
        const raw = localStorage.getItem(key);
        const map = raw ? JSON.parse(raw) : {};
        setFirstSeenMap(map && typeof map === 'object' ? map : {});
      } catch { setFirstSeenMap({}); }
    };

    const saveSeen = (mapObj) => {
      try {
        const key = getSeenStorageKey();
        localStorage.setItem(key, JSON.stringify(mapObj));
      } catch {}
    };

    const ensureFirstSeenFor = (items) => {
      const now = Date.now();
      const next = { ...firstSeenMap };
      let changed = false;
      const idsInList = new Set(items.map(i => i.id));
      items.forEach(i => {
        if (!next[i.id]) {
          next[i.id] = now;
          changed = true;
        }
      });
      // Optional: prune entries not in current items or older than 7 days to avoid growth
      Object.keys(next).forEach(id => {
        if (!idsInList.has(id)) delete next[id];
      });
      if (changed) {
        setFirstSeenMap(next);
        saveSeen(next);
      }
    };

    const buildItemsAdmin = (borrows) => {
      const items = [];
      borrows.forEach(b => {
        const code = b.borrow_code || b.code || '';
        const idBase = `borrow:${b.borrow_id || code || Math.random()}`;
        if (b.status === 'pending' || b.status === 'pending_approval') {
          items.push({ id: `${idBase}:pending`, type: 'admin_pending', text: `มีคำขอยืมใหม่ ${code ? '('+code+')' : ''} กรุณาตรวจสอบ`, href: '/borrow-list' });
        }
        if (b.status === 'carry') {
          items.push({ id: `${idBase}:carry`, type: 'admin_carry', text: `มีรายการส่งมอบครุภัณฑ์ ${code ? '('+code+')' : ''} รอดำเนินการ`, href: '/ReceiveItem' });
        }
        if (['approved','overdue','waiting_payment'].includes(b.status)) {
          items.push({ id: `${idBase}:return`, type: 'admin_return', text: `มีรายการคืนครุภัณฑ์ ${code ? '('+code+')' : ''} รอดำเนินการ`, href: '/return-list' });
        }
      });
      return items;
    };

    const buildItemsExecutive = (borrows, repairs) => {
      const items = [];
      borrows.filter(b => b.status === 'pending_approval').forEach(b => {
        const code = b.borrow_code || '';
        const idBase = `borrow:${b.borrow_id || code || Math.random()}`;
        items.push({ id: `${idBase}:pending_approval`, type: 'exec_borrow_approval', text: `มีคำขออนุมัติการยืมใหม่ ${code ? '('+code+')' : ''} กรุณาพิจารณาอนุมัติ`, href: '/BorrowApprovalList' });
      });
      (Array.isArray(repairs) ? repairs : []).filter(r => r.status === 'รออนุมัติซ่อม').forEach((r, idx) => {
        const rid = r.repair_id || r.id || r.request_id || idx;
        const rcode = r.repair_code || r.code || '';
        items.push({ id: `repair:${rid}:approval`, type: 'exec_repair_approval', text: `มีคำขออนุมัติซ่อมใหม่ ${rcode ? '('+rcode+')' : ''} กรุณาพิจารณาอนุมัติ` , href: '/Repair' });
      });
      return items;
    };

    const buildItemsUser = (mine) => {
      const items = [];
      mine.forEach(b => {
        const code = b.borrow_code || '';
        const idBase = `borrow:${b.borrow_id || code || Math.random()}`;
        if (b.status === 'pending' || b.status === 'pending_approval') items.push({ id: `${idBase}:pending`, type: 'user_pending', text: `คำขอยืมของท่านรอการอนุมัติ ${code ? '('+code+')' : ''}`, href: '/borrow' });
        if (b.status === 'approved') items.push({ id: `${idBase}:approved`, type: 'user_approved', text: `คำขอยืมของท่านได้รับการอนุมัติ ${code ? '('+code+')' : ''} กรุณามารับครุภัณฑ์ตามนัดหมาย`, href: '/approve' });
        if (b.status === 'carry') items.push({ id: `${idBase}:carry`, type: 'user_carry', text: `พร้อมส่งมอบครุภัณฑ์ ${code ? '('+code+')' : ''} กรุณามารับครุภัณฑ์ที่จุดรับ`, href: '/approve' });
        if (b.status === 'waiting_payment') items.push({ id: `${idBase}:waiting_payment`, type: 'user_waiting_payment', text: `มีรายการค้างชำระ ${code ? '('+code+')' : ''} กรุณาดำเนินการชำระ`, href: '/fine' });
        if (b.status === 'overdue') items.push({ id: `${idBase}:overdue`, type: 'user_overdue', text: `รายการยืม ${code ? '('+code+')' : ''} เกินกำหนดคืน กรุณาดำเนินการคืน`, href: '/return' });
        if (b.status === 'rejected') items.push({ id: `${idBase}:rejected`, type: 'user_rejected', text: `คำขอยืม ${code ? '('+code+')' : ''} ไม่ได้รับการอนุมัติ`, href: '/cancel' });
      });
      return items;
    };

    const refreshAdmin = async () => {
      try {
        const data = await getAllBorrows();
        if (!Array.isArray(data)) return;
        const pending = data.filter(b => b.status === 'pending' || b.status === 'pending_approval').length;
        const carry = data.filter(b => b.status === 'carry').length;
        const returns = data.filter(b => ['approved', 'overdue', 'waiting_payment'].includes(b.status)).length;
        setAdminCounts({ pending, carry, returns });
        loadRead();
        loadSeen();
        const items = buildItemsAdmin(data);
        setNotifItems(items);
        ensureFirstSeenFor(items);
      } catch {}
    };

    const refreshExecutive = async () => {
      try {
        const data = await getAllBorrows();
        const borrowApproval = Array.isArray(data) ? data.filter(b => b.status === 'pending_approval').length : 0;
        const res = await authFetch('http://localhost:5000/api/repair-requests');
        const list = await res.json();
        const repairApproval = Array.isArray(list) ? list.filter(r => r.status === 'รออนุมัติซ่อม').length : 0;
        setExecCounts({ borrowApproval, repairApproval });
        loadRead();
        loadSeen();
        const items = buildItemsExecutive(Array.isArray(data) ? data : [], Array.isArray(list) ? list : []);
        setNotifItems(items);
        ensureFirstSeenFor(items);
      } catch {}
    };

    const refreshUser = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (!user?.user_id) return;
        const data = await getAllBorrows();
        const mine = Array.isArray(data) ? data.filter(b => String(b.user_id) === String(user.user_id)) : [];
        setUserCounts({
          pending: mine.filter(b => b.status === 'pending' || b.status === 'pending_approval').length,
          approved: mine.filter(b => b.status === 'approved').length,
          carry: mine.filter(b => b.status === 'carry').length,
          waiting_payment: mine.filter(b => b.status === 'waiting_payment').length,
          overdue: mine.filter(b => b.status === 'overdue').length,
          rejected: mine.filter(b => b.status === 'rejected').length,
        });
        loadRead();
        loadSeen();
        const items = buildItemsUser(mine);
        setNotifItems(items);
        ensureFirstSeenFor(items);
      } catch {}
    };

    // Initial per role
    if (userRole === 'admin') refreshAdmin();
    if (userRole === 'executive') refreshExecutive();
    if (userRole === 'user') refreshUser();
    requestBrowserPermission();

    // Subscribe to real-time updates
    unsubscribe = subscribeToBadgeCounts((badges = {}) => {
      if (userRole === 'admin') {
        const { pendingCount, carryCount, returnCount } = badges;
        setAdminCounts(prev => ({
          pending: typeof pendingCount === 'number' ? pendingCount : prev.pending,
          carry: typeof carryCount === 'number' ? carryCount : prev.carry,
          returns: typeof returnCount === 'number' ? returnCount : prev.returns,
        }));
        // Rebuild list lazily
        refreshAdmin();
      } else if (userRole === 'executive') {
        const { borrowApprovalCount, repairApprovalCount } = badges;
        setExecCounts(prev => ({
          borrowApproval: typeof borrowApprovalCount === 'number' ? borrowApprovalCount : prev.borrowApproval,
          repairApproval: typeof repairApprovalCount === 'number' ? repairApprovalCount : prev.repairApproval,
        }));
        refreshExecutive();
      } else if (userRole === 'user') {
        // For user, just refresh personal counts on any badge update
        refreshUser();
      }
    });

    return () => {
      try { unsubscribe && unsubscribe(); } catch {}
    };
  }, [userRole, subscribeToBadgeCounts]);

  // Filter to show unread and recently-seen (<= 1 day)
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const nowTs = Date.now();
  const visibleItems = notifItems.filter(item => {
    const seenAt = firstSeenMap[item.id];
    const recentlySeen = seenAt && (nowTs - seenAt <= ONE_DAY_MS);
    // Always show both read and unread when there is any item; keep 1-day policy for prunes only
    return true;
  });
  const unreadCount = notifItems.reduce((acc, item) => acc + (readIds.has(item.id) ? 0 : 1), 0);
  const sortedVisibleItems = [...visibleItems].sort((a, b) => {
    const aUnread = !readIds.has(a.id);
    const bUnread = !readIds.has(b.id);
    if (aUnread !== bUnread) return aUnread ? -1 : 1; // ยังไม่อ่านมาก่อน
    const at = firstSeenMap[a.id] || 0;
    const bt = firstSeenMap[b.id] || 0;
    return bt - at; // ใหม่สุดก่อน
  });

  // Detect newly added notification items and trigger title blink + browser notification
  useEffect(() => {
    const currentIds = new Set(notifItems.map(i => i.id));
    const prevIds = prevItemIdsRef.current;
    const newIds = [...currentIds].filter(id => !prevIds.has(id));
    // Update ref for next compare
    prevItemIdsRef.current = currentIds;
    if (newIds.length > 0) {
      // Use the first new item's text for notification body
      const firstNew = notifItems.find(i => i.id === newIds[0]);
      if (firstNew) showBrowserNotification(firstNew.text);
      playNotificationSound();
      if (unreadCount > lastUnreadCount) startTitleBlink(unreadCount);
    }
    // Track last unread count
    setLastUnreadCount(unreadCount);
  }, [notifItems, unreadCount]);

  return (
    <>
      <header className="bg-gradient-to-r from-indigo-950 to-blue-700 text-white py-4 px-10 mb-1">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Logo + System Name */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center justify-center p-1 w-30 h-20 cursor-pointer" onClick={handleLogoClick} title="ไปหน้าแรก">
              <img
                src="/logo_it.png"
                alt="Logo"
                className="object-contain md:w-40 md:h-50"
              />
            </div>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold tracking-tight drop-shadow-sm whitespace-nowrap">
              ระบบยืม-คืนครุภัณฑ์
            </h1>
          </div>

          {/* Right side container */}
          <div className="flex flex-col sm:flex-row items-center gap-3 ">
            {/* Role switcher */}
            {/*
<div className="flex gap-2 bg-indigo-900/30 p-1 rounded-full">
  <button
    onClick={() => changeRole('admin')}
    className={`px-3 py-1 text-xs rounded-full ${userRole === 'admin' ? 'bg-blue-500 text-white' : 'bg-indigo-800/30 hover:bg-indigo-800/50'}`}
    title="ผู้ดูแลระบบ"
  >
    Admin
  </button>
  <button
    onClick={() => changeRole('user')}
    className={`px-3 py-1 text-xs rounded-full ${userRole === 'user' ? 'bg-blue-500 text-white' : 'bg-indigo-800/30 hover:bg-indigo-800/50'}`}
    title="ผู้ใช้งาน"
  >
    User
  </button>
  <button
    onClick={() => changeRole('executive')}
    className={`px-3 py-1 text-xs rounded-full ${userRole === 'executive' ? 'bg-blue-500 text-white' : 'bg-indigo-800/30 hover:bg-indigo-800/50'}`}
    title="ผู้บริหาร"
  >
    Executive
  </button>
</div>
*/}

            {/* User Info + Logout */}
            <div className="flex items-center gap-3 sm:gap-4 bg-indigo-950/50 rounded-full pl-5 pr-3 py-3 shadow-inner">
              {/* Username + Role */}
              <div className="text-right hidden sm:block">
                <div className="font-semibold text-sm md:text-base">{username}</div>
                <div className="text-blue-100 text-xs md:text-sm">{role}</div>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center">
                <img
                  src={avatar}
                  alt={username || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                  }}
                />
              </div>

              {/* Notifications - role specific content */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifMenu(v => !v)}
                  onBlur={() => setTimeout(() => setShowNotifMenu(false), 150)}
                  className="md:flex items-center justify-center p-2 rounded-full hover:bg-blue-700 transition-colors relative"
                  title="การแจ้งเตือน"
                >
                  <MdNotifications className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-96 bg-white text-gray-800 rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden z-20">
                    <div className="px-4 py-3 border-b text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 flex items-center gap-2">
                      <MdNotifications className="text-blue-600" /> การแจ้งเตือน
                    </div>
                    <div className="max-h-96 overflow-auto text-sm">
                      {unreadCount === 0 && (
                        <div className="px-4 py-3 text-gray-500">ยังไม่มีการแจ้งเตือนใหม่</div>
                      )}
                      {sortedVisibleItems.length > 0 && (
                        <ul className="divide-y">
                          {sortedVisibleItems.map(item => {
                            const isRead = readIds.has(item.id);
                            const iconMap = {
                              admin_pending: <MdAssignment className="text-blue-600" />,
                              admin_carry: <MdLocalShipping className="text-amber-600" />,
                              admin_return: <MdUndo className="text-purple-600" />,
                              exec_borrow_approval: <MdFactCheck className="text-red-600" />,
                              exec_repair_approval: <MdBuild className="text-amber-600" />,
                              user_pending: <MdSchedule className="text-blue-600" />,
                              user_approved: <MdCheckCircle className="text-green-600" />,
                              user_carry: <MdLocalShipping className="text-amber-600" />,
                              user_waiting_payment: <MdPayment className="text-rose-600" />,
                              user_overdue: <MdWarningAmber className="text-purple-600" />,
                              user_rejected: <MdErrorOutline className="text-gray-600" />,
                            };
                            const statusBadge = {
                              admin_pending: { label: 'รอจัดการ', cls: 'bg-blue-100 text-blue-700 border border-blue-200' },
                              admin_carry: { label: 'ส่งมอบ', cls: 'bg-amber-100 text-amber-700 border border-amber-200' },
                              admin_return: { label: 'รอคืน', cls: 'bg-purple-100 text-purple-700 border border-purple-200' },
                              exec_borrow_approval: { label: 'รออนุมัติยืม', cls: 'bg-red-100 text-red-700 border border-red-200' },
                              exec_repair_approval: { label: 'รออนุมัติซ่อม', cls: 'bg-amber-100 text-amber-700 border border-amber-200' },
                              user_pending: { label: 'รออนุมัติ', cls: 'bg-blue-100 text-blue-700 border border-blue-200' },
                              user_approved: { label: 'อนุมัติแล้ว', cls: 'bg-green-100 text-green-700 border border-green-200' },
                              user_carry: { label: 'กำลังยืม', cls: 'bg-amber-100 text-amber-700 border border-amber-200' },
                              user_waiting_payment: { label: 'ค้างชำระ', cls: 'bg-rose-100 text-rose-700 border border-rose-200' },
                              user_overdue: { label: 'เกินกำหนด', cls: 'bg-purple-100 text-purple-700 border border-purple-200' },
                              user_rejected: { label: 'ไม่อนุมัติ', cls: 'bg-gray-100 text-gray-700 border border-gray-200' },
                            }[item.type] || { label: 'แจ้งเตือน', cls: 'bg-gray-100 text-gray-700 border border-gray-200' };
                            const icon = iconMap[item.type] || <MdNotifications className="text-gray-600" />;
                            return (
                              <li key={item.id}>
                                <button
                                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3 cursor-pointer ${isRead ? 'text-gray-500' : 'text-gray-800'}`}
                                  onMouseDown={(e)=>e.preventDefault()}
                                  onClick={() => {
                                    setShowNotifMenu(false);
                                    const next = new Set(Array.from(readIds));
                                    next.add(item.id);
                                    setReadIds(next);
                                    try {
                                      const userStr = localStorage.getItem('user');
                                      const user = userStr ? JSON.parse(userStr) : null;
                                      const key = `notif.read.${userRole}.${user?.user_id || 'unknown'}`;
                                      localStorage.setItem(key, JSON.stringify(Array.from(next)));
                                    } catch {}
                                    try {
                                      const keyAt = (() => {
                                        try {
                                          const userStr = localStorage.getItem('user');
                                          const user = userStr ? JSON.parse(userStr) : null;
                                          const uid = user?.user_id ? String(user.user_id) : 'unknown';
                                          return `notif.readAt.${userRole}.${uid}`;
                                        } catch { return `notif.readAt.${userRole}.unknown`; }
                                      })();
                                      const newMap = { ...readAtMap, [item.id]: Date.now() };
                                      setReadAtMap(newMap);
                                      localStorage.setItem(keyAt, JSON.stringify(newMap));
                                    } catch {}
                                    navigate(item.href);
                                  }}
                                >
                                  <div className="mt-0.5">{icon}</div>
                                  <div className="flex-1">
                                    <div className="font-medium leading-5 flex items-center gap-2 flex-wrap">
                                      <span>{item.text}</span>
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.cls}`}>{statusBadge.label}</span>
                                      {!isRead && (
                                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full" title="ใหม่" aria-label="ใหม่"></span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      {(() => {
                                        const readAt = readAtMap[item.id];
                                        if (readAt) {
                                          const mins = Math.max(1, Math.round((nowTs - readAt) / 60000));
                                          return `อ่านแล้ว ${mins} นาทีที่แล้ว`;
                                        }
                                        return 'ยังไม่ได้อ่าน';
                                      })()}
                                    </div>
                                  </div>
                                  <div className="ml-auto flex items-center gap-2">
                                    <span className="text-xs text-blue-600 font-medium">คลิกเพื่อดูรายละเอียด</span>
                                  </div>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Settings Button (role-based destination) */}
              <button
                onClick={() => navigate(userRole === 'admin' ? '/system-settings' : '/edit_profile')}
                className="md:flex items-center justify-center p-2 rounded-full hover:bg-blue-700 transition-colors"
                title={userRole === 'admin' ? 'ตั้งค่าระบบ' : 'ตั้งค่า'}
              >
                <MdSettings className="h-5 w-5" />
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="md:flex items-center justify-center p-2 rounded-full hover:bg-blue-700 transition-colors"
                title="ออกจากระบบ"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {showLogoutConfirm && (
        <Notification
          show={showLogoutConfirm}
          title="ยืนยันออกจากระบบ"
          message="คุณต้องการออกจากระบบใช่หรือไม่?"
          type="warning"
          onClose={cancelLogout}
          actions={[
            { label: 'ยกเลิก', onClick: cancelLogout },
            { label: 'ออกจากระบบ', onClick: confirmLogout }
          ]}
        />
      )}
    </>
  );
}

export default Header;