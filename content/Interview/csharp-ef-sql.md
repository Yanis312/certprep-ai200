## Entity Framework Core vs Dapper

| | **EF Core** | **Dapper** |
|--|-----------|-----------|
| **Type** | ORM complet | Micro-ORM |
| **Requêtes** | LINQ → SQL généré | SQL manuel |
| **Migrations** | Oui (Code First) | Non |
| **Perf** | Bien pour CRUD simple | Excellent pour requêtes complexes |
| **Quand** | CRUD standard, prototypes | Requêtes optimisées, reporting |

```csharp
// EF Core
var users = await context.Users.Where(u => u.IsActive).ToListAsync();

// Dapper
var users = await conn.QueryAsync<User>("SELECT * FROM Users WHERE IsActive = 1");
```

---

## DbContext

Le `DbContext` est le point central d'EF Core — il représente la session avec la base de données.

```csharp
public class AppDbContext : DbContext {
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder) {
        builder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        builder.Entity<Order>().HasOne(o => o.User).WithMany(u => u.Orders);
    }
}

// Enregistrement dans Program.cs
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
```

---

## Migrations

Les migrations synchronisent ton modèle C# avec la base de données.

```bash
# Créer une migration
dotnet ef migrations add AddUserTable

# Appliquer en base
dotnet ef database update

# Revenir à une migration précédente
dotnet ef database update 20240101_InitialCreate

# Supprimer la dernière migration (si pas encore appliquée)
dotnet ef migrations remove
```

**Workflow Code First :**
1. Modifier le modèle C#
2. `dotnet ef migrations add NomDescription`
3. `dotnet ef database update`

---

## Code First — Attributs et Fluent API

```csharp
// Via attributs
public class User {
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [EmailAddress]
    [Index(IsUnique = true)]
    public string Email { get; set; }
}

// Via Fluent API (dans OnModelCreating) — plus flexible
builder.Entity<User>(entity => {
    entity.HasKey(u => u.Id);
    entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
    entity.HasIndex(u => u.Email).IsUnique();
    entity.HasMany(u => u.Orders).WithOne(o => o.User).OnDelete(DeleteBehavior.Cascade);
});
```

---

## Eager vs Lazy Loading vs Explicit Loading

```csharp
// Eager Loading — charge les relations avec Include()
var users = await context.Users
    .Include(u => u.Orders)
    .ThenInclude(o => o.Items)
    .ToListAsync();

// Lazy Loading — charge la relation quand on y accède (nécessite virtual)
public class User {
    public virtual ICollection<Order> Orders { get; set; } // ← virtual requis
}
var user = await context.Users.FindAsync(1);
var orders = user.Orders; // ← chargé automatiquement (N+1 problem !)

// Explicit Loading — contrôle manuel
var user = await context.Users.FindAsync(1);
await context.Entry(user).Collection(u => u.Orders).LoadAsync();
```

**Problème N+1 :** Lazy Loading en boucle → 1 requête pour la liste + N requêtes pour chaque relation. **Toujours préférer Eager Loading** pour les relations connues.

---

## Opérations CRUD

```csharp
// Create
var user = new User { Name = "Alice", Email = "alice@example.com" };
context.Users.Add(user);
await context.SaveChangesAsync(); // génère INSERT

// Read
var user = await context.Users.FindAsync(id);
var users = await context.Users.Where(u => u.IsActive).ToListAsync();

// Update
user.Name = "Alice Updated";
await context.SaveChangesAsync(); // génère UPDATE (change tracking)

// Delete
context.Users.Remove(user);
await context.SaveChangesAsync(); // génère DELETE
```

**Change Tracking :** EF Core détecte automatiquement les modifications sur les entités attachées au contexte. `SaveChangesAsync()` génère les SQL correspondants.

---

## AsNoTracking

Pour les requêtes read-only, désactive le change tracking → meilleure performance.

```csharp
// ❌ inutile si tu ne vas pas modifier
var users = await context.Users.ToListAsync();

// ✅ plus rapide pour affichage seul
var users = await context.Users.AsNoTracking().ToListAsync();
```
