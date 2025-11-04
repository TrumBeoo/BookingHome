import React from 'react';
import Layout from '../common/Layout';
import HeroSection from './HeroSection';
import FeaturedProperties from './FeaturedProperties';
import AboutSection from './AboutSection';
import SidebarBanner from '../banner/SidebarBanner';

const Home = () => {
  return (
    <Layout>
      <SidebarBanner />
      <HeroSection />
      <FeaturedProperties />
      <AboutSection />
    </Layout>
  );
};

export default Home;