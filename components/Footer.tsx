import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">VELOUR</div>
      <ul className="footer-links">
        <li>
          <Link href="/collection">Collection</Link>
        </li>
        <li>
          <Link href="/#story">Our Story</Link>
        </li>
        <li>
          <Link href="/#families">Boutique</Link>
        </li>
        <li>
          <Link href="/#contact">Contact</Link>
        </li>
      </ul>
      <div className="footer-copyright">
        © {new Date().getFullYear()} VELOUR PARIS. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
