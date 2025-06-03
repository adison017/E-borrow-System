-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('การบำรุงรักษา', 'อุปกรณ์ใหม่', 'กิจกรรม', 'ประกาศ') NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO news (title, content, category, date) VALUES
('ปรับปรุงระบบครั้งใหญ่!', 'ระบบ E-borrow จะมีการปิดปรับปรุงเพื่อเพิ่มประสิทธิภาพและฟีเจอร์ใหม่ๆ ในวันที่ 30 เมษายน 2568 ตั้งแต่เวลา 00:00 ถึง 06:00 น. ขออภัยในความไม่สะดวก', 'การบำรุงรักษา', '2025-04-25 00:00:00'),
('อุปกรณ์ใหม่: โดรนสำหรับการถ่ายภาพมุมสูง', 'เราได้เพิ่มโดรน DJI Mavic Air 3 เข้ามาในระบบ ท่านสามารถเริ่มยืมได้ตั้งแต่วันนี้เป็นต้นไป', 'อุปกรณ์ใหม่', '2025-04-22 00:00:00'),
('อบรมการใช้งานโปรเจกเตอร์รุ่นใหม่', 'ขอเชิญผู้ที่สนใจเข้าร่วมอบรมการใช้งานโปรเจกเตอร์ Epson EB-L200SW ในวันที่ 5 พฤษภาคม 2568 เวลา 13:00 - 15:00 น. ณ ห้องประชุมใหญ่', 'กิจกรรม', '2025-04-20 00:00:00'),
('ประกาศวันหยุดเทศกาลสงกรานต์', 'เนื่องในเทศกาลสงกรานต์ ระบบ E-borrow จะงดให้บริการในวันที่ 13-15 เมษายน 2568 และจะเปิดให้บริการตามปกติในวันที่ 16 เมษายน 2568', 'ประกาศ', '2025-04-10 00:00:00');