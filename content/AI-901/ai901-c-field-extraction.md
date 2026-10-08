# Field extraction and mapping — l'extraction de champs

## L'essentiel

- L'**OCR** dit **quel texte existe** ; l'**extraction de champs** dit **ce qu'il signifie** et **où il va** dans les systèmes de l'entreprise.
- Le pipeline compte **5 étapes**.
- Trois façons de détecter les champs : **modèles** (templates), **machine learning**, **IA générative**.
- La **position** du texte compte autant que son contenu.

## OCR ou extraction de champs

| | OCR | Extraction de champs |
|---|---|---|
| Question | Quel texte y a-t-il ? | Que signifie ce texte ? |
| Résultat | « 12345 » | `InvoiceNumber: 12345` |

## Les 5 étapes

```
1. Ingestion de la sortie OCR
2. Détection des champs et des candidats
3. Association des champs
4. Normalisation et standardisation
5. Intégration aux systèmes de l'entreprise
```

## 1. Ingestion de la sortie OCR

On reçoit le résultat de l'OCR :

| Élément | Contenu |
|---|---|
| **Texte brut** | Les caractères et mots extraits |
| **Métadonnées de position** | Coordonnées des cadres, page, ordre de lecture |
| **Scores de confiance** | La certitude de l'OCR pour chaque élément |
| **Mise en page** | Structure, retours à la ligne, paragraphes |

> **Pourquoi la position compte.** « 12345 » peut être un numéro de facture, un identifiant client ou un téléphone. Son **emplacement** dans le document aide à trancher.

## 2. Détection des champs : 3 approches

### Par modèles (templates)

Des **règles** et de la correspondance de motifs :

- Mises en page prédéfinies, avec la position connue des champs et des mots-clés d'ancrage.
- Recherche de paires libellé-valeur : « Invoice Number: », « Date: », « Total: ».
- **Expressions régulières**.

### Par machine learning

On entraîne un modèle sur un corpus de documents d'exemple. Les modèles **transformer** sont souvent utilisés, car ils exploitent bien les indices de contexte.

Modes d'entraînement : **supervisé** (données étiquetées), **auto-supervisé** (pré-entraînement sur de gros corpus), **multimodal** (texte, visuel et position combinés).

### Par IA générative

Grâce aux **LLM** :

| Technique | Principe |
|---|---|
| **Extraction par prompt** | On donne au LLM le texte du document et un **schéma** ; il associe le texte aux champs du schéma |
| **Few-shot learning** | Quelques exemples suffisent pour des champs personnalisés |
| **Chain-of-thought** | On guide le modèle pas à pas dans son raisonnement |

### Comparaison

| | Templates | Machine learning | IA générative |
|---|---|---|---|
| Fondement | Règles écrites à la main | Modèle entraîné sur des exemples | LLM + schéma |
| Points forts | Précis sur des documents connus, **rapide**, **explicable** | Gère des mises en page variées | Souple, peu d'exemples nécessaires |
| Limites | Création **manuelle**, fragile si la mise en page change | Demande des données d'entraînement | Demande de la puissance de calcul |

## 3. Association des champs

### Les paires clé-valeur

Pour des valeurs simples (fournisseur, date, total) :

| Famille | Techniques |
|---|---|
| **Analyse de proximité** | Regroupement spatial, ordre de lecture, alignement et position |
| **Reconnaissance linguistique** | **Reconnaissance d'entités nommées** (dates, montants, noms), étiquetage grammatical, analyse des dépendances |

### Les tableaux

Une facture contient souvent un tableau de lignes d'articles.

- **Détecter** le tableau : CNN spécialisés, détection d'objets, analyse par graphe.
- **Associer** les cellules aux champs : association **ligne-colonne**, détection des **en-têtes**, traitement hiérarchique pour les tableaux imbriqués et sous-totaux.

### Scores de confiance et validation

| Type | Principe |
|---|---|
| **Confiance OCR** | Héritée de la reconnaissance du texte |
| **Confiance du motif** | L'extraction correspond-elle au format attendu ? |
| **Validation du contexte** | La valeur a-t-elle du sens dans ce document ? |
| **Validation croisée** | Les champs sont-ils cohérents entre eux ? |

> **Exemple de validation croisée.** La somme des lignes d'articles doit être égale au total de la facture.

## 4. Normalisation et standardisation

Les valeurs brutes sont mises dans un **format cohérent**, puis vérifiées.

| Type | Exemple |
|---|---|
| **Dates** | `15/08/2024` et `08-15-2024` → format ISO `2024-08-15` |
| **Montants et nombres** | Symboles monétaires, séparateurs de milliers, décimales |
| **Texte** | Casse, encodage, développement des abréviations |

Validation :

| Famille | Contrôles |
|---|---|
| **Par règles** | Format (téléphone, e-mail), plage de valeurs, champs obligatoires présents |
| **Statistique** | Valeurs aberrantes, comparaison à l'historique, cohérence entre documents |

## 5. Intégration aux systèmes

Les champs sont envoyés vers les systèmes en aval :

| Cible | Action |
|---|---|
| **Base de données** | Associer les champs aux colonnes et tables |
| **API** | Mettre les données au format attendu par une API REST |
| **Files de messages** | Préparer des messages pour un traitement asynchrone |

Transformations possibles : renommer un champ, convertir un type de données, appliquer une règle métier.

On produit aussi un **rapport de qualité** : scores de confiance par champ, évaluation par document, classement des erreurs.

#### Point examen : question officielle du module — l'IA générative améliore l'extraction de données en utilisant des modèles de langage sémantiques pour associer précisément les valeurs extraites aux champs. Elle ne code pas des règles à la main et ne crée pas de nouveaux documents.

## Exercices rapides

**1.** Quelle différence entre l'OCR et l'extraction de champs ?

**2.** Cite les trois approches de détection des champs.

**3.** Quelle approche utilise des expressions régulières et des mises en page prédéfinies ?

**4.** Donne deux avantages et une limite de l'approche par templates.

**5.** Dans l'extraction par prompt, que fournit-on au LLM ?

**6.** Qu'est-ce que la validation croisée ? Donne un exemple.

**7.** Dans quelle étape convertit-on toutes les dates au même format ?

**8.** Pourquoi la position d'un texte dans le document est-elle utile ?

<details>
<summary>Voir le corrigé</summary>

**1.** L'OCR indique quel texte existe ; l'extraction de champs indique ce qu'il signifie et à quel champ il appartient.

**2.** Par modèles (templates), par machine learning, par IA générative.

**3.** L'approche par templates.

**4.** Avantages : grande précision sur les documents connus, rapidité, résultats explicables (deux suffisent). Limite : création manuelle des modèles, ou difficulté avec les variations de mise en page.

**5.** Le texte du document et la définition d'un schéma.

**6.** Vérifier la cohérence entre champs extraits ; par exemple, la somme des lignes doit égaler le total de la facture.

**7.** La normalisation et standardisation (étape 4).

**8.** Parce qu'une même valeur, comme « 12345 », peut désigner des champs différents selon son emplacement.

</details>
