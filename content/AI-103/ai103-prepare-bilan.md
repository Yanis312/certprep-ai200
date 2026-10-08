# Bilan du module — Plan and prepare

## Le module en 10 lignes

1. Une solution d'IA combine **modèles**, **services d'IA**, **prompt engineering** et **code**.
2. Cinq capacités : **IA générative et agents**, **NLP**, **parole**, **vision**, **extraction d'informations**.
3. Un **agent** = un LLM + des instructions + des outils.
4. **Microsoft Foundry** est la plateforme recommandée pour tout sauf les solutions les plus simples.
5. Un **projet** appartient à **une seule ressource Foundry** ; une ressource peut avoir plusieurs projets, dont un par défaut.
6. Un projet contient : **Models**, **Agents**, **Tools**, **Knowledge**.
7. Deux endpoints : **projet** (API Foundry, agents) et **Azure OpenAI** (API OpenAI).
8. **Foundry Tools** = services préconstruits : Language, Speech, Translator, Document Intelligence, Content Understanding.
9. Outils du développeur : VS Code + **Foundry Toolkit**, GitHub, GitHub Copilot ; SDK Foundry, API OpenAI, SDK des Foundry Tools.
10. IA responsable : **équité, fiabilité et sécurité, confidentialité et sécurité, inclusion, transparence, responsabilité**.

## Schéma d'ensemble

```
                    Portail Foundry / SDK Foundry / Foundry Toolkit (VS Code)
                                        │
                              Ressource Foundry (Azure)
                    ┌───────────────────┼────────────────────┐
              Projet (défaut)        Projet B          Foundry Tools
        ┌──────┬───────┬─────────┐                 Language · Speech · Translator
     Models  Agents  Tools  Knowledge              Document Intelligence
        │      │       │        │                  Content Understanding
   catalogue  Agent   MCP    Foundry IQ
   Foundry   Service
   Models
```

## Les trois noms à ne pas mélanger

| Nom | C'est |
|---|---|
| **Foundry Models** | Le catalogue de modèles (Microsoft, OpenAI, autres) |
| **Foundry Tools** | Les services préconstruits pour tâches courantes |
| **Foundry IQ** | La connexion centralisée aux sources de connaissances, basée sur MCP |

## Les questions officielles du module

Le quiz de cette unité reprend les trois questions de l'évaluation Microsoft, plus des questions de synthèse. Réponses officielles :

| Question | Réponse |
|---|---|
| Quel portail pour travailler avec les éléments d'un projet Foundry ? | Le portail Microsoft Foundry |
| Quel composant fournit des services préconstruits pour les tâches d'IA courantes ? | Foundry Tools |
| Quelle extension VS Code pour travailler avec les projets Foundry ? | Foundry Toolkit for Visual Studio Code |

#### Point examen : ces trois questions montrent le style de l'examen sur ce module. On te donne un besoin, tu dois nommer le bon composant.

## Exercices rapides

**1.** Sans regarder plus haut, cite les 5 Foundry Tools.

**2.** Cite les 6 principes d'IA responsable.

**3.** Un collègue dit : « Je vais créer un agent, je passe par l'endpoint Azure OpenAI. » Que lui réponds-tu ?

**4.** Donne un argument pour utiliser Azure Translator plutôt qu'un LLM pour traduire 500 000 fiches produit.

<details>
<summary>Voir le corrigé</summary>

**1.** Azure Language, Azure Speech, Azure Translator, Azure Document Intelligence, Azure Content Understanding.

**2.** Équité, fiabilité et sécurité, confidentialité et sécurité, inclusion, transparence, responsabilité.

**3.** Les agents se développent et s'utilisent avec le Foundry Agent Service, par l'endpoint du projet. L'endpoint Azure OpenAI sert aux modèles avec les API OpenAI.

**4.** Un outil préconstruit donne une solution moins chère et plus prévisible qu'un agent génératif, surtout à gros volume.

</details>
