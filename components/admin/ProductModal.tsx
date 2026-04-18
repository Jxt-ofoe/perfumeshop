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

function generateSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const inputStyle = { width: '100%', padding: '0.6rem', background: '#0a0805', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' };
const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.78rem', color: 'var(--color-gold)', textTransform: 'uppercase' as const, letterSpacing: '0.1em' };

export default function ProductModal({ product, isOpen, onClose, onSuccess }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', image: '',
    category: '', scentFamily: '', size: '', featured: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: (product.price / 100).toString(),
        image: product.image,
        category: product.category,
        scentFamily: product.scentFamily,
        size: product.size,
        featured: product.featured,
      });
    } else {
      setFormData({ name: '', description: '', price: '', image: '', category: '', scentFamily: '', size: '', featured: false });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        slug: product?.slug || generateSlug(formData.name),
        description: formData.description,
        price: Math.round(parseFloat(formData.price) * 100),
        image: formData.image,
        category: formData.category,
        scentFamily: formData.scentFamily,
        size: formData.size,
        featured: formData.featured,
        topNotes: product?.topNotes || '',
        heartNotes: product?.heartNotes || '',
        baseNotes: product?.baseNotes || '',
      };

      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PATCH' : 'POST';

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
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
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,5,15,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
      <div style={{ background: '#120e0a', borderRadius: '8px', border: '1px solid rgba(201,169,110,0.3)', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', color: 'var(--color-gold)' }}>
            {product ? 'Edit Product' : 'New Product'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Product Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Price (GH₵)</label>
              <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Size</label>
              <input value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} placeholder="e.g. 100ml" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Eau de Parfum" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Scent Family</label>
              <input required value={formData.scentFamily} onChange={e => setFormData({...formData, scentFamily: e.target.value})} placeholder="e.g. Floral" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Image URL</label>
            <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." style={inputStyle} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
            <label htmlFor="featured" style={{ color: 'white', fontSize: '0.9rem' }}>Feature on homepage?</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '0.5rem 1.5rem', background: 'var(--color-gold)', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
