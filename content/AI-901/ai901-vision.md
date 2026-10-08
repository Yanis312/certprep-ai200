# Computer vision — la vision par ordinateur

## L'essentiel

- La **vision par ordinateur** analyse une **entrée visuelle** : photos, vidéos, flux de caméra en direct.
- Elle fonctionne en **entraînant un modèle** avec un très grand nombre d'images.
- Quatre types de modèles : **classification d'images**, **détection d'objets**, **segmentation sémantique**, **modèles multimodaux**.
- La différence entre les trois premiers tient à la **précision de la localisation**.

## Les 4 types de modèles

| Type | Question à laquelle il répond | Résultat |
|---|---|---|
| **Classification d'images** | **Qu'est-ce** que cette image ? | Une étiquette pour l'image entière |
| **Détection d'objets** | **Où** sont les objets ? | Un cadre (boîte) autour de chaque objet |
| **Segmentation sémantique** | **Quels pixels** appartiennent à l'objet ? | Les pixels exacts de chaque objet |
| **Modèle multimodal** | **Que se passe-t-il** sur l'image ? | Une description complète en texte |

### Comment chacun est entraîné

- **Classification** : des images **étiquetées** avec leur sujet principal. Le modèle apprend ensuite à prédire l'étiquette d'une image inconnue.
- **Détection d'objets** : le modèle apprend à repérer l'**emplacement** d'objets précis.
- **Segmentation sémantique** : une forme **avancée** de détection d'objets. Au lieu d'une boîte, le modèle identifie les **pixels** de l'objet.
- **Multimodal** : le modèle combine des caractéristiques visuelles et les **descriptions textuelles** associées.

## Du plus grossier au plus fin

Pour une photo de rue avec deux voitures et un piéton :

```
Classification      →  « rue »                          (1 étiquette pour l'image)
Détection d'objets  →  [voiture] [voiture] [piéton]     (3 boîtes)
Segmentation        →  le contour exact, pixel par pixel, de chaque élément
Multimodal          →  « Deux voitures sont arrêtées à un passage piéton
                        qu'une personne traverse. »
```

> **Exemple sur le site d'histoire de l'informatique.** Un utilisateur charge la photo d'une vieille machine. Classification : « ordinateur personnel ». Détection : un cadre autour du clavier, un autre autour de l'écran. Multimodal : « Un Apple II posé sur un bureau, avec deux lecteurs de disquettes. »

## Scénarios courants

- Agents IA qui **interprètent une entrée visuelle**.
- **Légendes automatiques** ou génération de mots-clés (tags) pour des photos.
- **Recherche visuelle**.
- Suivi des **stocks** ou identification d'articles en caisse dans le commerce.
- **Vidéosurveillance** de sécurité.
- **Authentification** par reconnaissance faciale.
- **Robotique** et véhicules autonomes.

## Quel modèle pour quel besoin

| Besoin | Modèle |
|---|---|
| Trier des photos entre « chat » et « chien » | Classification |
| Compter les voitures sur un parking | Détection d'objets |
| Détourer précisément une tumeur sur une radio | Segmentation sémantique |
| Rédiger une légende pour une photo de presse | Multimodal |

#### Point examen : retiens l'ordre de précision — classification (toute l'image), détection (une boîte), segmentation (les pixels). Une description en phrases complètes renvoie au multimodal.

## Exercices rapides

Quel type de modèle ?

**1.** Dire si une radio des poumons est « normale » ou « anormale ».

**2.** Entourer d'un cadre chaque casque de chantier visible sur une photo.

**3.** Séparer précisément la route, le trottoir et le ciel, pixel par pixel, pour une voiture autonome.

**4.** Générer le texte alternatif « un homme répare un vélo dans un garage » pour une image.

Et aussi :

**5.** Quelle est la différence entre détection d'objets et segmentation sémantique ?

**6.** Avec quoi entraîne-t-on un modèle de classification d'images ?

**7.** Cite trois scénarios d'usage de la vision par ordinateur.

<details>
<summary>Voir le corrigé</summary>

**1.** Classification d'images.

**2.** Détection d'objets.

**3.** Segmentation sémantique.

**4.** Modèle multimodal.

**5.** La détection indique l'emplacement par une boîte ; la segmentation identifie les pixels exacts de l'objet.

**6.** Avec des images étiquetées par leur sujet principal.

**7.** Trois parmi : légendes automatiques, recherche visuelle, suivi des stocks ou caisse automatique, vidéosurveillance, reconnaissance faciale, robotique et véhicules autonomes.

</details>
