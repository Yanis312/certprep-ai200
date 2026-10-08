# Extraire de l'information de l'audio et de la vidéo

> Fiche incomplète : le texte que j'ai reçu s'arrêtait au début de la partie vidéo. La partie audio est complète. Colle-moi la fin de l'unité, le lab et l'évaluation du module pour que je termine.

## L'essentiel

- L'information d'entreprise se trouve de plus en plus dans de l'**audio** et de la **vidéo** : appels enregistrés, réunions en visioconférence.
- **Azure Content Understanding** analyse aussi ces formats.
- Pour l'audio, il fournit des **transcriptions**, des **résumés** et d'autres informations clés.
- Le principe reste le même que pour les documents : un **schéma** dit quoi extraire, un **analyseur** l'applique, le résultat revient en **JSON**.

## Extraire des données d'un fichier audio

### Exemple : résumer une messagerie vocale

Schéma des informations à extraire de chaque appel :

- Caller (appelant)
- Message summary (résumé du message)
- Requested actions (actions demandées)
- Callback number (numéro de rappel)
- Alternative contact details (autres coordonnées)

Message laissé :

> « Hi, this is Ava from Contoso. Just calling to follow up on our meeting last week. I wanted to let you know that I've run the numbers and I think we can meet your price expectations. Please call me back on 555-12345 or send me an e-mail at Ava@contoso.com and we'll discuss next steps. Thanks, bye! »

Résultat de l'analyse avec ce schéma :

| Champ | Valeur extraite |
|---|---|
| Caller | Ava from Contoso |
| Message summary | Ava a rappelé au sujet d'une réunion et indique qu'ils peuvent respecter les attentes de prix. Elle demande un rappel ou un e-mail pour la suite |
| Requested actions | Rappeler ou envoyer un e-mail pour discuter des prochaines étapes |
| Callback number | 555-12345 |
| Alternative contact details | Ava@contoso.com |

### Ce qui se passe en coulisses

```
Audio  ──►  reconnaissance vocale  ──►  transcription
                                            │
                                            ▼
                              compréhension du langage + schéma
                                            │
                                            ▼
                                   champs structurés (JSON)
```

Deux choses à remarquer :

- certains champs sont **copiés** tels quels (le numéro, l'e-mail) ;
- d'autres sont **rédigés** par l'IA à partir du sens (le résumé, les actions demandées).

C'est plus qu'une transcription : le service **comprend** le message.

## Analyser de l'audio dans le portail Foundry

Comme pour les documents, le portail est un moyen rapide de **vérifier que l'analyseur renvoie les bons champs** avant d'automatiser par le code.

Dans le portail, tu peux :

- choisir un analyseur **audio ou vidéo** et le lancer sur un fichier ;
- consulter les sorties : **transcription** pour l'audio, et **informations extraites** selon ton schéma ;
- afficher le **JSON** renvoyé, pour un traitement en aval.

> **Exemple du cours.** Au lieu d'écouter un appel en entier, tu lances l'**analyseur audio préconstruit**. À la fin, tu lis la transcription écrite et les informations précises tirées de l'appel, en JSON.

L'analyseur audio préconstruit s'appelle `prebuilt-audioSearch`, et celui pour la vidéo `prebuilt-videoSearch`.

## Extraire des données d'une vidéo

Content Understanding prend aussi en charge l'**analyse vidéo**. Par exemple : analyser une visioconférence enregistrée pour en tirer la **présence**, le **lieu** et d'autres informations.

La suite de cette partie (le schéma d'exemple et son résultat) manquait dans le texte reçu.

## Documents, audio, vidéo : la même logique

| | Document | Audio | Vidéo |
|---|---|---|---|
| Exemple | Facture | Message vocal | Visioconférence |
| Techniques | OCR, mise en page | Reconnaissance vocale | Analyse d'images et de son |
| Schéma d'exemple | Vendor, total, items | Caller, summary, callback | Présence, lieu |
| Analyseur préconstruit | `prebuilt-invoice` | `prebuilt-audioSearch` | `prebuilt-videoSearch` |
| Sortie | JSON | JSON, avec transcription | JSON |

#### Point examen : le guide d'étude demande d'« extraire de l'information à partir d'audio et de vidéo avec Content Understanding ». Retiens que le même couple schéma + analyseur s'applique à tous les types de contenu.

## Exercices rapides

**1.** Quels types de résultats Content Understanding fournit-il à partir d'un fichier audio ?

**2.** Dans l'exemple de la messagerie vocale, cite trois champs du schéma.

**3.** Lequel de ces champs est rédigé par l'IA plutôt que copié : le numéro de rappel ou le résumé du message ?

**4.** Pourquoi tester un analyseur dans le portail avant d'écrire du code ?

**5.** Quel analyseur préconstruit pour un appel enregistré ?

**6.** Donne un exemple d'information que l'on peut extraire d'une visioconférence enregistrée.

<details>
<summary>Voir le corrigé</summary>

**1.** Des transcriptions, des résumés et d'autres informations clés.

**2.** Trois parmi : Caller, Message summary, Requested actions, Callback number, Alternative contact details.

**3.** Le résumé du message.

**4.** Pour vérifier rapidement que l'analyseur renvoie bien les champs attendus avant d'automatiser.

**5.** `prebuilt-audioSearch`.

**6.** La présence des participants ou le lieu.

</details>
