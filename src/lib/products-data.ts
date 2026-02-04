export interface ProductOption {
  name: string
  type: 'color'
  values: ProductOptionValue[]
}

export interface ProductOptionValue {
  name: string
  color: string
  image: string
}

export interface ProductVariant {
  id: string
  name: string
  slug: string
  description: string
  basePrice: number
  currency: string
  badge?: string
  images: {
    hero: string
    colorSelector: string
    necklaceDetail: string
    lifestyle: string
    packaging: string
  }
  imageDescriptions: {
    hero: string
    colorSelector: string
    necklaceDetail: string
    lifestyle: string
    packaging: string
  }
  options: ProductOption[]
  getImagesForColor: (colorName: string) => {
    hero: string
    colorSelector: string
    necklaceDetail: string
    lifestyle: string
    packaging: string
  }
}

const bearColorImages: Record<string, string> = {
  Red: 'rouge',
  Pink: 'rose',
  Blue: 'bleu',
  White: 'blanc',
  Purple: 'violet',
}

const boxColorImages: Record<string, string> = {
  Red: 'rouge',
  Pink: 'rose',
}

export const eternalRoseBear: ProductVariant = {
  id: 'eternal-rose-bear',
  name: 'Eternal Rose Bear with Engraved Necklace',
  slug: 'eternal-rose-bear',
  description: 'Your perfect eternal companion. A stunning rose bear paired with an engraved necklace, creating a timeless symbol of love and remembrance.',
  basePrice: 29.99,
  currency: 'USD',
  badge: 'Most Popular',
  images: {
    hero: '/products/rose-bear/rouge/1.png',
    colorSelector: '/products/rose-bear/rouge/2.png',
    necklaceDetail: '/products/rose-bear/rouge/3.png',
    lifestyle: '/products/rose-bear/rouge/4.png',
    packaging: '/products/rose-bear/rouge/5.png',
  },
  imageDescriptions: {
    hero: 'Your perfect eternal companion. A stunning rose bear paired with an engraved necklace, creating a timeless symbol of love and remembrance.',
    colorSelector: 'Choose your color. Available in Red, Pink, Blue, Purple, or White. Each teddy preserve the beauty of eternal roses.',
    necklaceDetail: 'Personalize your gift. Engrave your message on the silver necklace. Available in Gray, Gold, or Rose Gold finishes.',
    lifestyle: 'The perfect gift for someone special. Celebrate your love with a thoughtful, lasting present that tells your story.',
    packaging: 'Premium unboxing experience. Your Eternal Rose Bear arrives beautifully packaged, ready to give or cherish for yourself.',
  },
  options: [
    {
      name: 'Bear Color',
      type: 'color',
      values: [
        { name: 'Red', color: '#B71C1C', image: '/products/rose-bear/rouge/1.png' },
        { name: 'Pink', color: '#FF69B4', image: '/products/rose-bear/rose/1.png' },
        { name: 'Blue', color: '#4169E1', image: '/products/rose-bear/bleu/1.png' },
        { name: 'Purple', color: '#9370DB', image: '/products/rose-bear/violet/1.png' },
        { name: 'White', color: '#FFFFFF', image: '/products/rose-bear/blanc/1.png' },
      ],
    },
    {
      name: 'Necklace Color',
      type: 'color',
      values: [
        { name: 'Gray', color: '#A8A9AD', image: '/products/necklaces/gray.png' },
        { name: 'Gold', color: '#FFD700', image: '/products/necklaces/gold.png' },
        { name: 'Rose Gold', color: '#D4AF88', image: '/products/necklaces/rose-gold.png' },
      ],
    },
  ],
  getImagesForColor(colorName: string) {
    const folder = bearColorImages[colorName] || 'rouge'
    return {
      hero: `/products/rose-bear/${folder}/1.png`,
      colorSelector: `/products/rose-bear/${folder}/2.png`,
      necklaceDetail: `/products/rose-bear/${folder}/3.png`,
      lifestyle: `/products/rose-bear/${folder}/4.png`,
      packaging: `/products/rose-bear/${folder}/5.png`,
    }
  },
}

export const eternalRoseBox: ProductVariant = {
  id: 'eternal-rose-box',
  name: 'Eternal Rose Box with Engraved Necklace',
  slug: 'eternal-rose-box',
  description: 'Eternal luxury in a box. A stunning preserved rose arrangement paired with a personalized engraved necklace.',
  basePrice: 19.99,
  currency: 'USD',
  badge: 'Premium',
  images: {
    hero: '/products/rose-box/rouge/1.png',
    colorSelector: '/products/rose-box/rouge/2.png',
    necklaceDetail: '/products/rose-box/rouge/3.png',
    lifestyle: '/products/rose-box/rouge/4.png',
    packaging: '/products/rose-box/rouge/5.png',
  },
  imageDescriptions: {
    hero: 'Eternal luxury in a box. A stunning preserved rose arrangement paired with a personalized engraved necklace.',
    colorSelector: 'Choose your box. Available in elegant Red or romantic Pink. Each preserves the beauty of eternal roses for years.',
    necklaceDetail: 'Engrave your message. Silver necklace available in Gray, Gold, or Rose Gold to match your style.',
    lifestyle: 'Premium presentation. Your Eternal Rose Box arrives in luxury packaging, perfect for the most special moments.',
    packaging: 'A complete gift experience. Combine the eternal rose with a personalized necklace for an unforgettable present.',
  },
  options: [
    {
      name: 'Box Color',
      type: 'color',
      values: [
        { name: 'Red', color: '#B71C1C', image: '/products/rose-box/rouge/1.png' },
        { name: 'Pink', color: '#FF69B4', image: '/products/rose-box/rose/1.png' },
      ],
    },
    {
      name: 'Necklace Color',
      type: 'color',
      values: [
        { name: 'Gray', color: '#A8A9AD', image: '/products/necklaces/gray.png' },
        { name: 'Gold', color: '#FFD700', image: '/products/necklaces/gold.png' },
        { name: 'Rose Gold', color: '#D4AF88', image: '/products/necklaces/rose-gold.png' },
      ],
    },
  ],
  getImagesForColor(colorName: string) {
    const folder = boxColorImages[colorName] || 'rouge'
    return {
      hero: `/products/rose-box/${folder}/1.png`,
      colorSelector: `/products/rose-box/${folder}/2.png`,
      necklaceDetail: `/products/rose-box/${folder}/3.png`,
      lifestyle: `/products/rose-box/${folder}/4.png`,
      packaging: `/products/rose-box/${folder}/5.png`,
    }
  },
}

export const allProducts: ProductVariant[] = [eternalRoseBear, eternalRoseBox]

export function getProductBySlug(slug: string): ProductVariant | undefined {
  return allProducts.find((p) => p.slug === slug)
}
