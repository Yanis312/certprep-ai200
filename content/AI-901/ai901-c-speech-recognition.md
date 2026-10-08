# Speech recognition — la reconnaissance vocale

## L'essentiel

- La reconnaissance vocale transforme un **signal audio** en **texte**, en **6 étapes**.
- Le son est d'abord converti en **vecteurs de caractéristiques** grâce aux **MFCC**.
- Le **modèle acoustique** trouve les **phonèmes** ; le **modèle de langage** trouve les mots plausibles.
- Le **décodage** choisit la meilleure phrase avec une **recherche en faisceau** (beam search).
- Le **post-traitement** ajoute majuscules, ponctuation et formats.

## Les 6 étapes

```
1. Capture audio
2. Prétraitement          → vecteurs de caractéristiques (MFCC)
3. Modèle acoustique      → phonèmes
4. Modèle de langage      → mots plausibles
5. Décodage               → meilleure phrase (beam search)
6. Post-traitement        → texte propre
```

## 1. Capture audio

Le micro convertit le son en signal numérique, en le mesurant plusieurs milliers de fois par seconde : c'est la **fréquence d'échantillonnage**.

| Fréquence | Usage |
|---|---|
| **8 à 16 kHz** | Suffisant pour la parole |
| **16 kHz** | Valeur typique pour la reconnaissance vocale |
| **44,1 kHz** | Musique |

## 2. Prétraitement : les MFCC

Le signal brut est transformé en **vecteurs de caractéristiques**. La technique la plus courante : **MFCC** (Mel-Frequency Cepstral Coefficients).

| Étape | Ce qui se passe |
|---|---|
| Découpage | Le signal est coupé en **trames** de **20 à 30 ms** |
| Transformée de Fourier | On trouve les fréquences présentes dans chaque trame |
| Échelle de Mel | On ajuste les fréquences à la façon dont l'**oreille humaine** les perçoit |
| Coefficients | On garde environ **13 coefficients** par trame |

Résultat : chaque trame devient un petit **vecteur de nombres** que le modèle peut traiter.

## 3. Modèle acoustique : les phonèmes

Un **phonème** est la **plus petite unité de son** de la parole.

- L'anglais compte environ **44 phonèmes**.
- « cat » = **/k/ /æ/ /t/**, soit trois phonèmes.
- Les phonèmes sont **propres à chaque langue**.

Le modèle acoustique, souvent un **transformer avec attention**, reçoit les vecteurs et produit, pour chaque trame, une **distribution de probabilités** sur les phonèmes possibles.

> **Exemple.** Pour une trame, le modèle peut répondre : /k/ 80 %, /g/ 15 %, /t/ 5 %.

## 4. Modèle de langage

Les sons seuls ne suffisent pas. « their » et « there » se prononcent pareil.

Le modèle de langage utilise les **régularités statistiques** de la langue et le **contexte** pour choisir la suite de mots la plus plausible.

> **Exemple.** « ... over **there** » est plus probable que « ... over **their** ».

On peut aussi l'**adapter à un domaine** : vocabulaire médical, juridique, technique.

## 5. Décodage

Le décodeur combine les scores du modèle acoustique et du modèle de langage pour trouver la **meilleure phrase**.

Il utilise la **recherche en faisceau** (**beam search**) : au lieu de tester toutes les combinaisons, il ne garde à chaque pas que les **quelques meilleures hypothèses**.

## 6. Post-traitement

Le texte brut est nettoyé :

| Traitement | Exemple |
|---|---|
| **Majuscules** | « bonjour marie » → « Bonjour Marie » |
| **Ponctuation** | Ajout des points et des virgules |
| **Format des nombres** | « twenty five dollars » → « $25 » (normalisation inverse du texte) |
| **Filtre de grossièretés** | Masquage des mots vulgaires |
| **Score de confiance** | Une probabilité pour chaque mot reconnu |

## Mémo : qui fait quoi

| Étape | Entrée | Sortie |
|---|---|---|
| Prétraitement | Onde sonore | **Vecteurs de caractéristiques** |
| Modèle acoustique | Vecteurs | **Phonèmes** probables |
| Modèle de langage | Phonèmes | **Mots** plausibles |
| Décodage | Hypothèses | **Meilleure phrase** |
| Post-traitement | Texte brut | **Texte lisible** |

#### Point examen : deux questions officielles du module — pendant le prétraitement, des vecteurs de caractéristiques sont extraits de l'onde audio ; un phonème est la plus petite unité de son de la parole.

## Exercices rapides

**1.** Quelle fréquence d'échantillonnage est typique pour la reconnaissance vocale ?

**2.** Que produit l'étape de prétraitement ?

**3.** Que signifie MFCC, et combien de coefficients garde-t-on environ par trame ?

**4.** Qu'est-ce qu'un phonème ? Donne ceux du mot « cat ».

**5.** Quel modèle départage « their » et « there » ?

**6.** Quelle technique le décodeur utilise-t-il ?

**7.** Dans quelle étape ajoute-t-on la ponctuation ?

**8.** Remets dans l'ordre : décodage, capture audio, modèle de langage, prétraitement, post-traitement, modèle acoustique.

<details>
<summary>Voir le corrigé</summary>

**1.** 16 kHz.

**2.** Des vecteurs de caractéristiques extraits de l'onde audio.

**3.** Mel-Frequency Cepstral Coefficients ; environ 13.

**4.** La plus petite unité de son de la parole. « cat » = /k/ /æ/ /t/.

**5.** Le modèle de langage, grâce au contexte.

**6.** La recherche en faisceau (beam search).

**7.** Le post-traitement.

**8.** Capture audio, prétraitement, modèle acoustique, modèle de langage, décodage, post-traitement.

</details>
