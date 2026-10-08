# Explore the model catalog — le catalogue de modèles

## L'essentiel

- Le catalogue **Foundry Models** est le point central pour découvrir et comparer les modèles : plus de 1 900.
- Deux grandes catégories selon **qui facture** : modèles vendus directement par Azure, modèles de partenaires et de la communauté.
- Chaque modèle a une **model card** (fiche d'identité).
- On filtre par collection, capacités, source, tâches d'inférence, méthodes de fine-tuning, secteur.
- Il faut savoir distinguer **LLM**, **SLM**, modèles de **raisonnement** et modèles **spécialisés**.

## Les deux catégories du catalogue

| Catégorie | Facturation | Exemples |
|---|---|---|
| **Foundry Models vendus directement par Azure** | Directement sur ton abonnement Azure | Modèles Azure OpenAI, modèles Microsoft et d'autres fournisseurs |
| **Foundry Models de partenaires et de la communauté** | Chacun a sa propre licence et sa propre tarification | Modèles fournis par des partenaires de confiance et la communauté |

## La model card

Elle présente les informations clés d'un modèle : **fournisseur**, **capacités**, **métriques de benchmark**, considérations d'**IA responsable**, **options de déploiement**.

## Les 6 filtres

| Filtre | Ce qu'il permet | Exemple |
|---|---|---|
| **Collection** | Regrouper les modèles | Modèles fournis directement dans Azure, dépôt Hugging Face |
| **Capabilities** | Capacités précises | Raisonnement, tool calling, traitement multimodal |
| **Source** | Le fournisseur | Azure OpenAI, Microsoft, Cohere, Mistral, Meta, Anthropic |
| **Inference tasks** | La tâche | Génération de texte, résumé, traduction, génération d'image, synthèse vocale |
| **Fine-tuning methods** | Techniques de fine-tuning prises en charge | — |
| **Industry** | Modèles entraînés sur des données d'un secteur | Médical, juridique |

Les modèles spécialisés par secteur surpassent souvent les modèles généralistes **dans leur domaine**.

## LLM ou SLM ?

| | LLM (Large Language Model) | SLM (Small Language Model) |
|---|---|---|
| Exemples | GPT-5, Mistral Large, Llama 3 70B | Phi-4, modèles Mistral OSS, Llama 3 8B |
| Point fort | Raisonnement profond, contenu complexe, grand contexte | Efficacité et coût bas sur les tâches NLP courantes |
| Ressources | Demande plus de calcul | Tourne sur du matériel modeste ou des **appareils edge** |
| Quand | La tâche est complexe | La **vitesse** et le **coût** comptent plus que le raisonnement le plus poussé |

> **Exemple.** Un assistant embarqué dans une borne en magasin, avec peu de puissance : un SLM comme Phi-4. Un outil qui analyse des contrats de 200 pages et raisonne dessus : un LLM.

## Chat completion et modèles de raisonnement

- **Chat completion** : la plupart des modèles de langage du catalogue. Ils génèrent du texte cohérent et adapté au contexte. Ils alimentent les interfaces conversationnelles et la génération de contenu.
- **Modèles de raisonnement** (par exemple Claude Opus 4.6) : pour les tâches complexes en **mathématiques, code, sciences, stratégie, logistique**. Ils décomposent un problème et peuvent montrer leur raisonnement.

## Les modèles spécialisés

| Type | Exemple | Ce qu'il fait |
|---|---|---|
| **Embedding** | text-embedding-3-large, text-embedding-3-small, embeddings Cohere | Convertit du texte en représentation numérique |
| **Génération d'images** | GPT-image-1 | Crée une image à partir d'une description |
| **Génération de vidéos** | Sora 2 | Crée une vidéo à partir d'une description |
| **Analyse d'images** | GPT-4.1 | Accepte du texte et des images, répond en langage naturel |
| **Text to speech** | GPT-4o-tts | Transforme du texte en voix synthétisée |
| **Speech to text** | GPT-4o-transcribe | Transforme de l'audio parlé en transcription |

## Zoom sur les embeddings

Un modèle d'embedding transforme un texte en **vecteur de nombres**. Deux textes de sens proche donnent des vecteurs proches.

```python
# Idée simplifiée
embedding("Comment retourner un article ?")   # → [0.12, -0.48, 0.91, ...]
embedding("Procédure de retour produit")       # → [0.10, -0.51, 0.89, ...]  proche
embedding("Recette de la tarte aux pommes")    # → [-0.77, 0.30, 0.02, ...]  éloigné
```

Usages : **recherche sémantique**, systèmes de **recommandation**, et **RAG** (Retrieval Augmented Generation), où l'on retrouve l'information par le **sens** et non par mots-clés exacts.

## Modèles régionaux et de domaine

Certains modèles sont optimisés pour une langue, une région ou un secteur : entraînés sur de la littérature médicale, des documents juridiques, ou un corpus dans une langue précise. Ils dépassent souvent les généralistes quand tu as besoin de cette spécialisation.

#### Point examen : « trouver une information par le sens », « recherche sémantique » ou « RAG » dans un énoncé = modèle d'embedding. « Appareil edge » ou « matériel limité » = SLM.

## Exercices rapides

Quel type de modèle choisis-tu ?

**1.** Un moteur de recherche interne qui retrouve les documents par leur sens.

**2.** Un assistant qui doit tourner sur une tablette sans connexion fiable.

**3.** Un outil qui résout des problèmes complexes d'optimisation logistique.

**4.** Une application qui transcrit les appels du service client.

**5.** Un modèle OpenAI déployé depuis Foundry : sur quoi est-il facturé ?

**6.** Quel filtre du catalogue utilises-tu pour ne voir que les modèles capables d'appeler des fonctions ?

<details>
<summary>Voir le corrigé</summary>

**1.** Un modèle d'embedding, par exemple text-embedding-3-large.

**2.** Un SLM, par exemple Phi-4, qui tourne sur du matériel modeste ou edge.

**3.** Un modèle de raisonnement.

**4.** Un modèle speech to text, par exemple GPT-4o-transcribe.

**5.** Directement sur l'abonnement Azure : c'est un modèle vendu directement par Azure.

**6.** Le filtre Capabilities, avec « tool calling ».

</details>
