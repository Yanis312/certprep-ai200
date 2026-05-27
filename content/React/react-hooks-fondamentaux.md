> **Dans cette unité, on va voir :**
> - Pourquoi les hooks existent et leurs règles fondamentales
> - `useState` — stocker et mettre à jour l'état
> - `useEffect` — exécuter du code après le rendu
> - `useRef` — valeurs mutables sans re-render
> - `useMemo` et `useCallback` — mémoïsation pour la performance
> - `useContext` — partager un état global sans prop drilling
> - Comment créer ses propres hooks personnalisés

---

## Pourquoi les hooks ?

Avant React 16.8, seuls les class components avaient un state et un lifecycle. Les hooks permettent d'utiliser ces fonctionnalités dans des **function components** — code plus concis, plus testable, plus lisible.

**Règles des hooks :**
- Appeler uniquement **au niveau supérieur** (pas dans des `if`, boucles, fonctions imbriquées)
- Appeler uniquement depuis des **function components** ou des **hooks personnalisés**

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
setCount(prev => prev + 1); // ✅ Safe
setCount(count + 1);        // ⚠️ Peut causer des bugs en updates rapides
```

#### Mise en situation — Formulaire de contact en TypeScript

**Situation :** Tu construis un formulaire d'inscription avec 4 champs (nom, email, mot de passe, rôle). Chaque champ doit être contrôlé — la valeur affichée est toujours celle du state React.

**Tâche :** Gérer l'état du formulaire et valider en temps réel sans re-render excessif.

**Action :** Un seul `useState` avec un objet contenant tous les champs. Le setter utilise le spread operator pour ne modifier que le champ qui change.

```typescript
const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });

const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm(prev => ({ ...prev, [field]: e.target.value }));
};
```

**Résultat :** 4 champs gérés avec un seul state, validation possible à chaque keystroke, code lisible et extensible — ajouter un champ = une seule ligne.

---

## useEffect

Exécute du code **après le rendu** — effets de bord, appels API, subscriptions, timers.

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
  return () => subscription.unsubscribe();
}, [event]);
```

**Tableau de dépendances :**
- `[]` → s'exécute une fois au montage
- `[a, b]` → s'exécute quand `a` ou `b` change
- Aucun tableau → s'exécute à chaque render (rarement voulu)

#### Mise en situation — Dashboard avec données en temps réel

**Situation :** Tu développes un dashboard qui affiche les métriques Azure d'un AKS cluster. Les données doivent se rafraîchir toutes les 30 secondes. Quand l'utilisateur change de cluster, le polling doit s'arrêter et redémarrer sur le nouveau.

**Tâche :** Mettre en place un polling automatique qui démarre au montage, se stoppe correctement au démontage, et redémarre si `clusterId` change.

**Action :**
```typescript
useEffect(() => {
  const poll = setInterval(() => fetchMetrics(clusterId), 30_000);
  fetchMetrics(clusterId); // appel immédiat
  return () => clearInterval(poll); // cleanup
}, [clusterId]);
```

**Résultat :** Polling propre sans fuite mémoire — quand le composant se démonte ou que `clusterId` change, l'intervalle précédent est automatiquement annulé.

---

## useRef

Stocke une valeur mutable **sans déclencher de re-render**.

```typescript
// Accès au DOM
const inputRef = useRef<HTMLInputElement>(null);
const handleFocus = () => inputRef.current?.focus();

// Stocker une valeur sans re-render (timer, WebSocket...)
const wsRef = useRef<WebSocket>();
wsRef.current = new WebSocket(url);

// Conserver la valeur précédente
const prevCount = useRef(count);
useEffect(() => { prevCount.current = count; }, [count]);
```

#### Mise en situation — Auto-focus sur un champ de recherche

**Situation :** Une app de recherche doit automatiquement mettre le focus sur le champ de saisie quand une modal s'ouvre, pour que l'utilisateur puisse taper directement sans cliquer.

**Tâche :** Donner le focus programmatiquement à un `<input>` sans déclencher de re-render inutile.

**Action :**
```typescript
const searchRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (isOpen) searchRef.current?.focus();
}, [isOpen]);

return <input ref={searchRef} placeholder="Rechercher..." />;
```

**Résultat :** La modal s'ouvre et le curseur est automatiquement dans le champ — expérience fluide sans aucun re-render superflu.

---

## useMemo

Mémoïse le **résultat** d'un calcul coûteux.

```typescript
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]); // recalcule seulement si `items` change

const stats = useMemo(() => ({
  total: orders.length,
  revenue: orders.reduce((s, o) => s + o.amount, 0),
  avgOrderValue: orders.reduce((s, o) => s + o.amount, 0) / orders.length,
}), [orders]);
```

**Quand l'utiliser :** calculs sur de grandes listes, création d'objets passés à des composants `React.memo`.
**Quand ne pas l'utiliser :** calculs simples — le coût de mémoïsation dépasse le gain.

---

## useCallback

Mémoïse une **fonction** pour qu'elle garde la même référence entre renders.

```typescript
const handleDelete = useCallback((id: string) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []); // nouvelle référence uniquement si les dépendances changent
```

#### Mise en situation — Liste de 1000 éléments avec suppression

**Situation :** Un tableau de données affiche 1000 lignes. Chaque ligne a un bouton "Supprimer" qui appelle `onDelete`. Sans optimisation, chaque keystroke dans un champ de filtre re-render les 1000 lignes car `onDelete` est une nouvelle fonction à chaque render.

**Tâche :** Éviter le re-render des 1000 lignes quand seul le filtre change.

**Action :** Wrapper `onDelete` dans `useCallback` + wrapper le composant `Row` dans `React.memo`. La référence de `onDelete` ne change que si ses dépendances changent — les lignes ne se re-rendent pas inutilement.

**Résultat :** Changement de filtre = re-render seulement des lignes filtrées, pas des 1000. Performance multipliée par 10 sur des grandes listes.

---

## useContext

Partage une valeur dans tout un sous-arbre sans prop drilling.

```typescript
// 1. Créer le contexte
const AuthContext = createContext<{ user: User | null; logout: () => void } | null>(null);

// 2. Fournir la valeur
<AuthContext.Provider value={{ user, logout }}>
  <App />
</AuthContext.Provider>

// 3. Consommer n'importe où dans l'arbre
const { user, logout } = useContext(AuthContext)!;
```

---

## Hooks personnalisés

Un hook personnalisé est une fonction qui commence par `use` et peut appeler d'autres hooks.

```typescript
function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });

  const setAndStore = useCallback((v: T) => {
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  }, [key]);

  return [value, setAndStore] as const;
}

// Utilisation — identique à useState mais persisté
const [theme, setTheme] = useLocalStorage("theme", "light");
```

---

## Résumé rapide

| Hook | Re-render ? | Usage principal |
|------|---|---|
| `useState` | Oui | State UI reactive |
| `useEffect` | Non | Effets de bord, API calls, cleanup |
| `useRef` | Non | DOM, timers, valeurs imperatives |
| `useMemo` | Non | Calculs coûteux mémoïsés |
| `useCallback` | Non | Fonctions mémoïsées |
| `useContext` | Si contexte change | État global partagé |
