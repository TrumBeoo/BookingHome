import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
  Phone,
  LocationOn,
  Home,
} from '@mui/icons-material';

const Footer = () => {
  const footerSections = [
    {
      title: 'Về Homestay Hub',
      links: [
        'Giới thiệu',
        'Chính sách bảo mật',
        'Điều khoản sử dụng',
        'Hỗ trợ khách hàng',
      ],
    },
    {
      title: 'Dành cho khách hàng',
      links: [
        'Cách đặt phòng',
        'Hướng dẫn thanh toán',
        'Chính sách hủy phòng',
        'Đánh giá và phản hồi',
      ],
    },
    {
      title: 'Dành cho chủ nhà',
      links: [
        'Đăng tin cho thuê',
        'Quản lý tin đăng',
        'Hướng dẫn hosting',
        'Chính sách commission',
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Home sx={{ mr: 1, fontSize: 32, color: 'primary.light' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Homestay Hub
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, color: 'grey.300' }}>
              Nền tảng đặt phòng homestay hàng đầu Việt Nam. Khám phá những 
              trải nghiệm lưu trú độc đáo và tạo nên những kỷ niệm đáng nhớ.
            </Typography>
            
            {/* Social Media */}
            <Box>
              <IconButton sx={{ color: 'white', mr: 1 }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: 'white', mr: 1 }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: 'white', mr: 1 }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: 'white' }}>
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <Grid item xs={12} sm={4} md={2.5} key={index}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>
                {section.title}
              </Typography>
              <Box>
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href="#"
                    color="grey.300"
                    sx={{
                      display: 'block',
                      mb: 1,
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.light',
                      },
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>
              Liên hệ
            </Typography>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, fontSize: 20, color: 'grey.400' }} />
                <Typography variant="body2" color="grey.300">
                  123 Đường ABC, Quận 1, TP.HCM
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, fontSize: 20, color: 'grey.400' }} />
                <Typography variant="body2" color="grey.300">
                  1900 1234
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, fontSize: 20, color: 'grey.400' }} />
                <Typography variant="body2" color="grey.300">
                  support@homestayhub.vn
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'grey.700' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="grey.400">
            © 2024 Homestay Hub. Tất cả quyền được bảo lưu.
          </Typography>
          <Typography variant="body2" color="grey.400">
            Được phát triển với ❤️ tại Việt Nam
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;