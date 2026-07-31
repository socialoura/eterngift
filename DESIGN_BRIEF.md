# Brief de redesign — EternGift

Prompt à copier-coller sur claude.ai/design. Objectif : obtenir 3 directions visuelles distinctes pour repenser le site, afin de choisir la meilleure et la faire implémenter ensuite dans le code réel.

---

## 1. Le business

**EternGift** est une boutique e-commerce mono-produit qui vend des cadeaux romantiques : une vraie rose préservée ("éternelle", elle ne fane pas) accompagnée d'un collier cœur gravable, présentés ensemble comme un cadeau sentimental.

- **Occasion d'achat** : anniversaire de couple, Saint-Valentin, réconciliation, "juste parce que", cadeau surprise. Achat impulsif et émotionnel — la décision se prend vite, sur mobile la plupart du temps, souvent motivée par une urgence ("je veux que ça arrive avant telle date").
- **Client cible** : quelqu'un (souvent un homme, 20-45 ans, d'après le positionnement actuel) qui cherche un cadeau qui a l'air cher et attentionné sans nécessairement l'être, pour son/sa partenaire.
- **Positionnement actuel** : romantique, généreux, "premium accessible" (prix 20-30$), pas du luxe réel — mais je veux que le *design* donne une impression de qualité supérieure au prix réellement payé, sans mentir sur le produit.
- **Contexte** : le site a été à l'arrêt pendant 3 mois, je le relance tout juste. Je viens d'avoir un premier client. Je n'ai donc **aucune vraie donnée de trafic ni de vrais avis clients en masse** — le redesign doit reposer sur des principes de design solides, pas sur de la donnée comportementale (pas encore disponible).

## 2. Catalogue produit (2 SKU, à ne pas complexifier)

### Eternal Rose Bear with Engraved Necklace — badge "Most Popular"
- Prix : 29,99 $ (prix barré ~38,99 $, -23%)
- Description actuelle : "Your perfect eternal companion. A stunning rose bear paired with an engraved necklace, creating a timeless symbol of love and remembrance."
- Variantes couleur de l'ours : Red, Pink, Blue, Purple, White (chaque couleur a son propre jeu de photos)
- Variantes couleur du collier : Gray, Gold, Rose Gold
- Personnalisation : gravure texte libre sur 2 moitiés de cœur ("Left Heart Engraving" / "Right Heart Engraving", 20 caractères max chacune)
- Note affichée : 4.9/5 (128 avis)

### Eternal Rose Box with Engraved Necklace — badge "Premium"
- Prix : 19,99 $ (prix barré ~25,99 $, -23%)
- Même concept : rose éternelle en coffret + collier gravable
- Variantes couleur du coffret : Red, Pink
- Mêmes variantes de collier : Gray, Gold, Rose Gold
- Note affichée : 4.9/5 (96 avis)

**Contrainte importante sur les visuels** : les photos produit actuelles sont des **rendus 3D/mockup** (pas de la vraie photographie produit — pas de studio shoot, pas de lifestyle photo avec de vraies mains/personnes). Chaque couleur a 5 images : hero, sélecteur couleur, détail collier, "lifestyle", packaging. Le redesign doit composer avec ces rendus 3D existants (les mettre en valeur intelligemment) plutôt que supposer qu'on a de la vraie photographie éditoriale à disposition — sauf si une des 3 directions propose explicitement un style qui fonctionne bien avec du rendu 3D stylisé.

## 3. Identité de marque actuelle (à garder, faire évoluer, ou remplacer — proposez librement)

- **Couleurs** : rouge profond `#B71C1C` (primaire), bordeaux `#8B1515`/`#8B1538`, rouge clair `#D32F2F`, or/taupe `#D4AF88` ("rose-gold"), rose pâle `#FFE5E5`, crème `#F5F1ED`, gris doux `#F0F0F0`
- **Typographie** : Playfair Display (titres, serif classique) + Inter (texte courant, sans-serif)
- **Ton de marque** : romantique, chaleureux, "forever in love" — le nom de la marque est littéralement "Eternal Gift", la promesse centrale est la durabilité du cadeau (contrairement aux vraies fleurs qui fanent)
- **Logo** : cœur + texte "EternGift / Forever in Love" en serif

Vous pouvez proposer de garder cette identité, de l'affiner, ou de proposer une palette/typo différente si vous pensez qu'elle sert mieux le positionnement — dites-moi pourquoi dans ce cas.

## 4. Ce qui cloche dans le design actuel (à éviter absolument dans les 3 propositions)

Le site a un look "généré par IA / template gratuit" que je veux fuir en priorité. Défauts concrets observés :

