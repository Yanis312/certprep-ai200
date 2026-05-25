## Les Hooks React — Pourquoi ?

Avant les hooks (React < 16.8), seuls les class components avaient un state et un lifecycle. Les hooks permettent d'utiliser ces fonctionnalités dans des **function components** — code plus concis, plus lisible, plus testable.

**Règles des hooks :**
- Appeler les hooks **uniquement au niveau supérieur** (pas dans des if, boucles, fonctions imbriquées)
- Appeler uniquement depuis des **function components** ou des hooks personnalisés

---

## useState

Stocke une valeur et déclenche un re-render quand elle change.

```typescript
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);
const [isOpen, setIsOpen] = useState(false);
```

**Mise à jour fonctionnelle** (quand la nouvelle valeur dépend de l'ancienne) :
```typescript
setCount(prev => prev + 1); // ✅ Safe en concurrent mode
setCount(count + 1);        // ⚠️ Peut causer des bugs en updates rapides
```

**useState avec objet :**
```typescript
const [form, setForm] = useState({ name: "", email: "" });

// Toujours spread l'objet existant, sinon les autres champs sont perdus
setForm(prev => ({ ...prev, name: "Yanis" }));
```

---

## useEffect

Exécute du code **après le rendu** — idéal pour les effets de bord (appels API, subscriptions, timers).

```typescript
// Au montage uniquement
useEffect(() => {
  fetchData();
}, []);

// À chaque changement de userId
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// Cleanup (évite les fuites mémoire)
useEffect(() => {
  const subscription = subscribe(event);
  return () => subscription.unsubscribe(); // cleanup
}, [event]);
```

**Tableau de dépendances :**
- `[]` → s'exécute une fois au montage
- `[a, b]` → s'exécute quand `a` ou `b` change
- Aucun tableau → s'exécute à chaque render (rarement voulu)

---

## useRef

Stocke une valeur mutable **sans déclencher de re-render**.

```typescript
// Accès au DOM
const inputRef = useRef<HTMLInputElement>(null);
const handleFocus = () => inputRef.current?.focus();

// Stocker une valeur sans re-render
const timerRef = useRef<NodeJS.Timeout>();
timerRef.current = setTimeout(() => {}, 1000);

// Conserver la valeur précédente
const prevCount = useRef(count);
useEffect(() => { prevCount.current = count; }, [count]);
```

**useRef vs useState :**
| | `useState` | `useRef` |
|---|---|---|
| Re-render | Oui | Non |
| Accès | `value` | `ref.current` |
| Usage | UI reactive | DOM, timers, valeurs imperatives |

---

## useMemo

Mémoïse le **résultat** d'un calcul coûteux.

```typescript
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]); // recalcule seulement si `items` change

const filteredUsers = useMemo(() => {
  return users.filter(u => u.role === selectedRole);
}, [users, selectedRole]);
```

**Quand utiliser useMemo :**
- Calculs coûteux (tri, filtre, agrégation de grandes listes)
- Création d'objets passés à des composants enfants optimisés avec `React.memo`
- Ne pas l'utiliser pour des calculs simples — le coût de mémoïsation dépasserait le gain

---

## useCallback

Mémoïse une **fonction** pour qu'elle garde la même référence entre renders.

```typescript
const handleSubmit = useCallback((e: React.FormEvent) => {
  e.preventDefault();
  submitForm(formData);
}, [formData]); // nouvelle référence seulement si formData change

// Sans useCallback : nouvelle référence à chaque render
// → l'enfant avec React.memo se re-render inutilement
```

**Règle :** useCallback est utile surtout quand la fonction est passée en prop à un composant optimisé avec `React.memo` ou utilisée comme dépendance de `useEffect`.

---

## useContext

Partage une valeur dans tout un sous-arbre sans prop drilling.

```typescript
// 1. Créer le contexte
const ThemeContext = createContext<"light" | "dark">("light");

// 2. Fournir la valeur
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// 3. Consommer n'importe où dans l'arbre
const theme = useContext(ThemeContext);
```

---

## Hooks personnalisés

Un hook personnalisé est une fonction qui commence par `use` et peut appeler d'autres hooks.

```typescript
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const update = () => setSize({ width: innerWidth, height: innerHeight });
    window.addEventListener("resize", update);
    update();
    return () => window.removeEventListener("resize", update);
  }, []);
  
  return size;
}

// Utilisation
const { width, height } = useWindowSize();
```

---

## Résumé rapide

| Hook | Déclenche re-render | Usage principal |
|------|---|---|
| `useState` | Oui | State UI reactive |
| `useEffect` | Non | Effets de bord, API calls |
| `useRef` | Non | DOM, timers, valeurs imperatives |
| `useMemo` | Non | Calculs coûteux mémoïsés |
| `useCallback` | Non | Fonctions mémoïsées |
| `useContext` | Oui (si contexte change) | État global partagé |
