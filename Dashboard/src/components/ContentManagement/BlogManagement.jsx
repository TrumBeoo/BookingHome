import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  Avatar,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Add,
  Publish,
  Drafts,
  Schedule,
  TrendingUp,
  Visibility as ViewIcon,
  ThumbUp,
  Comment,
} from '@mui/icons-material';

const BlogManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Mock data
  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 homestay đẹp nhất Sapa 2024',
      slug: 'top-10-homestay-dep-nhat-sapa-2024',
      excerpt: 'Khám phá những homestay tuyệt đẹp tại Sapa với view núi non hùng vĩ và dịch vụ tuyệt vời...',
      content: 'Nội dung chi tiết về các homestay đẹp tại Sapa...',
      author: 'Nguyễn Văn Admin',
      category: 'Du lịch',
      tags: ['Sapa', 'Homestay', 'Du lịch núi'],
      status: 'published',
      publishDate: '2024-01-15',
      createdDate: '2024-01-10',
      updatedDate: '2024-01-15',
      views: 2450,
      likes: 89,
      comments: 23,
      featuredImage: '/images/blog/sapa-homestay.jpg',
      seoTitle: 'Top 10 homestay đẹp nhất Sapa 2024 - Đặt phòng ngay',
      seoDescription: 'Danh sách 10 homestay đẹp nhất tại Sapa với giá tốt, view đẹp và dịch vụ chất lượng. Đặt phòng ngay!',
    },
    {
      id: 2,
      title: 'Kinh nghiệm du lịch Hội An tiết kiệm',
      slug: 'kinh-nghiem-du-lich-hoi-an-tiet-kiem',
      excerpt: 'Chia sẻ những kinh nghiệm du lịch Hội An với chi phí tiết kiệm nhất mà vẫn trải nghiệm đầy đủ...',
      content: 'Nội dung chi tiết về kinh nghiệm du lịch Hội An...',
      author: 'Trần Thị Editor',
      category: 'Kinh nghiệm',
      tags: ['Hội An', 'Du lịch tiết kiệm', 'Kinh nghiệm'],
      status: 'drafts',
      publishDate: null,
      createdDate: '2024-01-12',
      updatedDate: '2024-01-14',
      views: 0,
      likes: 0,
      comments: 0,
      featuredImage: '/images/blog/hoi-an-travel.jpg',
      seoTitle: 'Kinh nghiệm du lịch Hội An tiết kiệm - Cẩm nang chi tiết',
      seoDescription: 'Cẩm nang du lịch Hội An tiết kiệm với những mẹo hay và địa điểm không thể bỏ qua.',
    },
    {
      id: 3,
      title: 'Phú Quốc - Thiên đường nghỉ dưỡng',
      slug: 'phu-quoc-thien-duong-nghi-duong',
      excerpt: 'Phú Quốc không chỉ nổi tiếng với những bãi biển đẹp mà còn có nhiều homestay và resort tuyệt vời...',
      content: 'Nội dung chi tiết về Phú Quốc...',
      author: 'Lê Minh Writer',
      category: 'Điểm đến',
      tags: ['Phú Quốc', 'Biển', 'Nghỉ dưỡng'],
      status: 'scheduled',
      publishDate: '2024-01-20',
      createdDate: '2024-01-08',
      updatedDate: '2024-01-16',
      views: 0,
      likes: 0,
      comments: 0,
      featuredImage: '/images/blog/phu-quoc-beach.jpg',
      seoTitle: 'Phú Quốc - Thiên đường nghỉ dưỡng tại Việt Nam',
      seoDescription: 'Khám phá Phú Quốc - hòn đảo thiên đường với biển xanh, cát trắng và những trải nghiệm tuyệt vời.',
    },
    {
      id: 4,
      title: 'Đà Lạt mùa hoa mimosa vàng rực',
      slug: 'da-lat-mua-hoa-mimosa-vang-ruc',
      excerpt: 'Tháng 1-2 là thời điểm đẹp nhất để ngắm hoa mimosa tại Đà Lạt, cùng khám phá những homestay view hoa đẹp nhất...',
      content: 'Nội dung chi tiết về mùa hoa mimosa Đà Lạt...',
      author: 'Phạm Thị Content',
      category: 'Mùa du lịch',
      tags: ['Đà Lạt', 'Hoa mimosa', 'Mùa hoa'],
      status: 'published',
      publishDate: '2024-01-18',
      createdDate: '2024-01-15',
      updatedDate: '2024-01-18',
      views: 1890,
      likes: 67,
      comments: 15,
      featuredImage: '/images/blog/dalat-mimosa.jpg',
      seoTitle: 'Đà Lạt mùa hoa mimosa vàng rực - Cẩm nang du lịch',
      seoDescription: 'Cẩm nang du lịch Đà Lạt mùa hoa mimosa với những địa điểm ngắm hoa đẹp nhất và homestay view hoa.',
    },
    {
      id: 5,
      title: 'Cần Thơ - Khám phá miền Tây sông nước',
      slug: 'can-tho-kham-pha-mien-tay-song-nuoc',
      excerpt: 'Cần Thơ với chợ nổi, vườn trái cây và những homestay trên sông độc đáo mang đến trải nghiệm khó quên...',
      content: 'Nội dung chi tiết về du lịch Cần Thơ...',
      author: 'Hoàng Văn Travel',
      category: 'Điểm đến',
      tags: ['Cần Thơ', 'Miền Tây', 'Chợ nổi'],
      status: 'published',
      publishDate: '2024-01-10',
      createdDate: '2024-01-05',
      updatedDate: '2024-01-10',
      views: 1234,
      likes: 45,
      comments: 12,
      featuredImage: '/images/blog/can-tho-floating-market.jpg',
      seoTitle: 'Cần Thơ - Khám phá miền Tây sông nước đầy thú vị',
      seoDescription: 'Du lịch Cần Thơ với chợ nổi Cái Răng, vườn trái cây và những homestay trên sông độc đáo.',
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleViewDetails = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'drafts':
        return 'default';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return 'Đã xuất bản';
      case 'drafts':
        return 'Bản nháp';
      case 'scheduled':
        return 'Đã lên lịch';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <Publish />;
      case 'drafts':
        return <Drafts />;
      case 'scheduled':
        return <Schedule />;
      default:
        return null;
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = blogPosts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = blogPosts.reduce((sum, post) => sum + post.comments, 0);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Quản lý Blog/Tin tức
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Tạo bài viết mới
        </Button>
      </Box>

      {/* Search and Filter */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm bài viết theo tiêu đề, tác giả hoặc danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="published">Đã xuất bản</MenuItem>
              <MenuItem value="drafts">Bản nháp</MenuItem>
              <MenuItem value="scheduled">Đã lên lịch</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Edit sx={{ color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng bài viết
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    {blogPosts.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ViewIcon sx={{ color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng lượt xem
                  </Typography>
                  <Typography variant="h6" color="info.main">
                    {totalViews.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ThumbUp sx={{ color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng lượt thích
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {totalLikes}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Comment sx={{ color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng bình luận
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {totalComments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bài viết</TableCell>
                <TableCell>Tác giả</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Lượt xem</TableCell>
                <TableCell align="center">Tương tác</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPosts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((post) => (
                  <TableRow key={post.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          variant="rounded"
                          sx={{ mr: 2, width: 60, height: 40 }}
                          src={post.featuredImage}
                        />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {post.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {post.excerpt.substring(0, 60)}...
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {post.author}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={post.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {post.createdDate}
                      </Typography>
                      {post.publishDate && (
                        <Typography variant="caption" color="text.secondary">
                          Xuất bản: {post.publishDate}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600} color="info.main">
                        {post.views.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <Typography variant="body2" color="success.main">
                          👍 {post.likes}
                        </Typography>
                        <Typography variant="body2" color="warning.main">
                          💬 {post.comments}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusText(post.status)}
                        color={getStatusColor(post.status)}
                        size="small"
                        icon={getStatusIcon(post.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, post)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPosts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <Visibility sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Publish sx={{ mr: 1 }} />
          Xuất bản
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Schedule sx={{ mr: 1 }} />
          Lên lịch
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Xóa bài viết
        </MenuItem>
      </Menu>

      {/* Post Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          Chi tiết bài viết
        </DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={selectedPost.featuredImage || '/images/placeholder.jpg'}
                    alt={selectedPost.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {selectedPost.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {selectedPost.excerpt}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {selectedPost.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                    <Chip
                      label={getStatusText(selectedPost.status)}
                      color={getStatusColor(selectedPost.status)}
                      icon={getStatusIcon(selectedPost.status)}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Thông tin tác giả
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedPost.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Danh mục: {selectedPost.category}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Thống kê
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="info.main">
                          {selectedPost.views.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Lượt xem
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="success.main">
                          {selectedPost.likes}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Thích
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="warning.main">
                          {selectedPost.comments}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bình luận
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    SEO
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Tiêu đề SEO:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedPost.seoTitle}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Mô tả SEO:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedPost.seoDescription}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Thời gian
                  </Typography>
                  <Typography variant="body2">
                    Tạo: {selectedPost.createdDate}
                  </Typography>
                  <Typography variant="body2">
                    Cập nhật: {selectedPost.updatedDate}
                  </Typography>
                  {selectedPost.publishDate && (
                    <Typography variant="body2">
                      Xuất bản: {selectedPost.publishDate}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Chỉnh sửa
          </Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Xem trên web
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogManagement;