import React, { useEffect, useState } from "react";
import { Avatar } from "@material-tailwind/react";

// สร้าง global state สำหรับเก็บข้อมูลผู้ใช้
let globalUserData = null;
let globalUpdateProfileImage = null;

function Header({ userRole, changeRole }) {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState('/logo_it.png');
  const roleNames = {
    admin: "ผู้ดูแลระบบ",
    user: "ผู้ใช้งาน",
    executive: "ผู้บริหาร"
  };
  const role = roleNames[userRole] || "ผู้ใช้งาน";
  const [currentTime, setCurrentTime] = useState("");

  // Function to update global user data
  const updateGlobalUserData = (newData) => {
    globalUserData = newData;
    setUsername(newData.Fullname || newData.username);
    if (newData.avatar) {
      let avatarPath = newData.avatar;
      avatarPath = avatarPath.replace(/^[\\/]+/, '');
      avatarPath = avatarPath.replace(/^http:\/\/localhost:5000\//, '');
      avatarPath = avatarPath.replace(/^uploads\//, '');
      avatarPath = avatarPath.replace(/^imgEborow\//, '');
      setProfileImage(`http://localhost:5000/uploads/${avatarPath}?t=${Date.now()}`);
    }
  };

  // Add event listener for user data updates
  useEffect(() => {
    const handleUserDataUpdate = (event) => {
      if (event.detail && event.detail.userData) {
        updateGlobalUserData(event.detail.userData);
      }
    };

    const handleProfileImageUpdate = (event) => {
      if (event.detail && event.detail.imagePath) {
        // Add timestamp to force image refresh
        const timestamp = Date.now();
        const imagePath = event.detail.imagePath.includes('?')
          ? event.detail.imagePath
          : `${event.detail.imagePath}?t=${timestamp}`;
        setProfileImage(imagePath);
      }
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);

    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
    };
  }, []);

  // Function to update profile image
  const updateProfileImage = (newImagePath) => {
    if (newImagePath) {
      // Clean up the URL construction
      let filename = newImagePath;
      // Remove any base URLs
      filename = filename.replace(/http:\/\/localhost:5000\//g, '');
      // Remove any path prefixes
      filename = filename.replace(/^uploads\//, '');
      filename = filename.replace(/^imgEborow\//, '');
      // Remove any leading slashes or backslashes
      filename = filename.replace(/^[\\/]+/, '');
      // Add timestamp to force image refresh
      const timestamp = Date.now();
      const cleanPath = `http://localhost:5000/uploads/${filename}?t=${timestamp}`;
      setProfileImage(cleanPath);
    }
  };

  // Set the global update function
  useEffect(() => {
    globalUpdateProfileImage = updateProfileImage;
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = '31'; // กำหนดค่า user_id เป็น 28 สำหรับทดสอบ
      try {
        console.log('Fetching user data for ID:', userId);
        const response = await fetch(`http://localhost:5000/users/id/${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Received user data:', data);
          if (data) {
            globalUserData = data; // เก็บข้อมูลใน global state
            setUsername(data.Fullname || data.username);

            // Fix avatar URL construction
            let avatarPath = '/logo_it.png';
            if (data.avatar) {
              if (data.avatar.startsWith('http')) {
                // If it's already a full URL, use it directly
                avatarPath = data.avatar;
              } else {
                // Remove any path prefixes and clean the path
                let cleanPath = data.avatar.replace(/^[\\/]+/, '');
                cleanPath = cleanPath.replace(/^http:\/\/localhost:5000\//, '');
                cleanPath = cleanPath.replace(/^uploads\//, '');
                cleanPath = cleanPath.replace(/^imgEborow\//, '');
                // Add timestamp to force image refresh
                const timestamp = Date.now();
                avatarPath = `http://localhost:5000/uploads/${cleanPath}?t=${timestamp}`;
              }
            }

            console.log('Setting avatar path:', avatarPath);
            setProfileImage(avatarPath);
          } else {
            console.error('No user data received');
          }
        } else {
          console.error('Failed to fetch user data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

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

  return (
    <header className="bg-gradient-to-r from-indigo-950 to-blue-700 text-white py-4 px-10 mb-1">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Logo + System Name */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center justify-center p-1 w-30 h-20">
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
                src={profileImage}
                alt={username || "User"}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                }}
              />
            </div>

            {/* Logout Button (optional) */}
            <button
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
  );
}

// Export globalUserData และ globalUpdateProfileImage เพื่อให้ edit_profile.jsx สามารถเข้าถึงได้
export { globalUserData, globalUpdateProfileImage };
export default Header;