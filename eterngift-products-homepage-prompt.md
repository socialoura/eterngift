# 🌹 PROMPT ETERNGIFT - Intégration 2 Produits + Homepage

Tu dois créer un site e-commerce **Next.js 14+ avec App Router** pour la marque **EternGift**.

**Objectif:** Implémenter 2 produits principaux avec options de couleurs customisables + homepage inspirée du design luxury Valentine's Day.

---

## 📦 PRODUIT 1: Ours Rose Éternelle Avec Collier Gravé

### Structure des Photos:

**Dossier principal:** `Ours Rose Éternelle Avec Collier Gravé`

**5 Couleurs d'Ours (chacune avec sous-dossier):**
- `Ours Rose Éternelle Avec Collier Gravé\Produit Rouge\` (photos 1-5)
- `Ours Rose Éternelle Avec Collier Gravé\Produit Rose\` (photos 1-5)
- `Ours Rose Éternelle Avec Collier Gravé\Produit Bleu\` (photos 1-5)
- `Ours Rose Éternelle Avec Collier Gravé\Produit Violet\` (photos 1-5)
- `Ours Rose Éternelle Avec Collier Gravé\Produit Blanc\` (photos 1-5)

**Couleurs de Collier (fichiers directs):**
- `Ours Rose Éternelle Avec Collier Gravé\collier_couleur_gris.jpeg`
- `Ours Rose Éternelle Avec Collier Gravé\collier_couleur_or.jpeg`
- `Ours Rose Éternelle Avec Collier Gravé\collier_couleur_rose.jpeg`

### Spécifications du Produit:

**Nom:** Eternal Rose Bear with Engraved Necklace

**Options (Variant System):**
1. **Bear Color** (obligatoire)
   - Red → use photo `2` from `Produit Rouge` folder
   - Pink → use photo `2` from `Produit Rose` folder
   - Blue → use photo `2` from `Produit Bleu` folder
   - Purple → use photo `2` from `Produit Violet` folder
   - White → use photo `2` from `Produit Blanc` folder

2. **Necklace Color** (obligatoire)
   - Gray → use `collier_couleur_gris.jpeg`
   - Gold → use `collier_couleur_or.jpeg`
   - Rose Gold → use `collier_couleur_rose.jpeg`

### Gallery Structure (Product Detail Page):

**Photo Display Order:**
- Photo 1: Hero image (main product view)
- Photo 2: Product variant selector image (different bear colors)
- Photo 3: Necklace detail/close-up
- Photo 4: Lifestyle/context shot
- Photo 5: Packaging/unboxing

**Description avec Photos Associées:**

```
Image 1 (Hero):
"Your perfect eternal companion. A stunning rose bear paired with an engraved necklace, 
creating a timeless symbol of love and remembrance."

Image 2 (Bear Color Selector):
"Choose your color. Available in Red, Pink, Blue, Purple, or White. 
Each teddy preserve the beauty of eternal roses."

Image 3 (Necklace Details):
"Personalize your gift. Engrave your message on the silver necklace. 
Available in Gray, Gold, or Rose Gold finishes."

Image 4 (Lifestyle):
"The perfect gift for someone special. Celebrate your love with 
a thoughtful, lasting present that tells your story."

