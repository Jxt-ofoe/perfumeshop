import * as React from 'react';

interface OrderConfirmationEmailProps {
  orderReference: string;
  firstName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  deliveryAddress: string;
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  orderReference,
  firstName,
  items,
  totalAmount,
  deliveryAddress,
}) => {
  const formatPrice = (cents: number) => `GH₵${(cents / 100).toFixed(2)}`;

  return (
    <div style={{ fontFamily: 'Jost, sans-serif', color: '#0a0805', maxWidth: '600px', margin: '0 auto', border: '1px solid #e0d5c1' }}>
      <div style={{ backgroundColor: '#0a0805', padding: '30px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#c9a96e', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, fontWeight: 400 }}>
          CHARLENE LUXE
        </h1>
      </div>
      
      <div style={{ padding: '40px 30px', backgroundColor: '#fdfbf9' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', fontStyle: 'italic', color: '#0a0805', marginTop: 0 }}>
          Thank you for your order, {firstName}.
        </h2>
        
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#4a443a' }}>
          We have received your order and are preparing it for shipment. Your order reference is <strong>{orderReference}</strong>.
        </p>

        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', borderBottom: '1px solid #e0d5c1', paddingBottom: '10px' }}>
            Order Details
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', fontSize: '12px', color: '#8a847a', paddingBottom: '10px' }}>ITEM</th>
                <th style={{ textAlign: 'center', fontSize: '12px', color: '#8a847a', paddingBottom: '10px' }}>QTY</th>
                <th style={{ textAlign: 'right', fontSize: '12px', color: '#8a847a', paddingBottom: '10px' }}>PRICE</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '15px 0', borderBottom: '1px solid #f0eae1', fontSize: '14px' }}>{item.name}</td>
                  <td style={{ padding: '15px 0', borderBottom: '1px solid #f0eae1', fontSize: '14px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '15px 0', borderBottom: '1px solid #f0eae1', fontSize: '14px', textAlign: 'right' }}>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} style={{ padding: '20px 0 0', fontWeight: 'bold' }}>Total</td>
                <td style={{ padding: '20px 0 0', fontWeight: 'bold', textAlign: 'right', color: '#c9a96e' }}>{formatPrice(totalAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ backgroundColor: '#f5f0e8', padding: '20px', borderLeft: '3px solid #c9a96e' }}>
          <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a847a', margin: '0 0 10px 0' }}>
            Delivery To
          </h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#0a0805' }}>
            {deliveryAddress}
          </p>
        </div>
      </div>
      
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#0a0805', color: 'rgba(245,240,232,0.5)', fontSize: '11px', letterSpacing: '0.1em' }}>
        © {new Date().getFullYear()} CHARLENE LUXE PARIS. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
};
