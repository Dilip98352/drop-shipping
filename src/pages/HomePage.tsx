import React from 'react';
import HeroSection from '../components/home/HeroSection';
import Categories from '../components/home/Categories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import { useFacebookPixel } from '../hooks/useFacebookPixel';

export default function HomePage() {
  useFacebookPixel(); // Initialize Facebook Pixel

  return (
    <div>
      <HeroSection />
      <Categories />
      <FeaturedProducts />
      
      {/* Promotional Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p>Free shipping on orders above ₹499</p>
            </div>
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p>Quick delivery within 3-7 business days</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p>100% secure payment with money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}