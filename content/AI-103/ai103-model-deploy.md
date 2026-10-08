# Deploy models to endpoints — déployer un modèle

## L'essentiel

- **Déployer** un modèle le rend accessible par un **endpoint** que ton application appelle.
- Le **type de déploiement** fixe trois choses : où vont les données (**résidence**), comment ça monte en charge (**scaling**) et comment c'est **facturé**.
- **Global Standard** est le choix recommandé chaque fois que possible.
- Pour appeler le modèle, il faut **3 informations** : l'URL de l'endpoint, de quoi s'authentifier, et le **nom du déploiement**.
- Le **playground** permet de tester sans écrire de code.

## Les types de déploiement

Lis le nom en deux parties : **où** (Global, Data Zone, régional) + **comment c'est facturé** (Standard, Provisioned, Batch).

| Où | Signification |
|---|---|
| **Global** | Peut utiliser n'importe quelle région Azure |
| **Data Zone** | Les données restent dans une zone de données précise (UE ou US) |
| **Standard / Regional** | Une seule région |

| Facturation | Signification |
|---|---|
| **Standard** | Paiement **au token** (pay-per-token) |
| **Provisioned** | **PTU** réservées (provisioned throughput units) : débit élevé et **prévisible** |
| **Batch** | Gros traitements **asynchrones**, moins chers |

Les neuf types :

| Type | Région | Facturation | Idéal pour |
|---|---|---|---|
| **Global Standard** | Toute région | Au token | Usage général, **quota le plus élevé** |
| **Global Provisioned** | Toute région | PTU réservées | Débit élevé et prévisible |
| **Global Batch** | Toute région | **50 % de réduction** | Gros travaux asynchrones, sous 24 heures |
| **Data Zone Standard** | Zone UE/US | Au token | Conformité de zone de données UE ou US |
| **Data Zone Provisioned** | Zone de données | PTU réservées | Débit prévisible dans une zone |
| **Data Zone Batch** | Zone de données | Batch | Gros travaux asynchrones dans une zone |
| **Standard** | Une région | Au token | Résidence régionale des données, ou faible volume |
| **Regional Provisioned** | Une région | PTU réservées | Débit prévisible dans une région |
| **Developer** | Toute région | Au token | **Évaluation de modèles fine-tunés uniquement** |

Chaque modèle indique les types qu'il prend en charge. Le portail choisit automatiquement la meilleure option.

## Choisir en trois questions

1. **Les données doivent-elles rester dans une zone ou une région ?** Zone UE/US → Data Zone. Une région précise → Standard ou Regional Provisioned. Sinon → Global.
2. **Le trafic est-il interactif ou différé ?** Différé et volumineux → Batch.
3. **Faut-il un débit garanti et prévisible ?** Oui → Provisioned. Sinon → Standard.

> **Exemple 1.** Une banque française impose que les données restent dans l'UE, avec un trafic variable : **Data Zone Standard**.
>
> **Exemple 2.** Tu dois résumer 3 millions de documents cette nuit, sans urgence : **Global Batch**, moitié prix.
>
> **Exemple 3.** Un centre d'appels traite un volume constant et élevé toute la journée : **Global Provisioned**.

## Déployer depuis le portail

1. Portail Foundry → **Discover** → **Models**, puis ouvrir la model card.
2. Sélectionner **Deploy** :
   - **Default settings** : déploiement rapide avec la configuration recommandée ;
   - **Custom settings** : personnaliser les options.
3. Si le modèle l'exige, accepter les conditions **Azure Marketplace** (Agree and Proceed).
4. Configurer puis **Deploy**. Vérifier que l'état affiche **Succeeded**.

### Abonnement Marketplace

| Modèle | Abonnement Marketplace |
|---|---|
| Partenaires et communauté | **Souvent requis**, avec conditions d'utilisation à accepter |
| Vendus directement par Azure (ex. GPT-4o-mini) | **Non requis** |

### Paramètres de déploiement

- **Deployment name** : par défaut le nom du modèle. Modifiable pour distinguer plusieurs déploiements du même modèle. **C'est ce nom que ton code met dans le paramètre `model`.**
- **Deployment type** : choisi automatiquement selon le modèle et ton environnement.

### Cas du managed compute

Pour un déploiement sur calcul managé, on configure en plus :

