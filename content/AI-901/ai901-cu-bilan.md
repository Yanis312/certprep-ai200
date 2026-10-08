# Bilan du module — extraction d'informations dans Azure

## Le module en 10 lignes

1. **Azure Content Understanding** extrait des données **structurées** d'un contenu **non structuré**.
2. Types de contenu : **documents et images**, **audio**, **vidéo**.
3. Même déroulement partout : **ingestion → analyse par IA → sortie structurée** (JSON).
4. Un **schéma** dit **quoi** extraire et sous quelle **structure**, champs imbriqués compris.
5. Un **analyseur** définit **comment** le contenu est traité et **quelles données** sont renvoyées.
6. Avantage sur l'**OCR de base** : il comprend la **structure** et associe les données à un **schéma**.
7. L'extraction est **sémantique** : un champ est reconnu même avec un autre libellé, ou sans libellé.
8. Analyseurs préconstruits : `prebuilt-invoice`, `prebuilt-receipt`, `prebuilt-imageSearch`, `prebuilt-audioSearch`, `prebuilt-videoSearch`.
9. SDK : `azure-ai-contentunderstanding`, `ContentUnderstandingClient`, `begin_analyze`, `poller.result()`.
10. L'analyse est **asynchrone** : il faut **interroger** jusqu'à la fin du travail ; le SDK s'en charge.

## Le vocabulaire en un tableau

| Terme | Définition courte |
|---|---|
| **OCR** | Lit le texte d'une image |
| **Schéma** | La liste des champs à extraire et leur structure |
| **Analyseur** | L'unité qui applique le schéma et produit le résultat |
| **Champ** | Une valeur nommée, avec son type et son score de confiance |
| **Asynchrone** | Le résultat arrive plus tard ; on interroge jusqu'à ce qu'il soit prêt |
| **Polling** | Le fait d'interroger régulièrement l'état d'un travail |

## Du texte brut au sens

```
Read      →  « CAFÉ DU PORT 12/03 TOTAL 18,50 »          le texte
Layout    →  paragraphes, tableaux, hiérarchie            la structure
Receipt   →  Marchand : Café du Port · Total : 18,50      les champs
```

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Quel est l'avantage clé de Content Understanding par rapport à un OCR de base ? | Il **comprend la structure du document** et associe les données extraites à un **schéma défini** |
| Quel est le rôle principal d'un analyseur ? | Il définit **comment le contenu est traité** et **quelles données structurées** sont renvoyées |
| Avec le SDK Python, que se passe-t-il après l'envoi du contenu pour analyse ? | Il faut **interroger une URL** jusqu'à la fin du travail d'analyse |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

### Les mauvaises réponses à écarter

| Affirmation fausse | Pourquoi |
|---|---|
| Content Understanding va plus vite en sautant le prétraitement d'image | Son avantage est la compréhension, pas la vitesse |
| L'OCR extrait la relation entre les mots | C'est l'inverse : l'OCR ne comprend ni le sens ni les relations |
| L'analyseur stocke les données dans une base | Il traite et renvoie ; il ne stocke pas |
| L'analyseur convertit le JSON en texte lisible | Il produit du JSON structuré |
| Le résultat revient immédiatement dans la même requête | L'analyse est asynchrone |
| L'analyseur se réentraîne sur le contenu envoyé | Il applique son schéma, sans réentraînement |

## Ce que dit le résumé officiel

Content Understanding automatise le traitement de contenu d'entreprise non structuré (factures, formulaires, enregistrements d'appels, vidéos de réunions) en le convertissant en sortie structurée, lisible par une machine, en général du **JSON**, facile à stocker, à rechercher ou à intégrer dans d'autres systèmes.

On peut l'essayer dans le nouveau portail Foundry, ou construire des applications clientes avec l'**API REST** ou le **SDK Python**, qui gère l'analyse asynchrone et l'interrogation.

#### Point examen : la troisième question officielle porte sur l'asynchrone. Rapproche-la de la génération vidéo avec Sora : dans les deux cas, on lance un travail, on interroge son état, puis on récupère le résultat.

## Exercices rapides

**1.** Donne les trois temps du déroulement de Content Understanding.

**2.** Quel est le rôle d'un analyseur ?

**3.** Pourquoi Content Understanding fait-il mieux qu'un OCR de base sur une facture ?

**4.** Que fait `poller.result()` ?

**5.** Cite deux autres traitements asynchrones vus dans le parcours.

**6.** Associe chaque analyseur à son contenu : `prebuilt-invoice`, `prebuilt-receipt`, `prebuilt-audioSearch`, `prebuilt-videoSearch`.

<details>
<summary>Voir le corrigé</summary>

**1.** Ingestion du contenu, analyse par IA, sortie structurée.

**2.** Il définit comment le contenu est traité et quelles données structurées sont renvoyées.

**3.** Parce qu'il comprend la structure du document et associe les données extraites à un schéma défini, au lieu de renvoyer du texte brut.

**4.** Il attend la fin de l'analyse asynchrone ; le SDK interroge le service en coulisses.

**5.** La génération vidéo avec Sora, et la transcription audio par lots.

**6.** Facture, reçu, enregistrement audio, vidéo.

</details>
