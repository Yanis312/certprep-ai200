# React — Les Hooks essentiels

## C'est quoi un Hook ?

Un Hook = une fonction React qui commence par `use`. Elle te permet d'utiliser les fonctionnalités de React (state, effets de bord, contexte...) dans un composant fonctionnel.

**Règles des Hooks :**
- Appelle-les toujours au **niveau supérieur** du composant (pas dans des if, boucles, fonctions imbriquées)
- Appelle-les uniquement dans des **composants React** ou d'autres Hooks

---

## useState — Stocker une valeur réactive

```typescript
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>("");
const [user, setUser] = useState<User | null>(null);
```

- La valeur change → React **re-render** le composant
- `count` = valeur actuelle / `setCount` = fonction pour la modifier
- Ne jamais modifier directement : `count = 5` ❌ → toujours `setCount(5)` ✅

**Mise à jour basée sur la valeur précédente :**
```typescript
setCount(prev => prev + 1); // ✅ Correct (async-safe)
setCount(count + 1);         // ⚠️ Peut poser problème si appelé plusieurs fois
```

---

## useEffect — Effets de bord après le rendu

```typescript
// S'exécute après CHAQUE render
useEffect(() => {
  console.log("render");
});

// S'exécute UNE SEULE FOIS au montage
useEffect(() => {
  fetchData();
}, []);

// S'exécute quand `userId` change
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// Cleanup (ex: unsubscribe, clear timer)
useEffect(() => {
  const timer = setInterval(() => tick(), 1000);
  return () => clearInterval(timer); // ← cleanup
}, []);
```

**Cas d'usage :** appels API, subscriptions, manipulation DOM, timers

---

## useRef — Référence sans re-render

```typescript
// Accéder au DOM
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();

// Stocker une valeur sans déclencher de re-render
const countRef = useRef<number>(0);
countRef.current += 1; // ne re-render pas !
```

**Différence clé avec useState :**
- `useState` → change = re-render ✅
- `useRef` → change = **PAS** de re-render (persistant entre renders)

---

## useMemo — Mémoïser un calcul coûteux

```typescript
const filteredList = useMemo(() => {
  return bigList.filter(item => item.active);
}, [bigList]); // recalcule SEULEMENT si bigList change
```

**Quand l'utiliser :** calculs lourds, filtres/tris sur de grandes listes, valeurs dérivées coûteuses.
**Ne pas surutiliser** — le mémoïsation a un coût, inutile pour des opérations simples.

---

## useCallback — Mémoïser une fonction

```typescript
const handleSubmit = useCallback((data: FormData) => {
  submitForm(data);
}, [submitForm]); // recréée seulement si submitForm change
```

**Pourquoi ?** Sans `useCallback`, une nouvelle référence de fonction est créée à chaque render. Si tu passes cette fonction en prop à un composant enfant optimisé (`React.memo`), il re-render inutilement.

---

## useContext — Accéder au contexte global

```typescript
// Créer un contexte
const ThemeContext = createContext<"dark" | "light">("dark");

// Consommer dans un composant enfant
const theme = useContext(ThemeContext);
```

Évite le **prop drilling** (passer des props à travers plusieurs niveaux de composants).

---

## Résumé rapide

| Hook | Rôle | Re-render ? |
|---|---|---|
| `useState` | Valeur réactive | ✅ Oui |
| `useEffect` | Effets après render | — |
| `useRef` | Référence persistante | ❌ Non |
| `useMemo` | Mémoïser une valeur | — |
| `useCallback` | Mémoïser une fonction | — |
| `useContext` | Lire le contexte global | ✅ Si contexte change |

---

## Points clés pour les entretiens

- `useState` vs `useRef` : la différence clé c'est le re-render
- `useMemo` vs `useCallback` : memo = valeur, callback = fonction
- Toujours passer une fonction de mise à jour à `setState` quand la valeur dépend du state précédent
- Le tableau de dépendances de `useEffect` doit inclure toutes les valeurs utilisées à l'intérieur
