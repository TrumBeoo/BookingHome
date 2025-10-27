import React, { useState } from 'react';
import Layout from '../common/Layout';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: '📞',
      title: 'Hotline',
      content: '1900-1234',
      description: '24/7 hỗ trợ khách hàng',
    },
    {
      icon: '✉️',
      title: 'Email',
      content: 'homi@gmail.vn',
      description: 'Phản hồi trong 24h',
    },
    {
      icon: '📍',
      title: 'Địa chỉ',
      content: 'Quang Ninh, Viet Nam',
      description: 'Văn phòng chính',
    },
    {
      icon: '🕐',
      title: 'Giờ làm việc',
      content: '8:00 - 22:00',
      description: 'Thứ 2 - Chủ nhật',
    },
  ];

  const categories = [
    { value: 'general', label: 'Câu hỏi chung' },
    { value: 'booking', label: 'Đặt phòng' },
    { value: 'payment', label: 'Thanh toán' },
    { value: 'technical', label: 'Kỹ thuật' },
    { value: 'complaint', label: 'Khiếu nại' },
  ];

  const faqs = [
    {
      question: 'Làm thế nào để đặt phòng homestay?',
      answer: 'Bạn có thể đặt phòng bằng cách tìm kiếm homestay phù hợp, chọn ngày và số khách, sau đó tiến hành thanh toán. Hệ thống sẽ gửi email xác nhận ngay lập tức.',
      expanded: false,
    },
    {
      question: 'Tôi có thể hủy đặt phòng không?',
      answer: 'Có, bạn có thể hủy đặt phòng theo chính sách hủy của từng homestay. Thông thường, bạn có thể hủy miễn phí trong vòng 24-48h sau khi đặt.',
      expanded: false,
    },
    {
      question: 'Các phương thức thanh toán được hỗ trợ?',
      answer: 'Chúng tôi hỗ trợ thanh toán qua MoMo, VNPay, PayPal, Stripe và chuyển khoản ngân hàng. Tất cả giao dịch đều được bảo mật.',
      expanded: false,
    },
    {
      question: 'Làm sao để liên hệ với chủ homestay?',
      answer: 'Sau khi đặt phòng thành công, bạn sẽ nhận được thông tin liên hệ của chủ homestay qua email. Bạn cũng có thể nhắn tin qua hệ thống của chúng tôi.',
      expanded: false,
    },
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({ type: 'error', message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
      return;
    }

    console.log('Contact form submitted:', formData);
    setSubmitStatus({ type: 'success', message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.' });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      category: 'general',
    });
  };

  return (
    <Layout>
      <div style={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        fontFamily: 'Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 16px'
        }}>
          {/* Header Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: '0 0 16px 0',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Liên hệ với chúng tôi
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#757575',
              margin: '0',
              fontWeight: '400'
            }}>
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
          </div>

          {/* Main Content */}
          <div className="contact-grid">
            {/* Sidebar */}
            <div className="contact-sidebar">
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#212121',
                  marginBottom: '24px'
                }}>
                  Thông tin liên hệ
                </h2>
                
                {contactInfo.map((info, index) => (
                  <div key={index} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      marginRight: '16px',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#e3f2fd',
                      borderRadius: '50%'
                    }}>
                      {info.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#212121',
                        marginBottom: '4px'
                      }}>
                        {info.title}
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: '#212121',
                        marginBottom: '2px'
                      }}>
                        {info.content}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#757575'
                      }}>
                        {info.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Support */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                border: '1px solid #e3f2fd'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#212121',
                  marginBottom: '16px'
                }}>
                  Hỗ trợ nhanh
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <button style={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Roboto, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1565c0';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#1976d2';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}>
                    💬 Chat trực tuyến
                  </button>
                  <a href="tel:19001234" style={{ textDecoration: 'none' }}>
                    <button style={{
                      backgroundColor: 'transparent',
                      color: '#1976d2',
                      border: '2px solid #1976d2',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      width: '100%',
                      fontFamily: 'Roboto, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#1976d2';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#1976d2';
                      e.target.style.transform = 'translateY(0)';
                    }}>
                      📞 Gọi hotline
                    </button>
                  </a>
                  <a href="mailto:support@homestay.vn" style={{ textDecoration: 'none' }}>
                    <button style={{
                      backgroundColor: 'transparent',
                      color: '#1976d2',
                      border: '2px solid #1976d2',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      width: '100%',
                      fontFamily: 'Roboto, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#1976d2';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#1976d2';
                      e.target.style.transform = 'translateY(0)';
                    }}>
                      ✉️ Gửi email
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form">
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#212121',
                  marginBottom: '24px'
                }}>
                  Gửi tin nhắn cho chúng tôi
                </h2>

                {submitStatus && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    backgroundColor: submitStatus.type === 'success' ? '#e8f5e8' : '#ffebee',
                    border: `1px solid ${submitStatus.type === 'success' ? '#4caf50' : '#f44336'}`,
                    color: submitStatus.type === 'success' ? '#2e7d32' : '#c62828',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{submitStatus.message}</span>
                    <button 
                      onClick={() => setSubmitStatus(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        color: 'inherit'
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#212121',
                        marginBottom: '8px'
                      }}>
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontFamily: 'Roboto, sans-serif',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#212121',
                        marginBottom: '8px'
                      }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontFamily: 'Roboto, sans-serif',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#212121',
                        marginBottom: '8px'
                      }}>
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontFamily: 'Roboto, sans-serif',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#212121',
                        marginBottom: '8px'
                      }}>
                        Danh mục
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontFamily: 'Roboto, sans-serif',
                          transition: 'border-color 0.3s ease',
                          outline: 'none',
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#212121',
                        marginBottom: '8px'
                      }}>
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontFamily: 'Roboto, sans-serif',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#212121',
                        marginBottom: '8px'
                      }}>
                        Nội dung tin nhắn *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                        required
                        rows={5}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontFamily: 'Roboto, sans-serif',
                          transition: 'border-color 0.3s ease',
                          outline: 'none',
                          resize: 'vertical',
                          minHeight: '120px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                    </div>
                    <div className="form-group full-width">
                      <button
                        type="submit"
                        style={{
                          backgroundColor: '#1976d2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '16px 32px',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.3s ease',
                          fontFamily: 'Roboto, sans-serif'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#1565c0';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#1976d2';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        📤 Gửi tin nhắn
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ marginTop: '64px' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#212121',
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              Câu hỏi thường gặp
            </h2>
            
            <div style={{
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {faqs.map((faq, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#212121',
                      fontFamily: 'Roboto, sans-serif',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <span>{faq.question}</span>
                    <span style={{
                      fontSize: '1.5rem',
                      transform: expandedFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}>
                      ⌄
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div style={{
                      padding: '0 24px 20px 24px',
                      fontSize: '1rem',
                      lineHeight: '1.7',
                      color: '#757575',
                      borderTop: '1px solid #f0f0f0'
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{
              textAlign: 'center',
              marginTop: '32px'
            }}>
              <p style={{
                fontSize: '1rem',
                color: '#757575',
                marginBottom: '16px'
              }}>
                Không tìm thấy câu trả lời bạn cần?
              </p>
              <button style={{
                backgroundColor: 'transparent',
                color: '#1976d2',
                border: '2px solid #1976d2',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                fontFamily: 'Roboto, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1976d2';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#1976d2';
                e.target.style.transform = 'translateY(0)';
              }}>
                ❓ Xem thêm câu hỏi
              </button>
            </div>
          </div>

          {/* Map Section */}
          <div style={{ marginTop: '64px' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#212121',
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              Vị trí văn phòng
            </h2>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                height: '400px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  opacity: '0.7'
                }}>
                  🗺️ Google Maps Integration
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;