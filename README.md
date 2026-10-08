# CertPrep — révision AI-103 et AI-200

Site de révision pour les certifications **AI-103 — Azure AI Apps and Agents Developer Associate** et **AI-200 — Azure AI Cloud Developer Associate** : fiches de cours, quiz, flashcards et plan de révision à cocher.

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
| Une certification : examen, domaines, learning paths, planning des semaines | `data/certs/<certif>.ts` |
| Lexique | `components/Lexique.tsx` |

## Ajouter une unité

1. Écrire la fiche dans `content/<CERTIF>/<slug>.md` (par exemple `content/AI-103/`). Un corrigé repliable s'écrit avec `<details><summary>Voir le corrigé</summary>` suivi d'une ligne vide.
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

3. Pour un nouveau module : créer `data/modules/<slug>.json` (`slug`, `title`, `description`, `category` égal au code de la certification, `order`, `units`) puis renseigner `site: "<slug>"` sur la ligne correspondante de `data/certs/<certif>.ts` pour qu'il remplace « Fiche à venir » sur l'accueil.

Une unité est validée quand le dernier quiz atteint 70 %.

## Déploiement

`.github/workflows/deploy.yml` construit le site et le publie sur GitHub Pages. Dans les réglages du dépôt : **Settings → Pages → Source : GitHub Actions**.
