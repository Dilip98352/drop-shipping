import React from 'react';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import { Product } from '../../types';
import ProductCard from '../products/ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

export default function FeaturedProducts() {
  const { data: products, loading } = useFirebaseData<Record<string, Product>>('products');

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <LoadingSpinner size="lg" />
        </div>
      </section>
    );
  }

  const featuredProducts = products ? 
    Object.entries(products)
      .filter(([_, product]) => product.isActive)
      .sort(([_, a], [__, b]) => b.rating - a.rating)
      .slice(0, 8) : [];

  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <p className="text-center text-gray-600">No products available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(([id, product]) => (
            <ProductCard key={id} product={{ ...product, id }} />
          ))}
        </div>
      </div>
    </section>
  );
}