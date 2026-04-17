'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ProductModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductModal({ product, isOpen, onClose, onSuccess }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    image: '',
    category: 'Eau de Parfum',
    scentFamily: 'Floral',
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    size: '100ml',
    featured: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: (product.price / 100).toString(), // convert kobo to cedis for display
      });
    } else {
      setFormData({
        name: '', slug: '', description: '', price: '', image: '',
        category: 'Eau de Parfum', scentFamily: 'Floral',
        topNotes: '', heartNotes: '', baseNotes: '', size: '100ml', featured: false
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert price back to kobo before sending
      const payload = {
        ...formData,
        price: Math.round(parseFloat(formData.price) * 100)
      };

      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Product successfully ${product ? 'updated' : 'created'}`);
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || 'Failed to save product');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
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
            {product ? 'Edit Product' : 'New Product'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#f5f0e8', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gold)' }}>Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                style={{ width: '100%', padding: '0.5rem', background: '#0a0805', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gold)' }}>Slug</label>
              <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} 
                style={{ width: '100%', padding: '0.5rem', background: '#0a0805', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gold)' }}>Description</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3}
              style={{ width: '100%', padding: '0.5rem', background: '#0a0805', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gold)' }}>Price (GH₵)</label>
              <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} 
                style={{ width: '100%', padding: '0.5rem', background: '#0a0805', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gold)' }}>Image URL</label>
              <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} 
                placeholder="/images/example.jpg or https://"
                style={{ width: '100%', padding: '0.5rem', background: '#0a0805', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gold)' }}>Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} 
                style={{ width: '100%', padding: '0.5rem', background: '#0a0805', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                <option>Eau de Parfum</option>
                <option>Extrait de Parfum</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gold)' }}>Scent Family</label>
              <select value={formData.scentFamily} onChange={e => setFormData({...formData, scentFamily: e.target.value})} 
                style={{ width: '100%', padding: '0.5rem', background: '#0a0805', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                <option>Floral</option>
                <option>Woody</option>
                <option>Oriental</option>
                <option>Fresh</option>
                <option>Gourmand</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gold)' }}>Size</label>
              <input value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} 
                style={{ width: '100%', padding: '0.5rem', background: '#0a0805', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gold)' }}>Top Notes</label>
              <input value={formData.topNotes} onChange={e => setFormData({...formData, topNotes: e.target.value})} 
                style={{ width: '100%', padding: '0.5rem', background: '#0a0805', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gold)' }}>Heart Notes</label>
              <input value={formData.heartNotes} onChange={e => setFormData({...formData, heartNotes: e.target.value})} 
                style={{ width: '100%', padding: '0.5rem', background: '#0a0805', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gold)' }}>Base Notes</label>
              <input value={formData.baseNotes} onChange={e => setFormData({...formData, baseNotes: e.target.value})} 
                style={{ width: '100%', padding: '0.5rem', background: '#0a0805', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
            <label htmlFor="featured" style={{ color: 'white', fontSize: '0.9rem' }}>Feature on homepage?</label>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '0.5rem 1.5rem', background: 'var(--color-gold)', color: 'black', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
