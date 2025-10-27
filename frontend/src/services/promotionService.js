import api from './api';

class PromotionService {
  // Lấy danh sách khuyến mãi
  async getPromotions(type = null) {
    try {
      const params = type ? `?type=${type}` : '';
      const response = await fetch(`/api/promotions/${params}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching promotions:', error);
      throw error;
    }
  }

  // Kiểm tra mã giảm giá
  async validateCoupon(couponData) {
    try {
      const response = await fetch('/api/promotions/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Mã giảm giá không hợp lệ');
      }
      
      return data;
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw error;
    }
  }

  // Lấy combo packages
  async getComboPackages(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.min_nights) params.append('min_nights', filters.min_nights);
      if (filters.includes_breakfast !== undefined) params.append('includes_breakfast', filters.includes_breakfast);
      
      const response = await fetch(`/api/promotions/combos?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching combo packages:', error);
      throw error;
    }
  }

  // Lấy giá theo mùa
  async getSeasonalPricing(checkDate, homestayId = null) {
    try {
      const params = new URLSearchParams({ check_date: checkDate });
      if (homestayId) params.append('homestay_id', homestayId);
      
      const response = await fetch(`/api/promotions/seasonal-pricing?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching seasonal pricing:', error);
      throw error;
    }
  }

  // Lấy bảng giá ngày lễ
  async getHolidayPricing(year) {
    try {
      const response = await fetch(`/api/promotions/holiday-pricing?year=${year}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching holiday pricing:', error);
      throw error;
    }
  }

  // Tính giá động dựa trên ngày
  async calculateDynamicPrice(homestayId, checkIn, checkOut, basePrice) {
    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      
      let totalPrice = 0;
      let priceBreakdown = [];
      
      // Tính giá cho từng đêm
      for (let i = 0; i < nights; i++) {
        const currentDate = new Date(checkInDate);
        currentDate.setDate(currentDate.getDate() + i);
        
        // Lấy seasonal pricing cho ngày này
        const seasonalPricing = await this.getSeasonalPricing(
          currentDate.toISOString().split('T')[0], 
          homestayId
        );
        
        let nightPrice = basePrice;
        let multiplier = 1;
        let surcharge = 0;
        let reasons = [];
        
        // Áp dụng seasonal pricing
        if (seasonalPricing && seasonalPricing.length > 0) {
          for (const pricing of seasonalPricing) {
            multiplier *= pricing.price_multiplier;
            surcharge += pricing.fixed_surcharge;
            reasons.push(pricing.name);
          }
        }
        
        // Kiểm tra cuối tuần (Thứ 7, CN)
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          if (!reasons.some(r => r.includes('cuối tuần'))) {
            multiplier *= 1.2; // Tăng 20% cuối tuần
            reasons.push('Cuối tuần');
          }
        }
        
        nightPrice = (nightPrice * multiplier) + surcharge;
        totalPrice += nightPrice;
        
        priceBreakdown.push({
          date: currentDate.toISOString().split('T')[0],
          basePrice: basePrice,
          multiplier: multiplier,
          surcharge: surcharge,
          finalPrice: nightPrice,
          reasons: reasons
        });
      }
      
      return {
        totalPrice: Math.round(totalPrice),
        priceBreakdown: priceBreakdown,
        nights: nights,
        averagePrice: Math.round(totalPrice / nights)
      };
    } catch (error) {
      console.error('Error calculating dynamic price:', error);
      throw error;
    }
  }

  // Format giá tiền
  formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Tính phần trăm giảm giá
  calculateDiscountPercentage(originalPrice, discountedPrice) {
    if (originalPrice <= 0) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }
}

export default new PromotionService();