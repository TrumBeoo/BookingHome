import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  Button,
} from '@mui/material';
import { FormatQuote } from '@mui/icons-material';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Văn Nam',
      location: 'Hà Nội',
      rating: 5,
      comment: 'Trải nghiệm tuyệt vời! Homestay rất sạch sẽ, chủ nhà thân thiện và nhiệt tình. Sẽ quay lại lần sau.',
      avatar: 'N',
      homestay: 'Villa Sapa View',
    },
    {
      id: 2,
      name: 'Trần Thị Lan',
      location: 'TP.HCM',
      rating: 5,
      comment: 'Vị trí homestay rất thuận tiện, gần trung tâm. Phòng ốc đẹp, có đầy đủ tiện nghi. Highly recommended!',
      avatar: 'L',
      homestay: 'Homestay Hội An',
    },
    {
      id: 3,
      name: 'Lê Minh Tuấn',
      location: 'Đà Nẵng',
      rating: 4,
      comment: 'Không gian yên tĩnh, view đẹp. Phù hợp cho gia đình có trẻ nhỏ. Giá cả hợp lý.',
      avatar: 'T',
      homestay: 'Bungalow Phú Quốc',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          Khách hàng nói gì về chúng tôi?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Những chia sẻ chân thực từ khách hàng đã trải nghiệm dịch vụ của chúng tôi
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {testimonials.map((testimonial) => (
          <Grid item xs={12} md={4} key={testimonial.id}>
            <Card
              sx={{
                height: '100%',
                p: 3,
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {/* Quote Icon */}
              <FormatQuote
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: 32,
                  color: 'primary.main',
                  opacity: 0.3,
                }}
              />

              <CardContent sx={{ p: 0 }}>
                {/* Rating */}
                <Box sx={{ mb: 2 }}>
                  <Rating
                    value={testimonial.rating}
                    readOnly
                    sx={{ color: 'secondary.main' }}
                  />
                </Box>

                {/* Comment */}
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    color: 'text.primary',
                  }}
                >
                  "{testimonial.comment}"
                </Typography>

                {/* Homestay */}
                <Typography
                  variant="body2"
                  sx={{
                    mb: 3,
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                >
                  Tại {testimonial.homestay}
                </Typography>

                {/* Customer Info */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {testimonial.avatar}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.location}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CTA Section */}
      <Box
        sx={{
          mt: 8,
          p: 6,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 4,
          color: 'white',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 700,
          }}
        >
          Sẵn sàng cho chuyến đi tiếp theo?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            opacity: 0.9,
          }}
        >
          Tham gia cùng hàng nghìn khách hàng hài lòng của chúng tôi
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'secondary.main',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': {
              bgcolor: 'secondary.dark',
            },
          }}
        >
          Đặt phòng ngay
        </Button>
      </Box>
    </Container>
  );
};

export default TestimonialsSection;