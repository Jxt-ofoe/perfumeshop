'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ProductModal from '@/components/admin/ProductModal';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?search=${search}&limit=50`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedCategories = async () => {
    if (!confirm('Seed category settings? This will reset all categories.')) return;
    
    try {
      const res = await fetch('/api/admin/seed-categories', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Categories seeded successfully');
      } else {
        toast.error(data.error || 'Failed to seed categories');
      }
    } catch {
      toast.error('Network Error');
    }
  };

  const handleFeatureAll = async () => {
    if (!confirm('Mark all products as featured on homepage?')) return;
    
    try {
      const res = await fetch('/api/admin/feature-all', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        toast.success('All products are now featured on homepage');
        fetchProducts();
      } else {
        toast.error(data.error || 'Failed to update products');
      }
    } catch {
      toast.error('Network Error');
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error(data.error || 'Failed to delete product');
      }
    } catch {
      toast.error('Network Error');
    }
  };

  const openNewModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Products Inventory</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={handleSeedCategories}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(100,100,255,0.1)', color: '#8888ff',
              border: '1px solid rgba(100,100,255,0.3)', padding: '0.5rem 1rem', borderRadius: '4px',
              cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem'
            }}
          >
            Seed Categories
          </button>
          <button 
            onClick={handleFeatureAll}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(201,169,110,0.1)', color: 'var(--color-gold)',
              border: '1px solid rgba(201,169,110,0.3)', padding: '0.5rem 1rem', borderRadius: '4px',
              cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem'
            }}
          >
            Feature All on Homepage
          </button>
          <button 
            onClick={openNewModal}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--color-gold)', color: 'black',
              border: 'none', padding: '0.5rem 1rem', borderRadius: '4px',
              cursor: 'pointer', fontWeight: 500
            }}
          >
            <Plus size={18} /> New Product
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
          <input 
            type="text" 
            placeholder="Search products by name or slug..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', maxWidth: '400px', padding: '0.75rem',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,169,110,0.2)',
              color: 'white', borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(201,169,110,0.05)', color: 'var(--color-gold)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Scent Family</th>
                <th style={{ padding: '1rem' }}>Price (GH₵)</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No products found</td></tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div>
                          <div style={{ fontWeight: 500, color: 'white' }}>{p.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{p.size} • {p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.8)' }}>{p.scentFamily}</td>
                    <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.8)' }}>{(p.price / 100).toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem',
                        background: p.featured ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.05)',
                        color: p.featured ? 'var(--color-gold)' : 'white'
                      }}>
                        {p.featured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => openEditModal(p)} style={{ background: 'rgba(201,169,110,0.1)', color: 'var(--color-gold)', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} style={{ background: 'rgba(255,50,50,0.1)', color: '#ff6b6b', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={editingProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
