# Speech synthesis — la synthèse vocale

## L'essentiel

- La synthèse vocale transforme un **texte** en **audio**, en **4 étapes**.
- **Normalisation** : le texte est réécrit en mots prononçables.
- **Analyse linguistique** : les lettres deviennent des **phonèmes** (G2P).
- **Prosodie** : le rythme, la hauteur et l'accentuation rendent la voix **naturelle**.
- **Synthèse** : un modèle acoustique produit un **mel-spectrogramme**, puis un **vocodeur neuronal** produit le son.

## Les 4 étapes

```
1. Normalisation du texte    → mots prononçables
2. Analyse linguistique      → phonèmes
3. Génération de la prosodie → rythme et intonation
4. Synthèse                  → onde audio
```

## 1. Normalisation du texte

Les abréviations, nombres et symboles sont réécrits en toutes lettres.

> **Exemple du cours.** « Dr. Smith ordered 3 items for $25.50 on 12/15/2023 »

| Écrit | Prononcé |
|---|---|
| Dr. | Doctor |
| 3 | three |
| $25.50 | twenty-five dollars and fifty cents |
| 12/15/2023 | December fifteenth, twenty twenty-three |

## 2. Analyse linguistique

Le texte est converti en **phonèmes**. C'est la conversion **graphème vers phonème** (**G2P**, grapheme-to-phoneme).

Un **graphème** est une lettre ou un groupe de lettres ; un **phonème** est un son.

La difficulté : la même suite de lettres ne se prononce pas toujours pareil.

| Mots | Problème |
|---|---|
| though, through, cough | « ough » se prononce de trois façons différentes |
| read | Se prononce différemment au présent et au passé : seul le **contexte** tranche |

## 3. Génération de la prosodie

La **prosodie** est la « musique » de la parole.

| Élément | Signification |
|---|---|
| **Hauteur** (pitch) | Voix qui monte ou descend |
| **Durée** | Longueur de chaque son |
| **Intensité** | Volume |
| **Pauses** | Silences entre les groupes de mots |
| **Accentuation** | Mot sur lequel on insiste |

Sans prosodie, la voix est plate et robotique. Un **transformer** prédit ces valeurs à partir du texte.

> **Exemple du cours.** « I never said he ate the cake. » Le sens change selon le mot accentué :
>
> - « **I** never said... » : ce n'est pas moi qui l'ai dit.
> - « I never said **he** ate... » : j'ai parlé de quelqu'un d'autre.
> - « I never said he ate the **cake** » : il a mangé autre chose.

## 4. Synthèse de la parole

Deux composants travaillent à la suite :

| Composant | Rôle |
|---|---|
| **Modèle acoustique** | Transforme phonèmes + prosodie en **mel-spectrogramme** (une image des fréquences dans le temps) |
| **Vocodeur neuronal** | Transforme le mel-spectrogramme en **onde audio** |

Vocodeurs à connaître : **WaveNet**, **WaveGlow**, **HiFi-GAN**.

Le vocodeur fait l'**inverse** de la reconnaissance vocale : la reconnaissance part du son pour en extraire des caractéristiques ; le vocodeur part des caractéristiques pour recréer le son.

## Un exemple complet

« Dr. Chen's appointment is at 3:00 PM »

| Étape | Résultat |
|---|---|
| 1. Normalisation | « Doctor Chen's appointment is at three o'clock P M » |
| 2. Analyse linguistique | La suite de phonèmes de chaque mot |
| 3. Prosodie | Accent sur « three », légère pause avant l'heure |
| 4. Synthèse | Mel-spectrogramme, puis onde audio par le vocodeur |

## Reconnaissance et synthèse en miroir

| | Reconnaissance | Synthèse |
|---|---|---|
| Sens | Audio → texte | Texte → audio |
| Nombre d'étapes | 6 | 4 |
| Normalisation | À la **fin** (« twenty five » → « 25 ») | Au **début** (« 25 » → « twenty five ») |
| Phonèmes | Trouvés à partir du son | Trouvés à partir des lettres |

#### Point examen : question officielle du module — la prosodie est importante en synthèse vocale parce qu'elle donne une prononciation et une cadence naturelles. Retiens aussi : G2P = lettres vers phonèmes, vocodeur = spectrogramme vers son.

## Exercices rapides

**1.** Quelles sont les 4 étapes de la synthèse vocale ?

**2.** Que devient « $25.50 » après la normalisation ?

**3.** Que signifie G2P ?

**4.** Pourquoi « though », « through » et « cough » posent-ils un problème ?

**5.** Cite trois éléments de la prosodie.

**6.** Que produit le modèle acoustique en synthèse vocale ?

**7.** Quel composant transforme le mel-spectrogramme en son ? Cite un exemple.

**8.** Que montre la phrase « I never said he ate the cake » ?

<details>
<summary>Voir le corrigé</summary>

**1.** Normalisation du texte, analyse linguistique, génération de la prosodie, synthèse de la parole.

**2.** « twenty-five dollars and fifty cents ».

**3.** Grapheme-to-phoneme : la conversion des lettres en phonèmes.

**4.** Les mêmes lettres « ough » se prononcent de trois façons différentes.

**5.** Trois parmi : hauteur, durée, intensité, pauses, accentuation.

**6.** Un mel-spectrogramme.

**7.** Le vocodeur neuronal : WaveNet, WaveGlow ou HiFi-GAN.

**8.** Que l'accentuation change le sens d'une phrase : la prosodie porte du sens.

</details>
