# 🌟 VELOUR Luxury Perfume Shop

A high-end, luxury perfume e-commerce application built with Next.js 14, featuring a complete admin dashboard, database integration, and modern UI/UX.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Turso](https://img.shields.io/badge/Database-Turso-green)
![Tailwind CSS](https://img.shields.io/badge/Styling-CSS-blue)

## ✨ Features

### 🛍️ Customer Experience
- **Homepage**: Dynamic product showcase with "Load More" functionality
- **Product Collection**: Advanced filtering by category and scent family
- **Shopping Cart**: Persistent cart with local storage sync
- **Checkout**: Integrated Paystack payment processing
- **Responsive Design**: Mobile-first approach with smooth animations

### 🔧 Admin Dashboard
- **Product Management**: Full CRUD operations with pagination
- **Category Support**: Eau de Parfum, Extrait de Parfum, Mini Perfumes
- **Scent Families**: Floral, Woody, Oriental, Fresh, Gourmand
- **Search & Filter**: Advanced product search capabilities
- **Bulk Operations**: Efficient product management tools

### 🚀 Technical Features
- **Unlimited Products**: Scalable pagination system
- **Auto-Homepage Display**: All products automatically appear on homepage
- **Database Optimization**: Efficient queries with proper indexing
- **Error Handling**: Comprehensive error management
- **Form Validation**: Client and server-side validation
- **SEO Optimized**: Dynamic metadata and sitemap generation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React
- **Database**: Turso (libSQL) with Drizzle ORM
- **Payments**: Paystack API integration
- **Email**: Resend for order confirmations
- **Styling**: Vanilla CSS with custom design system
- **Animations**: Framer Motion, canvas-confetti
- **Notifications**: Sonner toast notifications

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/perfume-shop.git
   cd perfume-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database (Turso)
   TURSO_DATABASE_URL=your_turso_database_url
   TURSO_AUTH_TOKEN=your_turso_auth_token
   
   # Payments (Paystack)
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   
   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Database Setup**
   ```bash
   # Push schema to database
   npx drizzle-kit push
   
   # Seed categories
   npx tsx lib/db/seedCategories.ts
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Application**
   Visit [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
perfume-shop/
├── app/
│   ├── (shop)/                 # Customer-facing pages
│   │   ├── checkout/
│   │   ├── collection/
│   │   ├── sections/           # Homepage sections
│   │   └── page.tsx           # Homepage
│   ├── admin/                  # Admin dashboard
│   │   └── (dashboard)/
│   └── api/                    # API routes
│       ├── products/
│       ├── admin/
│       └── featured-products/
├── components/                 # Reusable components
│   ├── admin/
│   └── [various components]
├── lib/
│   ├── db/                     # Database configuration
│   ├── store/                  # State management
│   └── types/                  # TypeScript definitions
└── public/                     # Static assets
```

## 🎯 Usage

### Adding Products
1. Navigate to `/admin`
2. Click "New Product"
3. Fill in product details
4. Products automatically appear on homepage

### Categories Available
- **Eau de Parfum**: Signature concentration
- **Extrait de Parfum**: Highest concentration
- **Mini Perfumes**: Travel-sized luxury fragrances

### Scent Families
- Floral, Woody, Oriental, Fresh, Gourmand

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms
- Railway
- Netlify
- Any Node.js hosting platform

## 🔧 API Endpoints

- `GET /api/products` - Get all products with filtering
- `GET /api/featured-products` - Get products with pagination
- `GET /api/admin/products` - Admin product management
- `POST /api/admin/products` - Create new product
- `PATCH /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

© 2026 VELOUR PARIS. ALL RIGHTS RESERVED.

## 🙏 Acknowledgments

- Built with Next.js 14 and modern web technologies
- Database powered by Turso
- Payment processing by Paystack
- Email services by Resend

---

**Ready to launch your luxury perfume business!** 🌟