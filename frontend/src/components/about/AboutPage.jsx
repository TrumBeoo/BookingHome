import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab";
import {
  EmojiEvents,
  Groups,
  LocationOn,
  Star,
  TrendingUp,
  Security,
  SupportAgent,
  Verified,
} from '@mui/icons-material';
import Layout from '../common/Layout';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Nguyễn Văn Minh',
      position: 'Founder & CEO',
      description: 'Hơn 10 năm kinh nghiệm trong lĩnh vực du lịch và công nghệ',
      avatar: 'M',
    },
    {
      name: 'Trần Thị Lan',
      position: 'Head of Operations',
      description: 'Chuyên gia về quản lý chất lượng dịch vụ và trải nghiệm khách hàng',
      avatar: 'L',
    },
    {
      name: 'Lê Đức Thắng',
      position: 'Head of Technology',
      description: 'Kiến trúc sư phần mềm với đam mê xây dựng sản phẩm công nghệ',
      avatar: 'T',
    },
    {
      name: 'Phạm Thị Hương',
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
      icon: <Groups />,
      number: '100K+',
      label: 'Khách hàng hài lòng',
    },
    {
      icon: <LocationOn />,
      number: '10K+',
      label: 'Homestay chất lượng',
    },
    {
      icon: <Star />,
      number: '4.9★',
      label: 'Đánh giá trung bình',
    },
    {
      icon: <EmojiEvents />,
      number: '50+',
      label: 'Giải thưởng',
    },
  ];

  const values = [
    {
      icon: <Security />,
      title: 'An toàn & Tin cậy',
      description: 'Cam kết bảo vệ thông tin và tài sản của khách hàng với công nghệ bảo mật tiên tiến',
    },
    {
      icon: <Verified />,
      title: 'Chất lượng đảm bảo',
      description: 'Mọi homestay đều được kiểm duyệt kỹ lưỡng để đảm bảo chất lượng dịch vụ tốt nhất',
    },
    {
      icon: <SupportAgent />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ chăm sóc khách hàng chuyên nghiệp luôn sẵn sàng hỗ trợ mọi lúc',
    },
    {
      icon: <TrendingUp />,
      title: 'Đổi mới liên tục',
      description: 'Không ngừng cải tiến và phát triển để mang lại trải nghiệm tốt nhất',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Về Homestay Hub
            </Typography>
            <Typography
              variant="h5"
              sx={{
                opacity: 0.9,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Chúng tôi tin rằng mỗi chuyến đi đều là một câu chuyện đáng nhớ. 
              Sứ mệnh của chúng tôi là kết nối du khách với những trải nghiệm 
              lưu trú độc đáo và chân thực nhất tại Việt Nam.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Mission & Vision */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}
            >
              Sứ mệnh
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}
            >
              Homestay Hub được thành lập với mục tiêu tạo ra một nền tảng kết nối 
              tin cậy giữa du khách và các chủ nhà homestay. Chúng tôi muốn mang đến 
              những trải nghiệm lưu trú chân thực, giúp du khách hiểu sâu hơn về 
              văn hóa địa phương và tạo ra những kỷ niệm đáng nhớ.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}
            >
              Tầm nhìn
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}
            >
              Trở thành nền tảng đặt homestay hàng đầu Việt Nam, được biết đến với 
              chất lượng dịch vụ xuất sắc và sự đa dạng về trải nghiệm. Chúng tôi 
              hướng tới việc thúc đẩy du lịch bền vững và hỗ trợ cộng đồng địa phương 
              phát triển kinh tế thông qua du lịch.
            </Typography>
          </Grid>
        </Grid>

        {/* Achievements */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, textAlign: 'center', mb: 6 }}
          >
            Những Con Số Ấn Tượng
          </Typography>
          <Grid container spacing={4}>
            {achievements.map((achievement, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2rem',
                    }}
                  >
                    {achievement.icon}
                  </Avatar>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}
                  >
                    {achievement.number}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {achievement.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Timeline */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, textAlign: 'center', mb: 6 }}
          >
            Hành Trình Phát Triển
          </Typography>
          <Timeline position="alternate">
            {milestones.map((milestone, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      bgcolor: 'primary.main',
                      width: 16,
                      height: 16,
                    }}
                  />
                  {index < milestones.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      bgcolor: index % 2 === 0 ? 'primary.light' : 'secondary.light',
                      color: 'white',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {milestone.year} - {milestone.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {milestone.description}
                    </Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>

        {/* Values */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, textAlign: 'center', mb: 6 }}
          >
            Giá Trị Cốt Lõi
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 2,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {value.icon}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {value.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {value.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team */}
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, textAlign: 'center', mb: 6 }}
          >
            Đội Ngũ Lãnh Đạo
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      fontSize: '1.8rem',
                    }}
                  >
                    {member.avatar}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary.main"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {member.position}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.5 }}
                  >
                    {member.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default AboutPage;