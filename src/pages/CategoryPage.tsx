import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { Product, Category } from '../types';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: products, loading: productsLoading } = useFirebaseData<Record<string, Product>>('products');
  const { data: categories, loading: categoriesLoading } = useFirebaseData<Record<string, Category>>('categories');

  const category = categories && categoryId ? categories[categoryId] : null;
  
  const categoryProducts = useMemo(() => {
    if (!products || !category) return [];
    return Object.entries(products).filter(([_, product]) => 
      product.isActive && product.category === category.name
    );
  }, [products, category]);

  if (productsLoading || categoriesLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <Link to="/products" className="text-blue-600 hover:underline">
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="text-blue-600 hover:underline">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        {category.imageUrl && (
          <div className="h-48 rounded-lg overflow-hidden mb-6">
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600">{categoryProducts.length} products found</p>
      </div>

      {/* Products Grid */}
      {categoryProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products found in this category.</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map(([id, product]) => (
            <ProductCard key={id} product={{ ...product, id }} />
          ))}
        </div>
      )}
    </div>
  );
}