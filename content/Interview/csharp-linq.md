## LINQ — Language Integrated Query

LINQ permet d'interroger des collections directement en C# avec une syntaxe fluide.

```csharp
var nums = new[] { 1, 2, 3, 4, 5, 6 };

// Méthode chaînée (recommandée)
var result = nums.Where(x => x % 2 == 0).Select(x => x * 10).ToList();
// → [20, 40, 60]

// Syntaxe query (SQL-like)
var result2 = (from x in nums where x % 2 == 0 select x * 10).ToList();
```

---

## IEnumerable vs IQueryable

| | `IEnumerable<T>` | `IQueryable<T>` |
|--|-----------------|----------------|
| **Exécution** | En mémoire (C#) | Côté serveur (SQL) |
| **Quand** | Collections, listes en mémoire | EF Core, bases de données |
| **Traduit** | Non — tout est chargé d'abord | Oui — converti en SQL |

```csharp
// IQueryable → SQL généré : SELECT * FROM Users WHERE Age > 18
IQueryable<User> query = dbContext.Users.Where(u => u.Age > 18);

// IEnumerable → TOUS les users chargés en mémoire, filtrage en C#
IEnumerable<User> query2 = dbContext.Users.AsEnumerable().Where(u => u.Age > 18);
```

**Règle :** Utilise `IQueryable` pour les requêtes DB, `IEnumerable` pour les listes en mémoire.

---

## Deferred Execution (Exécution différée)

LINQ ne s'exécute **pas** quand tu écris la requête — seulement quand tu itères le résultat.

```csharp
var query = nums.Where(x => x > 3); // ← PAS encore exécuté

nums = nums.Append(10).ToArray();   // on modifie la source

foreach (var n in query) Console.Write(n); // ← s'exécute ICI → 4, 5, 6, 10
```

**Déclenche l'exécution immédiate :** `ToList()`, `ToArray()`, `Count()`, `First()`, `Sum()`...

---

## Any / All / Count / First

```csharp
var users = new[] { new User("Alice", 25), new User("Bob", 17), new User("Carol", 30) };

users.Any(u => u.Age < 18);        // → true (au moins un)
users.All(u => u.Age >= 18);       // → false (Bob a 17)
users.Count(u => u.Age >= 18);     // → 2
users.First(u => u.Age >= 18);     // → Alice
users.FirstOrDefault(u => u.Age > 50); // → null (pas d'exception)
```

---

## Projection (Select / SelectMany)

```csharp
// Select — transformer chaque élément
var names = users.Select(u => u.Name); // → ["Alice", "Bob", "Carol"]

// SelectMany — aplatir une collection de collections
var orders = users.SelectMany(u => u.Orders); // → toutes les commandes en une liste plate

// Projection vers un type anonyme
var summaries = users.Select(u => new { u.Name, IsAdult = u.Age >= 18 });
```

---

## GroupBy / OrderBy

```csharp
// Grouper par département
var byDept = employees.GroupBy(e => e.Department);
foreach (var group in byDept) {
    Console.WriteLine($"{group.Key}: {group.Count()} employés");
}

// Trier
var sorted = users.OrderBy(u => u.Age).ThenBy(u => u.Name);
var descending = users.OrderByDescending(u => u.Age);
```

---

## Delegates & Events

**Delegate** : type qui représente une référence vers une méthode.

```csharp
// Délégué personnalisé
delegate int Operation(int a, int b);
Operation add = (a, b) => a + b;
Console.WriteLine(add(3, 4)); // → 7

// Func<> et Action<> — délégués prédéfinis
Func<int, int, int> multiply = (a, b) => a * b;  // retourne un int
Action<string> print = msg => Console.WriteLine(msg); // retourne void
```

**Event** : délégué multicast — plusieurs handlers peuvent s'abonner.

```csharp
public class Button {
    public event EventHandler Clicked; // délégué multicast
    public void Click() => Clicked?.Invoke(this, EventArgs.Empty);
}

var btn = new Button();
btn.Clicked += (s, e) => Console.WriteLine("Handler 1");
btn.Clicked += (s, e) => Console.WriteLine("Handler 2");
btn.Click(); // → "Handler 1" + "Handler 2"
```

---

## Extension Methods

Ajoute des méthodes à un type existant sans le modifier.

```csharp
public static class StringExtensions {
    public static bool IsNullOrEmpty(this string s) => string.IsNullOrEmpty(s);
    public static string Truncate(this string s, int max) =>
        s.Length <= max ? s : s[..max] + "...";
}

// Utilisation
string name = "Alexandre";
name.IsNullOrEmpty(); // → false
name.Truncate(5);     // → "Alexa..."
```

---

## Null Coalescing

```csharp
string name = null;

string result = name ?? "Inconnu";           // → "Inconnu" si null
name ??= "Inconnu";                          // Assigne seulement si null

// Null-conditional
string upper = name?.ToUpper();              // → null si name est null (pas d'exception)
int length = name?.Length ?? 0;             // → 0 si name est null
```