- **Virtual machine SKU** : le type de VM. Il faut du **quota de calcul Azure Machine Learning** pour ce SKU dans l'abonnement.
- **Instance count** : nombre d'instances, pour répartir la charge et assurer la redondance.

## Gérer les déploiements

Portail Foundry → **Build** → **Models**. Pour chaque déploiement : configuration et état, **URL de l'endpoint**, **clés ou jetons**, métriques de supervision et d'usage, modification ou suppression.

Retiens : **Discover** pour chercher un modèle, **Build** pour gérer ce qui est déployé.

## Tester dans le playground

Après le déploiement, tu arrives dans le playground. Tu peux y :

- saisir des prompts et observer les réponses ;
- varier les tests : questions simples, raisonnement en plusieurs étapes, formats imposés, cas limites ;
- régler le **message système** ;
- modifier les **paramètres** ;
- ouvrir l'onglet **Code** pour obtenir des exemples (Python, C#, JavaScript) à copier.

### Message système

Il fixe le contexte, le ton et les consignes valables pour **toutes** les entrées utilisateur. Exemples : « réponds comme un agent du service client », « donne des explications techniques et concises ».

### Paramètres de génération

| Paramètre | Effet |
|---|---|
| **temperature** | Créativité contre constance : bas = réponses stables, haut = réponses variées |
| **max tokens** | Limite la longueur de la réponse |
| **top-p** | Nucleus sampling : restreint le choix aux tokens les plus probables |

## Accéder au modèle par le code

Trois informations, à lire dans les détails du déploiement :

| Information | Détail |
|---|---|
| **Endpoint URL** | Endpoint de **projet** (fonctions propres à Foundry) ou endpoint **OpenAI v1** (compatibilité avec les API OpenAI) |
| **Authentification** | Une clé, ou **Microsoft Entra ID** avec un jeton lié à l'identité de l'application |
| **Deployment name** | Passé dans le paramètre `model` pour router vers ton déploiement |

**Entra ID est recommandé en production.**

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://<ressource>.openai.azure.com/openai/v1/",   # 1. endpoint
    api_key="<clé>",                                              # 2. authentification
)

reponse = client.chat.completions.create(
    model="support-gpt4o-mini",        # 3. NOM DU DÉPLOIEMENT, pas le nom du modèle
    messages=[
        {"role": "system", "content": "Tu es un agent du service client. Réponds en 2 phrases."},
        {"role": "user", "content": "Comment retourner un article ?"},
    ],
    temperature=0.2,     # réponses stables
    max_tokens=150,      # réponse courte
)
print(reponse.choices[0].message.content)
```

L'erreur classique : mettre `model="gpt-4o-mini"` alors que le déploiement s'appelle `support-gpt4o-mini`. La requête échoue car aucun déploiement ne porte ce nom.

#### Point examen : question officielle du module — le type de déploiement le mieux adapté à un usage général avec le plus grand quota est Global Standard. Developer est réservé à l'évaluation de modèles fine-tunés.

## Exercices rapides

Quel type de déploiement ?

**1.** Usage général, aucune contrainte de localisation, tu veux le plus grand quota.

**2.** Les données doivent rester dans la zone UE, paiement au token.

**3.** Classification de 5 millions d'e-mails, résultat attendu demain, budget serré.

**4.** Débit garanti et prévisible, n'importe quelle région.

**5.** Tu veux tester un modèle que tu viens de fine-tuner.

Et aussi :

**6.** Ton code renvoie une erreur « deployment not found ». Tu as écrit `model="gpt-4o"`. Que vérifies-tu ?

**7.** Quelle authentification est recommandée en production ?

**8.** Pour des réponses toujours identiques à la même question, tu montes ou tu baisses la temperature ?

<details>
<summary>Voir le corrigé</summary>

**1.** Global Standard.

**2.** Data Zone Standard.

**3.** Global Batch : asynchrone, sous 24 heures, 50 % de réduction.

**4.** Global Provisioned (PTU réservées).

**5.** Developer.

**6.** Le nom du déploiement. Le paramètre `model` doit contenir le nom donné au déploiement, qui peut différer du nom du modèle.

**7.** Microsoft Entra ID, avec un jeton lié à l'identité de l'application, plutôt qu'une clé.

**8.** Tu la baisses.

</details>
