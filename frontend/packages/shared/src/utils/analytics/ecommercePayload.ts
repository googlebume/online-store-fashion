import type { ProductType } from '../types/prosuctData.type';

export const ECOMMERCE_CURRENCY = 'UAH';

function itemCategory(product: ProductType): string | undefined {
  const a = product.attributes as unknown;
  if (Array.isArray(a) && a[0] && typeof a[0] === 'object' && 'category' in a[0]) {
    return String((a[0] as { category?: string }).category);
  }
  if (a && typeof a === 'object' && 'category' in (a as object)) {
    return String((a as { category?: string }).category);
  }
  return undefined;
}

export function unitPrice(product: ProductType): number {
  const d = product.discount ?? 0;
  return d ? product.price * (1 - d / 100) : product.price;
}

export function lineValue(product: ProductType, quantity: number): number {
  return Math.round(unitPrice(product) * quantity * 100) / 100;
}

/** Рядок товару у форматі, зручному для GA4 / Firebase e-commerce. */
export function toGa4Item(product: ProductType, quantity: number) {
  const price = Math.round(unitPrice(product) * 100) / 100;
  const cat = itemCategory(product);
  return {
    item_id: product.id,
    item_name: product.name,
    item_brand: product.brand,
    price,
    quantity,
    ...(cat ? { item_category: cat } : {}),
  };
}

export function cartSummaryForAnalytics(items: (ProductType & { quantity: number })[]) {
  const gaItems = items.map((i) => toGa4Item(i, i.quantity));
  const value = Math.round(items.reduce((s, i) => s + lineValue(i, i.quantity), 0) * 100) / 100;
  return {
    currency: ECOMMERCE_CURRENCY,
    value,
    items: gaItems,
  };
}
