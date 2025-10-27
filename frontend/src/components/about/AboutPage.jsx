import React from 'react';
import Layout from '../common/Layout';
import './AboutPage.css';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Trịnh Xuân Trung',
      position: 'Founder & CEO',
      description: 'Hơn 10 năm kinh nghiệm trong lĩnh vực du lịch và công nghệ',
      avatar: 'M',
    },
    {
      name: 'Trần Thị B',
      position: 'Head of Operations',
      description: 'Chuyên gia về quản lý chất lượng dịch vụ và trải nghiệm khách hàng',
      avatar: 'L',
    },
    {
      name: 'Lê Đức C',
      position: 'Head of Technology',
      description: 'Kiến trúc sư phần mềm với đam mê xây dựng sản phẩm công nghệ',
      avatar: 'T',
    },
    {
      name: 'Phạm Thị H',
      position: 'Head of Marketing',
      description: 'Chuyên gia marketing số với kinh nghiệm phát triển thương hiệu',
      avatar: 'H',
    },
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Thành lập công ty',
      description: 'Homestay Hub được thành lập với tầm nhìn kết nối du khách với những trải nghiệm lưu trú độc đáo',
    },
    {
      year: '2021',
      title: 'Mở rộng ra toàn quốc',
      description: 'Phủ sóng 20 tỉnh thành với hơn 1,000 homestay đối tác',
    },
    {
      year: '2022',
      title: 'Đạt 50,000 khách hàng',
      description: 'Cột mốc quan trọng với hơn 50,000 lượt khách đã sử dụng dịch vụ',
    },
    {
      year: '2023',
      title: 'Ra mắt ứng dụng mobile',
      description: 'Phát triển ứng dụng di động để mang lại trải nghiệm tốt nhất cho người dùng',
    },
    {
      year: '2024',
      title: 'Mở rộng quốc tế',
      description: 'Kế hoạch mở rộng sang các nước Đông Nam Á',
    },
  ];

  const achievements = [
    {
      icon: '👥',
      number: '100K+',
      label: 'Khách hàng hài lòng',
    },
    {
      icon: '📍',
      number: '10K+',
      label: 'Homestay chất lượng',
    },
    {
      icon: '⭐',
      number: '5.0★',
      label: 'Đánh giá trung bình',
    },
    {
      icon: '🏆',
      number: '50+',
      label: 'Giải thưởng',
    },
  ];

  const values = [
    {
      icon: '🔒',
      title: 'An toàn & Tin cậy',
      description: 'Cam kết bảo vệ thông tin và tài sản của khách hàng với công nghệ bảo mật tiên tiến',
    },
    {
      icon: '✅',
      title: 'Chất lượng đảm bảo',
      description: 'Mọi homestay đều được kiểm duyệt kỹ lưỡng để đảm bảo chất lượng dịch vụ tốt nhất',
    },
    {
      icon: '🎧',
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ chăm sóc khách hàng chuyên nghiệp luôn sẵn sàng hỗ trợ mọi lúc',
    },
    {
      icon: '📈',
      title: 'Đổi mới liên tục',
      description: 'Không ngừng cải tiến và phát triển để mang lại trải nghiệm tốt nhất',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="hero-section" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '64px 0',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontWeight: 700,
              marginBottom: '24px',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              margin: '0 0 24px 0'
            }}>
              Về Homi
            </h1>
            <p style={{
              opacity: 0.9,
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.6,
              fontSize: '1.25rem',
              fontWeight: 400
            }}>
              Chúng tôi tin rằng mỗi chuyến đi đều là một câu chuyện đáng nhớ. 
              Sứ mệnh của chúng tôi là kết nối du khách với những trải nghiệm 
              lưu trú độc đáo và chân thực nhất tại Việt Nam.
            </p>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '64px 0',
        fontFamily: 'Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          {/* Mission & Vision */}
          <div className="mission-vision-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '48px',
            marginBottom: '64px'
          }}>
            <div className="mission-card">
              <h2 style={{
                fontWeight: 700,
                marginBottom: '24px',
                color: '#1976d2',
                fontSize: '2rem'
              }}>
                Sứ mệnh
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: '#757575',
                margin: 0
              }}>
                Homestay Hub được thành lập với mục tiêu tạo ra một nền tảng kết nối 
                tin cậy giữa du khách và các chủ nhà homestay. Chúng tôi muốn mang đến 
                những trải nghiệm lưu trú chân thực, giúp du khách hiểu sâu hơn về 
                văn hóa địa phương và tạo ra những kỷ niệm đáng nhớ.
              </p>
            </div>
            <div className="vision-card">
              <h2 style={{
                fontWeight: 700,
                marginBottom: '24px',
                color: '#1976d2',
                fontSize: '2rem'
              }}>
                Tầm nhìn
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: '#757575',
                margin: 0
              }}>
                Trở thành nền tảng đặt homestay hàng đầu Việt Nam, được biết đến với 
                chất lượng dịch vụ xuất sắc và sự đa dạng về trải nghiệm. Chúng tôi 
                hướng tới việc thúc đẩy du lịch bền vững và hỗ trợ cộng đồng địa phương 
                phát triển kinh tế thông qua du lịch.
              </p>
            </div>
          </div>

          {/* Achievements */}
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '48px',
              fontSize: '2rem',
              color: '#212121'
            }}>
              Những Con Số Ấn Tượng
            </h2>
            <div className="achievements-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '32px'
            }}>
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className="achievement-card"
                  style={{
                    textAlign: 'center',
                    backgroundColor: 'white',
                    padding: '32px 16px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{
                    backgroundColor: '#1976d2',
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 16px auto',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem'
                  }}>
                    {achievement.icon}
                  </div>
                  <div className="achievement-number" style={{
                    fontWeight: 700,
                    color: '#1976d2',
                    marginBottom: '8px',
                    fontSize: '2.5rem'
                  }}>
                    {achievement.number}
                  </div>
                  <div style={{
                    color: '#757575',
                    fontSize: '1.125rem',
                    fontWeight: 500
                  }}>
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '48px',
              fontSize: '2rem',
              color: '#212121'
            }}>
              Hành Trình Phát Triển
            </h2>
            <div className="timeline-container" style={{
              position: 'relative',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {/* Timeline Line */}
              <div className="timeline-line" style={{
                position: 'absolute',
                left: '50%',
                top: '0',
                bottom: '0',
                width: '2px',
                backgroundColor: '#1976d2',
                transform: 'translateX(-50%)'
              }}></div>
              
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '48px',
                    position: 'relative'
                  }}
                >
                  {/* Timeline Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#1976d2',
                    borderRadius: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}></div>
                  
                  {/* Content */}
                  <div style={{
                    width: '45%',
                    marginLeft: index % 2 === 0 ? '0' : '55%',
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    background: index % 2 === 0 
                      ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' 
                      : 'linear-gradient(135deg, #ff5722 0%, #ff8a65 100%)',
                    color: 'white'
                  }}>
                    <h3 style={{
                      fontWeight: 700,
                      marginBottom: '8px',
                      fontSize: '1.25rem',
                      margin: '0 0 8px 0'
                    }}>
                      {milestone.year} - {milestone.title}
                    </h3>
                    <p style={{
                      opacity: 0.9,
                      lineHeight: 1.6,
                      margin: 0,
                      fontSize: '0.875rem'
                    }}>
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '48px',
              fontSize: '2rem',
              color: '#212121'
            }}>
              Giá Trị Cốt Lõi
            </h2>
            <div className="values-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px'
            }}>
              {values.map((value, index) => (
                <div
                  key={index}
                  className="value-card"
                  style={{
                    height: '100%',
                    textAlign: 'center',
                    padding: '32px 24px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{
                    backgroundColor: '#1976d2',
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 16px auto',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {value.icon}
                  </div>
                  <h3 style={{
                    fontWeight: 600,
                    marginBottom: '16px',
                    fontSize: '1.25rem',
                    color: '#212121',
                    margin: '0 0 16px 0'
                  }}>
                    {value.title}
                  </h3>
                  <p style={{
                    color: '#757575',
                    lineHeight: 1.6,
                    margin: 0,
                    fontSize: '0.875rem'
                  }}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <h2 style={{
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '48px',
              fontSize: '2rem',
              color: '#212121'
            }}>
              Đội Ngũ Lãnh Đạo
            </h2>
            <div className="team-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px'
            }}>
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="team-card"
                  style={{
                    textAlign: 'center',
                    padding: '32px 24px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{
                    backgroundColor: '#1976d2',
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 16px auto',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {member.avatar}
                  </div>
                  <h3 style={{
                    fontWeight: 600,
                    marginBottom: '8px',
                    fontSize: '1.25rem',
                    color: '#212121',
                    margin: '0 0 8px 0'
                  }}>
                    {member.name}
                  </h3>
                  <div style={{
                    color: '#1976d2',
                    fontWeight: 600,
                    marginBottom: '16px',
                    fontSize: '1rem'
                  }}>
                    {member.position}
                  </div>
                  <p style={{
                    color: '#757575',
                    lineHeight: 1.5,
                    margin: 0,
                    fontSize: '0.875rem'
                  }}>
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;