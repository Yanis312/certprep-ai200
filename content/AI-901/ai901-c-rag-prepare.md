# Prepare data for retrieval — préparer les données

## L'essentiel

- La recherche ne trouve que ce qui a été rendu **cherchable** : il faut un **pipeline d'indexation**.
- Quatre tâches : **extraire** le texte, le **découper** en chunks, créer des **embeddings**, construire un **index**.
- La taille des chunks est un **compromis**.
- Trois types de recherche : **mots-clés**, **vectorielle**, **hybride**.
- La préparation n'est **pas une tâche unique** : l'index doit rester à jour.

## Le pipeline d'indexation

```
Documents  →  1. Extraire  →  2. Découper (chunks)  →  3. Embeddings  →  4. Index
```

## 1. Choisir et traiter les sources

Sources possibles : manuels produits, politiques, pages web, enregistrements de base de données, tickets de support.

| Étape | Action |
|---|---|
| **Charger** | Récupérer le contenu de chaque source |
| **Extraire** | Tirer le texte et la structure des PDF, présentations, pages web, tableaux |
| **Nettoyer** | Retirer en-têtes répétés, texte de navigation et éléments inutiles |
| **Ajouter des métadonnées** | Titre, URL source, catégorie, **droits d'accès**, date de mise à jour |

Deux règles :

- **La qualité des sources compte.** Des documents en double, périmés ou contradictoires donnent une mauvaise recherche et des réponses peu fiables.
- **Les contrôles d'accès sont essentiels.** Un utilisateur ne doit récupérer que le contenu qu'il a le droit de voir.

## 2. Découper en chunks

Un document est souvent trop gros pour être envoyé en entier au modèle. On le divise en passages appelés **chunks**. Chaque chunk doit avoir assez de contexte pour être compris, tout en restant centré sur un sujet.

> **Exemple du cours.** Une politique de voyage découpée par section : vols, hôtels, repas, transport terrestre. Une question sur les hôtels récupère la section hôtels, sans ajouter toute la politique au prompt.

### Le compromis

| Chunks trop grands | Chunks trop petits |
|---|---|
| Contiennent de l'information hors sujet | Séparent une phrase de son titre ou de sa définition |
| Consomment plus de **fenêtre de contexte** | Deviennent difficiles à comprendre seuls |

Les chunks se **chevauchent** souvent légèrement, pour ne pas perdre de contexte à la frontière.

## 3. Créer les embeddings

Un **modèle d'embedding** convertit chaque chunk en **embedding** : un **vecteur numérique** qui représente les caractéristiques sémantiques du contenu.

Des chunks de sens proche ont des embeddings **proches dans l'espace vectoriel**, même s'ils n'utilisent pas les mêmes mots.

## 4. Indexer

Les chunks, leurs embeddings et les métadonnées sont stockés dans un **index de recherche** ou un magasin de données vectoriel.

| Recherche | Principe | Utile quand |
|---|---|---|
| **Par mots-clés** | Correspondance des mots exacts | Mots précis, identifiants, **codes produit** |
| **Vectorielle** | Proximité de **sens** | La formulation diffère de celle du document |
| **Hybride** | Combine les deux | On veut les deux avantages |

> **Exemple.** La requête « business trip expenses » trouve un passage intitulé « company travel costs » grâce à la recherche **vectorielle**. La requête « REF-4471 » trouve le bon produit grâce à la recherche par **mots-clés**.

## Garder l'index à jour

Le pipeline doit **ajouter** les nouveaux contenus, **mettre à jour** ceux qui changent et **supprimer** ceux qui ne sont plus valables. La recherche doit refléter la source de vérité actuelle.

#### Point examen : deux questions officielles du module — on découpe les gros documents en chunks pour récupérer des passages ciblés qui tiennent efficacement dans un prompt ; un embedding est un vecteur numérique qui capture les caractéristiques sémantiques du contenu.

## Exercices rapides

**1.** Cite les quatre tâches du pipeline d'indexation.

**2.** Qu'est-ce qu'un chunk ?

**3.** Quel est le risque de chunks trop grands ? Et trop petits ?

**4.** Pourquoi fait-on se chevaucher les chunks ?

**5.** Qu'est-ce qu'un embedding dans une solution RAG ?

**6.** Quelle recherche choisir ? (a) Trouver le code produit « XK-200 ». (b) Trouver un passage qui parle du même sujet avec d'autres mots. (c) Faire les deux à la fois.

**7.** Cite trois métadonnées utiles à ajouter aux contenus.

**8.** Pourquoi la préparation des données n'est-elle pas une tâche unique ?

<details>
<summary>Voir le corrigé</summary>

**1.** Extraire le texte, le découper en chunks, créer les embeddings, créer l'index.

**2.** Un petit passage de texte issu du découpage d'un document.

**3.** Trop grands : information hors sujet et fenêtre de contexte consommée. Trop petits : une phrase est séparée du contexte nécessaire pour la comprendre.

**4.** Pour ne pas perdre de contexte important à la frontière entre deux chunks.

**5.** Un vecteur numérique qui représente les caractéristiques sémantiques du contenu.

**6.** (a) Mots-clés. (b) Vectorielle. (c) Hybride.

**7.** Trois parmi : titre, URL source, catégorie, droits d'accès, date de mise à jour.

**8.** Parce que les contenus changent : il faut ajouter, mettre à jour et supprimer pour que l'index reste fidèle à la source.

</details>
