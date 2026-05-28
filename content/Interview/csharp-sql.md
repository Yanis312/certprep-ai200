## JOINs

```sql
-- Tables
-- Users(Id, Name, DepartmentId)
-- Departments(Id, Name)
-- Orders(Id, UserId, Amount)

-- INNER JOIN — seulement les lignes qui matchent des deux côtés
SELECT u.Name, d.Name AS Department
FROM Users u
INNER JOIN Departments d ON u.DepartmentId = d.Id;

-- LEFT JOIN — tous les users, même sans département
SELECT u.Name, d.Name AS Department
FROM Users u
LEFT JOIN Departments d ON u.DepartmentId = d.Id;
-- Users sans département → Department = NULL

-- RIGHT JOIN — tous les départements, même sans users
SELECT u.Name, d.Name AS Department
FROM Users u
RIGHT JOIN Departments d ON u.DepartmentId = d.Id;

-- Plusieurs JOINs
SELECT u.Name, d.Name, SUM(o.Amount) AS TotalOrders
FROM Users u
INNER JOIN Departments d ON u.DepartmentId = d.Id
LEFT JOIN Orders o ON o.UserId = u.Id
GROUP BY u.Name, d.Name;
```

---

## GROUP BY / HAVING

```sql
-- Nombre de commandes par utilisateur
SELECT UserId, COUNT(*) AS OrderCount, SUM(Amount) AS TotalAmount
FROM Orders
GROUP BY UserId;

-- HAVING filtre les groupes (≠ WHERE qui filtre les lignes)
SELECT UserId, COUNT(*) AS OrderCount
FROM Orders
GROUP BY UserId
HAVING COUNT(*) > 5; -- seulement les users avec plus de 5 commandes
```

---

## Subqueries

```sql
-- Sous-requête dans WHERE
SELECT Name FROM Users
WHERE Id IN (SELECT UserId FROM Orders WHERE Amount > 1000);

-- Sous-requête corrélée
SELECT u.Name,
    (SELECT COUNT(*) FROM Orders o WHERE o.UserId = u.Id) AS OrderCount
FROM Users u;

-- Avec EXISTS
SELECT Name FROM Users u
WHERE EXISTS (SELECT 1 FROM Orders o WHERE o.UserId = u.Id AND o.Amount > 500);
```

---

## Index — Clustered vs Non-Clustered

| | **Clustered** | **Non-Clustered** |
|--|-------------|-----------------|
| **Nombre** | 1 par table | Plusieurs par table |
| **Stockage** | Données triées physiquement par l'index | Pointeurs vers les données |
| **Par défaut** | Primary Key | Tout autre index |
| **Lecture** | Rapide sur la PK | Rapide sur la colonne indexée |

```sql
-- Clustered (créé automatiquement sur la PK)
CREATE TABLE Users (
    Id INT PRIMARY KEY,  -- clustered par défaut
    Name NVARCHAR(100),
    Email NVARCHAR(200)
);

-- Non-Clustered
CREATE INDEX IX_Users_Email ON Users(Email);

-- Composite index
CREATE INDEX IX_Orders_UserDate ON Orders(UserId, OrderDate);
```

**Quand indexer ?** Colonnes dans WHERE, JOIN, ORDER BY fréquents. Trop d'index ralentit les INSERT/UPDATE.

---

## DELETE vs TRUNCATE vs DROP

| | **DELETE** | **TRUNCATE** | **DROP** |
|--|-----------|-------------|---------|
| **Supprime** | Lignes (avec filtre possible) | Toutes les lignes | La table entière |
| **WHERE** | ✅ | ❌ | ❌ |
| **Transaction** | ✅ (rollback possible) | ✅ (rollback possible) | ❌ |
| **Triggers** | ✅ déclenche | ❌ ne déclenche pas | ❌ |
| **Identity reset** | ❌ | ✅ remet à 1 | — |

```sql
DELETE FROM Orders WHERE Amount < 10;  -- supprime avec filtre
TRUNCATE TABLE TempData;               -- vide la table, reset identity
DROP TABLE TempBackup;                 -- supprime la table définitivement
```

---

## Stored Procedures

Procédure stockée côté serveur — réutilisable, sécurisée (pas d'injection SQL).

```sql
CREATE PROCEDURE GetUserOrders
    @UserId INT,
    @MinAmount DECIMAL(10,2) = 0
AS
BEGIN
    SELECT o.Id, o.Amount, o.OrderDate
    FROM Orders o
    WHERE o.UserId = @UserId
      AND o.Amount >= @MinAmount
    ORDER BY o.OrderDate DESC;
END;

-- Appel
EXEC GetUserOrders @UserId = 42, @MinAmount = 100;
```

---

## Identity Column

Colonne auto-incrémentée — la DB génère la valeur automatiquement.

```sql
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- commence à 1, incrémente de 1
    Name NVARCHAR(100)
);

-- SQL Server : récupérer le dernier Id inséré
INSERT INTO Users (Name) VALUES ('Alice');
SELECT SCOPE_IDENTITY(); -- → l'Id généré

-- EF Core → géré automatiquement
public class User {
    public int Id { get; set; }  // EF devine que c'est une identity
}
```

---

## Exercices SQL rapides

```sql
-- 1. Top 3 utilisateurs par montant total de commandes
SELECT TOP 3 u.Name, SUM(o.Amount) AS Total
FROM Users u
INNER JOIN Orders o ON o.UserId = u.Id
GROUP BY u.Name
ORDER BY Total DESC;

-- 2. Users sans commandes
SELECT u.Name FROM Users u
LEFT JOIN Orders o ON o.UserId = u.Id
WHERE o.Id IS NULL;

-- 3. Moyenne des commandes par département
SELECT d.Name, AVG(o.Amount) AS AvgOrder
FROM Departments d
INNER JOIN Users u ON u.DepartmentId = d.Id
INNER JOIN Orders o ON o.UserId = u.Id
GROUP BY d.Name;
```
