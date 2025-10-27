import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem,
  Checkbox, FormControlLabel, Slider, TextField, Chip, Button, Collapse, IconButton
} from '@mui/material';
import { Search, FilterList, ExpandMore, ExpandLess } from '@mui/icons-material';

const RoomCategoryFilter = ({ onFilterChange, filterOptions }) => {
  const [filters, setFilters] = useState({
    search: '',
    view_type: '',
    has_balcony: null,
    has_kitchen: null,
    is_pet_friendly: null,
    max_guests: '',
    price_range: [0, 2000000],
    tags: [],
    sort_by: 'name'
  });
  const [expanded, setExpanded] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (key === 'search') {
      if (searchTimeout) clearTimeout(searchTimeout);
      const timeout = setTimeout(() => {
        onFilterChange(newFilters);
      }, 500);
      setSearchTimeout(timeout);
    } else {
      onFilterChange(newFilters);
    }
  }, [filters, onFilterChange, searchTimeout]);

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  const handleTagToggle = (tagName) => {
    const newTags = filters.tags.includes(tagName)
      ? filters.tags.filter(t => t !== tagName)
      : [...filters.tags, tagName];
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      view_type: '',
      has_balcony: null,
      has_kitchen: null,
      is_pet_friendly: null,
      max_guests: '',
      price_range: [filterOptions?.price_range?.min || 0, filterOptions?.price_range?.max || 2000000],
      tags: [],
      sort_by: 'name'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = () => {
    return filters.search || filters.view_type || filters.has_balcony !== null || 
           filters.has_kitchen !== null || filters.is_pet_friendly !== null || 
           filters.max_guests || filters.tags.length > 0;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterList sx={{ mr: 1 }} />
        <Typography variant="h6">Bộ lọc tìm kiếm</Typography>
        {hasActiveFilters() && (
          <Chip 
            label="Có bộ lọc"
            size="small" 
            color="primary" 
            sx={{ ml: 1 }}
          />
        )}
        <IconButton 
          onClick={() => setExpanded(!expanded)}
          sx={{ ml: 'auto', mr: 1 }}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <Button 
          onClick={clearFilters} 
          disabled={!hasActiveFilters()}
          size="small"
        >
          Xóa bộ lọc
        </Button>
      </Box>

      <TextField
        label="Tìm kiếm theo tên loại phòng"
        value={filters.search}
        onChange={(e) => handleFilterChange('search', e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
        }}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Collapse in={expanded}>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>

        {/* View type */}
        <FormControl fullWidth>
          <InputLabel>Loại view</InputLabel>
          <Select
            value={filters.view_type}
            onChange={(e) => handleFilterChange('view_type', e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {filterOptions?.view_types?.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Số khách */}
        <TextField
          label="Số khách tối đa"
          type="number"
          value={filters.max_guests}
          onChange={(e) => handleFilterChange('max_guests', e.target.value)}
          fullWidth
        />

        {/* Sắp xếp */}
        <FormControl fullWidth>
          <InputLabel>Sắp xếp theo</InputLabel>
          <Select
            value={filters.sort_by}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
          >
            <MenuItem value="name">Tên A-Z</MenuItem>
            <MenuItem value="price_asc">Giá thấp → cao</MenuItem>
            <MenuItem value="price_desc">Giá cao → thấp</MenuItem>
            <MenuItem value="size_asc">Diện tích nhỏ → lớn</MenuItem>
            <MenuItem value="size_desc">Diện tích lớn → nhỏ</MenuItem>
            <MenuItem value="guests_asc">Ít khách → nhiều khách</MenuItem>
            <MenuItem value="guests_desc">Nhiều khách → ít khách</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tiện nghi */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Tiện nghi</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.has_balcony === true}
                onChange={(e) => handleFilterChange('has_balcony', e.target.checked ? true : null)}
              />
            }
            label="Có ban công"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.has_kitchen === true}
                onChange={(e) => handleFilterChange('has_kitchen', e.target.checked ? true : null)}
              />
            }
            label="Có bếp riêng"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.is_pet_friendly === true}
                onChange={(e) => handleFilterChange('is_pet_friendly', e.target.checked ? true : null)}
              />
            }
            label="Thân thiện với thú cưng"
          />
        </Box>
      </Box>

      {/* Khoảng giá */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Khoảng giá: {filters.price_range[0].toLocaleString('vi-VN')}đ - {filters.price_range[1].toLocaleString('vi-VN')}đ
        </Typography>
        <Slider
          value={filters.price_range}
          onChange={(e, value) => handleFilterChange('price_range', value)}
          min={filterOptions?.price_range?.min || 0}
          max={filterOptions?.price_range?.max || 2000000}
          step={50000}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value.toLocaleString('vi-VN')}đ`}
        />
      </Box>

      {/* Tags */}
      {filterOptions?.tags?.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Tags</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filterOptions.tags.map(tag => (
              <Chip
                key={tag.id}
                label={tag.name}
                onClick={() => handleTagToggle(tag.name)}
                color={filters.tags.includes(tag.name) ? 'primary' : 'default'}
                variant={filters.tags.includes(tag.name) ? 'filled' : 'outlined'}
                sx={{ 
                  backgroundColor: filters.tags.includes(tag.name) ? tag.color : 'transparent',
                  borderColor: tag.color,
                  color: filters.tags.includes(tag.name) ? 'white' : tag.color
                }}
              />
            ))}
          </Box>
        </Box>
      )}
      </Collapse>
    </Paper>
  );
};

export default RoomCategoryFilter;