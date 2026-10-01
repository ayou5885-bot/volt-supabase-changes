import { useEffect, useState } from 'react';
import { supabase, mapDbProductToProduct, type DbProduct } from '@/lib/supabase';
import type { Product } from '@/types/product';

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export function useProduct(slug: string | undefined): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setProduct(null);
      } else {
        setProduct(data ? mapDbProductToProduct(data as DbProduct) : null);
      }

      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, loading, error };
}
