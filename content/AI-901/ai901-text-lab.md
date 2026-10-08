# Lab — analyse de texte dans Microsoft Foundry

## Objectif

Essayer les **deux approches** d'analyse de texte : un modèle généraliste dans le chat playground, puis les analyseurs spécialisés d'**Azure Language**.

- **Durée** : environ 20 minutes.
- Tout se fait dans le **portail Foundry**, sans installer quoi que ce soit.

## Étape 1 — Créer le projet

1. Ouvre `https://ai.azure.com` et connecte-toi.
2. Active **New Foundry** dans la barre du haut si besoin.
3. Crée un projet (ou choisis-en un existant). Dans **Advanced options** :
   - **Foundry resource** : un nom valide ;
   - **Subscription** : ton abonnement ;
   - **Resource group** : nouveau ou existant ;
   - **Region** : une région recommandée.
4. **Create**, puis attends quelques minutes.

Selon tes permissions, tu devras peut-être **décocher** l'option de création des ressources recommandées.

## Étape 2 — Déployer un modèle généraliste

1. Page **Discover**, onglet **Models**.
2. Cherche **gpt-5-mini** et ouvre sa page.
3. **Deploy** avec les paramètres par défaut.
4. Tu arrives dans le **chat playground**.

Si tu n'as pas assez de quota dans ta région pour gpt-5-mini, prends un autre modèle de chat GPT (gpt-5-nano, gpt-5.4-mini), ou crée un projet dans une autre région. Tu peux aussi réutiliser un déploiement GPT existant.

## Étape 3 — Résumer un texte

1. Masque le volet de navigation pour gagner de la place.
2. Dans **Instructions**, écris :

```
You are an AI assistant that analyzes and summarizes text.
```

3. Envoie ce prompt (`CTRL+ENTER` pour aller à la ligne), suivi de l'article du lab sur le Commodore 64 :

```
Summarize this review as a single short paragraph:
```

**Ce que tu dois observer** : un paragraphe court qui reprend les points positifs (64K de RAM, graphismes, puce sonore SID), les points négatifs (clavier, documentation, prix des périphériques) et la conclusion.

Les LLM reposent sur des techniques issues du NLP : ils sont bons pour résumer, extraire des entités nommées et classer des documents par sentiment, sujet ou style.

## Étape 4 — Ouvrir les services Azure Language

1. Menu du haut : **Build**.
2. Menu de gauche : **Services**.

Tu vois les **AI Services** des Foundry Tools (anciennement Microsoft Cognitive Services) : parole, traduction, langage, content understanding.

## Étape 5 — Détecter la langue

1. Choisis l'analyseur **Azure Language - Language detection**.
2. Dans **Input text**, sélectionne un exemple fourni, puis **Detect**.
3. Clique sur l'icône **Edit** pour modifier le texte. Tu peux choisir un autre exemple, taper ton texte ou charger un fichier.
4. Essaie avec cette étiquette trouvée sur un vieil ordinateur :

```
CPC 464
Art.-Nr.: 31020
Serien-Nr.: 464-87-041256
220–240 V ~ 50 Hz
40 W
Hergestellt in Korea
SCHNEIDER RUNDFUNKWERKE AG
Türkheim/Unterallgäu
Bundesrepublik Deutschland
```

**Ce que tu dois observer** : la langue détectée et son score de confiance. Le texte contient peu de phrases et beaucoup de codes : c'est un bon test.

Pour aller plus loin, la page AI Services propose aussi un service **Text Translator**.

## Étape 6 — Identifier les PII

1. Dans la liste **Type**, choisis **Text PII Redaction**.
2. Sélectionne un exemple, puis **Detect**.
3. **Edit**, puis essaie avec cette facture :

```
Tailspin Toys Ltd
Invoice
14 September 1984

Customer:
  Margaret Ellis
  128 High Street, Reading, Berkshire RG1 2AB
  Telephone: 021 685 4215

Item: ZX Spectrum 48K home computer (includes power supply, RF lead, and user manual)
Price: £79.00
Payment received:  £79.00
```

**Ce que tu dois observer** : le nom, l'adresse et le téléphone repérés, chacun avec sa catégorie.

Azure Language reconnaît une longue liste de PII : noms de personnes, adresses e-mail, numéros de téléphone, adresses postales.

## Étape 7 — Lire le code d'exemple

Ouvre l'onglet **Code** à droite. Le code d'identification des PII ressemble à ceci :

```python
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

def authenticate_client():
     ta_credential = AzureKeyCredential(key)
     text_analytics_client = TextAnalyticsClient(
             endpoint=endpoint,
             credential=ta_credential)
     return text_analytics_client

client = authenticate_client()

def pii_recognition_example(client):
     documents = ["$documents"]
     response = client.recognize_pii_entities(documents, language="en")
     result = [doc for doc in response if not doc.is_error]
     for doc in result:
         print("Redacted Text: {}".format(doc.redacted_text))
         for entity in doc.entities:
             print("Entity: {}".format(entity.text))
             print(" Category: {}".format(entity.category))
             print(" Confidence Score: {}".format(entity.confidence_score))
```

Tu retrouves ce que dit le cours : `TextAnalyticsClient`, `AzureKeyCredential`, `recognize_pii_entities` et `redacted_text`. L'endpoint et la clé figurent dans la fenêtre d'exemple.

## Ce que le lab montre

| | Modèle généraliste | Azure Language |
|---|---|---|
| Utilisé pour | Le résumé | La langue et les PII |
| Tu donnes | Un prompt | Un texte à un analyseur |
| Tu reçois | Un paragraphe rédigé | Des valeurs structurées |

Dans beaucoup de cas, les capacités natives d'un modèle génératif suffisent. Pour les besoins plus spécialisés, Azure Language fournit un service dédié.

## Nettoyage

`https://portal.azure.com` → groupe de ressources du lab → **Delete resource group** → saisis le nom pour confirmer.

## Exercices rapides

**1.** Quelle tâche le lab confie-t-il au modèle généraliste ?

**2.** Quels deux analyseurs Azure Language essaies-tu ?

**3.** Dans quel menu du portail trouve-t-on ces services ?

**4.** Que faire si tu n'as pas assez de quota pour déployer gpt-5-mini ?

**5.** Quelle méthode du SDK apparaît dans le code d'exemple pour les PII ?

<details>
<summary>Voir le corrigé</summary>

**1.** Le résumé d'un article.

**2.** La détection de langue et le masquage des PII (Text PII Redaction).

**3.** Build, puis Services.

**4.** Utiliser un autre modèle de chat GPT, comme gpt-5-nano, ou créer un projet dans une autre région.

**5.** `recognize_pii_entities`.

</details>