- **Dégradés rouge→rose→or omniprésents** en fond de section, y compris des dégradés *animés* qui changent de couleur en boucle
- **Rendu 3D du produit flottant** avec halo lumineux radial derrière, anneaux qui tournent, badges pilule flottants ("Most Popular", "4.9/5 · 128 reviews") qui se chevauchent sur l'image — composition très "générateur de landing page"
- **Diviseurs SVG en vague** entre les sections
- **Cartes arrondies + ombres portées disproportionnées** sur à peu près tout (produits, features, avis, stats)
- **Animations décoratives excessives** : cœurs qui flottent vers le haut en continu, particules, icônes qui pulsent — sans rôle fonctionnel, juste du mouvement pour le mouvement
- **Trop de badges/pastilles** : badge produit + badge remise + badge "note" + badge "populaire", tous en même temps sur la même carte produit
- **Répétition visuelle des icônes** : icône dans un carré arrondi à dégradé, répétée identique dans 6 sections différentes (features, contact, newsletter, panier) sans hiérarchie
- **Copie marketing exagérée** : j'ai déjà retiré les faux chiffres ("50 000+ clients", "99% satisfaction", "support 24/7" qui contredisait les vrais horaires) — ne réintroduisez pas ce genre de social proof gonflé, gardez la réassurance honnête (livraison gratuite, garantie 30 jours, fait main)

Ce que je veux à la place : un rendu qui a l'air d'une vraie marque de joaillerie/cadeaux premium — typographie soignée avec une vraie hiérarchie, espace blanc généreux, mise en scène du produit plus sobre et intentionnelle, animations discrètes et uniquement fonctionnelles (feedback d'interaction, pas de décoration gratuite).

**Références esthétiques** (dans des registres différents — piochez librement, ou proposez d'autres refs si plus pertinentes) :
- *Minimal luxe* : Mejuri, Aesop, Article, Common Projects
- *Romantique éditorial chaleureux* : Catbird, Loeffler Randall, une esthétique "carte de vœux haut de gamme / papeterie fine"
- *Moderne bold* : Glossier, Parade, une esthétique plus graphique/contrastée avec de la couleur assumée mais maîtrisée (pas dégradé arc-en-ciel)

## 5. Écrans à designer (mêmes 3 directions appliquées à chacun)

Contenu actuel de chaque écran, pour référence — vous pouvez réorganiser/simplifier, mais gardez les éléments fonctionnels listés :

1. **Page d'accueil** : bannière d'annonce (livraison gratuite), header avec sélecteur langue/devise + panier, hero (titre, sous-titre, CTA "Shop Now", badge note), grille des 2 produits avec prix/remise/sélecteurs couleur rapides, section réassurance "Why Choose EternGift" (6 items : qualité, personnalisation, emballage, livraison, garantie, support), carrousel de témoignages + stats honnêtes, bloc newsletter, footer
2. **Fiche produit** : galerie photo (5 images + miniatures), titre, note/avis, prix + remise, sélecteur de couleur produit, champs de gravure (2 champs texte), sélecteur couleur collier, CTA "Buy Now" + ajouter au panier, section description longue avec liste de features, section "What's Included" (3 items), avis clients
3. **Panier** : liste d'articles (image, nom + variante, quantité, prix), résumé de commande (sous-total, livraison, total), CTA vers checkout, moyens de paiement acceptés
4. **Checkout** : formulaire de livraison (nom, email, adresse, ville, code postal, pays), résumé de commande sticky, CTA de paiement, badges de réassurance sécurité

Pour chaque direction : maquette **desktop et mobile** au moins pour la page d'accueil et la fiche produit (le panier/checkout peuvent être desktop uniquement si ça simplifie).

## 6. Contraintes techniques à respecter

- Le site est en **5 langues** (anglais, français, espagnol, allemand, italien) — le français et l'allemand produisent des libellés ~30-40% plus longs qu'en anglais. Évitez les designs où le texte est contraint dans un espace fixe trop serré (boutons très courts, titres sur une seule ligne obligatoire, etc.)
- Stack actuelle : Next.js + Tailwind CSS + Framer Motion + icônes Lucide — pas un blocage pour le design, mais ça veut dire qu'on peut faire des animations/interactions raisonnablement riches en implémentation, pas besoin de se limiter à du statique
- Le tunnel d'achat (produit → panier → paiement Stripe/PayPal) doit rester simple et rapide — c'est un achat impulsif, chaque friction en plus fait perdre des ventes

## 7. Livrable attendu

Proposez 3 directions artistiques clairement différentes. Pour chacune :
- Un nom + une phrase de mood/positionnement
- La palette de couleurs et le choix typographique proposés (avec justification courte)
- Les maquettes des 4 écrans listés en section 5
- Ce que vous changeriez dans le ton de la copy (titres, CTA) pour aller avec la direction visuelle

Je comparerai les 3, choisirai celle qui fonctionne le mieux (ou un mix), et je reviendrai avec le résultat pour le faire implémenter dans le code réel du site.
