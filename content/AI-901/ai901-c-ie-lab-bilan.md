# Lab et bilan — concepts de l'extraction d'informations

## Le lab : explorer l'extraction d'informations

- **Durée** : environ 15 minutes.
- **Aucun compte Azure nécessaire** : tout tourne dans le navigateur.
- But : voir les **deux étapes**, l'OCR puis l'extraction de champs.

### Préparation

1. Ouvre `https://aka.ms/info-extractor` et attends le chargement du modèle (**Microsoft Phi 3.5 Mini**).
2. Télécharge `pcbs.zip` depuis `https://aka.ms/pcb-images` et `receipts.zip` depuis `https://aka.ms/receipts`, puis extrais-les.

Si le modèle est trop lent, l'interrupteur **Use Generative AI** permet de passer en mode Basic (traitement de texte et recherche de motifs).

### Partie 1 — Lire du texte avec l'OCR

1. Vérifie que **OCR/Read** est sélectionné, avec l'image d'exemple (une carte de visite).
2. Lance l'analyse et regarde le texte extrait dans le panneau **Result**.
3. Charge une image de circuit imprimé (PCB) et relance l'analyse.

**Ce que tu dois observer** : le texte imprimé sur l'objet est converti en texte numérique.

### Partie 2 — Extraire les champs d'un reçu

1. Passe de **OCR/Read** à **Receipt Fields**.
2. Lance l'analyse sur le reçu d'exemple et patiente.
3. Regarde l'onglet **Fields** : les valeurs identifiées (nom de l'entreprise, téléphone, date, montants). L'onglet **Result** contient tout le texte OCR.
4. Recommence avec les reçus téléchargés.

### Ce qu'il faut retenir du lab

| Mode | Étape montrée | Résultat |
|---|---|---|
| **OCR/Read** | OCR | Tout le texte de l'image |
| **Receipt Fields** | OCR **+** extraction de champs par IA générative | Des champs nommés avec leur valeur |

Dans Microsoft Foundry, l'outil **Content Understanding** est une solution d'extraction **multimodale** : documents, images, fichiers audio et vidéos.

## Le module en 10 lignes

1. L'extraction d'informations tire des **champs structurés** d'un contenu **non structuré**.
2. Deux étapes : **OCR**, puis **extraction de champs**.
3. L'**OCR** convertit des images de texte en **texte lisible par une machine**.
4. Pipeline OCR en 5 étapes : acquisition, prétraitement, détection des zones, reconnaissance des caractères, sortie.
5. L'OCR dit **quel texte existe** ; l'extraction de champs dit **ce qu'il signifie**.
6. Pipeline d'extraction en 5 étapes : ingestion, détection, association, normalisation, intégration.
7. Trois approches de détection : **templates**, **machine learning**, **IA générative**.
8. L'IA générative associe le texte aux champs d'un **schéma** grâce au sens.
9. La **validation croisée** vérifie la cohérence entre champs (lignes = total).
10. Services Azure : **Document Intelligence** et **Content Understanding**.

## Les deux pipelines côte à côte

```
OCR                                  EXTRACTION DE CHAMPS

1. Acquisition de l'image            1. Ingestion de la sortie OCR
2. Prétraitement                     2. Détection des champs
3. Détection des zones de texte      3. Association des champs
4. Reconnaissance des caractères     4. Normalisation
5. Sortie et post-traitement   ───►  5. Intégration aux systèmes
```

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Quelle affirmation définit correctement l'extraction d'informations par IA ? | **Analyser un contenu non structuré** pour identifier et extraire les champs et valeurs pertinents |
| Comment l'OCR est-il utilisé dans l'extraction d'informations ? | L'**optical character recognition** convertit des **images de texte** en texte lisible par une machine |
| Comment l'IA générative améliore-t-elle l'extraction de données ? | En utilisant des **modèles de langage sémantiques** pour associer précisément les valeurs extraites aux champs |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

Les mauvaises réponses à écarter : l'extraction n'est ni une requête SQL ni une copie de fichiers. « Online Content Retrieval » et « Open Conversion Routine » n'existent pas. L'IA générative ne code pas de règles à la main et ne crée pas de nouveaux documents.

#### Point examen : le guide d'étude demande de décrire l'extraction d'informations à partir de documents et de formulaires. Retiens l'ordre : OCR d'abord, extraction de champs ensuite, et les services Document Intelligence et Content Understanding.

## Exercices rapides

**1.** Dans le lab, quel mode montre uniquement l'OCR ?

**2.** Dans le lab, quel onglet affiche les champs extraits d'un reçu ?

**3.** Quelle étape vient en premier : l'extraction de champs ou l'OCR ?

**4.** Quel outil Foundry extrait des informations de documents, images, audio et vidéos ?

**5.** OCR ou extraction de champs ? (a) Redresser un scan. (b) Décider que « 6.97 » est le total. (c) Convertir une date au format ISO. (d) Reconnaître la lettre « A ».

<details>
<summary>Voir le corrigé</summary>

**1.** OCR/Read.

**2.** L'onglet Fields.

**3.** L'OCR.

**4.** Content Understanding.

**5.** (a) OCR. (b) Extraction de champs. (c) Extraction de champs. (d) OCR.

</details>
