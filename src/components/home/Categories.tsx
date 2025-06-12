import React from 'react';
import { Link } from 'react-router-dom';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import { Category } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

export default function Categories() {
  const { data: categories, loading } = useFirebaseData<Record<string, Category>>('categories');

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <LoadingSpinner size="lg" />
        </div>
      </section>
    );
  }

  const activeCategories = categories ? 
    Object.entries(categories)
      .filter(([_, category]) => category.isActive)
      .slice(0, 6) : [];

  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {activeCategories.map(([id, category]) => (
            <Link
              key={id}
              to={`/category/${id}`}
              className="group text-center"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}