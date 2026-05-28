import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ── MODULE ─────────────────────────────────────────────────────────────────
  let mod = await prisma.module.findUnique({ where: { slug: "interview-csharp" } });
  if (!mod) {
    mod = await prisma.module.create({
      data: {
        slug: "interview-csharp",
        title: "Révision Entretien C#",
        description: "Fondamentaux, OOP, LINQ, EF Core, SQL, ASP.NET, Infrastructure, Git, Tests",
        category: "Interview",
        order: 1,
      },
    });
  }
  console.log("✅ Module Interview créé");

  // ── UNITÉS ────────────────────────────────────────────────────────────────
  const units = [
    { slug: "csharp-fondamentaux", title: "Fondamentaux C#", order: 1, contentFile: "csharp-fondamentaux" },
    { slug: "csharp-oop", title: "OOP & Patterns", order: 2, contentFile: "csharp-oop" },
    { slug: "csharp-linq", title: "LINQ & Delegates", order: 3, contentFile: "csharp-linq" },
    { slug: "csharp-ef-sql", title: "Entity Framework Core", order: 4, contentFile: "csharp-ef-sql" },
    { slug: "csharp-sql", title: "SQL & Base de données", order: 5, contentFile: "csharp-sql" },
    { slug: "csharp-aspnet", title: "ASP.NET Core", order: 6, contentFile: "csharp-aspnet" },
    { slug: "csharp-infrastructure", title: "Infrastructure & Cloud", order: 7, contentFile: "csharp-infrastructure" },
    { slug: "csharp-git-tools", title: "Git, Docker & Outils", order: 8, contentFile: "csharp-git-tools" },
    { slug: "csharp-tests", title: "Tests Unitaires", order: 9, contentFile: "csharp-tests" },
    { slug: "csharp-exercices", title: "Exercices & Comportemental", order: 10, contentFile: "csharp-exercices" },
  ];

  const createdUnits: Record<string, number> = {};

  for (const u of units) {
    let unit = await prisma.unit.findUnique({ where: { slug: u.slug } });
    if (!unit) {
      unit = await prisma.unit.create({
        data: { slug: u.slug, title: u.title, order: u.order, moduleId: mod.id },
      });
    }
    createdUnits[u.slug] = unit.id;
    console.log(`  ✅ Unité: ${u.title}`);
  }

  // ── QUIZ FINAL (unité dédiée) ─────────────────────────────────────────────
  let quizUnit = await prisma.unit.findUnique({ where: { slug: "csharp-quiz-final" } });
  if (!quizUnit) {
    quizUnit = await prisma.unit.create({
      data: {
        slug: "csharp-quiz-final",
        title: "Quiz Final — Révision Complète",
        order: 11,
        moduleId: mod.id,
      },
    });
  } else {
    await prisma.question.deleteMany({ where: { unitId: quizUnit.id } });
  }

  const quizId = quizUnit.id;
  console.log("  ✅ Unité Quiz Final créée");

  // ── QUESTIONS DU QUIZ FINAL ────────────────────────────────────────────────
  await prisma.question.createMany({
    data: [
      // ── FONDAMENTAUX ──
      {
        unitId: quizId,
        question: "Quelle est la différence principale entre .NET Framework et .NET 6+ ?",
        options: JSON.stringify([
          ".NET Framework est open source, .NET 6+ est propriétaire",
          ".NET Framework tourne uniquement sur Windows, .NET 6+ est cross-platform",
          ".NET 6+ ne supporte pas les applications Windows Forms",
          ".NET Framework utilise C#, .NET 6+ utilise F# uniquement",
        ]),
        correctAnswer: 1,
        explanation: ".NET Framework est limité à Windows (legacy). .NET 6+ (ex .NET Core) est cross-platform (Windows, Linux, Mac), open source, et est le standard pour tout nouveau projet.",
      },
      {
        unitId: quizId,
        question: "Pourquoi `httpClient.GetStringAsync(url).Result` est-il dangereux ?",
        options: JSON.stringify([
          "Il ne compile pas en .NET 6+",
          "Il bloque le thread appelant et peut causer un deadlock en contexte ASP.NET",
          "Il ne supporte pas HTTPS",
          "Il retourne null si la requête prend plus de 30 secondes",
        ]),
        correctAnswer: 1,
        explanation: ".Result bloque le thread appelant de façon synchrone. En contexte ASP.NET, cela peut causer un deadlock car le contexte de synchronisation attendu par await n'est jamais libéré. Toujours utiliser await.",
      },
      {
        unitId: quizId,
        question: "Que se passe-t-il ici ? `var p1 = new Person { Name = \"Alice\" }; var p2 = p1; p2.Name = \"Bob\";`",
        options: JSON.stringify([
          "p1.Name reste \"Alice\", p2.Name devient \"Bob\"",
          "p1.Name et p2.Name deviennent tous les deux \"Bob\"",
          "Une exception est levée car p1 est en lecture seule",
          "p2 devient null après l'assignation",
        ]),
        correctAnswer: 1,
        explanation: "Person est une classe (reference type). p2 = p1 copie la référence, pas l'objet. Les deux variables pointent vers le même objet en mémoire. Modifier via p2 affecte aussi p1.",
      },
      {
        unitId: quizId,
        question: "Quand faut-il utiliser StringBuilder plutôt que string ?",
        options: JSON.stringify([
          "Toujours — StringBuilder est toujours plus rapide que string",
          "Quand la string dépasse 100 caractères",
          "Quand on concatène en boucle ou avec de nombreuses opérations",
          "Seulement pour les concaténations avec +, pas avec string.Format",
        ]),
        correctAnswer: 2,
        explanation: "string est immuable — chaque + crée un nouvel objet en mémoire. En boucle, cela génère des milliers d'allocations. StringBuilder modifie le même buffer interne, beaucoup plus efficace pour les concaténations répétées.",
      },
      // ── OOP & PATTERNS ──
      {
        unitId: quizId,
        question: "Quel principe SOLID est violé si une classe UserService envoie aussi des emails ?",
        options: JSON.stringify([
          "Open/Closed Principle",
          "Single Responsibility Principle",
          "Liskov Substitution Principle",
          "Dependency Inversion Principle",
        ]),
        correctAnswer: 1,
        explanation: "SRP — Single Responsibility Principle. UserService a deux raisons de changer : la logique utilisateur ET la logique email. Il faut créer un EmailService séparé.",
      },
      {
        unitId: quizId,
        question: "Qu'apporte le Repository Pattern ?",
        options: JSON.stringify([
          "Il améliore automatiquement les performances des requêtes SQL",
          "Il abstrait l'accès aux données derrière une interface, facilitant les tests et le changement de DB",
          "Il remplace Entity Framework Core",
          "Il génère automatiquement les migrations de base de données",
        ]),
        correctAnswer: 1,
        explanation: "Le Repository Pattern isole la logique d'accès aux données. Le code métier dépend d'une interface (IUserRepository), pas d'une implémentation concrète. On peut mocker facilement pour les tests et changer de DB sans toucher au code métier.",
      },
      {
        unitId: quizId,
        question: "Quelle est la différence entre polymorphisme et abstraction ?",
        options: JSON.stringify([
          "Le polymorphisme concerne les interfaces, l'abstraction les classes abstraites",
          "Ce sont deux termes pour la même chose",
          "Le polymorphisme = un objet prend plusieurs formes selon son type réel ; l'abstraction = cacher la complexité derrière une interface simple",
          "Le polymorphisme est uniquement runtime, l'abstraction est uniquement compile-time",
        ]),
        correctAnswer: 2,
        explanation: "Polymorphisme : animal.Speak() appelle Dog.Speak() ou Cat.Speak() selon le type réel à runtime. Abstraction : IRepository cache si c'est SQL, MongoDB ou un mock — l'appelant ne le sait pas et n'a pas besoin de le savoir.",
      },
      {
        unitId: quizId,
        question: "Comment le Circuit Breaker Pattern protège-t-il un système ?",
        options: JSON.stringify([
          "Il chiffre les communications entre services",
          "Il bloque les appels vers un service défaillant pour éviter la propagation de panne",
          "Il redirige automatiquement vers un service de backup",
          "Il log toutes les erreurs dans Azure Monitor",
        ]),
        correctAnswer: 1,
        explanation: "Le Circuit Breaker a 3 états : Closed (normal), Open (défaillant — appels bloqués immédiatement), Half-Open (test de rétablissement). En état Open, les appels échouent vite sans appeler le service distant, évitant la surcharge en cascade.",
      },
      // ── LINQ ──
      {
        unitId: quizId,
        question: "Quelle est la différence entre IEnumerable et IQueryable ?",
        options: JSON.stringify([
          "IEnumerable est pour les listes, IQueryable est pour les tableaux",
          "IEnumerable exécute le filtre en mémoire, IQueryable traduit le filtre en SQL côté serveur",
          "IQueryable est une version améliorée d'IEnumerable disponible depuis .NET 6",
          "Il n'y a pas de différence, ils sont interchangeables",
        ]),
        correctAnswer: 1,
        explanation: "IEnumerable charge toutes les données puis filtre en mémoire. IQueryable traduit l'expression en SQL et laisse la DB filtrer. Utiliser IEnumerable sur un DbSet charge TOUTE la table avant de filtrer — catastrophique en production.",
      },
      {
        unitId: quizId,
        question: "Qu'est-ce que la deferred execution en LINQ ?",
        options: JSON.stringify([
          "LINQ met les résultats en cache pour les requêtes futures",
          "La requête ne s'exécute pas à l'écriture, mais à l'itération (foreach, ToList, Count...)",
          "LINQ attend que le thread soit disponible avant d'exécuter",
          "Les résultats sont calculés de façon asynchrone en arrière-plan",
        ]),
        correctAnswer: 1,
        explanation: "La deferred execution signifie que `var q = list.Where(x => x > 3)` ne calcule rien. L'exécution a lieu à la première itération du résultat (foreach) ou quand on appelle ToList(), Count(), First(), etc.",
      },
      {
        unitId: quizId,
        question: "Que fait `SelectMany` ?",
        options: JSON.stringify([
          "Sélectionne plusieurs propriétés d'un objet à la fois",
          "Aplati une collection de collections en une seule liste",
          "Sélectionne les éléments qui satisfont plusieurs conditions",
          "Crée plusieurs projections à partir d'une même source",
        ]),
        correctAnswer: 1,
        explanation: "SelectMany aplati (flattens) une collection de collections. Ex: users.SelectMany(u => u.Orders) retourne toutes les commandes de tous les utilisateurs en une seule liste plate, plutôt qu'une liste de listes.",
      },
      // ── EF CORE ──
      {
        unitId: quizId,
        question: "Qu'est-ce que le problème N+1 avec EF Core ?",
        options: JSON.stringify([
          "Une erreur quand on a plus de 100 entités dans le DbContext",
          "Une requête pour la liste + N requêtes supplémentaires pour charger les relations de chaque élément",
          "Un conflit quand plusieurs threads accèdent au même DbContext",
          "Une limitation d'EF Core qui ne peut pas joindre plus de N tables",
        ]),
        correctAnswer: 1,
        explanation: "Le N+1 survient avec Lazy Loading en boucle : 1 requête pour 100 users, puis 100 requêtes pour charger les orders de chaque user = 101 requêtes. Solution : Eager Loading avec Include() — une seule requête SQL avec JOIN.",
      },
      {
        unitId: quizId,
        question: "Quand utiliser AsNoTracking() ?",
        options: JSON.stringify([
          "Toujours — AsNoTracking est plus sûr que le tracking par défaut",
          "Pour les requêtes en lecture seule où on ne va pas modifier les entités",
          "Seulement dans les tests unitaires",
          "Pour les migrations de base de données",
        ]),
        correctAnswer: 1,
        explanation: "AsNoTracking désactive le change tracking d'EF Core. Si on ne va pas modifier les entités (affichage, export, rapport), c'est inutile de les tracker — AsNoTracking améliore les performances et réduit la consommation mémoire.",
      },
      // ── SQL ──
      {
        unitId: quizId,
        question: "Quelle est la différence entre INNER JOIN et LEFT JOIN ?",
        options: JSON.stringify([
          "INNER JOIN est plus rapide que LEFT JOIN",
          "INNER JOIN retourne seulement les lignes qui matchent des deux côtés ; LEFT JOIN retourne toutes les lignes de gauche, avec NULL si pas de match à droite",
          "LEFT JOIN ne peut joindre que deux tables, INNER JOIN peut en joindre plusieurs",
          "INNER JOIN filtre les doublons, LEFT JOIN les conserve",
        ]),
        correctAnswer: 1,
        explanation: "INNER JOIN : intersection — seulement les enregistrements qui ont une correspondance des deux côtés. LEFT JOIN : toutes les lignes de la table de gauche, même si pas de correspondance à droite (NULL dans les colonnes droites).",
      },
      {
        unitId: quizId,
        question: "Quelle est la différence entre TRUNCATE et DELETE ?",
        options: JSON.stringify([
          "TRUNCATE peut utiliser une clause WHERE, DELETE ne peut pas",
          "DELETE log chaque ligne supprimée et peut être rollbacké ; TRUNCATE est plus rapide, remet l'identity à 1, mais ne déclenche pas les triggers",
          "TRUNCATE supprime la table, DELETE supprime seulement les données",
          "Il n'y a aucune différence de performance entre les deux",
        ]),
        correctAnswer: 1,
        explanation: "DELETE supprime ligne par ligne (avec log), déclenche les triggers, supporte WHERE. TRUNCATE supprime tout le contenu d'un coup (plus rapide), remet les colonnes IDENTITY à 1, ne déclenche PAS les triggers, et ne supporte pas WHERE.",
      },
      {
        unitId: quizId,
        question: "Qu'est-ce qu'un index Clustered en SQL ?",
        options: JSON.stringify([
          "Un index partagé entre plusieurs tables",
          "Un index qui regroupe les données de plusieurs colonnes",
          "L'index qui définit l'ordre physique des données dans la table — une seule par table, généralement la PK",
          "Un index utilisé uniquement pour les JOIN entre tables",
        ]),
        correctAnswer: 2,
        explanation: "L'index Clustered trie et stocke physiquement les lignes de la table dans l'ordre de l'index. Il ne peut y en avoir qu'un par table (les données ne peuvent être triées que d'une façon). Par défaut, c'est la PRIMARY KEY.",
      },
      // ── ASP.NET ──
      {
        unitId: quizId,
        question: "Dans quelle lifetime (Transient/Scoped/Singleton) enregistre-t-on un DbContext ?",
        options: JSON.stringify([
          "Transient — une nouvelle instance par injection",
          "Scoped — une instance par requête HTTP",
          "Singleton — une instance partagée pour toute l'application",
          "N'importe lequel, EF Core gère le cycle de vie automatiquement",
        ]),
        correctAnswer: 1,
        explanation: "DbContext doit être Scoped — une instance par requête HTTP. Transient crée trop d'instances (problèmes de change tracking). Singleton partage le même DbContext entre toutes les requêtes simultanées (pas thread-safe, problèmes de concurrence).",
      },
      {
        unitId: quizId,
        question: "Quelle est la différence entre PUT et PATCH ?",
        options: JSON.stringify([
          "PUT est sécurisé (lecture seule), PATCH modifie les données",
          "PUT remplace l'entité entière, PATCH met à jour partiellement",
          "PATCH est déprécié depuis HTTP/2, il faut utiliser PUT",
          "PUT retourne 201, PATCH retourne 200 toujours",
        ]),
        correctAnswer: 1,
        explanation: "PUT remplace l'entité entière — le body doit contenir TOUS les champs. PATCH met à jour partiellement — le body contient seulement les champs à modifier. Les champs absents d'un PATCH restent inchangés.",
      },
      {
        unitId: quizId,
        question: "Que fait `app.UseAuthentication()` vs `app.UseAuthorization()` ?",
        options: JSON.stringify([
          "UseAuthentication est pour JWT, UseAuthorization est pour les cookies — ils sont interchangeables",
          "UseAuthentication identifie QUI tu es (lit le token) ; UseAuthorization vérifie ce que tu as le DROIT de faire",
          "UseAuthorization doit être appelé avant UseAuthentication",
          "UseAuthentication bloque les requêtes non-authentifiées automatiquement",
        ]),
        correctAnswer: 1,
        explanation: "UseAuthentication lit et valide le token (JWT, cookie) et remplit User.Claims. UseAuthorization vérifie si l'utilisateur identifié a les droits nécessaires ([Authorize], [Authorize(Roles=\"Admin\")]). L'ordre importe : Authentication AVANT Authorization.",
      },
      // ── INFRASTRUCTURE ──
      {
        unitId: quizId,
        question: "Pourquoi utilise-t-on Redis comme cache ?",
        options: JSON.stringify([
          "Redis remplace avantageusement SQL Server pour les données relationnelles",
          "Redis stocke les données en mémoire — lectures/écritures en microsecondes, idéal pour cacher les résultats de requêtes DB coûteuses",
          "Redis est obligatoire pour les applications ASP.NET Core en production",
          "Redis synchronise automatiquement les données entre plusieurs serveurs SQL",
        ]),
        correctAnswer: 1,
        explanation: "Redis est un store in-memory — pas de disque, pas de réseau vers une DB. Les opérations prennent des microsecondes vs millisecondes pour une DB SQL. On cache les données fréquemment lues et rarement modifiées (produits, config, sessions utilisateur).",
      },
      {
        unitId: quizId,
        question: "Quel est le rôle de RabbitMQ dans une architecture microservices ?",
        options: JSON.stringify([
          "RabbitMQ est une base de données dédiée aux microservices",
          "RabbitMQ est un API Gateway qui route les requêtes entre services",
          "RabbitMQ découple les services via des messages asynchrones — un service publie, un ou plusieurs consomment sans couplage direct",
          "RabbitMQ chiffre les communications entre microservices",
        ]),
        correctAnswer: 2,
        explanation: "RabbitMQ est un message broker. Le producteur publie un message dans une queue sans connaître le consommateur. Le consommateur traite les messages à son rythme. Si le consommateur tombe, les messages restent en queue et sont traités à son redémarrage.",
      },
      // ── GIT ──
      {
        unitId: quizId,
        question: "Quelle est la différence entre `git fetch` et `git pull` ?",
        options: JSON.stringify([
          "git fetch est plus rapide que git pull",
          "git fetch récupère les changements distants sans les merger ; git pull = fetch + merge automatique",
          "git pull ne fonctionne qu'avec GitHub, git fetch avec tous les remotes",
          "git fetch met à jour le code local, git pull met à jour uniquement les métadonnées",
        ]),
        correctAnswer: 1,
        explanation: "git fetch télécharge les changements distants mais ne modifie pas ton working directory — tu peux voir ce qui a changé avant de décider de merger. git pull = git fetch + git merge automatiquement (ou rebase si configuré).",
      },
      // ── TESTS ──
      {
        unitId: quizId,
        question: "Dans le pattern AAA des tests unitaires, que représente chaque A ?",
        options: JSON.stringify([
          "Authentication, Authorization, Action",
          "Arrange (prépare), Act (exécute), Assert (vérifie)",
          "Assert, Assign, Action",
          "Async, Await, Assert",
        ]),
        correctAnswer: 1,
        explanation: "Arrange : prépare les données, instancie les objets, configure les mocks. Act : exécute le code à tester (une seule action). Assert : vérifie que le résultat correspond à l'attendu. Cette structure rend les tests lisibles et maintenables.",
      },
      {
        unitId: quizId,
        question: "Quelle est la différence entre un test unitaire et un test d'intégration ?",
        options: JSON.stringify([
          "Un test unitaire est écrit par les développeurs, un test d'intégration par les QA",
          "Un test unitaire teste une unité isolée avec des mocks ; un test d'intégration teste plusieurs composants ensemble (vrai DB, vrai HTTP)",
          "Les tests d'intégration sont plus rapides car ils partagent les ressources",
          "Un test unitaire teste le frontend, un test d'intégration teste le backend",
        ]),
        correctAnswer: 1,
        explanation: "Test unitaire : teste une seule classe/méthode, toutes les dépendances sont mockées, rapide. Test d'intégration : teste plusieurs composants ensemble (ex: controller → service → vraie DB), plus lent mais révèle les problèmes de vraie intégration.",
      },
      {
        unitId: quizId,
        question: "Dans quel cas utilise-t-on `[Theory]` avec `[InlineData]` en xUnit ?",
        options: JSON.stringify([
          "Pour tester des méthodes asynchrones uniquement",
          "Pour documenter le comportement attendu sans exécuter le test",
          "Pour exécuter le même test avec plusieurs jeux de données différents",
          "Pour marquer un test comme ignoré temporairement",
        ]),
        correctAnswer: 2,
        explanation: "[Theory] + [InlineData] permettent de tester plusieurs cas avec la même logique de test. Au lieu de dupliquer le test 5 fois avec des données différentes, on écrit un seul test paramétré. Chaque [InlineData] correspond à une exécution distincte.",
      },
    ],
  });

  console.log("\n🎉 Quiz Final — 25 questions créées");
  console.log("\n📊 Résumé:");
  console.log(`  Module: ${mod.title}`);
  console.log(`  Unités: ${units.length + 1} (${units.length} cours + 1 quiz final)`);
  console.log(`  Questions quiz: 25`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
