# Admin Dashboard — Documentation (à jour)

> ⚠️ Ce document a été réécrit pour refléter le code réel. L'ancienne version décrivait
> un autre projet (pricing Instagram/TikTok) et était entièrement obsolète.
> Pour l'architecture complète, voir `AGENTS.md`.

## 1) Vue d'ensemble

- **Frontend** : Next.js (App Router) + React Client Components
- **UI Admin** : login `src/app/admin/page.tsx`, dashboard `src/app/admin/dashboard/page.tsx`
- **Analytics** : `src/components/admin/AnalyticsDashboard.tsx` (charts Recharts)
- **Backend** : API Routes sous `src/app/api/admin/*`
- **DB** : PostgreSQL via `@vercel/postgres` (SQL brut), helpers dans `src/lib/db.ts`
- **Auth** : JWT signé (`JWT_SECRET`), stocké en `localStorage.adminToken`, envoyé via `Authorization: Bearer <token>`

## 2) Authentification admin

### Login
- **Route** : `POST /api/admin/login` — `{ username, password }`
- **Vérification** : hash bcrypt en table `admin_users` si présent (mot de passe changé via le dashboard), sinon fallback sur les env `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- **Token émis** : JWT signé avec `JWT_SECRET` (`{ username, role: 'admin' }`, expiration 24 h)

### Vérification du token
- `verifyAdminToken()` (`src/lib/admin-auth.ts`) vérifie la **signature** et l'expiration sur tous les endpoints admin.

### Changement de mot de passe
- **Route** : `POST /api/admin/change-password` — `{ currentPassword, newPassword }` (min 8 caractères)
- Persiste réellement : hash bcrypt (bcryptjs) upserté dans `admin_users`. Le nouveau mot de passe prend le pas sur `ADMIN_PASSWORD`.

## 3) Onglets du dashboard

`activeTab` : **products | orders | analytics | settings | promo**

### Products (`ProductsTab`)
- GET `/api/admin/products` (liste), PUT `/api/admin/products/[productId]` (`{ basePrice?, stock? }`, id numérique)
- Seed initial : POST `/api/admin/seed-products` (insère les 2 produits si la table est vide : id 1 = Eternal Rose Bear 29,99 $, id 2 = Eternal Rose Box 19,99 $)

### Orders (`OrdersTab`)
- GET `/api/admin/orders`
- PUT `/api/admin/orders/[orderNumber]` — `{ status? }`, `{ cost? }` ou `{ notes? }`
- DELETE `/api/admin/orders/[orderNumber]` (les `order_items` partent en cascade)
- Identifiant utilisé : `order_number` (ex. `EG-XXXX-XXXX`)

### Analytics (`AnalyticsDashboard`)
- Recharts : revenue 7 jours, revenue + net profit par mois (moins dépenses Google Ads)
- Dépenses pubs : GET/POST `/api/admin/google-ads-expenses`, PUT/DELETE `/api/admin/google-ads-expenses/[month]` (`month` = `YYYY-MM`)

### Settings (`SettingsTab`)
- Changement de mot de passe (voir §2)
- Clés Stripe : GET/PUT `/api/admin/stripe-settings` (stockées dans la table `settings`, clés `stripe_secret_key` / `stripe_publishable_key` ; les env `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ont priorité à la lecture)
- Test de connexion : POST `/api/admin/stripe-settings/test`

### Promo (`PromoTab`)
- CRUD : GET/POST `/api/admin/promo-codes`, PUT/DELETE `/api/admin/promo-codes/[code]`
- Toggle champ promo au checkout : GET/PUT `/api/admin/promo-settings` (clé `promo_field_enabled` dans `settings`)
- ⚠️ Les codes promo ne sont **pas appliqués** côté checkout (pas de logique de réduction dans les routes de paiement).

## 4) Tables utilisées par le dashboard

- Prisma (`prisma db push`) : `products`, `orders` (+ `cost`, `notes`), `order_items`
- Créées par `initDatabase()` : `admin_users`, `settings`, `promo_codes`, `google_ads_expenses`
