## Les 4 principes OOP

### Encapsulation
Cacher les détails internes, exposer uniquement ce qui est nécessaire.
```csharp
public class BankAccount {
    private decimal _balance; // caché
    public void Deposit(decimal amount) {
        if (amount > 0) _balance += amount; // logique protégée
    }
    public decimal GetBalance() => _balance;
}
```

### Héritage
Une classe enfant hérite des propriétés et méthodes de la classe parent.
```csharp
public class Animal { public virtual void Speak() => Console.WriteLine("..."); }
public class Dog : Animal { public override void Speak() => Console.WriteLine("Woof!"); }
```

### Polymorphisme
Un objet peut prendre plusieurs formes — une même méthode se comporte différemment selon le type réel.
```csharp
Animal animal = new Dog();
animal.Speak(); // → "Woof!" (comportement de Dog, pas de Animal)
```

### Abstraction
Cacher la complexité, exposer uniquement l'essentiel via des interfaces ou classes abstraites.
```csharp
public interface IRepository<T> {
    Task<T> GetByIdAsync(int id);
    Task SaveAsync(T entity);
}
// L'appelant ne sait pas si c'est SQL, MongoDB ou un mock
```

---

## SOLID

| Principe | En une phrase | Exemple |
|----------|--------------|---------|
| **S** — Single Responsibility | Une classe = une seule raison de changer | `UserService` gère les users, pas les emails |
| **O** — Open/Closed | Ouvert à l'extension, fermé à la modification | Ajouter via héritage, pas modifier le code existant |
| **L** — Liskov Substitution | Un enfant remplace le parent sans surprises | `Dog` peut remplacer `Animal` partout |
| **I** — Interface Segregation | Plusieurs petites interfaces > une grande | `IReadable`, `IWritable` plutôt qu'un seul `IStorage` |
| **D** — Dependency Inversion | Dépendre des abstractions, pas des concrets | Injecter `IUserRepository`, pas `SqlUserRepository` |

```csharp
// ✅ D — Dependency Inversion
public class UserService {
    private readonly IUserRepository _repo; // interface
    public UserService(IUserRepository repo) => _repo = repo;
    // pas de new SqlUserRepository() ici !
}
```

---

## Repository Pattern

Abstrait l'accès aux données derrière une interface. Le code métier ne sait pas si c'est SQL, MongoDB ou un cache.

```csharp
public interface IUserRepository {
    Task<User?> GetByIdAsync(int id);
    Task<IEnumerable<User>> GetAllAsync();
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(int id);
}

public class SqlUserRepository : IUserRepository {
    private readonly AppDbContext _db;
    public SqlUserRepository(AppDbContext db) => _db = db;
    public async Task<User?> GetByIdAsync(int id) => await _db.Users.FindAsync(id);
    // ...
}
```

**Pourquoi ?** Testable (mock facile), changement de DB transparent pour le reste du code.

---

## Service Layer Pattern

Sépare la logique métier des controllers. Le controller reçoit la requête, délègue au service, retourne la réponse.

```csharp
// Controller — fin, pas de logique
[HttpPost]
public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto) {
    var user = await _userService.CreateAsync(dto);
    return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
}

// Service — logique métier
public class UserService {
    public async Task<UserDto> CreateAsync(CreateUserDto dto) {
        var user = new User { Name = dto.Name, Email = dto.Email };
        await _repo.AddAsync(user);
        await _emailService.SendWelcomeAsync(user.Email);
        return user.ToDto();
    }
}
```

---

## DTO — Data Transfer Object

Objet simple qui transporte des données entre les couches. Évite d'exposer directement les entités DB.

```csharp
// Entité DB — contient tout
public class User { public int Id; public string Name; public string PasswordHash; public DateTime CreatedAt; }

// DTO — expose uniquement ce dont l'API a besoin
public class UserDto { public int Id; public string Name; }

// Mapping
public static UserDto ToDto(this User u) => new() { Id = u.Id, Name = u.Name };
```

**Pourquoi ?** Sécurité (ne pas exposer PasswordHash), flexibilité (changer la DB sans casser l'API).

---

## Circuit Breaker Pattern

Empêche un service défaillant de surcharger le système. Comme un disjoncteur électrique.

**3 états :**
- **Closed** (normal) — les appels passent
- **Open** (défaillant) — les appels sont bloqués immédiatement (fail fast)
- **Half-Open** (test) — quelques appels passent pour vérifier si le service est rétabli

```csharp
// Avec Polly (librairie standard .NET)
var policy = Policy
    .Handle<HttpRequestException>()
    .CircuitBreakerAsync(
        exceptionsAllowedBeforeBreaking: 3,
        durationOfBreak: TimeSpan.FromSeconds(30)
    );

await policy.ExecuteAsync(() => httpClient.GetAsync(url));
```
