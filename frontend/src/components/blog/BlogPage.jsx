import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { useNavigate } from 'react-router-dom';
import './BlogPage.css';

const BlogPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const mockPosts = [
    {
      id: 1,
      title: 'Top 10 Homestay Đẹp Nhất Sapa 2024',
      excerpt: 'Khám phá những homestay tuyệt đẹp tại Sapa với view núi non hùng vĩ và không gian nghỉ dưỡng lý tưởng cho kỳ nghỉ của bạn.',
      category: 'Địa điểm',
      author: 'Nguyễn Văn An',
      authorAvatar: 'N',
      publishDate: '2024-01-15',
      readTime: '5 phút đọc',
      tags: ['Sapa', 'Homestay', 'Du lịch núi'],
      featured: true,
    },
    {
      id: 2,
      title: 'Kinh Nghiệm Đặt Homestay Hội An Giá Tốt',
      excerpt: 'Hướng dẫn chi tiết cách đặt homestay tại Hội An với giá cả hợp lý và chất lượng dịch vụ tốt nhất.',
      category: 'Kinh nghiệm',
      author: 'Trần Thị Lan',
      authorAvatar: 'L',
      publishDate: '2024-01-12',
      readTime: '7 phút đọc',
      tags: ['Hội An', 'Kinh nghiệm', 'Tiết kiệm'],
      featured: false,
    },
    {
      id: 3,
      title: 'Những Điều Cần Biết Khi Lần Đầu Ở Homestay',
      excerpt: 'Cẩm nang dành cho những ai lần đầu trải nghiệm homestay, từ cách đặt phòng đến những lưu ý quan trọng.',
      category: 'Hướng dẫn',
      author: 'Lê Minh Tuấn',
      authorAvatar: 'T',
      publishDate: '2024-01-10',
      readTime: '6 phút đọc',
      tags: ['Hướng dẫn', 'Homestay', 'Newbie'],
      featured: false,
    },
    {
      id: 4,
      title: 'Review Homestay Đà Lạt: Không Gian Lãng Mạn',
      excerpt: 'Chia sẻ trải nghiệm thực tế tại các homestay lãng mạn nhất Đà Lạt, phù hợp cho các cặp đôi.',
      category: 'Review',
      author: 'Phạm Thu Hà',
      authorAvatar: 'H',
      publishDate: '2024-01-08',
      readTime: '8 phút đọc',
      tags: ['Đà Lạt', 'Review', 'Lãng mạn'],
      featured: true,
    },
  ];

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Địa điểm', label: 'Địa điểm' },
    { value: 'Kinh nghiệm', label: 'Kinh nghiệm' },
    { value: 'Hướng dẫn', label: 'Hướng dẫn' },
    { value: 'Review', label: 'Review' },
  ];

  useEffect(() => {
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = posts.filter(post => post.featured);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const PostCard = ({ post, featured = false }) => (
    <div 
      className={`blog-card ${featured ? 'featured' : ''}`}
      onClick={() => navigate(`/blog/${post.id}`)}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{
          height: featured ? '300px' : '250px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: '500',
          opacity: '0.7'
        }}>
          📝 Blog Image
        </div>
        
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: '#1976d2',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          {post.category}
        </div>
        
        {featured && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#f44336',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            animation: 'pulse 2s infinite'
          }}>
          📈 Nổi bật
          </div>
        )}
      </div>

      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
        <h3 style={{
          fontSize: featured ? '1.25rem' : '1.125rem',
          fontWeight: '600',
          color: '#212121',
          margin: '0 0 12px 0',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {post.title}
        </h3>

        <p style={{
          fontSize: '0.875rem',
          color: '#757575',
          margin: '0 0 16px 0',
          lineHeight: '1.6',
          flexGrow: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {post.excerpt}
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '16px'
        }}>
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              style={{
                backgroundColor: '#f5f5f5',
                color: '#1976d2',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: '500',
                border: '1px solid #e0e0e0'
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#ff5722',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              {post.authorAvatar}
            </div>
            <span style={{
              fontSize: '0.75rem',
              color: '#757575'
            }}>
              {post.author}
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ fontSize: '0.75rem' }}>📅</span>
            <span style={{
              fontSize: '0.75rem',
              color: '#757575'
            }}>
              {new Date(post.publishDate).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>

        <div style={{
          fontSize: '0.75rem',
          color: '#757575',
          marginTop: '8px',
          fontStyle: 'italic'
        }}>
          {post.readTime}
        </div>
      </div>
    </div>
  );

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
              Blog Du Lịch
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#757575',
              margin: '0 0 32px 0',
              fontWeight: '400'
            }}>
              Chia sẻ kinh nghiệm và khám phá những homestay tuyệt vời
            </p>
            
            {/* Search and Filter */}
            <div style={{
              maxWidth: '600px',
              margin: '0 auto 32px auto'
            }}>
              <div style={{
                position: 'relative',
                marginBottom: '16px'
              }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 48px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '24px',
                    fontSize: '1rem',
                    fontFamily: 'Roboto, sans-serif',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
                <span style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem'
                }}>
                  🔍
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    style={{
                      backgroundColor: selectedCategory === category.value ? '#1976d2' : 'transparent',
                      color: selectedCategory === category.value ? 'white' : '#1976d2',
                      border: '2px solid #1976d2',
                      borderRadius: '20px',
                      padding: '6px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Roboto, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== category.value) {
                        e.target.style.backgroundColor = '#1976d2';
                        e.target.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== category.value) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#1976d2';
                      }
                    }}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Posts */}
          {!searchTerm && selectedCategory === 'all' && featuredPosts.length > 0 && (
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#212121',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📈 Bài viết nổi bật
              </h2>
              <div className="featured-grid">
                {featuredPosts.slice(0, 2).map((post) => (
                  <PostCard key={post.id} post={post} featured />
                ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#212121',
              marginBottom: '24px'
            }}>
              {searchTerm || selectedCategory !== 'all' ? 'Kết quả tìm kiếm' : 'Tất cả bài viết'}
              <span style={{
                fontSize: '0.875rem',
                color: '#757575',
                fontWeight: '400',
                marginLeft: '16px'
              }}>
                ({filteredPosts.length} bài viết)
              </span>
            </h2>
            
            <div className="blog-grid">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="skeleton-card">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-title"></div>
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text short"></div>
                    </div>
                  </div>
                ))
              ) : currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '64px 16px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    color: '#757575',
                    margin: '0 0 8px 0',
                    fontWeight: '600'
                  }}>
                    Không tìm thấy bài viết nào
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#757575',
                    margin: '0'
                  }}>
                    Thử thay đổi từ khóa tìm kiếm hoặc danh mục
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '32px',
              gap: '8px'
            }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    backgroundColor: currentPage === page ? '#1976d2' : 'white',
                    color: currentPage === page ? 'white' : '#1976d2',
                    border: '2px solid #1976d2',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Roboto, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== page) {
                      e.target.style.backgroundColor = '#1976d2';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== page) {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#1976d2';
                    }
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          )}

          {/* Newsletter Section */}
          <div style={{
            marginTop: '64px',
            padding: '32px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid #e3f2fd'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#212121',
              margin: '0 0 16px 0'
            }}>
              Đăng ký nhận tin tức mới nhất
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#757575',
              margin: '0 0 24px 0',
              lineHeight: '1.6'
            }}>
              Nhận thông báo về những bài viết mới và ưu đãi đặc biệt từ chúng tôi
            </p>
            <div style={{
              display: 'flex',
              gap: '16px',
              maxWidth: '400px',
              margin: '0 auto',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <input
                type="email"
                placeholder="Email của bạn"
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '12px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <button style={{
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '0.875rem',
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
              }}>
                Đăng ký ➡️
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;