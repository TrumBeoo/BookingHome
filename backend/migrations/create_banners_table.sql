-- Migration: Create banners table
-- Date: 2024-01-01

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

-- Insert sample banners
INSERT INTO banners (title, description, image_url, link_url, position, button_text, discount_text, priority, is_active, start_date, end_date) VALUES
('Giảm 20% cho khách đặt lần đầu', 'Đặt homestay ngay hôm nay và nhận ưu đãi đặc biệt', '/uploads/banners/hero1.jpg', '/homestays', 'home_hero', 'Đặt ngay', '🎉 Giảm 20%', 100, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('Khám phá Sa Pa mùa đông', 'Trải nghiệm không khí se lạnh và cảnh đẹp tuyệt vời', '/uploads/banners/sapa.jpg', '/homestays?location=sapa', 'home_hero', 'Xem ngay', 'Deal Hot', 90, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY)),
('Ưu đãi đặt 2 đêm', 'Giảm 10% khi đặt tối thiểu 2 đêm', '/uploads/banners/promo.jpg', '/homestays', 'listing_top', 'Áp dụng ngay', 'Giảm 10%', 80, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 45 DAY)),
('Deal cuối tuần', 'Giảm giá 15% cho đặt phòng cuối tuần', '/uploads/banners/weekend.jpg', '/homestays', 'detail_top', 'Đặt ngay', '🔥 Giảm 15%', 70, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY));
