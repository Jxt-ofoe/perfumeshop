import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  price: integer('price').notNull(), // in kobo (smallest currency unit)
  image: text('image').notNull().default('/images/bottle-placeholder.jpg'),
  category: text('category').notNull(), // Eau de Parfum, Extrait de Parfum
  scentFamily: text('scent_family').notNull(), // Floral, Woody, Oriental, Fresh, Gourmand
  topNotes: text('top_notes').notNull(),
  heartNotes: text('heart_notes').notNull(),
  baseNotes: text('base_notes').notNull(),
  size: text('size').notNull().default('100ml'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  reference: text('reference').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  totalAmount: integer('total_amount').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id),
  productId: integer('product_id').notNull(),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
});

export const categorySettings = sqliteTable('category_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(), // The actual string used in products, e.g. "Floral" or "Eau de Parfum"
  slug: text('slug').notNull().unique(),
  description: text('description'),
  type: text('type').notNull(), // 'scent_family' or 'category'
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  displayOrder: integer('display_order').notNull().default(0),
});

// Type exports from schema
export type CategorySettingInsert = typeof categorySettings.$inferInsert;
export type CategorySettingSelect = typeof categorySettings.$inferSelect;
export type ProductInsert = typeof products.$inferInsert;
export type ProductSelect = typeof products.$inferSelect;
export type OrderInsert = typeof orders.$inferInsert;
export type OrderSelect = typeof orders.$inferSelect;
export type OrderItemInsert = typeof orderItems.$inferInsert;
export type OrderItemSelect = typeof orderItems.$inferSelect;
