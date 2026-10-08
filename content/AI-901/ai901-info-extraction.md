# Information extraction — l'extraction d'informations

## L'essentiel

- L'**extraction d'informations** trouve des données et dégage des enseignements dans des sources **non structurées** : documents et formulaires scannés, images, enregistrements audio ou vidéo.
- La base de la plupart des solutions d'analyse de documents est l'**OCR** (reconnaissance optique de caractères).
- L'OCR **localise le texte** dans une image. On lui ajoute un **modèle d'analyse** qui interprète les valeurs et extrait des **champs** précis.
- Les modèles récents savent aussi extraire de l'information d'**audio, d'images et de vidéos**.

## Donnée structurée ou non structurée

| | Structurée | Non structurée |
|---|---|---|
| Forme | Rangée dans des colonnes et des champs | Texte libre, image, son |
| Exemple | Une ligne d'un tableau de dépenses | La photo d'un ticket de caisse |
| Exploitable directement | Oui | Non, il faut d'abord **extraire** |

Le travail de l'extraction : passer de la colonne de droite à la colonne de gauche.

## Comment ça marche : OCR + modèle d'analyse

```
Photo d'un ticket
      │
      ▼
1. OCR                  repère où se trouve le texte et le lit
      │                 « CAFÉ DU PORT  12/03  TOTAL 18,50 »
      ▼
2. Modèle d'analyse     comprend ce que chaque valeur représente
      │
      ▼
3. Champs extraits      Marchand : Café du Port
                        Date : 12/03
                        Total : 18,50
```

| Étape | Rôle |
|---|---|
| **OCR** | Une technologie de **vision par ordinateur** qui identifie l'**emplacement du texte** dans une image |
| **Modèle d'analyse** | Interprète les valeurs du document pour en extraire des **champs** précis |

L'OCR seul donne du texte brut. C'est le modèle d'analyse qui sait que « 18,50 » est le **total** et non le numéro de table.

> **Exemple du cours.** Faire correspondre le texte extrait d'un reçu aux champs d'une demande de note de frais.
>
> **Exemple du site.** Extraire le numéro de série visible sur la photo d'un composant, puis s'en servir pour identifier l'ordinateur d'origine.

## Au-delà des formulaires

Historiquement, les modèles d'extraction traitaient surtout des **formulaires textuels**. Des modèles plus avancés extraient maintenant de l'information d'**enregistrements audio**, d'**images** et de **vidéos**.

## Scénarios courants

- **Traitement automatisé** de formulaires et documents dans un processus métier, comme une note de frais.
- **Numérisation à grande échelle** de formulaires papier, comme l'archivage de registres de recensement.
- **Indexation** de documents pour la recherche.
- Identification des **points clés et des actions de suivi** dans des transcriptions ou enregistrements de réunions.

## Vision ou extraction ?

| | Vision par ordinateur | Extraction d'informations |
|---|---|---|
| Question | Qu'y a-t-il sur l'image ? | Quelles **valeurs** puis-je récupérer ? |
| Sortie | Une étiquette, une boîte, une description | Des **champs** : date, montant, nom |
| Exemple | « C'est un reçu » | « Total : 18,50 » |

#### Point examen : retiens que l'OCR est la base de l'analyse de documents, et qu'il est combiné à un modèle d'analyse pour extraire des champs. Un énoncé qui parle de « récupérer le montant d'une facture » vise l'extraction d'informations, pas la simple vision.

## Exercices rapides

**1.** Que signifie OCR, et que fait cette technologie ?

**2.** Pourquoi l'OCR seul ne suffit-il pas pour remplir une note de frais ?

**3.** Donne deux exemples de sources de données non structurées.

**4.** Vision ou extraction ? (a) Dire qu'une photo montre un passeport. (b) Récupérer le numéro et la date d'expiration du passeport.

**5.** Cite deux scénarios d'usage de l'extraction d'informations.

**6.** De quels types de contenu les modèles récents savent-ils extraire de l'information, en plus des formulaires ?

<details>
<summary>Voir le corrigé</summary>

**1.** Optical character recognition, reconnaissance optique de caractères. Elle identifie l'emplacement du texte dans une image.

**2.** Parce qu'il donne du texte brut. Il faut un modèle d'analyse pour interpréter les valeurs et les associer aux bons champs.

**3.** Deux parmi : documents et formulaires scannés, images, enregistrements audio, vidéos.

**4.** (a) Vision par ordinateur. (b) Extraction d'informations.

**5.** Deux parmi : traitement de formulaires dans un processus métier, numérisation de formulaires papier, indexation de documents pour la recherche, points clés et actions de suivi de réunions.

**6.** Des enregistrements audio, des images et des vidéos.

</details>
