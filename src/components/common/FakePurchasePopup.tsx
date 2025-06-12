import React, { useState, useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import { Product, Settings } from '../../types';

export default function FakePurchasePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const { data: products } = useFirebaseData<Record<string, Product>>('products');
  const { data: settings } = useFirebaseData<Settings>('settings');

  useEffect(() => {
    if (!settings?.showFakePurchase || !products) return;

    const activeProducts = Object.values(products).filter(p => p.isActive && p.fakeBuyCount > 0);
    if (activeProducts.length === 0) return;

    const showPopup = () => {
      const randomProduct = activeProducts[Math.floor(Math.random() * activeProducts.length)];
      setCurrentProduct(randomProduct);
      setIsVisible(true);

      // Auto hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Show popup every 30-60 seconds
    const interval = setInterval(showPopup, Math.random() * 30000 + 30000);

    // Show first popup after 10 seconds
    const firstTimeout = setTimeout(showPopup, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(firstTimeout);
    };
  }, [products, settings?.showFakePurchase]);

  if (!isVisible || !currentProduct) return null;

  const names = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rohit', 'Kavya', 'Arjun', 'Divya'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
  
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const timeAgo = Math.floor(Math.random() * 30) + 1;

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-50 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 rounded-full p-1">
            <ShoppingBag className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-sm font-medium text-green-600">Just Purchased!</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex space-x-3">
        <img
          src={currentProduct.imageUrl}
          alt={currentProduct.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {currentProduct.name}
          </p>
          <p className="text-xs text-gray-600">
            {randomName} from {randomCity}
          </p>
          <p className="text-xs text-gray-500">
            {timeAgo} minutes ago
          </p>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {currentProduct.fakeBuyCount} people have bought this today
      </div>
    </div>
  );
}