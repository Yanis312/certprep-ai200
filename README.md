# CertPrep — révision AI-200

Site de révision pour la certification **AI-200 — Azure AI Cloud Developer Associate** : fiches de cours, quiz, flashcards et plan de révision sur 10 semaines.

Le site est **100 % statique** (export Next.js) et publié sur GitHub Pages à chaque push sur `main`. La progression est enregistrée dans le navigateur (localStorage), il n'y a ni serveur ni base de données.

## Lancer en local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # génère le site statique dans out/
```

## Où est le contenu

| Quoi | Où |
|---|---|
| Modules, unités et questions de quiz | `data/modules/<slug-du-module>.json` |
| Texte des fiches de cours | `content/<catégorie>/<slug-de-l-unité>.md` |
| Plan officiel (9 learning paths) et planning des semaines | `data/plan.ts` |
| Lexique | `components/Lexique.tsx` |

## Ajouter une unité

1. Écrire la fiche dans `content/AI-200/<slug>.md`.
2. Ajouter l'unité dans le JSON de son module :

```json
{
  "slug": "aca-deploy",
  "title": "Déployer sur Container Apps",
  "order": 1,
  "isLab": false,
  "questions": [
    {
      "question": "…",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "…"
    }
  ]
}
```

3. Pour un nouveau module : créer `data/modules/<slug>.json` (`slug`, `title`, `description`, `category: "AI-200"`, `order`, `units`) puis renseigner `site: "<slug>"` sur la ligne correspondante de `data/plan.ts` pour qu'il remplace « Fiche à venir » sur l'accueil.

Une unité est validée quand le dernier quiz atteint 70 %.

## Déploiement

`.github/workflows/deploy.yml` construit le site et le publie sur GitHub Pages. Dans les réglages du dépôt : **Settings → Pages → Source : GitHub Actions**.
