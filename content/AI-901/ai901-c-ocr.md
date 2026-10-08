# Optical character recognition — l'OCR

## L'essentiel

- L'**OCR** (reconnaissance optique de caractères) convertit le **texte visible dans une image** en **texte modifiable et interrogeable**.
- Il évite la saisie manuelle.
- Le pipeline OCR compte **5 étapes**.
- À chaque étape, il existe des méthodes **classiques** et des méthodes de **deep learning**.

## D'où vient le texte

- Factures et reçus scannés
- Photos de documents
- Fichiers PDF contenant des images de texte
- Captures d'écran
- Formulaires et **notes manuscrites**

## Les 5 étapes

```
1. Acquisition de l'image
2. Prétraitement et amélioration
3. Détection des zones de texte
4. Reconnaissance et classification des caractères
5. Génération de la sortie et post-traitement
```

## 1. Acquisition de l'image

L'image entre dans le système : photo de smartphone, document scanné, image extraite d'une vidéo, page PDF convertie en image.

La **qualité de l'image** à cette étape influence fortement la précision finale.

## 2. Prétraitement et amélioration

On prépare l'image pour mieux reconnaître le texte.

| Technique | But |
|---|---|
| **Réduction du bruit** | Retirer taches, poussières et défauts de scan |
| **Ajustement du contraste** | Mieux séparer le texte du fond |
| **Correction de l'inclinaison** (skew) | Redresser un document tourné, pour aligner les lignes |
| **Optimisation de la résolution** | Amener l'image à la résolution idéale |

> **Exemple.** Tu photographies un reçu froissé, de travers, sous une lumière faible. Le prétraitement le redresse, renforce le contraste et efface les taches.

## 3. Détection des zones de texte

Le système repère **où** se trouve le texte.

| Technique | But |
|---|---|
| **Analyse de la mise en page** | Distinguer texte, images, graphiques et espaces vides |
| **Identification des blocs de texte** | Regrouper les caractères en mots, lignes et paragraphes |
| **Ordre de lecture** | Établir le sens de lecture (gauche à droite, haut en bas pour l'anglais) |
| **Classification des zones** | Reconnaître titres, corps de texte, légendes, tableaux |

## 4. Reconnaissance et classification des caractères

C'est le **cœur** de l'OCR : chaque caractère est identifié.

| Technique | But |
|---|---|
| **Extraction de caractéristiques** | Analyser la forme, la taille et les traits distinctifs de chaque caractère |
| **Correspondance de motifs** | Comparer ces caractéristiques à des modèles entraînés sur différentes polices et écritures |
| **Analyse du contexte** | Utiliser les caractères et mots voisins, des dictionnaires et des modèles de langage |
| **Score de confiance** | Donner une probabilité à chaque caractère reconnu |

> **Exemple.** Le caractère lu peut être « 0 » ou « O ». Dans « 2O24 », le contexte indique un chiffre : l'analyse du contexte corrige en « 2024 ».

## 5. Génération de la sortie et post-traitement

Les résultats deviennent un texte utilisable.

| Technique | But |
|---|---|
| **Compilation du texte** | Assembler les caractères en mots et phrases |
| **Conservation du format** | Garder paragraphes, retours à la ligne, espacements |
| **Cartographie des coordonnées** | Enregistrer la **position exacte** de chaque élément dans l'image d'origine |
| **Validation de la qualité** | Vérifier orthographe et grammaire pour repérer les erreurs |

La position du texte est conservée : elle sera indispensable pour l'extraction de champs.

## Classique ou deep learning

À chaque étape, deux familles de méthodes existent. Inutile d'apprendre tous les noms ; retiens le principe.

| | Méthodes classiques | Deep learning |
|---|---|---|
| Principe | Règles et algorithmes mathématiques | Modèles entraînés sur des données |
| Exemples | Filtres, seuillage, comparaison à des gabarits | **CNN**, **transformers**, modèles de langage |

## Mémo : quelle étape fait quoi

| Action | Étape |
|---|---|
| Redresser un scan penché | 2. Prétraitement |
| Trouver où est le tableau | 3. Détection des zones de texte |
| Décider que c'est un « A » | 4. Reconnaissance des caractères |
| Noter la position de chaque mot | 5. Sortie et post-traitement |

#### Point examen : question officielle du module — l'OCR (optical character recognition) sert à convertir des images de texte en données texte lisibles par une machine. Les deux autres développements proposés pour le sigle sont inventés.

## Exercices rapides

**1.** Que signifie OCR ?

**2.** Combien d'étapes compte le pipeline OCR ? Cite-les.

**3.** Dans quelle étape corrige-t-on l'inclinaison d'un document ?

**4.** Quelle étape est le cœur de l'OCR ?

**5.** À quoi sert le score de confiance ?

**6.** Dans quelle étape enregistre-t-on la position de chaque élément de texte ?

**7.** Quelle technique regroupe les caractères en mots, lignes et paragraphes ?

**8.** Pourquoi la qualité de l'image de départ compte-t-elle ?

<details>
<summary>Voir le corrigé</summary>

**1.** Optical character recognition, reconnaissance optique de caractères.

**2.** Cinq : acquisition de l'image, prétraitement, détection des zones de texte, reconnaissance des caractères, génération de la sortie et post-traitement.

**3.** Le prétraitement (étape 2).

**4.** La reconnaissance et classification des caractères (étape 4).

**5.** À indiquer à quel point le système est sûr de chaque caractère reconnu.

**6.** La génération de la sortie et post-traitement (étape 5).

**7.** L'identification des blocs de texte, à l'étape 3.

**8.** Parce qu'elle influence fortement la précision finale de l'extraction.

</details>
