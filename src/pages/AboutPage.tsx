import React from 'react';
import { Shield, Truck, Heart, Award, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: '100% secure payment processing with SSL encryption and fraud protection.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping with tracking information provided.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Dedicated customer support team ready to help you 24/7.'
    },
    {
      icon: Award,
      title: 'Quality Products',
      description: 'Carefully curated products from trusted suppliers worldwide.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50,000+', label: 'Products Sold' },
    { number: '99.9%', label: 'Uptime' },
    { number: '4.8/5', label: 'Customer Rating' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About DropShop</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your trusted partner in discovering amazing products at unbeatable prices. 
            We're committed to bringing you the best shopping experience.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2024, DropShop started with a simple mission: to make quality products 
                accessible to everyone at affordable prices. We believe that great products shouldn't 
                break the bank, and excellent customer service should be the standard, not the exception.
              </p>
              <p className="text-gray-700 mb-4">
                Our team works tirelessly to source products from trusted suppliers around the world, 
                ensuring that every item in our catalog meets our high standards for quality and value. 
                We're not just a marketplace – we're your shopping companion.
              </p>
              <p className="text-gray-700">
                Today, we're proud to serve thousands of customers across India, and we're just getting started. 
                Our commitment to innovation, quality, and customer satisfaction drives everything we do.
              </p>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                alt="Our team"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose DropShop?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best online shopping experience possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-gray-600">Numbers that speak for themselves</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <Globe className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="text-gray-700">
                To democratize access to quality products by connecting customers with trusted suppliers 
                worldwide, while providing exceptional service and unbeatable value. We strive to make 
                online shopping simple, secure, and satisfying for everyone.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-2xl font-bold">Our Vision</h3>
              </div>
              <p className="text-gray-700">
                To become India's most trusted and customer-centric e-commerce platform, where quality 
                meets affordability. We envision a future where every customer feels valued, every 
                purchase brings joy, and every interaction builds lasting relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600">The passionate people behind DropShop</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Founder & CEO',
                image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
              },
              {
                name: 'Priya Sharma',
                role: 'Head of Operations',
                image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'
              },
              {
                name: 'Amit Patel',
                role: 'Customer Success Manager',
                image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers and discover amazing products today!</p>
          <a
            href="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Browse Products
          </a>
        </div>
      </section>
    </div>
  );
}