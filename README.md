# CV-Web

CV en ligne d'Eliot Bedel, développé avec **React** et **Vite**, déployé automatiquement sur GitHub Pages.

Site en ligne : [the-bub.github.io/CV](https://the-bub.github.io/CV/)

## Stack

- React 19 + Vite.
- CSS pur (pas de framework CSS), palette et échelle typographique pilotées par variables CSS (`src/index.css`).
- [`gsap`](https://gsap.com) (ScrollTrigger, ScrollSmoother, SplitText) pour le smooth scroll et la chorégraphie d'animations ; [`motion`](https://motion.dev) pour les apparitions simples au scroll.
- [`three`](https://threejs.org) pour la pièce 3D du hero (`src/three/InstrumentField.jsx`), avec shaders GLSL faits main — chargée en asynchrone (`React.lazy`) pour ne pas alourdir le chargement initial.
- Oxlint pour le lint.

## Lancer le projet en local

Prérequis : Node.js et npm.

```bash
npm install
npm run dev
```

Le serveur de développement Vite tourne sur `http://localhost:5173` (le site répond sur `/CV/` du fait du `base` configuré dans `vite.config.js`, cohérent avec l'URL de production).

Autres scripts :

```bash
npm run build    # build de production dans dist/
npm run preview  # sert le build de production en local
npm run lint     # vérifie le code avec Oxlint
```

## Modifier le contenu du CV

Tout le contenu texte du site est centralisé dans **[`src/data.js`](src/data.js)** — c'est le seul fichier à modifier pour mettre à jour le CV, aucune connaissance de React n'est nécessaire. Les composants (`src/components/`) ne font que lire ces données et les afficher ; ils n'ont pas besoin d'être touchés pour un changement de contenu.

Le fichier exporte plusieurs objets :

| Export | Rôle | Où c'est affiché |
|---|---|---|
| `profile` | Nom, titre, bio, coordonnées de contact (téléphone, email, adresse, lien Maps, LinkedIn) | Hero + section Contact |
| `experiences` | Liste des expériences professionnelles (rôle, entreprise, période, missions) | Section Parcours |
| `education` | Liste des formations (période, titre, école, détail) | Section Formation |
| `certifications` | Certifications obtenues (nom, organisme, intitulé complet, description) | Section Compétences |
| `skills` | Compétences groupées par catégorie (`Red Team`, `Blue Team`, `GRC`, `Systèmes et réseaux`) | Section Compétences |
| `hobbies` | Centres d'intérêt, résultats CTF, autres loisirs | Section Compétences |

Chaque export est un tableau ou un objet simple : pour ajouter une expérience, dupliquer un bloc `{ role, company, period, items }` dans le tableau `experiences` ; pour ajouter une compétence, ajouter une ligne dans le tableau `items` de la catégorie concernée ; etc. Aucune autre modification n'est nécessaire, les listes s'affichent automatiquement.

**Photo** : remplacer le fichier importé dans [`Hero.jsx`](src/components/Hero.jsx) (`src/assets/eliot-bedel-2026-v2.jpg`).

**Favicon** : `public/favicon.svg`.

## Déploiement

Le déploiement est **automatique** via [GitHub Actions](.github/workflows/deploy.yml) : tout push sur `main` déclenche un build (`npm run build`) et une publication sur GitHub Pages. Rien à faire manuellement — l'ancienne procédure de déploiement via une branche `gh-pages` n'est plus utilisée.

Le dossier `dist/` (généré par le build) n'est pas suivi par git : il est reconstruit à chaque déploiement par le workflow.

## Structure du projet

```text
cv-site/
├── .github/workflows/deploy.yml   # CI/CD → GitHub Pages
├── index.html
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── data.js                    # tout le contenu du CV (voir ci-dessus)
    ├── App.jsx / main.jsx
    ├── index.css
    ├── assets/                    # photo
    ├── components/                # Hero, Nav, Experience, Education, Skills, Contact,
    │                               # Preloader, GrainOverlay, Cursor, SmoothScroll, Reveal, GsapReveal, BlurText, BorderGlow
    ├── three/                     # scène 3D du hero (InstrumentField, shaders GLSL, fallback statique)
    └── lib/                       # thème clair/sombre, config GSAP, curseur magnétique, spotlight
```

## Licence

**Tous droits réservés.**

© 2026 Eliot Bedel. Ce dépôt (code source, contenu textuel, données, images) est mis à disposition publiquement à titre de démonstration et de portfolio. Aucune reproduction, copie, modification, redistribution ou réutilisation, totale ou partielle, n'est autorisée sans l'accord écrit préalable de l'auteur.
