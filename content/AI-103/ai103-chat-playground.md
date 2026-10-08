# Explore with the model playground — explorer avant de coder

## L'essentiel

- Le **Model playground** du portail Foundry est un environnement **sans code** pour tester un modèle.
- On y règle les paramètres et le message système, et on voit les réponses en temps réel.
- Le bouton **Code** génère un exemple de code qui reproduit ta session, **déjà rempli** avec ton endpoint et ton nom de déploiement.
- Méthode de travail : explorer, générer le code, développer, itérer.

## Ce que permet le playground

Accès : **Model playground** dans la navigation de gauche du portail.

- envoyer des prompts à un modèle déployé et voir les réponses en temps réel ;
- régler des paramètres comme **temperature** et **max tokens** ;
- ajouter un **message système** pour personnaliser le comportement ;
- essayer différents modèles et configurations.

## Le bouton Code

Dans le volet de chat, le bouton **Code** affiche à tout moment un exemple qui reproduit la session en cours. Tu choisis trois choses :

| Choix | Options |
|---|---|
| **API** | Responses, ou une autre comme ChatCompletions |
| **Language** | Le langage de programmation voulu |
| **SDK** | Le SDK dont tu veux voir l'exemple |

L'exemple est **pré-rempli** avec :

- l'**endpoint** de ton projet ;
- le **nom de ton déploiement** de modèle ;
- tes **réglages** en cours.

Tu le copies dans ton environnement de développement et tu l'adaptes.

## Du playground au code : les 4 étapes

1. **Explorer** dans le playground : tester des prompts, ajuster les réglages, trouver ce qui marche.
2. **Générer** des exemples de code avec l'onglet Code.
3. **Développer** l'application à partir du code généré.
4. **Itérer** : revenir au playground pour tester de nouvelles idées, puis mettre le code à jour.

L'intérêt : prototyper et valider une idée **avant** d'investir du temps de développement.

## Exemple

Tu prépares un assistant pour un service après-vente.

1. Dans le playground, tu écris le message système « Tu réponds en 3 phrases maximum, sur un ton courtois ». Tu baisses la temperature à 0,2.
2. Tu poses dix questions types. La septième donne une réponse trop longue : tu précises la consigne et tu retestes.
3. Quand le comportement te convient, tu cliques sur **Code**, tu choisis **Responses API**, **Python**, **OpenAI SDK**.
4. Tu colles le résultat dans VS Code. L'endpoint, le déploiement, la temperature et le message système y sont déjà.

Tu as mis au point ton prompt en dix minutes, sans écrire de code.

#### Point examen : le playground sert à explorer et à générer du code de départ. Il ne remplace pas l'évaluation automatisée sur un jeu de données, vue au module précédent.

## Exercices rapides

**1.** Cite trois informations déjà renseignées dans le code généré par le bouton Code.

**2.** Quels trois choix te propose le bouton Code ?

**3.** Remets dans l'ordre : développer, itérer, explorer, générer le code.

**4.** Vrai ou faux : il faut écrire du code pour changer la temperature dans le playground.

<details>
<summary>Voir le corrigé</summary>

**1.** L'endpoint du projet, le nom du déploiement du modèle et les réglages en cours.

**2.** L'API, le langage et le SDK.

**3.** Explorer, générer le code, développer, itérer.

**4.** Faux. Le playground est un environnement sans code.

</details>
