# Bilan du module — Select, deploy, and evaluate

## Le module en 10 lignes

1. Le catalogue **Foundry Models** : plus de **1 900 modèles**, en deux catégories (vendus par Azure, partenaires et communauté).
2. **LLM** pour le raisonnement complexe, **SLM** pour la vitesse, le coût et l'edge.
3. Modèles spécialisés : **embedding** (recherche sémantique, RAG), image, vidéo, speech.
4. Benchmarks en 4 familles : **qualité, sécurité, coût, performance**.
5. **ASR** bas = plus sûr. **Coût estimé** = ratio 3 tokens d'entrée pour 1 de sortie. **TTFT** bas et **GTPS** haut = rapide.
6. Types de déploiement = **où** (Global, Data Zone, régional) + **facturation** (Standard, Provisioned, Batch).
7. **Global Standard** : usage général, plus grand quota. **Batch** : 50 % de réduction, asynchrone.
8. Pour appeler un modèle : **endpoint**, **authentification** (Entra ID en production), **nom du déploiement**.
9. Évaluation **manuelle**, **assistée par IA** (Groundedness, Relevance, Coherence, Fluency) et **NLP** (F1, BLEU, METEOR, ROUGE, GLEU).
10. Scores bas → prompt engineering, autre modèle, RAG, fine-tuning. Risques → filtres de contenu, durcissement du prompt, validation des sorties.

## Les options de déploiement vues par le résumé officiel

| Option | Caractéristique |
|---|---|
| **Serverless API** | Paiement à l'appel, flexible |
| **Provisioned** | Charges constantes à fort volume |
| **Managed compute** | Hébergement sur machines virtuelles |
| **Batch** | Travaux non interactifs à coût optimisé |

## Métriques : laquelle pour quoi

| Besoin | Métrique |
|---|---|
| Réponse appuyée sur le contexte fourni | Groundedness |
| Réponse qui traite la question | Relevance |
| Idées qui s'enchaînent logiquement | Coherence |
| Langue correcte et naturelle | Fluency |
| Traduction | BLEU, METEOR |
| Résumé | ROUGE |
| Classification, recherche d'information | F1-score |

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Quel benchmark indique la capacité à traiter les prompts et renvoyer des réponses complètes rapidement ? | **Throughput** (débit) |
| Quel type de déploiement convient à un usage général avec le plus grand quota ? | **Global Standard** |
| Quelle métrique mesure la correction linguistique et la qualité de la langue ? | **Fluency** |

## Et après ?

Les suites possibles citées par Microsoft :

- **intégrer** le modèle dans une application avec les SDK et API REST ;
- mettre en place du **RAG** pour ancrer les réponses dans tes données ;
- ajouter **Azure AI Content Safety** comme couche de protection ;
- **fine-tuner** le modèle sur ton domaine quand c'est possible ;
- **superviser** la production avec **Azure Monitor** et **Application Insights** : usage, latence, coûts, erreurs ;
- **itérer** à partir des retours utilisateurs et de réévaluations régulières.

#### Point examen : la supervision avec Azure Monitor et Application Insights relève du domaine « Gérer, surveiller et sécuriser les systèmes IA ». Retiens les quatre choses suivies : usage, latence, coûts, erreurs.

## Exercices rapides

**1.** Donne le sens (haut ou bas = mieux) de : Quality index, ASR, coût estimé, TTFT, GTPS.

**2.** Associe : traduction, résumé, ancrage dans le contexte → métrique.

**3.** Une startup veut tester un chatbot avec un trafic faible et imprévisible, sans contrainte de localisation. Quel type de déploiement ?

**4.** Cite les trois informations nécessaires pour appeler un modèle déployé.

**5.** Avec quels services supervise-t-on un modèle en production ?

<details>
<summary>Voir le corrigé</summary>

**1.** Quality index : haut. ASR : bas. Coût estimé : bas. TTFT : bas. GTPS : haut.

**2.** Traduction → BLEU ou METEOR. Résumé → ROUGE. Ancrage dans le contexte → Groundedness.

**3.** Global Standard : paiement au token, usage général, plus grand quota.

**4.** L'URL de l'endpoint, la clé ou le jeton d'authentification, le nom du déploiement.

**5.** Azure Monitor et Application Insights.

</details>
