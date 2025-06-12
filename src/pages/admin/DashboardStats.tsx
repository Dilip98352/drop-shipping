import React from 'react';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import { Product, Order } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DashboardStats() {
  const { data: products, loading: productsLoading } = useFirebaseData<Record<string, Product>>('products');
  const { data: orders, loading: ordersLoading } = useFirebaseData<Record<string, Order>>('orders');

  if (productsLoading || ordersLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const activeProducts = products ? Object.values(products).filter(p => p.isActive).length : 0;
  const totalOrders = orders ? Object.keys(orders).length : 0;
  const totalRevenue = orders ? Object.values(orders).reduce((sum, order) => sum + order.totalAmount, 0) : 0;
  const pendingOrders = orders ? Object.values(orders).filter(o => o.status === 'pending').length : 0;

  const stats = [
    {
      title: 'Active Products',
      value: activeProducts,
      icon: Package,
      color: 'bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: Users,
      color: 'bg-orange-600',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        {orders && Object.keys(orders).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Product</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(orders)
                  .sort(([_, a], [__, b]) => b.createdAt - a.createdAt)
                  .slice(0, 5)
                  .map(([id, order]) => (
                    <tr key={id} className="border-b">
                      <td className="py-2 text-sm font-mono">#{id.slice(-8)}</td>
                      <td className="py-2">{order.customerName}</td>
                      <td className="py-2">{order.productName}</td>
                      <td className="py-2">₹{order.totalAmount}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No orders yet.</p>
        )}
      </div>
    </div>
  );
}