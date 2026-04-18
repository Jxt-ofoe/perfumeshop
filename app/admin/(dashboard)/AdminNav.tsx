'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // We can clear the cookie by making a request to an endpoint,
    // or just clearing it with JS if it wasn't HttpOnly... wait, it is HttpOnly.
    // Let's clear it via a quick API route or just tell the browser to expire it.
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <>
      <aside className="admin-sidebar">
        <div className="admin-logo">CHARLENE LUXE</div>
        <nav className="admin-nav-links" style={{ flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`admin-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="admin-nav-links" style={{ paddingBottom: '1rem' }}>
          <button 
            onClick={handleLogout}
            className="admin-nav-link" 
            style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      <nav className="admin-bottom-tab">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`admin-tab-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={24} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button 
          onClick={handleLogout}
          className="admin-tab-link" 
          style={{ border: 'none', background: 'transparent' }}
        >
          <LogOut size={24} />
          <span>Exit</span>
        </button>
      </nav>
    </>
  );
}
