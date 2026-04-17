import { CartProvider } from '@/lib/store/cart-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  );
}
