import React from 'react';
import {
  Security,
  SupportAgent,
  Verified,
  TravelExplore,
} from '@mui/icons-material';

const AboutSection = () => {
  const features = [
    {
      icon: <Security />,
      title: 'Bảo mật tuyệt đối',
      description: 'Thông tin cá nhân và thanh toán được bảo vệ với công nghệ mã hóa tiên tiến',
    },
    {
      icon: <Verified />,
      title: 'Chất lượng đã kiểm định',
      description: 'Tất cả homestay đều được kiểm tra và xác minh chất lượng trước khi đăng tải',
    },
    {
      icon: <SupportAgent />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ tư vấn viên chuyên nghiệp sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi',
    },
    {
      icon: <TravelExplore />,
      title: 'Trải nghiệm độc đáo',
      description: 'Khám phá văn hóa địa phương qua những homestay đặc sắc và chủ nhà thân thiện',
    },
  ];

  return (
    <div style={{ backgroundColor: '#f5f5f5', padding: '64px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            marginBottom: '16px',
            fontWeight: 700,
            fontSize: '2.5rem',
            color: '#212121',
            fontFamily: 'Roboto, sans-serif'
          }}>
            Tại sao chọn Homi?
          </h2>
          <h6 style={{
            color: '#757575',
            maxWidth: '700px',
            margin: '0 auto',
            fontSize: '1.25rem',
            fontWeight: 400,
            lineHeight: 1.6,
            fontFamily: 'Roboto, sans-serif'
          }}>
            Chúng tôi cam kết mang đến cho bạn những trải nghiệm lưu trú tuyệt vời nhất
            với sự an tâm và tiện lợi tối đa
          </h6>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
          {features.map((feature, index) => (
            <div key={index}>
              <div
                style={{
                  height: '100%',
                  textAlign: 'center',
                  padding: '24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                  e.target.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    backgroundColor: '#1976d2',
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '28px',
                  }}
                >
                  {feature.icon}
                </div>
                
                <h6 style={{
                  fontWeight: 600,
                  marginBottom: '16px',
                  color: '#212121',
                  fontSize: '1.25rem',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  {feature.title}
                </h6>
                
                <p style={{
                  color: '#757575',
                  lineHeight: 1.6,
                  margin: 0,
                  fontSize: '1rem',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div style={{ marginTop: '64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '32px', justifyItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{
                fontWeight: 700,
                color: '#1976d2',
                marginBottom: '8px',
                fontSize: '3rem',
                margin: '0 0 8px 0',
                fontFamily: 'Roboto, sans-serif'
              }}>
                10K+
              </h3>
              <h6 style={{ color: '#757575', fontSize: '1.25rem', fontWeight: 400, margin: 0, fontFamily: 'Roboto, sans-serif' }}>
                Homestay
              </h6>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h3 style={{
                fontWeight: 700,
                color: '#1976d2',
                marginBottom: '8px',
                fontSize: '3rem',
                margin: '0 0 8px 0',
                fontFamily: 'Roboto, sans-serif'
              }}>
                50K+
              </h3>
              <h6 style={{ color: '#757575', fontSize: '1.25rem', fontWeight: 400, margin: 0, fontFamily: 'Roboto, sans-serif' }}>
                Khách hàng
              </h6>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h3 style={{
                fontWeight: 700,
                color: '#1976d2',
                marginBottom: '8px',
                fontSize: '3rem',
                margin: '0 0 8px 0',
                fontFamily: 'Roboto, sans-serif'
              }}>
                5.0★
              </h3>
              <h6 style={{ color: '#757575', fontSize: '1.25rem', fontWeight: 400, margin: 0, fontFamily: 'Roboto, sans-serif' }}>
                Đánh giá
              </h6>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h3 style={{
                fontWeight: 700,
                color: '#1976d2',
                marginBottom: '8px',
                fontSize: '3rem',
                margin: '0 0 8px 0',
                fontFamily: 'Roboto, sans-serif'
              }}>
                34
              </h3>
              <h6 style={{ color: '#757575', fontSize: '1.25rem', fontWeight: 400, margin: 0, fontFamily: 'Roboto, sans-serif' }}>
                Tỉnh thành
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;