Image 5 (Packaging):
"Premium unboxing experience. Your Eternal Rose Bear arrives beautifully 
packaged, ready to give or cherish for yourself."
```

---

## 📦 PRODUIT 2: Boîte Rose Éternelle Avec Collier Gravé

### Structure des Photos:

**Dossier principal:** `Boîte Rose Éternelle Avec Collier Gravé`

**2 Couleurs de Boîte (chacune avec sous-dossier):**
- `Boîte Rose Éternelle Avec Collier Gravé\Couleur Rouge\` (photos 1-5)
- `Boîte Rose Éternelle Avec Collier Gravé\Photos Produits Couleur Rose\` (photos 1-5)

**Couleurs de Collier (mêmes fichiers que Produit 1):**
- `Ours Rose Éternelle Avec Collier Gravé\collier_couleur_gris.jpeg`
- `Ours Rose Éternelle Avec Collier Gravé\collier_couleur_or.jpeg`
- `Ours Rose Éternelle Avec Collier Gravé\collier_couleur_rose.jpeg`

### Spécifications du Produit:

**Nom:** Eternal Rose Box with Engraved Necklace

**Options (Variant System):**
1. **Box Color** (obligatoire)
   - Red → use photo `2` from `Couleur Rouge` folder
   - Pink → use photo `2` from `Photos Produits Couleur Rose` folder

2. **Necklace Color** (obligatoire)
   - Gray → use `collier_couleur_gris.jpeg`
   - Gold → use `collier_couleur_or.jpeg`
   - Rose Gold → use `collier_couleur_rose.jpeg`

### Gallery Structure (Product Detail Page):

**Photo Display Order:**
- Photo 1: Hero image (full box display)
- Photo 2: Box color variant selector
- Photo 3: Necklace detail/close-up
- Photo 4: Unboxing/luxury presentation
- Photo 5: Complete set with styling

**Description avec Photos Associées:**

```
Image 1 (Hero):
"Eternal luxury in a box. A stunning preserved rose arrangement 
paired with a personalized engraved necklace."

Image 2 (Box Color Selector):
"Choose your box. Available in elegant Red or romantic Pink. 
Each preserves the beauty of eternal roses for years."

Image 3 (Necklace Details):
"Engrave your message. Silver necklace available in Gray, Gold, 
or Rose Gold to match your style."

Image 4 (Luxury Unboxing):
"Premium presentation. Your Eternal Rose Box arrives in luxury 
packaging, perfect for the most special moments."

Image 5 (Complete Set):
"A complete gift experience. Combine the eternal rose with 
a personalized necklace for an unforgettable present."
```

---

## 🎨 HOMEPAGE DESIGN - Inspire from Reference

**Design Reference:** 
- PSD: `Homepage\6494054.psd`
- Image: `Homepage\6494647.jpg`

### Homepage Structure:

#### **1. Hero Section (60% screen height)**

**Layout:** Image-focused hero with text overlay (matching Love Valentine theme)

**Background:**
- Gradient: Deep burgundy (#8B1538) to dark red (#B71C1C)
- Subtle texture overlay (luxury feel)

**Hero Image Integration:**
- Position ONE of your products (Eternal Rose Bear or Box) 
- Use photo `1` from the product gallery (hero image)
- Right-aligned (product takes 40-50% of hero)
- Natural lighting, premium presentation
- Smooth fade-in animation on page load

**Text Overlay (Left Side):**
```
Headline: "Express Your Love Forever"
Subheading: "Discover eternal roses and personalized gifts"
CTA Button: "Shop Now" → /products
Button Style: Outline white border, hover rose gold fill
```

**Typography:**
- Headline: Playfair Display, 48-64px, white
- Subheading: Inter, 18-20px, light rose (#FFE5E5)
- All text left-aligned, generous spacing

**Animations:**
- Text fade-in (0.8s ease-out, staggered)
- Product image slide-in from right (1.2s ease-out)
- Subtle glow around product image
- Parallax scroll effect (light)

---

#### **2. Featured Products Section (after hero, 100% width)**

**Section Title:** "Your Eternal Gifts"
- Font: Playfair Display, 42px, rose gold (#D4AF88)
- Centered, margin: 60px top/bottom

**Product Grid Layout:** 2 columns (desktop), 1 column (mobile)

**Product Card 1: Eternal Rose Bear**
- **Image:** Product `1` photo from each bear color variant (show RED bear as default)
- **Title:** "Eternal Rose Bear with Engraved Necklace"
- **Price:** $89.99 (display in client's currency, all prices in USD backend)
- **Quick Options:**
  - Bear Color: 5 color swatches (Red, Pink, Blue, Purple, White)
  - Necklace Color: 3 color swatches (Gray, Gold, Rose Gold)
- **CTA:** "View Details" or "Quick Add" button
- **Badge:** "⭐ Most Popular" or "💝 Best Seller"

**Product Card 2: Eternal Rose Box**
- **Image:** Product `1` photo from each box color variant (show RED box as default)
- **Title:** "Eternal Rose Box with Engraved Necklace"
- **Price:** $129.99
- **Quick Options:**
  - Box Color: 2 color swatches (Red, Pink)
  - Necklace Color: 3 color swatches (Gray, Gold, Rose Gold)
- **CTA:** "View Details" or "Quick Add" button
- **Badge:** "✨ Premium" or "🎁 Perfect Gift"

**Card Styling:**
- Background: White/cream (#F5F1ED)
- Border: Subtle rose gold accent border (1px, #D4AF88)
- Shadow: Soft shadow on hover, lift effect
- Hover: Slight scale (1.02x), shadow increase, smooth transition
- Responsive: Stack on mobile, side-by-side on desktop

---

#### **3. Why EternGift Section (optional, after products)**

**3-Column Feature List:**
- Column 1: "Eternal Quality" + icon (rose)
  - "Preserved to perfection, lasting forever"
- Column 2: "Personalized Love" + icon (heart)
  - "Engraved messages make each gift unique"
- Column 3: "Premium Packaging" + icon (gift box)
  - "Luxury presentation for special moments"

**Styling:**
- Background: Cream gradient (#F5F1ED to white)
- Icons: Rose gold color (#D4AF88)
- Text: Centered, readable

---

#### **4. Newsletter Section (optional, before footer)**

**CTA Copy:**
"Get 10% off your first order"

**Input:** Email field (placeholder: "your email...")
**Button:** "Subscribe" (red #B71C1C, hover rose gold)

**Styling:**
- Background: Soft rose (#FFE5E5)
- Centered layout, padding generous

---

#### **5. Footer**

**Links:** Home | Products | About | Contact
**Contact:** support@eterngift.com
**Social:** Instagram | TikTok | Pinterest icons
**Copyright:** "© 2026 EternGift. All rights reserved."

---

## 🎨 DESIGN SYSTEM - COLORS (STRICT)

```
Primary Colors:
- Deep Red: #8B1538 (hero background, dark elements)
- Primary Red: #B71C1C (buttons, accents)
- Rose Gold: #D4AF88 (luxury accents, hover states)
- White: #FFFFFF (text, contrast)

