## Redis — Cache distribué

Redis est un store clé-valeur en mémoire ultra-rapide. Utilisé pour le cache, les sessions, les queues.

```csharp
// Installation
// dotnet add package StackExchange.Redis
// dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis

// Program.cs
builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = builder.Configuration["Redis:ConnectionString"];
});

// Utilisation dans un service
public class ProductService {
    private readonly IDistributedCache _cache;
    private readonly IProductRepository _repo;

    public async Task<Product?> GetByIdAsync(int id) {
        var key = $"product:{id}";
        var cached = await _cache.GetStringAsync(key);

        if (cached != null)
            return JsonSerializer.Deserialize<Product>(cached);

        var product = await _repo.GetByIdAsync(id);
        if (product != null) {
            await _cache.SetStringAsync(key, JsonSerializer.Serialize(product),
                new DistributedCacheEntryOptions {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                });
        }
        return product;
    }

    public async Task InvalidateAsync(int id) {
        await _cache.RemoveAsync($"product:{id}"); // invalider après update
    }
}
```

**Cas d'usage :** Cache de requêtes DB coûteuses, sessions utilisateur, rate limiting, pub/sub.

---

## RabbitMQ — Message Broker

RabbitMQ découple les services via des messages asynchrones. Un producteur publie un message, un ou plusieurs consommateurs le traitent.

```
[API] → publish → [RabbitMQ Queue] → consume → [Worker Service]
```

```csharp
// dotnet add package RabbitMQ.Client

// Producteur — envoie un message
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();
channel.QueueDeclare("orders", durable: true, exclusive: false, autoDelete: false);

var body = JsonSerializer.SerializeToUtf8Bytes(new { OrderId = 42, Amount = 99.99 });
channel.BasicPublish(exchange: "", routingKey: "orders", body: body);

// Consommateur — traite les messages
var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, ea) => {
    var order = JsonSerializer.Deserialize<Order>(ea.Body.ToArray());
    ProcessOrder(order);
    channel.BasicAck(ea.DeliveryTag, false); // confirme le traitement
};
channel.BasicConsume("orders", autoAck: false, consumer: consumer);
```

**Pourquoi ?** Scalabilité, résilience, découplage. Si le Worker tombe, les messages restent en queue et sont traités à son redémarrage.

---

## Azure Key Vault

Stockage sécurisé pour les secrets, clés et certificats. Ne jamais stocker des secrets dans `appsettings.json` ou le code.

```csharp
// dotnet add package Azure.Extensions.AspNetCore.Configuration.Secrets
// dotnet add package Azure.Identity

// Program.cs
var keyVaultUri = new Uri($"https://{builder.Configuration["KeyVaultName"]}.vault.azure.net/");
builder.Configuration.AddAzureKeyVault(keyVaultUri, new DefaultAzureCredential());

// Utilisation — exactement comme une config normale
var dbConnection = builder.Configuration["DatabaseConnectionString"]; // vient de Key Vault
```

**Avec Managed Identity :** `DefaultAzureCredential` s'authentifie automatiquement via la managed identity en production — pas besoin de stocker de credentials.

---

## Azure Functions

Serverless — le code s'exécute en réponse à un événement, la plateforme gère l'infra.

```csharp
// HTTP Trigger
[Function("ProcessOrder")]
public async Task<HttpResponseData> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req) {
    var order = await req.ReadFromJsonAsync<Order>();
    await _orderService.ProcessAsync(order!);
    var response = req.CreateResponse(HttpStatusCode.OK);
    await response.WriteAsJsonAsync(new { status = "processed" });
    return response;
}

// Timer Trigger — tous les jours à minuit
[Function("DailyReport")]
public void Run([TimerTrigger("0 0 0 * * *")] TimerInfo timer) {
    _reportService.GenerateDaily();
}

// Queue Trigger — traite les messages d'une queue
[Function("ProcessMessage")]
public void Run([QueueTrigger("my-queue")] string message) {
    _service.Process(message);
}
```

**Plans :** Consumption (pay per use, scale auto), Premium (warm instances, VNet), Dedicated (App Service Plan).

---

## CI/CD — Concepts

**CI (Continuous Integration)** : automatiser build + tests à chaque commit.
**CD (Continuous Delivery/Deployment)** : automatiser le déploiement vers staging/prod.

```yaml
# GitHub Actions — pipeline simple .NET
name: CI/CD
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      
      - name: Build
        run: dotnet build --no-restore
      
      - name: Test
        run: dotnet test --no-build --verbosity normal
      
      - name: Publish
        run: dotnet publish -c Release -o ./publish
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'my-app'
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: './publish'
```

**Concepts clés :**
- **Branch protection** : on ne peut pas merger sans que les checks CI passent
- **Environments** : staging déployé auto, prod déclenché manuellement
- **Secrets** : variables d'environnement chiffrées dans GitHub/Azure DevOps
