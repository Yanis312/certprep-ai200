# Remets dans l'ordre — les étapes à connaître

## L'essentiel

- L'AI-901 contient des questions **interactives** où il faut **remettre des étapes dans l'ordre** (build list).
- Cette fiche réunit **toutes les séquences** du cours, sur une seule page.
- Méthode : apprends la **première** et la **dernière** étape de chaque séquence, le milieu se déduit.

## Azure

**La hiérarchie Azure (4 niveaux)**

1. Tenant
2. Abonnement
3. Groupe de ressources
4. Ressource

## Traitement du langage

**Préparer le texte (exemple)**

1. Normalisation (minuscules, sans ponctuation)
2. Suppression des mots vides
3. Stemming ou lemmatisation

**TF-IDF**

1. TF : compter le mot dans le document
2. IDF : `log(N / df)`
3. TF-IDF : `tf × idf`

**TextRank**

1. Construire un graphe (phrases = nœuds)
2. Calculer les rangs
3. Extraire les phrases les mieux classées

**L'évolution des techniques**

Fréquence → TF-IDF → Bag-of-words → Word2Vec / GloVe → Attention → GPT

## Parole

**Reconnaissance vocale (6 étapes)**

1. Capture audio
2. Prétraitement (MFCC)
3. Modèle acoustique (phonèmes)
4. Modèle de langage
5. Décodage (beam search)
6. Post-traitement

**Synthèse vocale (4 étapes)**

1. Normalisation du texte
2. Analyse linguistique (G2P)
3. Génération de la prosodie
4. Synthèse (modèle acoustique → mel-spectrogramme → vocodeur)

**Dans le lab vocal**

Listening → Processing → Speaking

## Vision

**Un CNN**

1. Filtres → cartes de caractéristiques
2. Pooling
3. Aplatissement
4. Réseau entièrement connecté
5. Couche de sortie (softmax)

**Entraîner un CNN**

1. Poids aléatoires
2. Prédiction
3. Calcul de la perte
4. Ajustement des poids
5. Répéter sur plusieurs époques

**La diffusion**

1. Pixels aléatoires (bruit)
2. Retirer du bruit
3. Comparer au prompt
4. Répéter jusqu'à l'image finale

**L'évolution des modèles de vision**

Classifieurs statistiques → CNN → Transformers multimodaux

## Extraction d'informations

**Les 2 grandes étapes**

OCR → extraction de champs

**Pipeline OCR (5 étapes)**

1. Acquisition de l'image
2. Prétraitement
3. Détection des zones de texte
4. Reconnaissance des caractères
5. Sortie et post-traitement

**Pipeline d'extraction de champs (5 étapes)**

1. Ingestion de la sortie OCR
2. Détection des champs
3. Association des champs
4. Normalisation
5. Intégration aux systèmes

**Content Understanding en code**

1. Créer le client
2. `begin_analyze` (lancer)
3. `poller.result()` (attendre)
4. Lire `contents` (markdown, fields)

## RAG et Foundry IQ

**Indexation (avant)**

1. Extraire le texte
2. Découper en chunks
3. Créer les embeddings
4. Créer l'index

**Exécution (à chaque question)**

1. L'utilisateur envoie un prompt
2. Recherche dans l'index
3. Ajout du contexte au prompt
4. Réponse ancrée du modèle

**Connecter Foundry IQ à un agent (6 étapes)**

1. Créer ou connecter Azure AI Search
2. Créer une base de connaissances et ses sources
3. Créer ou choisir un agent
4. Ajouter la base à l'agent comme outil MCP
5. Écrire les instructions
6. Tester dans le playground

## Code : appeler un agent

1. Créer `AIProjectClient` (endpoint + `DefaultAzureCredential`)
2. Récupérer l'agent : `project_client.agents.get(...)`
3. Obtenir le client OpenAI : `get_openai_client()`
4. `responses.create(...)` avec la référence d'agent
5. Lire `response.output_text`

#### Point examen : si tu hésites dans une question d'ordre, place d'abord la première et la dernière étape, puis demande-toi ce dont chaque étape a besoin pour démarrer : on ne peut pas indexer avant d'avoir des chunks, ni décoder avant d'avoir des phonèmes.

## Exercices rapides

**1.** Remets dans l'ordre : groupe de ressources, tenant, ressource, abonnement.

**2.** Remets dans l'ordre : décodage, capture audio, post-traitement, modèle acoustique, prétraitement, modèle de langage.

**3.** Remets dans l'ordre : créer l'index, découper en chunks, extraire le texte, créer les embeddings.

**4.** Remets dans l'ordre : reconnaissance des caractères, acquisition de l'image, sortie, prétraitement, détection des zones de texte.

**5.** Remets dans l'ordre : prosodie, normalisation du texte, synthèse, analyse linguistique.

**6.** Remets dans l'ordre : `poller.result()`, créer le client, lire `contents`, `begin_analyze`.

<details>
<summary>Voir le corrigé</summary>

**1.** Tenant, abonnement, groupe de ressources, ressource.

**2.** Capture audio, prétraitement, modèle acoustique, modèle de langage, décodage, post-traitement.

**3.** Extraire le texte, découper en chunks, créer les embeddings, créer l'index.

**4.** Acquisition de l'image, prétraitement, détection des zones de texte, reconnaissance des caractères, sortie.

**5.** Normalisation du texte, analyse linguistique, prosodie, synthèse.

**6.** Créer le client, `begin_analyze`, `poller.result()`, lire `contents`.

</details>
