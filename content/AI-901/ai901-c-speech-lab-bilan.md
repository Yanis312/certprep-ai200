# Lab et bilan — concepts de la parole

## Le lab : explorer la parole

- **Durée** : environ 15 minutes.
- **Aucun compte Azure nécessaire** : tout tourne dans le navigateur.
- Il faut un **micro** et des **haut-parleurs**.

### Les étapes

1. Ouvre `https://aka.ms/chat-playground` et attends le chargement du modèle.
2. Active le **mode vocal** et choisis une **voix**.
3. Clique sur **Start session**.
4. Parle : pose une question à voix haute.
5. Observe les trois états successifs :

| État | Ce qui se passe | Technique |
|---|---|---|
| **Listening** | L'application t'écoute | Reconnaissance vocale |
| **Processing** | Le modèle prépare la réponse | Modèle de langage |
| **Speaking** | L'application répond à voix haute | Synthèse vocale |

6. Utilise le bouton **CC** pour afficher les sous-titres de la conversation.

### Ce qu'il faut retenir du lab

- L'application utilise la **Web Speech API** du navigateur : c'est une version simplifiée.
- Dans Microsoft Foundry, **Voice Live** permet de vraies conversations en temps réel, sur plusieurs tours, avec gestion des **interruptions** et **suppression du bruit**.

## Le module en 10 lignes

1. **Reconnaissance** = parole → texte. **Synthèse** = texte → parole.
2. Bénéfices : **accessibilité**, **productivité**, **expérience utilisateur**, **portée mondiale**.
3. À vérifier : qualité audio, langues, confidentialité, latence, accessibilité (**WCAG**).
4. Toujours prévoir une **autre méthode** d'entrée et de sortie.
5. Reconnaissance en **6 étapes** : capture, prétraitement, modèle acoustique, modèle de langage, décodage, post-traitement.
6. Prétraitement = **MFCC** → **vecteurs de caractéristiques**.
7. **Phonème** = plus petite unité de son ; environ 44 en anglais.
8. Décodage = **beam search**.
9. Synthèse en **4 étapes** : normalisation, analyse linguistique (**G2P**), **prosodie**, synthèse.
10. **Modèle acoustique** → mel-spectrogramme ; **vocodeur** (WaveNet, WaveGlow, HiFi-GAN) → son.

## Les deux chaînes côte à côte

```
RECONNAISSANCE                      SYNTHÈSE

Audio                               Texte
  ↓ capture (16 kHz)                  ↓ normalisation
  ↓ prétraitement (MFCC)              ↓ analyse linguistique (G2P)
  ↓ modèle acoustique (phonèmes)      ↓ prosodie
  ↓ modèle de langage                 ↓ modèle acoustique (mel-spectrogramme)
  ↓ décodage (beam search)            ↓ vocodeur
  ↓ post-traitement                 Audio
Texte
```

## Le vocabulaire à ne pas confondre

| Terme | Définition courte |
|---|---|
| **MFCC** | Caractéristiques extraites du son, en reconnaissance |
| **Phonème** | Plus petite unité de son |
| **Graphème** | Lettre ou groupe de lettres |
| **G2P** | Conversion lettres → phonèmes, en synthèse |
| **Prosodie** | Hauteur, durée, intensité, pauses, accentuation |
| **Beam search** | Recherche de la meilleure phrase, en reconnaissance |
| **Vocodeur** | Spectrogramme → onde audio, en synthèse |

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Que se passe-t-il pendant l'étape de prétraitement de la reconnaissance vocale ? | Des **vecteurs de caractéristiques** sont extraits de l'onde audio |
| Que sont les phonèmes ? | La **plus petite unité de son** de la parole |
| Pourquoi la prosodie est-elle importante en synthèse vocale ? | Elle donne une **prononciation et une cadence naturelles** |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

#### Point examen : le guide d'étude demande de décrire la reconnaissance et la synthèse vocales. Sache dire dans quelle chaîne se trouve chaque terme : MFCC et beam search côté reconnaissance, G2P, prosodie et vocodeur côté synthèse.

## Exercices rapides

**1.** Dans le lab, à quelle technique correspond l'état « Listening » ? Et « Speaking » ?

**2.** Reconnaissance ou synthèse ? (a) MFCC. (b) Vocodeur. (c) Beam search. (d) Prosodie. (e) G2P.

**3.** Combien d'étapes compte la reconnaissance ? Et la synthèse ?

**4.** Quel service Foundry gère les conversations vocales en temps réel avec interruptions ?

**5.** Quelle est la différence entre un graphème et un phonème ?

<details>
<summary>Voir le corrigé</summary>

**1.** Listening = reconnaissance vocale. Speaking = synthèse vocale.

**2.** (a) Reconnaissance. (b) Synthèse. (c) Reconnaissance. (d) Synthèse. (e) Synthèse.

**3.** Six pour la reconnaissance, quatre pour la synthèse.

**4.** Voice Live.

**5.** Un graphème est une lettre ou un groupe de lettres ; un phonème est un son.

</details>
