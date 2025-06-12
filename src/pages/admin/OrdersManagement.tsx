import React from 'react';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import { Order } from '../../types';
import { database } from '../../firebase/config';
import { ref, update } from 'firebase/database';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function OrdersManagement() {
  const { data: orders, loading } = useFirebaseData<Record<string, Order>>('orders');

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await update(ref(database, `orders/${orderId}`), { status: newStatus });
      toast.success('Order status updated successfully!');
    } catch (error) {
      toast.error('Error updating order status');
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const orderList = orders ? 
    Object.entries(orders).sort(([_, a], [__, b]) => b.createdAt - a.createdAt) : [];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Orders Management</h2>
        <div className="text-sm text-gray-600">
          Total Orders: {orderList.length}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {orderList.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No orders found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Order ID</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map(([id, order]) => (
                  <tr key={id} className="border-b">
                    <td className="p-4">
                      <span className="font-mono text-sm">#{id.slice(-8)}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-600">{order.customerEmail}</div>
                        <div className="text-sm text-gray-600">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{order.productName}</div>
                        <div className="text-sm text-gray-600">Qty: {order.quantity}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">₹{order.totalAmount}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(id, e.target.value as Order['status'])}
                        className="text-sm p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Summary */}
      {orderList.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-600">Pending Orders</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {orderList.filter(([_, order]) => order.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-600">Processing Orders</h3>
            <p className="text-2xl font-bold text-blue-600">
              {orderList.filter(([_, order]) => order.status === 'processing').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-600">Shipped Orders</h3>
            <p className="text-2xl font-bold text-purple-600">
              {orderList.filter(([_, order]) => order.status === 'shipped').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-600">Delivered Orders</h3>
            <p className="text-2xl font-bold text-green-600">
              {orderList.filter(([_, order]) => order.status === 'delivered').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}