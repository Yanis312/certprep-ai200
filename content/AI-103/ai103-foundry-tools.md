# Foundry Tools — les services prêts à l'emploi

## L'essentiel

- Les **Foundry Tools** sont des **API et modèles préconstruits** pour les tâches d'IA courantes.
- Ils évitent de tout confier à un agent génératif : la solution devient **moins chère et plus prévisible**.
- Ils sont hébergés dans la **ressource Foundry** associée à ton projet.
- Anciens noms à reconnaître : **Azure AI Services**, et avant ça **Azure Cognitive Services**.

## Les 5 outils

| Outil | Ce qu'il fait | Exemple |
|---|---|---|
| **Azure Language** | Analyse du texte : extraction d'entités, analyse de sentiment, résumé. Permet aussi de créer des modèles de langage conversationnel et des solutions de questions-réponses | Repérer les noms de personnes et de lieux dans des e-mails |
| **Azure Speech** | Texte vers parole, parole vers texte, voix en direct pour apps et agents conversationnels | Sous-titrer une réunion en temps réel |
| **Azure Translator** | Traduit du texte entre un grand nombre de langues | Traduire une fiche produit en 12 langues |
| **Azure Document Intelligence** | Extrait des champs de documents complexes avec des modèles préconstruits ou personnalisés | Lire factures, reçus et formulaires |
| **Azure Content Understanding** | Analyse **multimodale** : extrait des données de formulaires, documents, images, vidéos et flux audio | Analyser une vidéo de formation et en sortir les sujets abordés |

## Document Intelligence ou Content Understanding ?

| | Document Intelligence | Content Understanding |
|---|---|---|
| Entrées | Documents (factures, reçus, formulaires) | Documents, **images, vidéos, audio** |
| Mot-clé | Extraction de **champs** | Analyse **multimodale** |

Si l'énoncé parle de vidéo ou d'audio, c'est Content Understanding.

## Pourquoi ne pas tout faire avec un LLM ?

Un LLM sait traduire ou détecter un sentiment. Mais un outil dédié apporte :

- un **coût** plus bas pour une tâche répétitive à gros volume ;
- un résultat **prévisible**, au même format à chaque appel ;
- pas de prompt à concevoir ni à maintenir.

> **Exemple.** Tu dois classer 2 millions d'avis clients par sentiment chaque mois. Azure Language renvoie directement un score positif, neutre ou négatif. Passer chaque avis à un LLM coûterait plus cher et donnerait des formulations variables.

## Comment on les utilise

1. L'application cliente se connecte à l'**endpoint propre à l'outil**, dans la ressource Foundry.
2. Elle s'authentifie avec la **clé d'authentification du projet** ou par **jeton** (token).
3. Elle appelle l'**API ou le SDK propre à l'outil**.

Certains outils ont aussi une interface de configuration et de test dans le portail Foundry.

## Exemple : analyse de sentiment avec Azure Language

```python
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient

client = TextAnalyticsClient(
    endpoint="https://<ressource>.cognitiveservices.azure.com/",
    credential=AzureKeyCredential("<clé>"),
)

resultat = client.analyze_sentiment(["La livraison était rapide, merci !"])[0]
print(resultat.sentiment)            # positive
print(resultat.confidence_scores)    # scores positif / neutre / négatif
```

Remarque le nom `cognitiveservices` dans l'adresse et `textanalytics` dans le SDK : ce sont les anciens noms, toujours présents dans certaines API.

## Ressource autonome ou ressource Foundry ?

On peut encore créer certains outils comme **ressources Azure individuelles**, hors de Foundry. Pour un **nouveau projet**, Microsoft recommande d'utiliser les outils fournis dans une **ressource Foundry**.

#### Point examen : « services préconstruits pour des tâches d'IA courantes » = Foundry Tools. Ne confonds pas avec Foundry Models (le catalogue de modèles) ni Foundry IQ (les connaissances).

## Exercices rapides

Quel Foundry Tool choisis-tu ?

**1.** Générer la version audio d'un article de blog.

**2.** Extraire le total et la TVA de milliers de factures fournisseurs.

**3.** Repérer les moments clés dans des enregistrements vidéo de réunions.

**4.** Résumer des tickets de support et en extraire les noms de produits cités.

**5.** Cite les deux anciens noms des Foundry Tools.

<details>
<summary>Voir le corrigé</summary>

**1.** Azure Speech (texte vers parole).

**2.** Azure Document Intelligence.

**3.** Azure Content Understanding : c'est le seul qui analyse la vidéo.

**4.** Azure Language (résumé et extraction d'entités).

**5.** Azure AI Services, et avant cela Azure Cognitive Services.

</details>
