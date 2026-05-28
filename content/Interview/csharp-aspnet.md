## Middleware ASP.NET Core

Le middleware est une chaîne de traitements qui s'exécutent dans l'ordre pour chaque requête HTTP.

```
Requête → [Logging] → [Auth] → [Routing] → [Controller] → [Controller] → [Routing] → [Auth] → [Logging] → Réponse
```

```csharp
// Program.cs — ordre important !
app.UseExceptionHandler("/error"); // doit être en premier
app.UseHttpsRedirection();
app.UseAuthentication();           // avant Authorization
app.UseAuthorization();
app.MapControllers();

// Middleware custom
app.Use(async (context, next) => {
    Console.WriteLine($"→ {context.Request.Method} {context.Request.Path}");
    await next(context);           // passe au middleware suivant
    Console.WriteLine($"← {context.Response.StatusCode}");
});

// Middleware qui court-circuite (ne passe pas au suivant)
app.Use(async (context, next) => {
    if (!context.Request.Headers.ContainsKey("X-Api-Key")) {
        context.Response.StatusCode = 401;
        return; // court-circuit — pas de next()
    }
    await next(context);
});
```

---

## Injection de dépendances — Lifetimes

| Lifetime | Instance | Quand utiliser |
|----------|----------|----------------|
| **Transient** | Nouvelle à chaque injection | Services sans état, légers |
| **Scoped** | Une par requête HTTP | DbContext, services avec état par requête |
| **Singleton** | Une seule pour toute l'app | Cache, config, services thread-safe |

```csharp
// Enregistrement dans Program.cs
builder.Services.AddTransient<IEmailService, SmtpEmailService>();
builder.Services.AddScoped<IUserRepository, SqlUserRepository>();
builder.Services.AddSingleton<ICacheService, MemoryCacheService>();
```

**Piège :** Ne jamais injecter un service Scoped dans un Singleton — le Scoped serait "capturé" et vivrait trop longtemps.

---

## PUT vs PATCH

| | **PUT** | **PATCH** |
|--|--------|---------|
| **Sémantique** | Remplace l'entité entière | Met à jour partiellement |
| **Body** | Tous les champs (même inchangés) | Seulement les champs à changer |
| **Idempotent** | ✅ Oui | ✅ Oui (si implémenté correctement) |

```csharp
// PUT — remplace tout l'utilisateur
[HttpPut("{id}")]
public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto) {
    // dto doit contenir TOUS les champs
    var user = await _repo.GetByIdAsync(id);
    user.Name = dto.Name;
    user.Email = dto.Email;
    user.Phone = dto.Phone;
    await _repo.UpdateAsync(user);
    return NoContent();
}

// PATCH — met à jour partiellement
[HttpPatch("{id}")]
public async Task<IActionResult> PatchUser(int id, [FromBody] JsonPatchDocument<User> patch) {
    var user = await _repo.GetByIdAsync(id);
    patch.ApplyTo(user); // applique seulement les champs fournis
    await _repo.UpdateAsync(user);
    return NoContent();
}
```

---

## Sécuriser une API REST

### JWT (JSON Web Token)

```csharp
// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Controller
[Authorize]
[HttpGet("profile")]
public IActionResult GetProfile() {
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    return Ok(userId);
}

// Rôles
[Authorize(Roles = "Admin")]
[HttpDelete("{id}")]
public Task<IActionResult> Delete(int id) { ... }
```

### CORS

```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("AllowFrontend", policy => {
        policy.WithOrigins("https://monapp.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
app.UseCors("AllowFrontend");
```

### Rate Limiting (ASP.NET 7+)

```csharp
builder.Services.AddRateLimiter(options => {
    options.AddFixedWindowLimiter("api", config => {
        config.PermitLimit = 100;
        config.Window = TimeSpan.FromMinutes(1);
    });
});
app.UseRateLimiter();

[EnableRateLimiting("api")]
[HttpGet]
public IActionResult Get() { ... }
```

---

## Model Validation

```csharp
public class CreateUserDto {
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Range(18, 120)]
    public int Age { get; set; }
}

// Retour automatique 400 si invalide (grâce à [ApiController])
[ApiController]
public class UsersController : ControllerBase {
    [HttpPost]
    public IActionResult Create([FromBody] CreateUserDto dto) {
        // Si dto invalide → 400 automatique, on n'arrive jamais ici
    }
}
```

---

## Action Results courants

```csharp
return Ok(user);                                  // 200 + body
return Created($"/users/{id}", user);             // 201 + body
return CreatedAtAction(nameof(Get), new { id }, user); // 201 + Location header
return NoContent();                               // 204
return BadRequest("Email invalide");              // 400
return Unauthorized();                            // 401
return Forbid();                                  // 403
return NotFound();                                // 404
return Problem("Erreur serveur", statusCode: 500); // 500
```
