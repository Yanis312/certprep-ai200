# Introduction et Overview — l'extraction d'informations

## L'essentiel

- L'**extraction d'informations** tire des **champs de données structurés** d'un contenu **non structuré** : documents, images, et même vidéos et audio.
- Elle combine deux étapes : l'**OCR** (lire le texte) puis l'**extraction de champs** (comprendre à quoi il correspond).
- Elle sert de base à l'**automatisation** de tâches : factures, reçus, contrats, dossiers médicaux.
- Le choix de l'approche dépend des **documents** et des **contraintes techniques**.

## Le principe en 2 étapes

```
Document scanné  →  1. OCR  →  texte  →  2. Extraction de champs  →  données structurées
```

| Étape | Technique | Ce qu'elle fait |
|---|---|---|
| 1 | **Vision par ordinateur** (OCR) | Détecte et extrait le texte de l'image |
| 2 | **Machine learning**, et de plus en plus **IA générative** | Relie le texte à des champs précis, d'après son sens |

> **Exemple du cours.** Un reçu de café scanné pour une note de frais :

| Champ | Valeur extraite |
|---|---|
| Vendor | Fourth Coffee |
| Date | 2024-08-15 |
| Subtotal | $6.48 |
| Tax | $0.49 |
| Total Claim | $6.97 |

Autre exemple simple : lire les coordonnées sur la photo d'une **carte de visite**.

## Les scénarios courants

| Domaine | Documents | Champs extraits |
|---|---|---|
| **Finance** | Factures, reçus, relevés | Fournisseur, numéro et date de facture, lignes d'articles, taxes, totaux, moyen de paiement |
| **Juridique et conformité** | Contrats, formulaires fiscaux, d'assurance, administratifs | Parties, dates d'effet, clauses, échéanciers, numéros de police |
| **Santé** | Dossiers médicaux | Informations du patient, diagnostics, traitements, codes de facturation |
| **Chaîne logistique** | Documents d'expédition, bons de commande | Numéros de suivi, adresses, codes douaniers, quantités, délais de livraison |

## Choisir la bonne approche

### Les caractéristiques des documents

| Facteur | Conséquence |
|---|---|
| **Mise en page régulière** | Des formulaires standardisés conviennent à une approche par **modèles** (templates) |
| **Formats variés** | Il faut une solution de **machine learning**, plus complexe |
| **Gros volume** | On privilégie des modèles automatisés sur du matériel optimisé |
| **Exigence de précision** | Les usages critiques peuvent demander une validation **humaine** (human-in-the-loop) |

### Les contraintes techniques

| Facteur | À retenir |
|---|---|
| **Sécurité et confidentialité** | Les documents peuvent contenir des données sensibles : accès protégé et conformité |
| **Puissance de calcul** | Le deep learning et l'IA générative demandent beaucoup de ressources |
| **Latence** | Le temps réel peut limiter la complexité du modèle |
| **Mise à l'échelle** | Le cloud s'adapte mieux aux charges variables |
| **Intégration** | Compatibilité des API et formats de données |

## Les services Azure

Souvent, on ne construit pas tout soi-même : on s'appuie sur un service.

- **Azure Document Intelligence** dans Foundry Tools
- **Azure Content Understanding** dans Foundry Tools

Ils réduisent l'effort de développement et apportent performance, précision et mise à l'échelle.

#### Point examen : question officielle du module — l'extraction d'informations par IA consiste à analyser un contenu non structuré pour identifier et extraire les champs et valeurs utiles. Ce n'est ni une requête SQL, ni une copie de fichiers.

## Exercices rapides

**1.** Quelles sont les deux étapes d'une solution d'extraction d'informations ?

**2.** Quelle technique lit le texte dans une image ?

**3.** Dans l'exemple du reçu, quel champ vaut « Fourth Coffee » ?

**4.** Tes documents sont des formulaires tous identiques. Quelle approche est favorisée ?

**5.** Tes documents ont des mises en page très variées. Quelle approche faut-il ?

**6.** Que signifie « human-in-the-loop », et quand l'utilise-t-on ?

**7.** Cite deux services Azure pour l'extraction d'informations.

<details>
<summary>Voir le corrigé</summary>

**1.** L'OCR (détection et extraction du texte), puis l'identification des valeurs et leur association à des champs.

**2.** L'OCR, la reconnaissance optique de caractères.

**3.** Le champ Vendor (le fournisseur).

**4.** Une approche par modèles (templates).

**5.** Une solution fondée sur le machine learning.

**6.** Une validation par un humain ; on l'utilise quand l'exigence de précision est critique.

**7.** Azure Document Intelligence et Azure Content Understanding.

</details>
