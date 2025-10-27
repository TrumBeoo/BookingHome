import React from 'react';
import { Box, Container, Paper, Typography, Fade, Slide } from '@mui/material';

/**
 * HTML Base Template Component
 * Provides a consistent layout structure for dashboard pages
 */
const HTMLBaseTemplate = ({ 
  children, 
  title, 
  subtitle, 
  headerActions,
  maxWidth = 'xl',
  padding = 3,
  showPaper = true,
  fadeIn = true,
  slideDirection = 'up',
  slideTimeout = 800,
  fadeTimeout = 600
}) => {
  const content = (
    <Container maxWidth={maxWidth}>
      <Box sx={{ py: padding }}>
        {/* Header Section */}
        {(title || subtitle || headerActions) && (
          <Slide direction="down" in timeout={fadeTimeout}>
            <Box sx={{ 
              mb: 4, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box>
                {title && (
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: subtitle ? 1 : 0
                    }}
                  >
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ maxWidth: 600 }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
              {headerActions && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {headerActions}
                </Box>
              )}
            </Box>
          </Slide>
        )}

        {/* Main Content */}
        <Slide direction={slideDirection} in timeout={slideTimeout}>
          <Box>
            {showPaper ? (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                }}
              >
                {children}
              </Paper>
            ) : (
              children
            )}
          </Box>
        </Slide>
      </Box>
    </Container>
  );

  return fadeIn ? (
    <Fade in timeout={fadeTimeout}>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {content}
      </Box>
    </Fade>
  ) : (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {content}
    </Box>
  );
};

/**
 * HTML Base Card Component
 * Provides a consistent card layout with animations
 */
export const HTMLBaseCard = ({ 
  children, 
  title, 
  subtitle,
  actions,
  elevation = 0,
  hover = true,
  padding = 3,
  ...props 
}) => {
  return (
    <Paper
      elevation={elevation}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        ...(hover && {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px 0 rgba(0,0,0,0.12)',
          }
        }),
        ...props.sx
      }}
      {...props}
    >
      {(title || subtitle || actions) && (
        <Box sx={{ 
          p: padding,
          pb: title || subtitle ? 2 : padding,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Box>
            {title && (
              <Typography variant="h6" component="h2" gutterBottom={!!subtitle}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {actions}
            </Box>
          )}
        </Box>
      )}
      <Box sx={{ p: padding }}>
        {children}
      </Box>
    </Paper>
  );
};

/**
 * HTML Base Grid Component
 * Provides responsive grid layout
 */
export const HTMLBaseGrid = ({ 
  children, 
  spacing = 3,
  container = true,
  ...props 
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: spacing,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(auto-fit, minmax(300px, 1fr))',
          md: 'repeat(auto-fit, minmax(350px, 1fr))',
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * HTML Base List Component
 * Provides consistent list styling
 */
export const HTMLBaseList = ({ 
  items = [], 
  renderItem,
  emptyMessage = 'Không có dữ liệu',
  loading = false,
  ...props 
}) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Đang tải...</Typography>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box {...props}>
      {items.map((item, index) => (
        <Box
          key={item.id || index}
          sx={{
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            borderRadius: 1,
            mb: 1,
            p: 1,
          }}
        >
          {renderItem(item, index)}
        </Box>
      ))}
    </Box>
  );
};

/**
 * HTML Base Stats Component
 * Provides consistent stats card layout
 */
export const HTMLBaseStats = ({ 
  title, 
  value, 
  change, 
  trend = 'up',
  icon: Icon,
  color = 'primary',
  ...props 
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'success.main';
    if (trend === 'down') return 'error.main';
    return 'text.secondary';
  };

  return (
    <HTMLBaseCard hover {...props}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ mb: 1 }}>
            {value}
          </Typography>
          {change && (
            <Typography variant="body2" color={getTrendColor()}>
              {change}
            </Typography>
          )}
        </Box>
        {Icon && (
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: `${color}.light`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: `${color}.main`,
            }}
          >
            <Icon />
          </Box>
        )}
      </Box>
    </HTMLBaseCard>
  );
};

export default HTMLBaseTemplate;