## .NET Framework vs .NET Core

**.NET Framework** — Windows uniquement, legacy. Installé sur la machine, partagé entre les apps.

**.NET Core / .NET 5+** — Cross-platform (Windows, Linux, Mac), open source, moderne. Chaque app embarque son propre runtime.

```
.NET Framework → applications Windows enterprise existantes
.NET 6/7/8     → tout nouveau projet aujourd'hui
```

---

## async / await

`async` et `await` permettent d'écrire du code asynchrone sans bloquer le thread. Le thread est libéré pendant l'attente (I/O, DB, HTTP) et reprend quand c'est prêt.

```csharp
// Sans async → thread bloqué pendant l'appel HTTP
public string GetData() {
    return httpClient.GetStringAsync(url).Result; // ❌ bloque
}

// Avec async → thread libéré, revient quand c'est prêt
public async Task<string> GetDataAsync() {
    return await httpClient.GetStringAsync(url); // ✅ non-bloquant
}
```

**Règle :** `async` tout le chemin — si une méthode est async, toutes ses appelantes doivent l'être aussi.

---

## Value Types vs Reference Types

| | Value Type | Reference Type |
|--|-----------|---------------|
| **Stocké dans** | Stack | Heap |
| **Copie** | Copie la valeur | Copie la référence |
| **Exemples** | `int`, `bool`, `struct`, `enum` | `class`, `string`, `array` |

```csharp
int a = 5;
int b = a;   // b = copie de 5
b = 10;      // a reste 5

var p1 = new Person { Name = "Alice" };
var p2 = p1;         // p2 pointe vers le même objet
p2.Name = "Bob";     // p1.Name aussi = "Bob" !
```

---

## String vs StringBuilder

`string` est **immuable** — chaque modification crée un nouvel objet en mémoire.
`StringBuilder` modifie le même buffer — beaucoup plus efficace pour les concaténations répétées.

```csharp
// ❌ Crée 1000 nouveaux strings en mémoire
string result = "";
for (int i = 0; i < 1000; i++)
    result += i;

// ✅ Modifie le même buffer
var sb = new StringBuilder();
for (int i = 0; i < 1000; i++)
    sb.Append(i);
string result = sb.ToString();
```

**Règle :** Utilise `StringBuilder` dès que tu concaténes en boucle.

---

## Boxing vs Unboxing

**Boxing** : convertir un value type (ex: `int`) en `object` (stockage sur le heap).
**Unboxing** : extraire le value type depuis l'object.

```csharp
int num = 42;
object boxed = num;      // Boxing   — copie vers heap
int unboxed = (int)boxed; // Unboxing — copie depuis heap
```

**Problème :** coûteux en mémoire et en perf. À éviter dans les boucles serrées. `List<int>` évite le boxing, `ArrayList` non.

---

## Exception Handling

```csharp
try {
    var data = await GetDataAsync();
    // code qui peut lancer une exception
}
catch (HttpRequestException ex) {
    // exception spécifique d'abord
    logger.LogError(ex, "Erreur HTTP");
}
catch (Exception ex) {
    // exception générale en dernier
    logger.LogError(ex, "Erreur inattendue");
}
finally {
    // s'exécute toujours (cleanup, fermer connexions)
    connection.Close();
}
```

**Bonnes pratiques :**
- `catch` du plus spécifique au plus général
- Ne jamais attraper `Exception` sans logger
- `finally` pour libérer les ressources (ou utiliser `using`)
- Ne pas utiliser les exceptions pour le flux normal de l'app

```csharp
// ✅ using → Dispose() appelé automatiquement même si exception
using var connection = new SqlConnection(connectionString);
```
