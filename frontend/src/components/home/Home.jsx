import React from 'react';
import Layout from '../common/Layout';
import HeroSection from './HeroSection';

import FeaturedProperties from './FeaturedProperties';
import AboutSection from './AboutSection';


const Home = () => {
  return (
    <Layout>
      <HeroSection />

      <FeaturedProperties />
      <AboutSection />
    </Layout>
  );
};

export default Home;