import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categorySettings } from '@/lib/db/schema';

const initialSettings = [
  // Categories (Concentrations)
  {
    name: 'Eau de Parfum',
    slug: 'eau-de-parfum',
    description: 'Our signature concentration, offering a perfect balance of sillage and longevity for everyday luxury.',
    type: 'category',
    displayOrder: 1,
  },
  {
    name: 'Extrait de Parfum',
    slug: 'extrait-de-parfum',
    description: 'The highest concentration of pure perfume oil, reserved for our most opulent and enduring creations.',
    type: 'category',
    displayOrder: 2,
  },
  {
    name: 'Mini Perfumes',
    slug: 'mini-perfumes',
    description: 'Perfectly sized luxury fragrances for travel, gifting, or discovering new scents.',
    type: 'category',
    displayOrder: 3,
  },

  // Scent Families
  {
    name: 'Floral',
    slug: 'floral',
    description: 'From dewy petals to narcotic blooms, our floral masterpieces capture nature in its most romantic abstraction.',
    type: 'scent_family',
    displayOrder: 1,
  },
  {
    name: 'Woody',
    slug: 'woody',
    description: 'Deep, resonant, and mysterious. Featuring rare roots, resins, and sustainably harvested woods.',
    type: 'scent_family',
    displayOrder: 2,
  },
  {
    name: 'Oriental',
    slug: 'oriental',
    description: 'A rich tapestry of ancient spices, sacred incenses, and warm ambers that transport the senses.',
    type: 'scent_family',
    displayOrder: 3,
  },
  {
    name: 'Fresh',
    slug: 'fresh',
    description: 'Invigorating citruses, coastal herbs, and aquatic notes that evoke brilliant mornings and sea breezes.',
    type: 'scent_family',
    displayOrder: 4,
  },
  {
    name: 'Gourmand',
    slug: 'gourmand',
    description: 'Edible, sensual indulgence. Decadent notes of vanilla, caramel, and praline melting upon the skin.',
    type: 'scent_family',
    displayOrder: 5,
  },
];

export async function POST() {
  try {
    // Clear existing categories
    await db.delete(categorySettings);

    // Insert new categories
    for (const setting of initialSettings) {
      await db.insert(categorySettings).values(setting);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${initialSettings.length} categories including Mini Perfumes` 
    });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json({ 
      error: 'Failed to seed categories' 
    }, { status: 500 });
  }
}