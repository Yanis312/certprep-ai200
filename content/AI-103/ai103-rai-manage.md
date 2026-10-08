# Manage a responsible generative AI solution — gérer

## L'essentiel

- Dernière étape : préparer la **mise en service** et l'**exploitation** de la solution.
- **Avant** la sortie : faire passer les **revues de conformité** (juridique, confidentialité, sécurité, accessibilité).
- **Pendant** et **après** : livraison **par phases**, plan de **réponse aux incidents**, plan de **retour arrière**.
- Prévoir de pouvoir **bloquer** vite : des réponses nuisibles, mais aussi des utilisateurs, applications ou adresses IP.
- Donner aux utilisateurs un moyen de **signaler** un problème, et suivre la **télémétrie** dans le respect de la vie privée.

## Avant la sortie : les revues

On identifie les exigences de conformité de l'organisation et du secteur, et on donne aux équipes concernées l'occasion d'examiner le système **et sa documentation**.

| Revue | Ce qu'elle vérifie |
|---|---|
| **Juridique** (Legal) | Conformité aux lois et aux contrats |
| **Confidentialité** (Privacy) | Traitement des données personnelles |
| **Sécurité** (Security) | Vulnérabilités, accès |
| **Accessibilité** (Accessibility) | Utilisable par tous |

## Sortir et exploiter : les 7 recommandations

| Recommandation | Détail |
|---|---|
| **Plan de livraison par phases** | Sortir d'abord pour un **groupe restreint** d'utilisateurs, afin de recueillir des retours et repérer les problèmes avant un public plus large |
| **Plan de réponse aux incidents** | Avec une estimation du **temps de réponse** aux incidents imprévus |
| **Plan de retour arrière** (rollback) | Les étapes pour ramener la solution à un **état antérieur** en cas d'incident |
| **Blocage immédiat des réponses nuisibles** | Pouvoir les bloquer dès qu'elles sont découvertes |
| **Blocage d'utilisateurs, d'applications ou d'adresses IP** | En cas de mauvais usage du système |
| **Retour des utilisateurs** | Leur permettre de signaler un contenu **inexact, incomplet, nuisible, offensant** ou autrement problématique |
| **Télémétrie** | Mesurer la satisfaction, repérer les manques fonctionnels et les difficultés d'usage |

La télémétrie doit respecter les **lois sur la vie privée** ainsi que les politiques et engagements de ton organisation.

## Trois plans à ne pas confondre

| Plan | Question à laquelle il répond | Quand |
|---|---|---|
| **Livraison par phases** | À qui ouvre-t-on, et dans quel ordre ? | Avant et pendant la sortie |
| **Réponse aux incidents** | Que fait-on, et en combien de temps, quand un problème survient ? | Pendant un incident |
| **Retour arrière** | Comment revient-on à la version précédente ? | Pendant un incident |

> **Exemple.** Une banque lance un assistant génératif.
>
> 1. **Semaine 1** : ouverture à 200 employés volontaires (livraison par phases).
> 2. Un employé signale avec le bouton « Signaler » une réponse qui cite un taux périmé (retour utilisateur).
> 3. L'équipe bloque cette réponse dans l'heure (blocage immédiat), comme prévu par le plan de réponse aux incidents.
> 4. Le problème venant de la dernière mise à jour, elle revient à la version précédente (retour arrière).
> 5. Une fois corrigé, ouverture à 5 000 clients.

#### Point examen : question officielle du module — on prévoit un plan de livraison par phases pour recueillir des retours et repérer les problèmes avant une diffusion plus large. Il ne dispense pas des étapes Map, Measure, Mitigate, Manage.

## Exercices rapides

**1.** Cite les 4 revues de conformité courantes avant une sortie.

**2.** À quoi sert un plan de livraison par phases ?

**3.** Quelle différence entre un plan de réponse aux incidents et un plan de retour arrière ?

**4.** Cite deux choses que la solution doit pouvoir bloquer rapidement.

**5.** Quels types de problèmes un utilisateur doit-il pouvoir signaler sur un contenu généré ?

**6.** Quelle contrainte s'applique à la télémétrie collectée ?

<details>
<summary>Voir le corrigé</summary>

**1.** Juridique, confidentialité, sécurité, accessibilité.

**2.** À sortir d'abord pour un groupe restreint, afin de recueillir des retours et de repérer les problèmes avant un public plus large.

**3.** Le plan de réponse aux incidents dit comment réagir et estime le temps de réponse. Le plan de retour arrière décrit les étapes pour ramener la solution à un état antérieur.

**4.** Les réponses nuisibles du système, et des utilisateurs, applications ou adresses IP en cas de mauvais usage.

**5.** Un contenu inexact, incomplet, nuisible, offensant ou autrement problématique.

**6.** Elle doit respecter les lois sur la vie privée et les politiques et engagements de l'organisation.

</details>
