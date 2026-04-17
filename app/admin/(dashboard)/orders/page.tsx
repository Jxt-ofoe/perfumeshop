'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?search=${search}&status=${statusFilter}&limit=50`);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetails = async (order: any) => {
    setSelectedOrder(null);
    setIsModalOpen(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`);
      const data = await res.json();
      if (data.order) {
        setSelectedOrder(data.order);
      }
    } catch {
      toast.error('Failed to load order details');
      setIsModalOpen(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        setSelectedOrder({ ...selectedOrder, status: newStatus });
        fetchOrders(); // refresh list in background
      } else {
        toast.error('Failed to update status');
      }
    } catch {
        toast.error('Network Error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#6c8480';
      case 'pending': return 'rgba(255,255,255,0.5)';
      case 'shipped': return '#4ade80'; // green
      case 'delivered': return '#3b82f6'; // blue
      case 'cancelled': return '#ff6b6b'; // red
      default: return 'white';
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Order Management</h1>
      </div>

      <div className="admin-card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(124,58,237,0.1)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search reference, name, or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: '250px', padding: '0.75rem',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(124,58,237,0.2)',
              color: 'white', borderRadius: '4px'
            }}
          />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.75rem', background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(124,58,237,0.2)', color: 'white', borderRadius: '4px'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(124,58,237,0.05)', color: 'var(--color-gold)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Order Ref</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Customer</th>
                <th style={{ padding: '1rem' }}>Amount (GH₵)</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No orders found</td></tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: 'white' }}>#{o.reference.substring(0,8)}...</td>
                    <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.6)' }}>
                       {format(new Date(o.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: 'white' }}>{o.firstName} {o.lastName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{o.email}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-gold)' }}>{(o.totalAmount / 100).toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem',
                        background: 'rgba(255,255,255,0.05)', color: getStatusColor(o.status), textTransform: 'capitalize'
                      }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => openOrderDetails(o)} style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--color-gold)', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10,8,5,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
        }}>
          <div style={{
            background: '#0d0d1f', borderRadius: '8px', border: '1px solid rgba(124,58,237,0.3)',
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', color: 'var(--color-gold)' }}>
                Order Details
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#f5f0e8', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {!selectedOrder ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading...</div>
            ) : (
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               
                {/* Header Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <div>
                     <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Reference Code</div>
                     <div style={{ fontSize: '1.1rem', color: 'white', fontFamily: 'monospace' }}>{selectedOrder.reference}</div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Update Status</div>
                     <select 
                       value={selectedOrder.status}
                       disabled={updatingStatus}
                       onChange={(e) => updateOrderStatus(e.target.value)}
                       style={{
                         padding: '0.4rem 0.8rem', background: '#0a0805', 
                         border: '1px solid rgba(124,58,237,0.5)', color: getStatusColor(selectedOrder.status), 
                         borderRadius: '4px', cursor: 'pointer', textTransform: 'capitalize'
                       }}
                     >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                     </select>
                   </div>
                </div>

                {/* Customer Details */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: 'var(--color-gold)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Customer Details</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'white', fontSize: '0.9rem' }}>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Name</div>
                      {selectedOrder.firstName} {selectedOrder.lastName}
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Contact</div>
                      {selectedOrder.email}<br/>
                      {selectedOrder.phone}
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Delivery Address</div>
                      {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <div style={{ color: 'var(--color-gold)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Items ({selectedOrder.items.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedOrder.items.map((item: any) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                        <div>
                          <div style={{ color: 'white' }}>{item.productName}</div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Qty: {item.quantity}</div>
                        </div>
                        <div style={{ color: 'var(--color-gold)' }}>GH₵{(item.price / 100).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '1.2rem', color: 'white' }}>
                  <span>Total</span>
                  <span style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--color-gold)', fontSize: '1.5rem' }}>GH₵{(selectedOrder.totalAmount / 100).toFixed(2)}</span>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
