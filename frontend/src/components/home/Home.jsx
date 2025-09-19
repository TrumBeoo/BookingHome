import React from 'react';
import Layout from '../common/Layout';
import HeroSection from './HeroSection';
import FeaturedProperties from './FeaturedProperties';
import AboutSection from './AboutSection';
import TestimonialsSection from './TestimonialsSection';

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedProperties />
      <AboutSection />
      <TestimonialsSection />
    </Layout>
  );
};

export default Home;