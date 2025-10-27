import React from 'react';
import Layout from '../common/Layout';
import HeroSection from './HeroSection';
import PromotionBannerSection from '../promotions/PromotionBannerSection';
import FeaturedProperties from './FeaturedProperties';
import AboutSection from './AboutSection';


const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <PromotionBannerSection />
      <FeaturedProperties />
      <AboutSection />
    </Layout>
  );
};

export default Home;