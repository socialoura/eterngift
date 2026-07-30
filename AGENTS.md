# AGENTS.md — EternGift

> Contexte de travail pour agents IA. Généré à partir de l'analyse réelle du code (juillet 2026). En cas de doute, **le code fait foi**, pas les autres `.md` du repo (voir section « Incohérences doc vs code »).

## 1. Vue rapide

EternGift est une boutique e-commerce mono-produit (2 SKU : « Eternal Rose Bear » et « Eternal Rose Box », ours/boîte de roses éternelles avec collier gravé personnalisable). Next.js 14 App Router, déployé sur Vercel, paiement Stripe + PayPal en modal (sans redirection), prix affichés en devise locale mais **toujours facturés en USD**, notifications de commande par email (Resend) et webhook Discord, dashboard admin maison.

## 2. Stack technique

- **Framework** : Next.js `^14.2.35` (App Router) + React 18 + TypeScript 5
- **Styling** : Tailwind CSS 3, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `framer-motion`
- **État client** : Zustand 5 (`src/store/cart.ts` avec `persist` localStorage, `src/store/currency.ts`)
- **DB** : PostgreSQL (Vercel Postgres / Neon). **Accès réel = SQL brut via `@vercel/postgres` (`sql` tag)**. Prisma 7 est installé et `prisma/schema.prisma` existe, mais **le client Prisma n'est importé nulle part** — il ne sert qu'à décrire/pousser le schéma (`db push` via `prisma.config.ts`).
- **Paiements** : `stripe` (+ `@stripe/react-stripe-js`, Payment Element), `@paypal/react-paypal-js` + API REST PayPal v2
- **Email** : `resend` (PAS SendGrid, contrairement à `.env.example`)
- **Charts admin** : `recharts`
- **i18n** : maison, 5 locales `en/fr/es/de/it` (`src/lib/i18n/`), middleware de redirection locale + devise
- **Analytics** : `@vercel/analytics`, `@vercel/speed-insights`, Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`, fallback en dur `1434519064736453` dans `layout.tsx` — c'est un identifiant public, pas un secret)
- **Dépendances mortes** : `jsonwebtoken`, `jose`, `bcryptjs`, `@types/*` associés, `dinero.js`, `zod`, `react-hook-form`, `@hookform/resolvers` — installés mais non utilisés dans les flux critiques. L'auth admin n'utilise **pas** JWT (voir §7).

## 3. Structure des dossiers

```
src/
├── middleware.ts              # Redirection vers /<locale>/… + cookies devise/locale
├── app/
│   ├── layout.tsx             # Root layout : fonts, Meta Pixel, Vercel Analytics
│   ├── page.tsx               # Racine (redirigée par le middleware)
│   ├── sitemap.ts, loading.tsx, not-found.tsx, globals.css
│   ├── [lang]/                # TOUTES les pages publiques sont sous /<locale>/
│   │   ├── page.tsx           # Homepage
│   │   ├── products/page.tsx, products/[id]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── order-confirmation/page.tsx
│   │   ├── collections/, faq/, contact/
│   │   └── layout.tsx         # I18nProvider + Header/Footer
│   ├── admin/
│   │   ├── page.tsx           # Login admin (POST /api/admin/login)
│   │   └── dashboard/page.tsx # Dashboard, onglets: products | orders | analytics | settings | promo
│   └── api/                   # 21 routes API (voir §6)
├── components/
│   ├── checkout/              # PaymentModal, QuickBuyModal, StripeCardForm, PayPalButtonWrapper
│   ├── home/                  # Sections homepage (Hero, FeaturedProducts, Testimonials…)
│   ├── products/, layout/, ui/
│   ├── admin/                 # ProductsTab, OrdersTab, AnalyticsDashboard, SettingsTab, PromoTab
│   └── providers/             # I18nProvider, MotionProvider
├── hooks/                     # useStorefrontProducts, useProductPrices, useIsMobile
├── lib/
│   ├── db.ts                  # ⚠️ TOUT l'accès DB (SQL brut @vercel/postgres) + initDatabase()
│   ├── email.ts               # Resend (confirmation) + webhook Discord
│   ├── admin-auth.ts          # Vérif token admin (base64 JSON, pas JWT)
│   ├── products-data.ts       # Catalogue statique des 2 produits (variants, couleurs, images)
│   ├── currency.ts            # Conversion de devises côté client
│   ├── i18n/                  # config + dictionnaires JSON (en/fr/es/de/it)
│   ├── prisma.ts              # Client Prisma — INUTILISÉ
│   ├── utils.ts               # cn(), generateOrderNumber() → "EG-<base36>-<rand>"
│   └── types.ts, fonts.ts
├── store/                     # cart.ts (persisté), currency.ts
prisma/
└── schema.prisma              # Schéma de référence réel (users, products, orders, order_items, currency_rates)
public/products/               # Images produits par couleur (rouge/rose/bleu/blanc/violet)
Homepage/, Ours Rose …/        # Assets sources (PSD/JPG/PNG), pas du code
```

Fichiers racine notables : `README.md`, `ADMIN_DASHBOARD.md` (**obsolète**, voir §10), `eterngift-prompt.md` / `eterngift-products-homepage-prompt.md` (prompts de génération initiaux), `ilyes-belkadi_*.json` (CV exporté, sans rapport avec l'app), `logo.png`, `product-homepage*.png`, `paypal.svg`.

## 4. Points d'entrée

- **App publique** : `src/middleware.ts` redirige `/…` → `/<locale>/…` (détection `Accept-Language`, cookie `user-selected-locale` prioritaire si choix manuel) et pose les cookies `preferred-locale` / `preferred-currency` (devise **toujours synchronisée sur la locale** : en→USD, fr/es/de/it→EUR).
- **Pages** : `src/app/[lang]/layout.tsx` → `page.tsx` et sous-pages.
- **Admin** : `/admin` (login) → `/admin/dashboard`. Le middleware exclut `/admin` de la redirection de locale.
- **API** : `src/app/api/**/route.ts`.
- **Scripts npm** : `dev` (next dev), `build` (`prisma generate && next build`), `start`, `lint` (next lint), `postinstall` (`prisma generate`).

## 5. Logique métier — flux critiques

### Catalogue & prix
- Le catalogue « riche » (couleurs, gravures, images) est **statique** dans `src/lib/products-data.ts` (2 produits : `eternal-rose-bear` 29,99 $, `eternal-rose-box` 19,99 $ — prix de fallback).
- Les prix/stocks réels viennent de la DB table `products` (schéma Prisma, IDs numériques **1 = bear, 2 = box**, mapping en dur dans le code) via :
  - `GET /api/storefront/products` (prix + stock)
  - `GET /api/products/prices`
  - Hooks `useStorefrontProducts` / `useProductPrices`, avec fallback sur les prix statiques si la DB échoue.

### Devises
- `GET /api/currency/rates` : taux via exchangerate-api.com (clé `NEXT_PUBLIC_EXCHANGE_RATE_API_KEY`), cache mémoire 10 min, sinon `FALLBACK_RATES` en dur (EUR 0.92, GBP 0.79, …).
- Affichage en devise locale partout ; **facturation en USD** (`totalUsd` envoyé tel quel aux PSP).

### Checkout Stripe (modal)
1. `StripeCardForm` → `GET /api/stripe/publishable-key` (clé publique : env `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` sinon table `settings`).
2. `POST /api/stripe/create-payment-intent` `{ totalUsd, currency }` → PaymentIntent (clé secrète : env `STRIPE_SECRET_KEY` sinon table `settings`).
3. Confirmation carte côté client (Payment Element).
4. `POST /api/checkout` `{ items, shippingInfo, totalUsd, currency, paymentMethod:'stripe', paymentIntentId }` → le serveur **revérifie** que le PaymentIntent est `succeeded`, puis : `createOrder()` (SQL), email Resend, notification Discord. ⚠️ Si l'insert DB échoue, la commande est quand même confirmée au client (log seulement).

### Checkout PayPal (modal)
1. `PayPalButtonWrapper` → `POST /api/paypal/create-order` `{ totalUsd, items, shippingInfo }` → ordre PayPal v2 (`intent: CAPTURE`). ⚠️ Les `return_url`/`cancel_url` pointent vers `/api/paypal/capture` et `/checkout` **sans locale** — restes d'un flux redirect, mais le SDK boutons n'utilise pas ces URLs.
2. Approbation dans la popup PayPal.
3. `POST /api/paypal/capture-order` `{ paypalOrderId, items, shippingInfo, totalUsd, currency }` → capture, vérif `status === 'COMPLETED'`, puis même finalisation que Stripe (createOrder + email + Discord).
- Il existe aussi `POST /api/paypal/checkout` qui crée la commande **sans capture ni vérification** — route legacy/risquée (commande en DB sans paiement confirmé). Vérifier avant usage ; ne pas l'utiliser pour un nouveau flux.

### Commande
- `generateOrderNumber()` → `EG-<timestamp base36>-<rand>` (`src/lib/utils.ts`).
- `createOrder()` (`src/lib/db.ts`) insère dans `orders` (colonnes du **schéma Prisma** : `order_number`, `customer_email`, `total_usd`, …, statut `'confirmed'`, `email_sent`/`discord_notified` = true) puis les `order_items` en mappant les slugs → IDs numériques (bear→1, box→2, **défaut 1**).
- Livraison : pas de flux de livraison/fulfillment dans le code — email « Estimated delivery: 5-7 business days » en dur, livraison « FREE » en dur, pas de tracking.
- Codes promo : CRUD admin + table `promo_codes`, mais **aucune route checkout n'applique de promo** (le toggle `promo_field_enabled` n'affecte que l'affichage).

### Admin
- Login `POST /api/admin/login` avec `ADMIN_USERNAME`/`ADMIN_PASSWORD` (env). Token = **base64(JSON {username, role:'admin', exp: now+24h})** — non signé, forgeable par quiconque (voir §9).
- Dashboard (`/admin/dashboard`) : onglets **products | orders | analytics | settings | promo**. Token lu de `localStorage.adminToken`, envoyé en `Authorization: Bearer`.
- Settings Stripe : clés stockées en clair dans la table `settings` (`stripe_secret_key`, `stripe_publishable_key`) ; l'env a priorité à la lecture (`getStripeSecretKey`).
- Change password (`POST /api/admin/change-password`) : **stub no-op** — vérifie le mot de passe actuel mais ne persiste rien (renvoie « update ADMIN_PASSWORD in environment variables »).

## 6. Routes API (21 fichiers de route)

| Route | Méthodes | Auth admin | Rôle |
|---|---|---|---|
| `/api/checkout` | POST | non | Finalisation commande Stripe (vérif PaymentIntent + DB + email + Discord) |
| `/api/stripe/create-payment-intent` | POST | non | Crée le PaymentIntent |
| `/api/stripe/publishable-key` | GET | non | Expose la clé publique Stripe |
| `/api/paypal/create-order` | POST | non | Crée l'ordre PayPal v2 |
| `/api/paypal/capture-order` | POST | non | Capture + finalisation commande PayPal |
| `/api/paypal/checkout` | POST | non | ⚠️ Legacy : crée une commande sans paiement vérifié |
| `/api/products` | GET, POST | non | ⚠️ Mock : 4 produits factices en dur (Unsplash), tableau en mémoire |
| `/api/products/prices` | GET | non | Prix DB (IDs 1/2 → slugs) + fallback |
| `/api/storefront/products` | GET | non | Prix + stock DB + fallback |
| `/api/currency/rates` | GET | non | Taux de change (cache 10 min + fallback) |
| `/api/admin/login` | POST | — | Login admin |
| `/api/admin/change-password` | POST | oui | Stub no-op |
| `/api/admin/products` | GET | oui | Liste produits (SQL brut) |
| `/api/admin/products/[productId]` | PUT | oui | Maj prix/stock produit |
| `/api/admin/seed-products` | GET, POST | oui | Seed des 2 produits (IDs 1/2) si table vide |
| `/api/admin/orders` | GET | oui | Liste commandes |
| `/api/admin/orders/[orderId]` | PUT, DELETE | oui | Maj/suppression commande (⚠️ voir §10) |
| `/api/admin/stripe-settings` | GET, PUT | oui | Clés Stripe en table `settings` |
| `/api/admin/stripe-settings/test` | POST | oui | Test de connexion Stripe |
| `/api/admin/promo-settings` | GET, PUT | oui | Toggle champ promo (clé `promo_field_enabled`) |
| `/api/admin/promo-codes` + `/[code]` | GET, POST, PUT, DELETE | oui | CRUD codes promo |
| `/api/admin/google-ads-expenses` + `/[month]` | GET, POST, PUT, DELETE | oui | Dépenses pubs par mois `YYYY-MM` |

Toutes les routes admin (sauf login) vérifient le token via `verifyAdminToken()`.

## 7. Base de données — schéma réel

**Source de vérité déclarée** : `prisma/schema.prisma` (PostgreSQL). Pas de dossier `prisma/migrations` (gitignored, jamais commité) — le schéma est poussé par `prisma db push` (URL : `POSTGRES_URL_NO_SSL` via `prisma.config.ts`).

Tables Prisma :
- `users` (id, email unique, password, name?, role='admin', timestamps) — **inutilisée** par le code
- `products` (id serial, name, description?, **price_usd** Decimal(10,2), image_url?, images_url String[], category?, stock=0, rating?, review_count=0, status='active', badge?)
- `orders` (id serial, **order_number** unique, customer_email, customer_name, customer_currency='USD', subtotal_usd, tax_usd=0, total_usd, total_displayed?, exchange_rate?, shipping_address_street/city/postal/country?, payment_method, payment_id?, status='pending', email_sent=false, discord_notified=false)
- `order_items` (id, order_id→orders cascade, product_id→products, product_name, price_usd, quantity, total_usd)
- `currency_rates` (currency unique, rate) — **inutilisée** (les taux viennent de l'API externe)

⚠️ **Double schéma conflictuel** : `initDatabase()` dans `src/lib/db.ts` (appelé au chargement de certaines routes admin) crée **d'autres tables** incompatibles — `admin_users`, `products(id TEXT, base_price)`, `product_variants`, `orders(order_id TEXT PK, price, cost, notes, promo_code, discount_amount)`, `order_items(id TEXT, rose_color, necklace_color)`, `settings`, `promo_codes`, `google_ads_expenses`. Ces tables « legacy » coexistent avec le schéma Prisma sur la même base : `settings`, `promo_codes`, `google_ads_expenses` sont réellement utilisées (elles n'existent pas dans le schéma Prisma), tandis que `products`/`orders`/`order_items` legacy entrent en conflit de définition avec le schéma Prisma. En pratique, les routes écrivent au **format Prisma** ; si `initDatabase()` crée les tables en premier sur une base vierge, les inserts Prisma-format échouent.

## 8. Variables d'environnement

Réellement lues par le code (`grep process.env`) :

| Variable | Usage | Où |
|---|---|---|
| `POSTGRES_URL` (+ `POSTGRES_URL_NO_SSL`, `POSTGRES_*`) | Connexion DB (`@vercel/postgres` auto ; `NO_SSL` pour Prisma CLI) | implicite + `prisma.config.ts` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (prioritaire sur table settings) | `db.ts` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe | `db.ts`, StripeCardForm |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | OAuth PayPal serveur | routes paypal |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | SDK boutons PayPal | PayPalButtonWrapper |
| `RESEND_API_KEY` | Envoi emails (sinon skip silencieux) | `email.ts` |
| `RESEND_FROM_EMAIL` | From: (défaut `EternGift <orders@eterngift.com>`) | `email.ts` |
| `DISCORD_WEBHOOK_URL` | Notification commandes (sinon skip silencieux) | `email.ts` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Login admin | routes admin |
| `NEXT_PUBLIC_EXCHANGE_RATE_API_KEY` | exchangerate-api.com (sinon fallback en dur) | currency/rates |
| `NEXT_PUBLIC_SITE_URL` | URLs PayPal (défaut https://eterngift.com) | paypal/create-order |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel (fallback en dur) | layout.tsx |
| `NEXT_PUBLIC_BASE_CURRENCY` | Devise de base | `currency.ts` |

**Dans `.env.example` mais FAUX/inutilisés** : `SENDGRID_API_KEY` (le code utilise Resend), `JWT_SECRET` (pas de JWT), `NEXT_PUBLIC_SITE_EMAIL`, `NEXT_PUBLIC_SITE_NAME` (non lus).
**Manquants dans `.env.example`** : `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_META_PIXEL_ID`.

## 9. Conventions de code & sécurité

Conventions :
- TypeScript strict-ish, imports alias `@/…`, App Router avec `route.ts` ; `params` awaité (style Next 15) alors que Next est en 14 — fonctionne mais à noter.
- Composants fonctionnels, `'use client'` pour tout ce qui est interactif ; Zustand pour l'état global ; pas de tests, pas de CI, pas de Prettier config (ESLint `next/core-web-vitals` seul).
- Nommage : camelCase TS, snake_case colonnes DB ; prix **toujours** en USD côté serveur.
- Gestion d'erreurs : try/catch + log console, réponses `{ error }` ; les appels DB du checkout ne font **pas** échouer la commande.

Sécurité — points faibles connus :
- **Token admin forgeable** : base64(JSON) non signé, vérifie seulement `exp` et `role==='admin'`. N'importe qui peut générer un token valide sans connaître le mot de passe. À remplacer par un JWT signé (`JWT_SECRET`) ou une session serveur.
- **Clés Stripe stockées en clair** dans la table `settings` via le dashboard.
- `POST /api/paypal/checkout` crée des commandes sans paiement vérifié.
- `/api/products` POST sans auth (mock en mémoire, sans effet réel, mais à supprimer).
- Pas de rate limiting, pas de CSRF, secrets Stripe prioritaires depuis l'env (bon).
- Scan secrets : aucun secret en dur dans le code ni dans l'historique Git (45 commits vérifiés). Le Meta Pixel ID en dur est public par nature.

## 10. Incohérences doc vs code (à connaître avant de modifier)

1. **`ADMIN_DASHBOARD.md` décrit un AUTRE projet** (copié d'une app de pricing Instagram/TikTok) :
   - Onglet « Social Media Pricing » et routes `GET/PUT /api/admin/pricing` → **n'existent pas**. Onglets réels : products, orders, analytics, settings, promo.
   - `POST /api/admin/password` → réel : `POST /api/admin/change-password` (et c'est un stub no-op).
   - `PUT /api/admin/orders/update` → réel : `PUT /api/admin/orders/[orderId]`.
   - `DELETE /api/orders/delete/:id` → **n'existe pas** (réel : `DELETE /api/admin/orders/[orderId]`).
   - Tables `pricing`, colonnes `orders.order_status/notes/cost/price/amount`, filtres « platform instagram/tiktok », « Top packages par followers » → absents du code.
   - Clé settings `promo_enabled` → réel : `promo_field_enabled`.
   - Correct dans cette doc : mécanisme du token base64 (hélas), tables `settings`/`promo_codes`/`google_ads_expenses`, format mois `YYYY-MM`.
2. **`README.md` — structure fausse** : `src/app/cart`, `src/app/checkout`, `src/app/dashboard`, `src/app/products` n'existent pas à la racine de `app/` ; tout est sous `src/app/[lang]/` et l'admin sous `src/app/admin/`. Pas de dossier `src/app/dashboard`.
3. **`.env.example`** : `SENDGRID_API_KEY` (code = Resend), `JWT_SECRET` inutile, et il manque `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`RESEND_API_KEY`.
4. **`src/lib/db.ts` vs `prisma/schema.prisma`** : double schéma conflictuel (voir §7). Les seeds en dur de `initDatabase()` (`base_price` 19.99/29.99 sur IDs texte) contredisent le schéma Prisma (IDs numériques, `price_usd`).
5. **Admin orders cassé** : `getOrder`/`updateOrder`/`deleteOrder` filtrent sur `WHERE order_id = …` alors que la table Prisma `orders` n'a **pas** de colonne `order_id` (PK `id`, `order_number`). L'édition/suppression de commandes depuis le dashboard est probablement en échec silencieux. Idem `deleteOrder` qui supprime `order_items WHERE order_id` (TEXT legacy) avant `orders`.
6. **`GET /api/products`** renvoie 4 produits factices (prix 49.99–149.99, images Unsplash) qui ne correspondent ni au catalogue réel (2 produits, 19.99/29.99) ni à la DB.
7. **Mapping produit ID figé** : bear=1, box=2 en dur à 4 endroits (`storefront/products`, `products/prices`, `db.ts createOrder`, seed). Tout nouveau produit en DB ne sera pas reconnu.
8. **Promo codes** : CRUD admin complet mais jamais appliqué au checkout ; la doc promo laisse entendre un flux fonctionnel de bout en bout.
9. **`eterngift-prompt.md`** mentionne « SendGrid ou Resend » → implémenté : Resend uniquement.
10. **Package.json** : `eslint-config-next` 16 en devDep avec Next 14 (mismatch), `main: "index.js"` sans sens pour Next, deps inutilisées (JWT, bcrypt, zod, dinero, react-hook-form).

