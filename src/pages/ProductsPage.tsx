import React, { useState, useMemo } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { Product, Category } from '../types';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Filter, Grid, List } from 'lucide-react';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: products, loading: productsLoading } = useFirebaseData<Record<string, Product>>('products');
  const { data: categories, loading: categoriesLoading } = useFirebaseData<Record<string, Category>>('categories');

  const activeProducts = useMemo(() => {
    if (!products) return [];
    return Object.entries(products).filter(([_, product]) => product.isActive);
  }, [products]);

  const activeCategories = useMemo(() => {
    if (!categories) return [];
    return Object.entries(categories).filter(([_, category]) => category.isActive);
  }, [categories]);

  const filteredProducts = useMemo(() => {
    let filtered = [...activeProducts];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(([_, product]) => product.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange !== 'all') {
      filtered = filtered.filter(([_, product]) => {
        switch (priceRange) {
          case 'under-500':
            return product.price < 500;
          case '500-1000':
            return product.price >= 500 && product.price <= 1000;
          case '1000-2000':
            return product.price >= 1000 && product.price <= 2000;
          case 'above-2000':
            return product.price > 2000;
          default:
            return true;
        }
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort(([_, a], [__, b]) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort(([_, a], [__, b]) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort(([_, a], [__, b]) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort(([_, a], [__, b]) => b.createdAt - a.createdAt);
        break;
      default:
        filtered.sort(([_, a], [__, b]) => b.rating - a.rating);
    }

    return filtered;
  }, [activeProducts, selectedCategory, sortBy, priceRange]);

  if (productsLoading || categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Filters</h3>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Category</h4>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {activeCategories.map(([id, category]) => (
                  <option key={id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Price Range</h4>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="under-500">Under ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-2000">₹1000 - ₹2000</option>
                <option value="above-2000">Above ₹2000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-bold">
              Products ({filteredProducts.length})
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map(([id, product]) => (
                <ProductCard key={id} product={{ ...product, id }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}