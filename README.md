# Portfolio de Deli Mha Ezekiel

Portfolio personnel conçu et développé par Deli Mha Ezekiel. Il présente mon parcours, mes compétences, mes expériences et mes formations.

## Technologies

HTML, CSS et JavaScript natifs. Le site ne nécessite ni dépendance ni compilation.

## Lancer en local

Depuis le dossier du projet :

```bash
python3 -m http.server 8000
```

Ouvre ensuite http://localhost:8000.

## Actualité et projets en cours

Dans `script.js`, renseigne les champs de l'objet `ACTUALITE`. La rubrique et son lien de navigation apparaissent dès qu'un titre, un texte ou un lien est renseigné. Si ces champs restent vides, la rubrique n'est pas affichée.

## Galerie

Après ajout ou suppression d'images, exécute `node scripts/generate-gallery-manifest.mjs` pour actualiser la galerie en local. Le workflow de publication régénère automatiquement la liste avant chaque déploiement.

## Publication

Dans les paramètres GitHub Pages du dépôt, choisis `GitHub Actions` comme source de publication. Le site est configuré pour être publié à l’adresse https://ezekieldeli677-ux.github.io/.
