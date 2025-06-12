import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { Product } from '../types';
import { database } from '../firebase/config';
import { ref, push } from 'firebase/database';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useFacebookPixel } from '../hooks/useFacebookPixel';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { data: products, loading } = useFirebaseData<Record<string, Product>>('products');
  const { trackEvent } = useFacebookPixel();

  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: ''
  });

  const product = products && id ? products[id] : null;

  React.useEffect(() => {
    if (product) {
      trackEvent('ViewContent', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [id],
        value: product.price,
        currency: 'INR'
      });
    }
  }, [product, id, trackEvent]);

  const handleAddToCart = () => {
    if (product) {
      trackEvent('AddToCart', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [id],
        value: product.price * quantity,
        currency: 'INR'
      });
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    setShowOrderForm(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !id) return;

    try {
      const orderData = {
        productId: id,
        productName: product.name,
        quantity,
        totalAmount: product.price * quantity,
        ...orderForm,
        status: 'pending',
        createdAt: Date.now()
      };

      await push(ref(database, 'orders'), orderData);
      
      trackEvent('Purchase', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [id],
        value: product.price * quantity,
        currency: 'INR'
      });

      toast.success('Order placed successfully!');
      setShowOrderForm(false);
      setOrderForm({ customerName: '', customerEmail: '', customerPhone: '', address: '' });
    } catch (error) {
      toast.error('Error placing order');
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-screen" />;
  if (!product) return <div className="container mx-auto px-4 py-8 text-center">Product not found</div>;

  const discountPercentage = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const productImages = product.images || [product.imageUrl];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="text-blue-600 hover:underline">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {productImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                  -{discountPercentage}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {product.features && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <div className="flex items-center text-green-600">
                <span className="font-semibold">In Stock</span>
                {product.stock < 10 && (
                  <span className="ml-2 text-orange-600">Only {product.stock} left!</span>
                )}
              </div>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </div>

          {/* Fake Buy Count */}
          {product.fakeBuyCount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
              <p className="text-green-800 text-sm">
                🔥 {product.fakeBuyCount} people bought this today
              </p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100"
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
          </div>

          {/* Additional Actions */}
          <div className="flex space-x-4 mb-8">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
              <Heart className="h-5 w-5" />
              <span>Add to Wishlist</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Guarantees */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Truck className="h-5 w-5 text-blue-600" />
              <span>Free shipping on orders above ₹499</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <RotateCcw className="h-5 w-5 text-green-600" />
              <span>7-day return policy</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Shield className="h-5 w-5 text-purple-600" />
              <span>100% secure payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Complete Your Order</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                    <p className="font-semibold">Total: ₹{product.price * quantity}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={orderForm.customerEmail}
                    onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={orderForm.customerPhone}
                    onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Address</label>
                  <textarea
                    value={orderForm.address}
                    onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}