## 11. Commandes de vérification avant de terminer une tâche

```bash
npm run lint                 # ESLint (next lint)
npx tsc --noEmit             # Vérif types (pas de script npm dédié)
npm run build                # prisma generate + build complet (nécessite POSTGRES_* en env pour prisma.config)
```

⚠️ `npm install` échoue sans `POSTGRES_URL_NO_SSL` définie (le `postinstall` lance `prisma generate`, qui charge `prisma.config.ts` → `PrismaConfigEnvError`). Une valeur factice suffit pour generate/build local (pas de connexion).

Il n'y a **aucun test** automatisé. Vérifier manuellement : parcours checkout Stripe/PayPal en mode test, `/api/storefront/products`, login admin + chaque onglet du dashboard. Après toute modif DB : vérifier contre `prisma/schema.prisma` ET `initDatabase()` (double schéma, §7).

## 12. Résumé nouvel agent (7 points essentiels)

1. **DB = SQL brut `@vercel/postgres`** partout ; Prisma n'est qu'un schéma de référence, son client n'est jamais utilisé. Ne pas « migrer vers Prisma Client » sans décision explicite.
2. **Double schéma conflictuel** : `initDatabase()` (db.ts) crée des tables legacy incompatibles avec `prisma/schema.prisma`. Les flux de paiement écrivent au format Prisma ; les tables `settings`/`promo_codes`/`google_ads_expenses` n'existent que côté legacy.
3. **IDs produits figés** : 1 = eternal-rose-bear (29,99 $), 2 = eternal-rose-box (19,99 $), mappés en dur dans 4 fichiers.
4. **Checkout** : Stripe via Payment Element + re-vérif serveur du PaymentIntent ; PayPal v2 create→capture ; finalisation commune = `createOrder()` + email Resend + webhook Discord. Une commande est confirmée au client même si l'insert DB échoue.
5. **Auth admin = token base64 non signé** (forgeable) ; `change-password` est un stub. Toute modif auth doit commencer par corriger ça.
6. **Toutes les pages publiques sont sous `/[lang]/`** (5 locales, devise synchronisée sur la locale via middleware). Ne pas créer de page à la racine de `app/`.
7. **Ne pas faire confiance à `ADMIN_DASHBOARD.md`** (autre projet) ni à la structure du `README.md` ; se fier à ce fichier et au code.
