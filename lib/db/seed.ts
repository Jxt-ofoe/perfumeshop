import { db } from './index';
import { products } from './schema';

const perfumeProducts = [
  {
    name: "Nuit d'Or",
    slug: 'nuit-dor',
    description: 'A mesmerizing oriental composition that opens with luminous bergamot and precious saffron, unfolding into a rich heart of rose absolute and sacred olibanum. The base reveals deep vanilla and rare agarwood, creating an intoxicating trail that lingers through the night like liquid gold.',
    price: 28500,
    image: '/images/nuit-dor.jpg',
    category: 'Eau de Parfum',
    scentFamily: 'Oriental',
    topNotes: 'Bergamot, Saffron',
    heartNotes: 'Rose Absolute, Olibanum',
    baseNotes: 'Vanilla, Agarwood',
    size: '100ml',
    featured: true,
  },
  {
    name: 'Ombre Soie',
    slug: 'ombre-soie',
    description: 'An ethereal floral fragrance wrapped in powdery elegance. Pink pepper ignites the opening alongside sun-ripened fig, while the heart blooms with noble iris and intoxicating jasmine. The drydown reveals warm sandalwood enveloped in skin-like musk — pure silk on skin.',
    price: 24000,
    image: '/images/ombre-soie.jpg',
    category: 'Eau de Parfum',
    scentFamily: 'Floral',
    topNotes: 'Pink Pepper, Fig',
    heartNotes: 'Iris, Jasmine',
    baseNotes: 'Sandalwood, Musk',
    size: '100ml',
    featured: true,
  },
  {
    name: 'Bois Cendré',
    slug: 'bois-cendre',
    description: 'A sophisticated woody composition inspired by the embers of an ancient campfire. Warm cardamom and crisp cypress lead into a heart of deep vetiver and majestic cedar. The base reveals supple leather and luminous amber — a fragrance of quiet confidence.',
    price: 31000,
    image: '/images/bois-cendre.jpg',
    category: 'Extrait de Parfum',
    scentFamily: 'Woody',
    topNotes: 'Cardamom, Cypress',
    heartNotes: 'Vetiver, Cedar',
    baseNotes: 'Leather, Amber',
    size: '50ml',
    featured: true,
  },
  {
    name: 'Fleur Noire',
    slug: 'fleur-noire',
    description: 'A dark and hypnotic floral that defies convention. Blackcurrant and rare truffle create an unexpected opening, giving way to the mysterious allure of black orchid and sensuous ylang-ylang. The base wraps in earthy patchouli and bitter dark chocolate.',
    price: 26000,
    image: '/images/fleur-noire.jpg',
    category: 'Eau de Parfum',
    scentFamily: 'Floral',
    topNotes: 'Blackcurrant, Truffle',
    heartNotes: 'Black Orchid, Ylang-Ylang',
    baseNotes: 'Patchouli, Dark Chocolate',
    size: '100ml',
    featured: true,
  },
  {
    name: 'Écume de Mer',
    slug: 'ecume-de-mer',
    description: 'The Mediterranean at golden hour captured in a flacon. Crystalline sea salt and sparkling grapefruit evoke coastal breezes, while the heart of wild sage and bitter orange neroli adds herbal warmth. Ambrette seed and sun-bleached driftwood linger on the skin.',
    price: 22500,
    image: '/images/ecume-de-mer.jpg',
    category: 'Eau de Parfum',
    scentFamily: 'Fresh',
    topNotes: 'Sea Salt, Grapefruit',
    heartNotes: 'Sage, Neroli',
    baseNotes: 'Ambrette, Driftwood',
    size: '100ml',
    featured: true,
  },
  {
    name: 'Ambre Mystique',
    slug: 'ambre-mystique',
    description: 'An opulent oriental amber that transports you to ancient spice markets. Warm coriander and glowing cinnamon open the composition, revealing a resinous heart of sacred myrrh and labdanum. Tonka bean and benzoin form a velvety base that feels like cashmere.',
    price: 29500,
    image: '/images/ambre-mystique.jpg',
    category: 'Extrait de Parfum',
    scentFamily: 'Oriental',
    topNotes: 'Coriander, Cinnamon',
    heartNotes: 'Myrrh, Labdanum',
    baseNotes: 'Tonka Bean, Benzoin',
    size: '50ml',
    featured: true,
  },
  {
    name: 'Jardin Givré',
    slug: 'jardin-givre',
    description: 'A frost-kissed garden at dawn. Effervescent yuzu and garden mint create an invigorating opening, while green tea and crushed violet leaf bring a meditative calm. White musk and oakmoss ground the composition with earthy freshness.',
    price: 21000,
    image: '/images/jardin-givre.jpg',
    category: 'Eau de Parfum',
    scentFamily: 'Fresh',
    topNotes: 'Yuzu, Mint',
    heartNotes: 'Green Tea, Violet Leaf',
    baseNotes: 'White Musk, Oakmoss',
    size: '100ml',
    featured: false,
  },
  {
    name: 'Velours Sucré',
    slug: 'velours-sucre',
    description: 'An indulgent gourmand creation that blurs the line between fragrance and dessert. Buttery caramel and toasted hazelnut open with irresistible sweetness, while vanilla bourbon and artisanal praline form the decadent heart. Benzoin and cashmeran create a cozy, enveloping drydown.',
    price: 23000,
    image: '/images/velours-sucre.jpg',
    category: 'Eau de Parfum',
    scentFamily: 'Gourmand',
    topNotes: 'Caramel, Hazelnut',
    heartNotes: 'Vanilla Bourbon, Praline',
    baseNotes: 'Benzoin, Cashmeran',
    size: '100ml',
    featured: false,
  },
  {
    name: 'Rose Immortelle',
    slug: 'rose-immortelle',
    description: 'A timeless ode to the queen of flowers. Bulgarian rose and Turkish rose otto intertwine in a lush, romantic heart, supported by dewy peony and a whisper of pink pepper. Oud wood and ambergris add depth and longevity to this floral masterpiece.',
    price: 34500,
    image: '/images/rose-immortelle.jpg',
    category: 'Extrait de Parfum',
    scentFamily: 'Floral',
    topNotes: 'Pink Pepper, Bergamot',
    heartNotes: 'Bulgarian Rose, Turkish Rose Otto',
    baseNotes: 'Oud Wood, Ambergris',
    size: '50ml',
    featured: false,
  },
  {
    name: 'Cuir Céleste',
    slug: 'cuir-celeste',
    description: 'Celestial leather — a paradox perfected. Birch tar and smoky incense create a dramatic opening, while a heart of supple suede and powdery iris softens the intensity. The base of sandalwood and white amber adds ethereal warmth to this darkly beautiful creation.',
    price: 32000,
    image: '/images/cuir-celeste.jpg',
    category: 'Extrait de Parfum',
    scentFamily: 'Woody',
    topNotes: 'Birch Tar, Incense',
    heartNotes: 'Suede, Iris',
    baseNotes: 'Sandalwood, White Amber',
    size: '50ml',
    featured: false,
  },
  {
    name: 'Thé Fumé',
    slug: 'the-fume',
    description: 'A contemplative composition inspired by a Kyoto tea ceremony. Smoked lapsang souchong and crisp bergamot create an aromatic beginning, while osmanthus and jasmine sambac add floral sweetness. The base of sandalwood and vetiver grounds this meditative creation.',
    price: 27000,
    image: '/images/the-fume.jpg',
    category: 'Eau de Parfum',
    scentFamily: 'Woody',
    topNotes: 'Lapsang Souchong, Bergamot',
    heartNotes: 'Osmanthus, Jasmine Sambac',
    baseNotes: 'Sandalwood, Vetiver',
    size: '100ml',
    featured: false,
  },
  {
    name: 'Lune de Miel',
    slug: 'lune-de-miel',
    description: 'A warm and sensual gourmand inspired by a moonlit honeymoon. Candied orange and wild honey create a golden opening, while tuberose and heliotrope add narcotic floral sweetness. The base of sandalwood, vanilla, and beeswax creates an intimate, skin-scent dry down.',
    price: 25500,
    image: '/images/lune-de-miel.jpg',
    category: 'Eau de Parfum',
    scentFamily: 'Gourmand',
    topNotes: 'Candied Orange, Wild Honey',
    heartNotes: 'Tuberose, Heliotrope',
    baseNotes: 'Sandalwood, Beeswax',
    size: '100ml',
    featured: false,
  },
];

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing products
  await db.delete(products);

  // Insert all products
  for (const product of perfumeProducts) {
    await db.insert(products).values(product);
    console.log(`  ✓ Added: ${product.name}`);
  }

  console.log(`\n✅ Successfully seeded ${perfumeProducts.length} products.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
