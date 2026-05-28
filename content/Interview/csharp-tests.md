## Tests unitaires — xUnit

xUnit est le framework de test standard .NET (NUnit fonctionne très similairement).

```csharp
// Installation : dotnet add package xunit xunit.runner.visualstudio Moq

public class UserServiceTests {
    private readonly Mock<IUserRepository> _repoMock;
    private readonly UserService _service;

    public UserServiceTests() {
        _repoMock = new Mock<IUserRepository>();
        _service = new UserService(_repoMock.Object);
    }

    [Fact]
    public async Task CreateAsync_WithValidDto_ReturnsUserDto() {
        // Arrange
        var dto = new CreateUserDto { Name = "Alice", Email = "alice@test.com" };
        _repoMock.Setup(r => r.AddAsync(It.IsAny<User>())).Returns(Task.CompletedTask);

        // Act
        var result = await _service.CreateAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Alice", result.Name);
        _repoMock.Verify(r => r.AddAsync(It.IsAny<User>()), Times.Once);
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ThrowsNotFoundException() {
        // Arrange
        _repoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((User?)null);

        // Act + Assert
        await Assert.ThrowsAsync<NotFoundException>(() => _service.GetByIdAsync(99));
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    [InlineData("   ")]
    public async Task CreateAsync_WithInvalidName_ThrowsArgumentException(string name) {
        var dto = new CreateUserDto { Name = name, Email = "alice@test.com" };
        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateAsync(dto));
    }
}
```

---

## Arrange / Act / Assert (AAA)

Toujours structurer tes tests ainsi :

```csharp
[Fact]
public void Divide_ByZero_ThrowsDivideByZeroException() {
    // Arrange — prépare les données et le contexte
    var calculator = new Calculator();
    int dividend = 10;
    int divisor = 0;

    // Act — exécute le code à tester
    Action act = () => calculator.Divide(dividend, divisor);

    // Assert — vérifie le résultat
    Assert.Throws<DivideByZeroException>(act);
}
```

---

## Moq — Mock d'interfaces

```csharp
var mock = new Mock<IEmailService>();

// Setup — définir le comportement
mock.Setup(s => s.SendAsync(It.IsAny<string>(), It.IsAny<string>()))
    .ReturnsAsync(true);

// Verify — vérifier qu'une méthode a été appelée
mock.Verify(s => s.SendAsync("alice@test.com", It.IsAny<string>()), Times.Once);

// Never called
mock.Verify(s => s.SendAsync(It.IsAny<string>(), It.IsAny<string>()), Times.Never);

// Setup avec callback
mock.Setup(s => s.GetUserAsync(1))
    .ReturnsAsync(new User { Id = 1, Name = "Alice" });
```

---

## Tests d'intégration

Les tests unitaires testent la logique isolée. Les tests d'intégration testent l'ensemble (controller + service + DB).

```csharp
// Avec WebApplicationFactory (ASP.NET Core)
public class UserApiTests : IClassFixture<WebApplicationFactory<Program>> {
    private readonly HttpClient _client;

    public UserApiTests(WebApplicationFactory<Program> factory) {
        _client = factory.WithWebHostBuilder(builder => {
            builder.ConfigureServices(services => {
                // Remplace la vraie DB par une SQLite in-memory
                services.RemoveAll<DbContextOptions<AppDbContext>>();
                services.AddDbContext<AppDbContext>(opt =>
                    opt.UseInMemoryDatabase("TestDb"));
            });
        }).CreateClient();
    }

    [Fact]
    public async Task GetUsers_ReturnsOk() {
        var response = await _client.GetAsync("/api/users");
        response.EnsureSuccessStatusCode();
        var users = await response.Content.ReadFromJsonAsync<List<UserDto>>();
        Assert.NotNull(users);
    }
}
```

---

## Couverture de tests

```bash
# Lancer les tests avec couverture
dotnet test --collect:"XPlat Code Coverage"

# Générer un rapport HTML
dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"coveragereport" -reporttypes:Html
```

**Objectif réaliste :** 70-80% de couverture sur la logique métier. 100% est rarement utile (code trivial, propriétés auto).

---

## Bonnes pratiques de test

```csharp
// ✅ Nom de test descriptif : Méthode_Scénario_RésultatAttendu
public void CreateUser_WithDuplicateEmail_ThrowsConflictException() { }

// ✅ Un seul Assert logique par test
public void GetBalance_AfterDeposit_ReturnsCorrectAmount() {
    var account = new BankAccount();
    account.Deposit(100);
    Assert.Equal(100, account.GetBalance()); // UNE assertion
}

// ❌ Trop d'assertions → difficile à diagnostiquer
public void TestEverything() {
    Assert.Equal(100, account.GetBalance());
    Assert.True(account.IsActive);
    Assert.Equal("Alice", account.Owner);
    // si ça fail, lequel ?
}

// ✅ Utiliser [Theory] pour tester plusieurs cas
[Theory]
[InlineData(100, 50, 50)]
[InlineData(100, 100, 0)]
[InlineData(50, 10, 40)]
public void Withdraw_ValidAmount_ReducesBalance(decimal initial, decimal withdraw, decimal expected) {
    var account = new BankAccount(initial);
    account.Withdraw(withdraw);
    Assert.Equal(expected, account.GetBalance());
}
```