Secondary Colors:
- Light Pink: #FFE5E5 (subtle backgrounds)
- Cream: #F5F1ED (light backgrounds)
- Dark Gray: #333333 (text, contrast)

Necklace Color Swatches:
- Gray: #A8A9AD
- Gold: #FFD700
- Rose Gold: #D4AF88
```

---

## ⚙️ TECHNICAL IMPLEMENTATION

### Product Database Schema:

```javascript
// Product 1: Eternal Rose Bear
{
  id: "eternal-rose-bear",
  name: "Eternal Rose Bear with Engraved Necklace",
  description: "...",
  basePrice: 89.99,
  currency: "USD",
  images: [
    "/products/bear/hero.jpg", // photo 1
    "/products/bear/color-selector.jpg", // photo 2
    "/products/bear/necklace-detail.jpg", // photo 3
    "/products/bear/lifestyle.jpg", // photo 4
    "/products/bear/packaging.jpg" // photo 5
  ],
  options: [
    {
      name: "Bear Color",
      type: "color",
      values: [
        { name: "Red", color: "#B71C1C", image: "/bear/red-2.jpg" },
        { name: "Pink", color: "#FF69B4", image: "/bear/pink-2.jpg" },
        { name: "Blue", color: "#4169E1", image: "/bear/blue-2.jpg" },
        { name: "Purple", color: "#9370DB", image: "/bear/purple-2.jpg" },
        { name: "White", color: "#FFFFFF", image: "/bear/white-2.jpg" }
      ]
    },
    {
      name: "Necklace Color",
      type: "color",
      values: [
        { name: "Gray", color: "#A8A9AD", image: "/necklace/gray.jpeg" },
        { name: "Gold", color: "#FFD700", image: "/necklace/gold.jpeg" },
        { name: "Rose Gold", color: "#D4AF88", image: "/necklace/rose-gold.jpeg" }
      ]
    }
  ]
}

