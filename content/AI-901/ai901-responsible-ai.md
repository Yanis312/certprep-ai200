# Responsible AI — l'IA responsable

## L'essentiel

- L'**IA responsable** regroupe les précautions pour construire des systèmes d'IA dotés de **garde-fous**, qui réduisent le risque de contenu ou d'actions automatisées **nuisibles, illégaux ou offensants**.
- Les **filtres de contenu** sont un moyen d'y parvenir, mais ils ne suffisent pas.
- Une IA responsable demande de respecter des principes **de la conception à l'exploitation**.
- **6 principes** : équité, fiabilité et sécurité, confidentialité et sécurité, inclusion, transparence, responsabilité.

## Les 6 principes

| Principe | L'idée | Ce que fait le développeur |
|---|---|---|
| **Fairness** (équité) | Les données d'entraînement sont choisies par des humains et peuvent refléter des **biais inconscients**, d'où des résultats discriminatoires | Réduire les biais dans les données et **tester l'équité** du système |
| **Reliability and safety** (fiabilité et sécurité) | L'IA repose sur des **modèles probabilistes** : elle n'est **pas infaillible** | En tenir compte et **atténuer les risques** |
| **Privacy and security** (confidentialité et sécurité) | Les données d'entraînement peuvent contenir des **informations personnelles** | Sécuriser ces données et empêcher le modèle de **révéler** des détails privés |
| **Inclusiveness** (inclusion) | Le potentiel de l'IA doit être **ouvert à tous** | Veiller à ce que la solution **n'exclue** aucun utilisateur |
| **Transparency** (transparence) | L'IA peut sembler « magique » | Informer les utilisateurs du **fonctionnement** du système et de ses **limites** |
| **Accountability** (responsabilité) | Les personnes et organisations qui développent et distribuent l'IA **répondent** de leurs actes | Définir et appliquer un **cadre de gouvernance** |

## Un exemple par principe

Ce sont les exemples du cours. Entraîne-toi à retrouver le principe en cachant la colonne de droite.

| Scénario | Principe |
|---|---|
| Un système d'**admission universitaire** doit évaluer toutes les candidatures sur des critères académiques pertinents, sans discrimination fondée sur des facteurs démographiques | **Équité** |
| Un **robot** qui détecte des objets par vision n'agit que si le niveau de **confiance** dépasse un **seuil** | **Fiabilité et sécurité** |
| Un système d'**identification faciale** en aéroport **supprime** les images dès qu'elles ne sont plus nécessaires, et en limite l'accès | **Confidentialité et sécurité** |
| Un agent vocal génère aussi des **sous-titres** pour les utilisateurs malentendants | **Inclusion** |
| Une **banque** qui utilise l'IA pour approuver des prêts **signale** cet usage et décrit les données d'entraînement | **Transparence** |

Pour la **responsabilité**, pense à une organisation qui met en place un cadre de gouvernance pour s'assurer que ses équipes appliquent ces principes.

## Les mots qui trahissent le principe

| Si l'énoncé parle de... | C'est... |
|---|---|
| Biais, discrimination, traitement égal | Équité |
| Seuil de confiance, erreur possible, éviter un dommage | Fiabilité et sécurité |
| Données personnelles, suppression, accès restreint | Confidentialité et sécurité |
| Handicap, accessibilité, ne laisser personne de côté | Inclusion |
| Informer, expliquer, limites, « fonctionne avec de l'IA » | Transparence |
| Gouvernance, qui répond, cadre | Responsabilité |

## Deux confusions classiques

- **Équité ou inclusion ?** L'équité concerne les **décisions** du système (pas de biais). L'inclusion concerne l'**accès** au système (tout le monde peut s'en servir).
- **Transparence ou responsabilité ?** La transparence, c'est **expliquer** aux utilisateurs. La responsabilité, c'est **qui répond** du système.

#### Point examen : le guide d'étude consacre un sous-domaine entier à ces six principes, à raison d'une puce par principe. Attends-toi à des questions « quel principe s'applique à ce scénario ? ».

## Exercices rapides

Quel principe ?

**1.** Une application de recrutement est testée pour vérifier qu'elle ne défavorise aucun groupe.

**2.** Un chatbot affiche « Je suis un assistant IA, mes réponses peuvent contenir des erreurs ».

**3.** Une application vocale propose aussi une saisie au clavier.

**4.** Un drone de livraison annule son approche s'il n'est pas sûr à 95 % d'avoir reconnu la zone d'atterrissage.

**5.** Une entreprise crée un comité qui valide chaque modèle avant sa mise en ligne.

**6.** Un hôpital chiffre les dossiers utilisés pour entraîner un modèle et vérifie que le modèle ne peut pas les restituer.

Et aussi :

**7.** Les filtres de contenu suffisent-ils à rendre une IA responsable ?

**8.** Pourquoi l'IA n'est-elle pas infaillible ?

<details>
<summary>Voir le corrigé</summary>

**1.** Équité.

**2.** Transparence.

**3.** Inclusion.

**4.** Fiabilité et sécurité.

**5.** Responsabilité.

**6.** Confidentialité et sécurité.

**7.** Non. Ils sont un moyen parmi d'autres ; il faut respecter les principes de la conception jusqu'à l'exploitation.

**8.** Parce qu'elle repose sur des modèles probabilistes.

</details>
