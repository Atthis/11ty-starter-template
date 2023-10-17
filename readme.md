Site pour tester le Générateur de Site Statique **Eleventy**
---

# Installation

- vérifier qu'on a bien NPM : `npm -v` (si NPM% présent, on a le retour de la version en cours)
- initialiser le projet : `npm init -y`
- installer Eleventy : `npm install @11ty/eleventy -D`
- installer si nécessaire le plugin pour gérer SASS + Lightning : `npm install @11tyrocks/eleventy-plugin-sass-lightningcss -D` ([repo du plugin](https://github.com/5t3ph/eleventy-plugin-sass-lightningcss))

# Configuration

Gérer sa configuration avec un fichier *.eleventy.js* à la racine du projet.

Configurer à l'intérieur les dossier sources et de destination :
```js
const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss"); // si plugin SASS/Lightning présent

module.export = function(eleventyConfig) {

    eleventyConfig.addPlugin(eleventySass); // si plugin SASS/Lightning présent

    return {
        // Gestion des dossiers source et destination
        dir: {
          input: "src", // ajuster les noms selon la hiérarchie réelle du projet
          output: "public"
        }
      }
}
```

# Mise en place de GitHub pages

Afin de pouvoir automatiser le déploiement du site sur une GH Page, il y a quelques configurations à mettre en place.

## Création du répertoire de workflow et du fichier

1. Créer à la racine du dépôt, sur la branche principale (généralement **main**), un dossier `.github` avec à l'intérieur un nouveau dossier `workflows`.
2. Dans ce dernier dossier (chemin : `.github/workflows/`), ajouter un fichier YAML avec le nom que vous souhaitez.
3. Copier-coller le contenu suivant : 
```yml
name: Build Eleventy
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-20.04

    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies & build
        run: |
          npm ci
          npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3.8.0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          #publish_dir is the folder on the docker instance which eleventy builds the pages to.
          #it is not the docs folder in the repository
          publish_dir: ./public
          #publish_branch is the branch in the repository.
          #this is where you need to point GitHub pages
          publish_branch: gh-pages
```
*source : [article de Quinn Dombrowski](https://quinndombrowski.com/blog/2022/05/07/hosting-eleventy-on-github-pages/)*

Adapter si besoin la valeur de **publish_dir** à votre configuration.

**Pour garantir le bon fonctionnement du fichier de workflow :** Aller dans les réglages du dépôt, puis dans l'onglet *Actions > Général*. S'assurer que "Autoriser toutes les actions et workflows réutilisables" est coché, et modifier le réglage des permissions pour "Permission en lecture et écriture".

## Ajout d'un fichier .nojekyll

Afin d'informer GitHub que nous ne voulons pas utiliser Jekyll, il faut ajouter à la racine du dépôt un fichier vide nommé `.nojekyll` (ne pas oublier le point au début).

## Ajout d'un script dans le fichier package.json

Si cela n'est pas déjà fait, ajoutez dans votre fichier `package.json` une commande pour "build" le site avec Eleventy.
```json
"scripts": {
    "build": "eleventy"
  },
```

## Test de fonctionnement et génération de la branche "gh-pages"

Une fois toutes les étapes précédentes effectuées, lancer le script de build en générant un push vers le dépôt distant :
```
git add *
git commit -m 'create CI/CD structure'
git push
```

Si tout est bien configuré, le workflow devrait être visible dans l'onglet "Actions" de la page GitHub du dépôt.
Si une des étapes bloque, vous recevrez un mail avec des informations sur l'origine du problème.

Vous pouvez aussi contrôler qu'il y a bien maintenant une branche "gh-pages" de créée, au niveau de l'onglet "code" puis à gauche dans le menu déroulant des branches.

## Configuration de GitHub Pages

Si tout s'est bien passé, vous avez maintenant une branche "gh-pages" d'existante sur le dépôt.

Aller dans les réglages du dépôt, puis dans l'onglet "Pages" du menu latéral.

Choisissez comme source "Déployer à partir d'une branche", et sélectionner la branche "gh-pages", avec le dossier "/(root)".

Lors du prochain push sur la branche main, le workflow créera le build des fichiers public, puis les enverra sur la branche "gh-pages". Cette branche étant alors mise à jour, le déploiement via la GitHub page se lancera automatiquement, mettant en place le site statique à l'adresse "https://<utilisateur>.github.io/<nom du dépôt>/".

**Attention** : si aucun fichier source (concernant le site : html, css, js...) n'a été modifié, le build et déploiement GH-Pages ne sera pas lancé.

# Debug

- si au lancement du serveur, on a l'erreur `Cannot find module 'node:fs'`, penser à contrôler la version de Node.js : ^18