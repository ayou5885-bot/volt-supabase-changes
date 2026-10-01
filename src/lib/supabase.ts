import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/types/product';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Raw shape of a row coming back from the `products` table (snake_case columns).
export interface DbProduct {
  id: string;
  brand: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  image: string;
  short_description: string | null;
  description: string | null;
  specifications: { label: string; value: string }[] | null;
  features: string[] | null;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  featured: boolean;
  created_at?: string;
}

// Converts a raw Supabase row into the Product type already used across the app,
// so existing components don't need to change how they read product fields.
export function mapDbProductToProduct(row: DbProduct): Product {
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    slug: row.slug,
    category: row.category,
    price: Number(row.price),
    image: row.image,
    shortDescription: row.short_description ?? '',
    description: row.description ?? '',
    specifications: row.specifications ?? [],
    features: row.features ?? [],
    availability: row.availability,
    featured: row.featured,
  };
}
