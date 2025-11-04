-- ============================================================================
-- Migration: Fix banners table structure
-- Date: 2024
-- Description: Sửa cấu trúc bảng banners để khớp với code
-- ============================================================================

-- Bước 1: Backup dữ liệu hiện tại (nếu có)
CREATE TABLE IF NOT EXISTS banners_backup AS SELECT * FROM banners;

-- Bước 2: Drop bảng cũ
DROP TABLE IF EXISTS banners;

-- Bước 3: Tạo lại bảng với cấu trúc đúng
CREATE TABLE IF NOT EXISTS banners (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    link_url VARCHAR(500),
    position ENUM(
        'home_hero',
        'home_below_search',
        'listing_top',
        'listing_sidebar',
        'detail_top',
        'checkout_sidebar',
        'popup'
    ) NOT NULL,
    button_text VARCHAR(100),
    discount_text VARCHAR(100),
    priority INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATETIME,
    end_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_position (position),
    INDEX idx_is_active (is_active),
    INDEX idx_dates (start_date, end_date)
);

-- Bước 4: Migrate dữ liệu từ backup (nếu có)
-- Uncomment các dòng dưới nếu cần migrate dữ liệu cũ
/*
INSERT INTO banners (
    title, description, image_url, position, 
    discount_text, is_active, start_date, end_date
)
SELECT 
    title,
    description,
    image as image_url,
    CASE position
        WHEN 'HERO' THEN 'home_hero'
        WHEN 'SIDEBAR' THEN 'listing_sidebar'
        WHEN 'FOOTER' THEN 'home_below_search'
        WHEN 'POPUP' THEN 'popup'
        ELSE 'home_hero'
    END as position,
    CONCAT(
        CASE discount_type
            WHEN 'PERCENTAGE' THEN CONCAT('Giảm ', discount_value, '%')
            WHEN 'FIXED' THEN CONCAT('Giảm ', FORMAT(discount_value, 0), ' VNĐ')
            ELSE ''
        END
    ) as discount_text,
    is_active,
    CAST(start_date AS DATETIME),
    CAST(end_date AS DATETIME)
FROM banners_backup
WHERE EXISTS (SELECT 1 FROM banners_backup);
*/

-- Bước 5: Insert dữ liệu mẫu
INSERT INTO banners (title, description, image_url, link_url, position, button_text, discount_text, priority, is_active, start_date, end_date) VALUES
-- Home Hero Banners
(
    'Giảm 20% cho khách đặt lần đầu', 
    'Đặt homestay ngay hôm nay và nhận ưu đãi đặc biệt dành cho khách hàng mới. Áp dụng cho tất cả các homestay trên hệ thống.', 
    '/images/homestays/1.jpg', 
    '/homestays', 
    'home_hero', 
    'Đặt ngay', 
    '🎉 Giảm 20%', 
    100, 
    TRUE, 
    NOW(), 
    DATE_ADD(NOW(), INTERVAL 30 DAY)
),
(
    'Khám phá Sa Pa mùa đông', 
    'Trải nghiệm không khí se lạnh và cảnh đẹp tuyệt vời của Sa Pa. Homestay chất lượng cao với view núi non hùng vĩ.', 
    '/images/homestays/2.jpg', 
    '/homestays?location=sapa', 
    'home_hero', 
    'Xem ngay', 
    'Deal Hot 🔥', 
    90, 
    TRUE, 
    NOW(), 
    DATE_ADD(NOW(), INTERVAL 60 DAY)
),
(
    'Nghỉ dưỡng biển Đà Nẵng', 
    'Homestay view biển tuyệt đẹp tại Đà Nẵng. Giá ưu đãi cho kỳ nghỉ cuối tuần của bạn.', 
    '/images/homestays/3.jpg', 
    '/homestays?location=danang', 
    'home_hero', 
    'Khám phá', 
    'Giảm 15%', 
    85, 
    TRUE, 
    NOW(), 
    DATE_ADD(NOW(), INTERVAL 45 DAY)
),

-- Home Below Search Banner
(
    'Ưu đãi đặc biệt trong tuần này', 
    'Giảm 20% cho khách đặt lần đầu. Sử dụng mã WELCOME20 khi thanh toán.', 
    NULL, 
    '/homestays', 
    'home_below_search', 
    NULL, 
    'WELCOME20', 
    100, 
    TRUE, 
    NOW(), 
    DATE_ADD(NOW(), INTERVAL 7 DAY)
),

-- Listing Top Banner
(
    'Ưu đãi đặt 2 đêm', 
    'Giảm 10% khi đặt tối thiểu 2 đêm. Áp dụng cho tất cả homestay.', 
    '/images/homestays/4.jpg', 
    '/homestays', 
    'listing_top', 
    'Áp dụng ngay', 
    'Giảm 10%', 
    80, 
    TRUE, 
    NOW(), 
    DATE_ADD(NOW(), INTERVAL 45 DAY)
),

-- Listing Sidebar Banner
(
    'Homestay gần bạn', 
    'Khám phá các homestay chất lượng cao gần vị trí của bạn.', 
    '/images/homestays/5.jpg', 
    '/homestays', 
    'listing_sidebar', 
    'Xem ngay', 
    NULL, 
    70, 
    TRUE, 
    NOW(), 
    DATE_ADD(NOW(), INTERVAL 90 DAY)
),

-- Detail Top Banner
(
    'Deal cuối tuần', 
    'Giảm giá 15% cho đặt phòng cuối tuần (Thứ 6 - Chủ nhật).', 
    '/images/homestays/6.jpg', 
    '/homestays', 
    'detail_top', 
    'Đặt ngay', 
    '🔥 Giảm 15%', 
    70, 
    TRUE, 
    NOW(), 
    DATE_ADD(NOW(), INTERVAL 7 DAY)
),

-- Checkout Sidebar Banner
(
    'Thanh toán an toàn', 
    'Đặt phòng với chúng tôi - Thanh toán 100% an toàn và bảo mật.', 
    NULL, 
    NULL, 
    'checkout_sidebar', 
    NULL, 
    '✓ Bảo mật', 
    60, 
    TRUE, 
    NOW(), 
    DATE_ADD(NOW(), INTERVAL 365 DAY)
),

-- Popup Banner
(
    'Ưu đãi đặc biệt!', 
    'Giảm 15% cho đơn đặt phòng đầu tiên. Áp dụng ngay hôm nay!', 
    NULL, 
    '/homestays', 
    'popup', 
    'Xem ngay', 
    '🎉 Giảm 15%', 
    100, 
    TRUE, 
    NOW(), 
    DATE_ADD(NOW(), INTERVAL 14 DAY)
);

-- Bước 6: Kiểm tra kết quả
SELECT 
    position,
    COUNT(*) as total,
    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count
FROM banners
GROUP BY position
ORDER BY position;

-- Bước 7: Drop backup table (uncomment sau khi kiểm tra xong)
-- DROP TABLE IF EXISTS banners_backup;

-- ============================================================================
-- HOÀN THÀNH
-- ============================================================================
