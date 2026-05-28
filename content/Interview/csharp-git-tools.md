## Git — Commandes essentielles

```bash
# État et historique
git status                          # fichiers modifiés/staged
git log --oneline --graph           # historique compact avec branches
git diff                            # changements non staged
git diff --staged                   # changements staged

# Travailler
git add <file>                      # stager un fichier
git add .                           # stager tout
git commit -m "feat: add login"     # committer
git push origin feature/login       # pousser

# Branches
git branch                          # lister les branches locales
git branch -a                       # locales + distantes
git checkout -b feature/new-page    # créer + changer de branche
git switch main                     # changer de branche (moderne)
git branch -d feature/done          # supprimer branche locale

# Synchronisation
git fetch origin                    # récupère sans merger
git pull origin main                # fetch + merge
git push -u origin feature/login    # pousser + tracker la branche distante
```

---

## Merge vs Rebase

```bash
# Merge — crée un commit de fusion, conserve l'historique exact
git checkout main
git merge feature/login
# → commit "Merge branch 'feature/login'"

# Rebase — réapplique tes commits sur la branche cible, historique linéaire
git checkout feature/login
git rebase main
# → tes commits sont réappliqués après le dernier commit de main
```

**Règle :** `merge` pour les feature branches vers main (en équipe), `rebase` pour mettre à jour ta branch locale depuis main.

---

## Résoudre un conflit de merge

```bash
# 1. Git signale le conflit
git merge feature/login
# CONFLICT (content): Merge conflict in src/UserService.cs

# 2. Ouvrir le fichier — Git ajoute des marqueurs
<<<<<<< HEAD
public string GetName() => "Alice"; // version de main
=======
public string GetName() => "Bob";   // version de feature/login
>>>>>>> feature/login

# 3. Résoudre manuellement — garder la bonne version, supprimer les marqueurs
public string GetName() => "Alice"; // on garde main

# 4. Marquer comme résolu et committer
git add src/UserService.cs
git commit -m "resolve merge conflict in UserService"
```

---

## Git Flow — Stratégie de branches

```
main          ────────────────────────────────── production stable
    ↑ merge via PR
develop       ───────────────────────────────── intégration continue
    ↑ merge
feature/X     ──────┐ ↗                        fonctionnalité
feature/Y            ──────┐ ↗                 fonctionnalité
hotfix/bug                     ──┐ ↗           fix urgent en prod
```

**Conventional Commits :**
```
feat: add user authentication
fix: resolve null reference in OrderService
docs: update README
refactor: extract payment logic to service
test: add unit tests for UserService
chore: update NuGet packages
```

---

## Docker — Bases

```dockerfile
# Dockerfile pour une app ASP.NET Core
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY *.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "MyApp.dll"]
```

```bash
# Build + run
docker build -t my-app:v1 .
docker run -p 8080:8080 my-app:v1

# Docker Compose
docker-compose up -d     # démarrer tous les services
docker-compose logs -f   # voir les logs
docker-compose down      # arrêter et supprimer
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports: ["8080:8080"]
    environment:
      - ConnectionStrings__Default=Server=db;Database=mydb;
    depends_on: [db]
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      SA_PASSWORD: "MyPass123!"
      ACCEPT_EULA: "Y"
    ports: ["1433:1433"]
```

---

## Angular — Concepts clés pour entretien

### ngOnInit vs constructeur

```typescript
export class UserComponent implements OnInit {
    user: User;

    constructor(private userService: UserService) {
        // ← injection de dépendances uniquement
        // NE PAS appeler des services ici — les inputs ne sont pas encore initialisés
    }

    ngOnInit(): void {
        // ← point d'entrée correct pour la logique
        // Les @Input() sont disponibles ici
        this.userService.getUser().subscribe(u => this.user = u);
    }
}
```

### Services et Observables

```typescript
// Service
@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>('/api/users');
    }
}

// Composant — s'abonner et se désabonner
export class UserListComponent implements OnInit, OnDestroy {
    users: User[] = [];
    private sub: Subscription;

    ngOnInit() {
        this.sub = this.userService.getUsers().subscribe(users => this.users = users);
    }

    ngOnDestroy() {
        this.sub.unsubscribe(); // éviter les fuites mémoire
    }
}
```

### Pipes et template basics

```html
<!-- Template -->
<div *ngFor="let user of users">{{ user.name | uppercase }}</div>
<input [(ngModel)]="searchTerm" />
<button (click)="save()" [disabled]="isLoading">Save</button>
<p *ngIf="user">{{ user.name }}</p>
```

---

## Postman — Tests API

```javascript
// Tests dans Postman (onglet Tests)
pm.test("Status 200", () => pm.response.to.have.status(200));
pm.test("Body has user", () => {
    const body = pm.response.json();
    pm.expect(body).to.have.property("id");
    pm.expect(body.name).to.be.a("string");
});

// Variables d'environnement
pm.environment.set("userId", pm.response.json().id);
// → utilisable dans les prochaines requêtes comme {{userId}}
```

**Collections Postman :** regroupe les requêtes par module, `Run Collection` pour tester toute une API d'un coup.