// Product 2: Eternal Rose Box (similar structure)
```

### Frontend Implementation:

1. **Product Page Structure:**
   - Image Gallery with variant switching
   - Option selectors (color swatches with preview)
   - Description with photo-associated text
   - "Add to Cart" with selected options
   - Price display (in user's currency, charged in USD)

2. **Homepage Product Cards:**
   - Fetch both products from database
   - Display hero images
   - Show color swatches with hover preview
   - Smooth transitions on option selection
   - Mobile-responsive grid

3. **Image Integration:**
   - All product images optimized (Next.js `<Image>` component)
   - Lazy loading for gallery
   - Responsive sizes (mobile, tablet, desktop)
   - WebP format with JPG fallback

---

## 📸 PHOTO MAPPING (EXACT)

**Eternal Rose Bear:**
- Bear Red: `/Ours Rose Éternelle Avec Collier Gravé/Produit Rouge/1.jpg` to `5.jpg`
- Bear Pink: `/Ours Rose Éternelle Avec Collier Gravé/Produit Rose/1.jpg` to `5.jpg`
- Bear Blue: `/Ours Rose Éternelle Avec Collier Gravé/Produit Bleu/1.jpg` to `5.jpg`
- Bear Purple: `/Ours Rose Éternelle Avec Collier Gravé/Produit Violet/1.jpg` to `5.jpg`
- Bear White: `/Ours Rose Éternelle Avec Collier Gravé/Produit Blanc/1.jpg` to `5.jpg`
- Necklace Gray: `/Ours Rose Éternelle Avec Collier Gravé/collier_couleur_gris.jpeg`
- Necklace Gold: `/Ours Rose Éternelle Avec Collier Gravé/collier_couleur_or.jpeg`
- Necklace Rose Gold: `/Ours Rose Éternelle Avec Collier Gravé/collier_couleur_rose.jpeg`

**Eternal Rose Box:**
- Box Red: `/Boîte Rose Éternelle Avec Collier Gravé/Couleur Rouge/1.jpg` to `5.jpg`
- Box Pink: `/Boîte Rose Éternelle Avec Collier Gravé/Photos Produits Couleur Rose/1.jpg` to `5.jpg`
- Necklace: (same as bear product)

---

## 🎯 HOMEPAGE INTEGRATION - SMOOTH & SEAMLESS

**Key Requirements:**

✅ **Visual Harmony:**
- Product images match hero aesthetic (same lighting, color grading)
- No jarring transitions between sections
- Consistent spacing and alignment

✅ **Responsive Design:**
- Hero product image scales beautifully on mobile
- Product cards stack naturally
- All text readable on small screens

✅ **Performance:**
- Image optimization critical (Lighthouse >85)
- Lazy load product images
- Smooth animations (no janky transitions)
- <3s load time target

✅ **User Experience:**
- Clear path from hero → product cards → details
- Hover states are obvious and smooth
- Option selection is intuitive
- CTAs are prominent but not aggressive

✅ **Brand Consistency:**
- All elements use EternGift design system
- Romantic, premium aesthetic throughout
- Luxury feel (spacing, typography, colors)
- No cheapness or overdecorated look

---

## 🚀 DELIVERABLES

You will create:

1. ✅ Homepage with hero, featured products, sections
2. ✅ Product detail pages for both items
3. ✅ Variant system (color options with images)
4. ✅ Image galleries (5 photos each, photo-associated descriptions)
5. ✅ Responsive design (mobile, tablet, desktop)
6. ✅ Design system compliance (colors, fonts, spacing)
7. ✅ Performance optimized (images, lazy loading, animations)
8. ✅ Smooth integrations (no jarring sections)

---

## 📝 FINAL NOTES

- Keep it **elegant and romantic**
- Focus on **product photography quality**
- Ensure **smooth visual flow** throughout
- Maintain **luxury brand positioning**
- Test extensively on **mobile devices**
- Use `Next.js <Image>` for all product photos
- Implement **variant switching** smoothly
- All animations should be **subtle and smooth**

**Your homepage should look like a premium, curated luxury brand – not a generic dropshipping site.** 🌹✨

