Site pour tester le Générateur de Site Statique **Eleventy**
---

# Installation

- vérifier qu'on a bien NPM : `npm -v` (si NPM% présent, on a le retour de la version en cours)
- initialiser le projet : `npm init -y`
- installer Eleventy : `npm install @11ty/eleventy -D`
- installer si nécessaire le plug-in pour gérer SASS + Lightning : `npm install @11tyrocks/eleventy-plugin-sass-lightningcss -D`

# Configuration

Gérer sa configuration avec un fichier *.eleventy.js* à la racine du projet.

Configurer à l'intérieur les dossier sources et de destination :
```js
const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss"); // si plug-in SASS/Lightning présent

module.export = function(eleventyConfig) {

    eleventyConfig.addPlugin(eleventySass); // si plug-in SASS/Lightning présent

    return {
        // Gestion des dossiers source et destination
        dir: {
          input: "src", // ajuster les noms selon la hiérarchie réelle du projet
          output: "public"
        }
      }
}
```

# Débug

- si au lancement du serveur, on a l'erreur `Cannot find module 'node:fs'`, penser à contrôler la version de Node.js : ^18