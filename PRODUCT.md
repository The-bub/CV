# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruteurs, chasseurs de tête, DSI/RSSI et décideurs métier qui évaluent une
candidature. Ils arrivent le plus souvent depuis LinkedIn ou un lien envoyé en
candidature, souvent sur mobile, entre deux rendez-vous, avec quelques dizaines
de secondes d'attention avant de décider s'ils lisent ou ferment. Une partie
d'entre eux n'est pas technique : ils cherchent à situer un profil, pas à
auditer une compétence.

Public secondaire : pairs cyber et jurys de sélection (le site sert aussi de
démonstration de savoir-faire).

## Product Purpose

CV en ligne d'Eliot Bedel (`cv.ebedel.fr`). Il doit rendre un parcours lisible
en un coup d'œil, prouver un niveau d'exécution technique par sa propre
fabrication, et déboucher sur un contact ou le téléchargement du CV PDF.
Succès = le visiteur repart avec une lecture juste du profil et une action
(contact, PDF, LinkedIn).

## Positioning

Un profil charnière : trois ans de red team / test d'intrusion, puis le
management du risque IT (GRC). L'argument est la traduction — la complexité
technique offensive convertie en risques métier actionnables — et non l'une ou
l'autre spécialité prise seule. Un CV de pentester pur ou de consultant GRC pur
ne peut pas revendiquer les deux versants.

## Operating Context

- Lecture courte, souvent mobile, réseau et matériel non maîtrisés.
- Le PDF ATS (`public/eliot-bedel-cv.pdf`, généré par `npm run pdf`) est la
  pièce qui circule dans les outils de recrutement ; le site est la pièce qui
  se visite.
- Deux versions coexistent : V4 servie à la racine, V5 embarquée sous `/v5/`.
  La source V5 vit sur la branche `V5` puis est ré-embarquée.

## Capabilities and Constraints

- React 19 + Vite 8. GSAP + ScrollTrigger, Lenis (smooth scroll), Three.js
  (uniquement pour le fond génératif), fontsource pour les fontes.
- Déploiement continu GitHub Actions → GitHub Pages (`.github/workflows/deploy.yml`).
- Trois palettes commutables à chaud (`data-palette` : sapin par défaut,
  vermillon, platine), persistées en localStorage ; toute pièce visuelle doit
  lire ses couleurs depuis les custom properties CSS.
- Préférence de mouvement exposée par un contrôle explicite « Animations »
  (`data-motion`, persisté). **Décision 2026-07-26 :** pour le fond animé,
  `prefers-reduced-motion: reduce` fait autorité de façon stricte — l'état
  statique n'est pas réactivable depuis le bouton. Le reste du site conserve
  son comportement actuel (`HONOUR_REDUCED_MOTION = false` dans `src/lib/gsap.js`).
- Three.js n'a pas d'autre usage que le fond : la dépendance est retirable si
  la direction retenue n'en a pas besoin.
- Budget performance : 60 fps visé sur mobile milieu de gamme, Lighthouse
  mobile ≥ 90, dégradation propre sans WebGL.
- Site entièrement en français.

## Brand Commitments

- Nom et identité personnelle réels ; ton sobre, professionnel, à la première
  personne.
- Portrait photographique en niveaux de gris (`src/assets/`).
- Les trois palettes et le commutateur sont acquis.
- Contrainte de direction artistique posée par le propriétaire : refus des
  poncifs visuels du secteur (flow fields de bruit simplex, particules
  suiveuses de souris, grilles de points pulsées, pluie de caractères, glitch
  cyberpunk) **et** des métaphores littérales du métier (cadenas, boucliers,
  code binaire, hexagones « sécurité »). Le concept visuel doit valoir par ses
  qualités formelles, sans lien thématique revendiqué avec le métier.

## Evidence on Hand

Contenu réel, dans `src/data.js` :
- 9 ans IT & cybersécurité, 3 ans en sécurité offensive.
- Certifications obtenues : GIAC GWAPT (SANS), Pro Lab Zephyr (Hack The Box).
  En préparation : CISSP (ISC2), ISO 27005 Risk Manager (PECB).
- Titre RNCP 7 « Expert en sécurité digitale » (ENI).
- Deux podiums CTF (2ᵉ place).
- Parcours, expertises, formation, loisirs, coordonnées de contact.
- Portrait photo, `og-image.jpg`, CV PDF téléchargeable.

Aucun témoignage, référence client, logo d'employeur sous licence ni métrique
de mission n'est disponible : ne pas en fabriquer.

## Product Principles

1. La lisibilité du parcours prime sur toute intention décorative — un
   recruteur pressé doit pouvoir tout lire sans effort.
2. Le site prouve le niveau d'exécution en étant bien fait, jamais en
   l'affirmant.
3. Aucune illustration littérale du métier ; la forme se justifie par ses
   qualités propres.
4. Toute pièce visuelle doit survivre aux trois palettes et à l'absence de
   WebGL sans perdre son idée.
5. Les données personnelles retirées volontairement (adresse complète, âge) ne
   reviennent pas.

## Accessibility & Inclusion

- Contraste AA vérifié sur les trois palettes (le token `--bone-3` a déjà été
  relevé pour cette raison sur la palette vermillon).
- Lien d'évitement, ordre de tabulation contrôlé, décor en `aria-hidden`.
- Fond animé : `prefers-reduced-motion: reduce` fige, sans réactivation.
