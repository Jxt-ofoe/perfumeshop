'use client';

import { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#c9a96e', '#d8bd8a', '#ead5b1', '#f5f0e8', '#ffffff'];

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30d'); // 7d, 30d, 90d, 12m

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const json = await res.json();
      setData(json);
    } catch {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => `GH₵${(val / 100).toFixed(2)}`;

  if (loading && !data) {
    return <div style={{ color: 'rgba(245,240,232,0.6)' }}>Loading terminal data...</div>;
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Command Center</h1>
        <select 
          value={range} 
          onChange={(e) => setRange(e.target.value)}
          style={{
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            border: '1px solid rgba(201,169,110,0.3)',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontFamily: 'inherit'
          }}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="12m">Last 12 Months</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="admin-card">
          <p style={{ color: 'rgba(245,240,232,0.6)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Revenue</p>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem', color: 'var(--color-gold)' }}>
            {formatCurrency(data?.summary?.revenue || 0)}
          </p>
        </div>
        <div className="admin-card">
          <p style={{ color: 'rgba(245,240,232,0.6)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Successful Orders</p>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem', color: '#f5f0e8' }}>
            {data?.summary?.orders || 0}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Revenue Line Chart */}
        <div className="admin-card">
          <h2 style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--color-gold)', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Revenue Over Time</h2>
          <div style={{ height: '300px' }}>
            {data?.revenueOverTime?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.revenueOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickMargin={10} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickFormatter={(val) => `GH₵${val/100}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#120e0a', borderColor: 'rgba(201,169,110,0.3)', color: '#f5f0e8' }}
                    formatter={(value: any) => [formatCurrency(value || 0), 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={2} dot={{ r: 4, fill: '#c9a96e' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,240,232,0.4)' }}>
                No revenue data for this period
              </div>
            )}
          </div>
        </div>

        {/* Top Products Bar Chart */}
        <div className="admin-card">
          <h2 style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--color-gold)', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Top Products by Revenue</h2>
          <div style={{ height: '300px' }}>
             {data?.topProducts?.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topProducts} layout="vertical" margin={{ left: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} tickFormatter={(val) => `GH₵${val/100}`} />
                  <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.8)" fontSize={12} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#120e0a', borderColor: 'rgba(201,169,110,0.3)', color: '#f5f0e8' }}
                    formatter={(value: any) => [formatCurrency(value || 0), 'Revenue']}
                  />
                  <Bar dataKey="total_revenue" fill="#c9a96e" radius={[0, 4, 4, 0]}>
                    {data.topProducts.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
             ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,240,232,0.4)' }}>
                No product data for this period
              </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
