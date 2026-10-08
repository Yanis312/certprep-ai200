# Responsible AI — les 6 principes de Microsoft

## L'essentiel

- Un système d'IA repose sur des **modèles probabilistes**, eux-mêmes dépendants des **données d'entraînement**. Il peut donc se tromper ou reproduire des biais.
- Comme l'IA paraît « humaine », les utilisateurs lui font **beaucoup confiance**, parfois trop.
- Le développeur doit réduire les risques : erreurs de prédiction, mauvais usage, discrimination.
- Microsoft retient **6 principes** : équité, fiabilité et sécurité, confidentialité et sécurité, inclusion, transparence, responsabilité.

## Les 6 principes en un tableau

| Principe | En une phrase | Mot-clé pour le reconnaître |
|---|---|---|
| **Fairness** (équité) | L'IA traite toutes les personnes équitablement | Biais, groupes défavorisés |
| **Reliability and safety** (fiabilité et sécurité) | L'IA fonctionne de façon fiable et sûre | Tests rigoureux, seuils de confiance, risque pour la vie |
| **Privacy and security** (confidentialité et sécurité) | L'IA est sécurisée et respecte la vie privée | Données personnelles, protection des données |
| **Inclusiveness** (inclusion) | L'IA profite à tout le monde | Handicap, diversité des testeurs |
| **Transparency** (transparence) | L'IA est compréhensible | Objectif, fonctionnement, limites, score de confiance |
| **Accountability** (responsabilité) | Des personnes répondent du système | Gouvernance, cadre légal, développeurs responsables |

## Fairness — équité

> **Exemple.** Un modèle aide une banque à approuver des prêts. Il ne doit intégrer aucun biais lié au genre, à l'origine ethnique ou à d'autres facteurs qui avantageraient ou désavantageraient un groupe.

Les outils de mesure du biais existent, mais **ne suffisent pas**. Il faut :

- penser à l'équité **dès le début** du projet ;
- vérifier que les **données d'entraînement** représentent tous les publics concernés ;
- évaluer les performances **par sous-groupe** d'utilisateurs tout au long du cycle de développement.

## Reliability and safety — fiabilité et sécurité

> **Exemples.** Un véhicule autonome, ou un modèle qui diagnostique des symptômes et recommande une prescription. Une défaillance met des vies en danger.

Deux exigences :

- des **tests rigoureux** et une gestion stricte des déploiements avant mise en production ;
- tenir compte de la nature **probabiliste** des modèles en appliquant des **seuils** sur les scores de confiance.

```python
# Seuil de confiance : on n'agit que si le modèle est assez sûr
if prediction.confidence >= 0.90:
    appliquer(prediction)
else:
    envoyer_a_un_humain(prediction)
```

## Privacy and security — confidentialité et sécurité

Les modèles s'appuient sur de gros volumes de données, qui peuvent contenir des **informations personnelles**. Le risque ne s'arrête pas à l'entraînement : en production, le système traite de **nouvelles données** pour prédire ou agir. Il faut des protections pour les données et le contenu des clients.

## Inclusiveness — inclusion

L'IA doit bénéficier à toute la société, quels que soient les capacités physiques, le genre, l'orientation sexuelle, l'origine ethnique ou d'autres facteurs.

Moyen concret : faire participer un **groupe de personnes aussi divers que possible** à la conception, au développement et aux tests.

## Transparency — transparence

Les utilisateurs doivent connaître l'**objectif** du système, son **fonctionnement** et ses **limites**.

- Indiquer ce qui influence la précision : nombre de cas d'entraînement, caractéristiques les plus influentes.
- Partager le **score de confiance** des prédictions.
- Si le système utilise des données personnelles (reconnaissance faciale par exemple), dire **comment elles sont utilisées et conservées, et qui y a accès**.

## Accountability — responsabilité

Même si le système semble autonome, ce sont les **développeurs** qui ont entraîné et validé les modèles, et défini la logique de décision, qui en sont responsables.

Les équipes travaillent dans un **cadre de gouvernance** et de principes d'organisation, pour que la solution respecte des normes responsables et légales clairement définies.

## Ne pas confondre

| On hésite entre | Comment trancher |
|---|---|
| Équité et inclusion | Équité = pas de **biais** dans les décisions. Inclusion = l'IA est **utilisable par tous** |
| Transparence et responsabilité | Transparence = **expliquer** à l'utilisateur. Responsabilité = **qui répond** du système |
| Fiabilité et confidentialité | Fiabilité = le système **marche comme prévu**. Confidentialité = les **données** sont protégées |

#### Point examen : le sujet revient dans le domaine « Implémenter l'IA responsable », avec filtres de contenu, garde-fous et évaluations de sécurité. Ici, sache associer un scénario à l'un des 6 principes.

## Exercices rapides

Quel principe est en jeu ?

**1.** Un modèle de recrutement écarte plus souvent les candidatures de femmes.

**2.** Une application indique « réponse générée par IA, fiable à 72 % » sous chaque résultat.

**3.** Une application vocale est testée avec des personnes ayant des troubles de l'élocution.

**4.** Une entreprise nomme un comité qui valide chaque modèle avant sa mise en production.

**5.** Un outil médical n'affiche un diagnostic que si le score de confiance dépasse 95 %.

**6.** Les enregistrements audio des clients sont chiffrés et supprimés après 30 jours.

<details>
<summary>Voir le corrigé</summary>

**1.** Équité (fairness) : c'est un biais contre un groupe.

**2.** Transparence : l'utilisateur est informé de la nature du système et de son score de confiance.

**3.** Inclusion : on implique un public divers dans les tests.

**4.** Responsabilité (accountability) : un cadre de gouvernance, des personnes qui répondent du système.

**5.** Fiabilité et sécurité : un seuil de confiance sur un modèle probabiliste.

**6.** Confidentialité et sécurité.

</details>
