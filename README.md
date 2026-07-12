# CV-Web

CV en ligne développé avec **React** et **Vite**, destiné à présenter un profil d'ingénieur cybersécurité de manière moderne, lisible et déployable sur GitHub Pages.

## Stack

- React.
- Vite.
- JavaScript ES modules via `type: "module"`.
- Outils npm avec scripts `dev`, `build`, `lint` et `preview`.

## Lancer le projet en local

Prérequis : Node.js et npm installés sur la machine.

```bash
npm install
npm run dev
```

Le serveur de développement Vite permet de tester le site localement avant publication.

## Build de production

```bash
npm run build
```

Cette commande génère la version statique du site à publier, généralement dans le dossier `dist/` pour un projet Vite.

## Déploiement GitHub Pages

Le dépôt ayant pour nom `CV`, le déploiement GitHub Pages doit tenir compte du sous-chemin `/CV/` afin que les assets se chargent correctement en production.

Exemple de configuration dans `vite.config.js` :

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/CV/',
})
```

Étapes recommandées :

1. Ajouter le paramètre `base: '/CV-Web/'` dans `vite.config.js`.
2. Exécuter `npm run build` pour générer les fichiers statiques.
3. Publier le contenu de `dist/` sur GitHub Pages via une branche `gh-pages` ou un workflow GitHub Actions.

## Structure du projet

```text
CV-Web/
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
```

Cette structure correspond à une application Vite classique avec point d'entrée HTML à la racine et code applicatif dans `src/`.

## Scripts utiles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

Ces scripts sont déclarés dans le `package.json` du dépôt.
