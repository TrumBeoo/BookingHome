import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Input, message, Modal, Carousel, Badge } from 'antd';
import { GiftOutlined, PercentageOutlined, FireOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import './PromotionBanner.css';

const PromotionBanner = ({ onCouponApply }) => {
  const [promotions, setPromotions] = useState([]);
  const [combos, setCombos] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    fetchPromotions();
    fetchCombos();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions/?type=coupon');
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const fetchCombos = async () => {
    try {
      const response = await fetch('/api/promotions/combos');
      const data = await response.json();
      setCombos(data);
    } catch (error) {
      console.error('Error fetching combos:', error);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    message.success('Đã sao chép mã giảm giá!');
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      message.warning('Vui lòng nhập mã giảm giá');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/promotions/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          total_amount: 1000000, // Giá trị mẫu
          homestay_id: null,
          user_id: null
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.valid) {
        message.success(data.message);
        onCouponApply && onCouponApply(data);
        setCouponCode('');
      } else {
        message.error(data.detail || 'Mã giảm giá không hợp lệ');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi kiểm tra mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const formatDiscount = (promotion) => {
    if (promotion.discount_type === 'percentage') {
      return `${promotion.discount_value}%`;
    } else {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
      }).format(promotion.discount_value);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="promotion-banner">
      {/* Coupon Input Section */}
      <Card className="coupon-input-card">
        <div className="coupon-input-section">
          <div className="coupon-header">
            <GiftOutlined className="coupon-icon" />
            <span>Nhập mã giảm giá</span>
          </div>
          <div className="coupon-input-group">
            <Input
              placeholder="Nhập mã giảm giá của bạn"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onPressEnter={handleApplyCoupon}
              className="coupon-input"
            />
            <Button
              type="primary"
              loading={loading}
              onClick={handleApplyCoupon}
              className="apply-button"
            >
              Áp dụng
            </Button>
          </div>
        </div>
      </Card>

      {/* Active Promotions Carousel */}
      {promotions.length > 0 && (
        <Card 
          title={
            <div className="section-title">
              <PercentageOutlined />
              <span>Mã giảm giá hot</span>
              <Badge count={promotions.length} style={{ backgroundColor: '#52c41a' }} />
            </div>
          }
          className="promotions-card"
        >
          <Carousel 
            autoplay 
            dots={false}
            slidesToShow={Math.min(3, promotions.length)}
            slidesToScroll={1}
            responsive={[
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }
              }
            ]}
          >
            {promotions.map((promotion) => (
              <div key={promotion.id} className="promotion-slide">
                <div className="promotion-item">
                  <div className="promotion-header">
                    <Tag color="red" className="discount-tag">
                      Giảm {formatDiscount(promotion)}
                    </Tag>
                    {promotion.max_uses && promotion.used_count >= promotion.max_uses * 0.8 && (
                      <Tag color="orange" icon={<FireOutlined />}>
                        Sắp hết
                      </Tag>
                    )}
                  </div>
                  
                  <h4 className="promotion-name">{promotion.name}</h4>
                  <p className="promotion-description">{promotion.description}</p>
                  
                  {promotion.min_order_value && (
                    <div className="promotion-condition">
                      Đơn tối thiểu: {formatPrice(promotion.min_order_value)}
                    </div>
                  )}
                  
                  <div className="promotion-code-section">
                    <div className="code-display">
                      <code>{promotion.code}</code>
                    </div>
                    <Button
                      type="text"
                      icon={copiedCode === promotion.code ? <CheckOutlined /> : <CopyOutlined />}
                      onClick={() => handleCopyCode(promotion.code)}
                      className={`copy-button ${copiedCode === promotion.code ? 'copied' : ''}`}
                    >
                      {copiedCode === promotion.code ? 'Đã sao chép' : 'Sao chép'}
                    </Button>
                  </div>
                  
                  <div className="promotion-validity">
                    Có hiệu lực đến: {new Date(promotion.end_date).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </Card>
      )}

      {/* Combo Packages */}
      {combos.length > 0 && (
        <Card 
          title={
            <div className="section-title">
              <GiftOutlined />
              <span>Combo tiết kiệm</span>
              <Badge count={combos.length} style={{ backgroundColor: '#1890ff' }} />
            </div>
          }
          className="combos-card"
        >
          <div className="combos-grid">
            {combos.map((combo) => (
              <div key={combo.id} className="combo-item">
                <div className="combo-header">
                  <h4 className="combo-name">{combo.name}</h4>
                  <Tag color="green" className="savings-tag">
                    Tiết kiệm {formatPrice(combo.savings)}
                  </Tag>
                </div>
                
                <p className="combo-description">{combo.description}</p>
                
                <div className="combo-pricing">
                  <div className="original-price">
                    Giá gốc: <span className="strikethrough">{formatPrice(combo.original_price)}</span>
                  </div>
                  <div className="combo-price">
                    Giá combo: <span className="highlight">{formatPrice(combo.combo_price)}</span>
                  </div>
                </div>
                
                <div className="combo-features">
                  {combo.includes_breakfast && <Tag color="blue">Ăn sáng</Tag>}
                  {combo.includes_transport && <Tag color="purple">Đưa đón</Tag>}
                  {combo.includes_tour && <Tag color="orange">Tour</Tag>}
                </div>
                
                <div className="combo-nights">
                  Từ {combo.min_nights} đêm trở lên
                </div>
                
                <Button type="primary" className="combo-button" block>
                  Xem chi tiết
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PromotionBanner;