## Exercices algorithmiques

Ces exercices reviennent souvent en entretien. Comprends la logique, ne mémorise pas.

---

### 1. Inverser une chaîne

```csharp
// Solution simple
public static string Reverse(string s) => new string(s.Reverse().ToArray());

// Sans LINQ
public static string Reverse(string s) {
    char[] chars = s.ToCharArray();
    int left = 0, right = chars.Length - 1;
    while (left < right) {
        (chars[left], chars[right]) = (chars[right], chars[left]);
        left++; right--;
    }
    return new string(chars);
}
```

---

### 2. Trouver les doublons dans une liste

```csharp
// Avec HashSet — O(n)
public static IEnumerable<int> FindDuplicates(int[] nums) {
    var seen = new HashSet<int>();
    var duplicates = new HashSet<int>();
    foreach (var n in nums) {
        if (!seen.Add(n)) // Add retourne false si déjà présent
            duplicates.Add(n);
    }
    return duplicates;
}

// Avec LINQ
public static IEnumerable<int> FindDuplicates(int[] nums) =>
    nums.GroupBy(x => x).Where(g => g.Count() > 1).Select(g => g.Key);

// Exemple : [1,2,3,2,4,1] → [1, 2]
```

---

### 3. Vérifier si une string est un palindrome

```csharp
public static bool IsPalindrome(string s) {
    s = s.ToLower();
    int left = 0, right = s.Length - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++; right--;
    }
    return true;
}

// Avec LINQ
public static bool IsPalindrome(string s) => s == new string(s.Reverse().ToArray());
// "racecar" → true, "hello" → false
```

---

### 4. FizzBuzz

```csharp
for (int i = 1; i <= 100; i++) {
    if (i % 15 == 0) Console.WriteLine("FizzBuzz"); // multiple de 3 ET 5
    else if (i % 3 == 0) Console.WriteLine("Fizz");
    else if (i % 5 == 0) Console.WriteLine("Buzz");
    else Console.WriteLine(i);
}
```

---

### 5. Trouver le maximum dans une liste sans Max()

```csharp
public static int FindMax(int[] nums) {
    if (nums.Length == 0) throw new ArgumentException("Liste vide");
    int max = nums[0];
    foreach (var n in nums)
        if (n > max) max = n;
    return max;
}
```

---

### 6. Fibonacci — itératif vs récursif

```csharp
// Récursif — simple mais O(2^n), inutilisable pour n > 40
public static int FibRecursive(int n) =>
    n <= 1 ? n : FibRecursive(n - 1) + FibRecursive(n - 2);

// Itératif — O(n), toujours utiliser ça
public static int Fib(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}
```

---

### 7. Compter les occurrences de chaque caractère

```csharp
public static Dictionary<char, int> CharCount(string s) {
    var result = new Dictionary<char, int>();
    foreach (char c in s)
        result[c] = result.GetValueOrDefault(c) + 1;
    return result;
}

// Avec LINQ
public static Dictionary<char, int> CharCount(string s) =>
    s.GroupBy(c => c).ToDictionary(g => g.Key, g => g.Count());

// "hello" → {'h':1, 'e':1, 'l':2, 'o':1}
```

---

### 8. Scénarios SQL en entretien

```sql
-- Exercice 1 : trouver les doublons d'email
SELECT Email, COUNT(*) AS Count
FROM Users
GROUP BY Email
HAVING COUNT(*) > 1;

-- Exercice 2 : 2ème salaire le plus élevé
SELECT MAX(Salary) AS SecondHighest
FROM Employees
WHERE Salary < (SELECT MAX(Salary) FROM Employees);

-- Exercice 3 : utilisateurs qui n'ont pas commandé le mois dernier
SELECT u.Id, u.Name
FROM Users u
WHERE u.Id NOT IN (
    SELECT DISTINCT UserId FROM Orders
    WHERE OrderDate >= DATEADD(MONTH, -1, GETDATE())
);

-- Exercice 4 : moyenne mobile sur 7 jours
SELECT OrderDate,
       AVG(Amount) OVER (
           ORDER BY OrderDate
           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS MovingAvg7Days
FROM Orders;
```

---

## Questions comportementales

**"Parle-moi d'un bug difficile que tu as résolu"**
→ Structure : contexte → symptôme → investigation → solution → ce que j'ai appris

**"Comment tu t'organises sur un projet ?"**
→ Trello/Jira pour les tâches, branches Git par feature, PR avec review, daily standup

**"Qu'est-ce que tu fais quand tu es bloqué ?"**
→ 30 min solo (docs, Stack Overflow, débogage), puis collègue, puis découper le problème en plus petit

**"Pourquoi tu veux changer de poste ?"**
→ Chercher à progresser techniquement, nouvelles technologies, équipe plus grande, projet plus challengeant

**"Où tu te vois dans 3 ans ?"**
→ Monter en compétences sur [technologie], prendre plus de responsabilités techniques, éventuellement lead tech

---

## Concepts à connaître par cœur

| Concept | Réponse en une phrase |
|---------|----------------------|
| **Qu'est-ce que la dette technique ?** | Code qui fonctionne mais est difficile à maintenir/étendre à cause de mauvais choix passés |
| **YAGNI** | "You Ain't Gonna Need It" — n'implémente pas ce dont tu n'as pas besoin maintenant |
| **DRY** | "Don't Repeat Yourself" — évite la duplication de logique |
| **KISS** | "Keep It Simple, Stupid" — la solution la plus simple qui fonctionne |
| **Code review** | Vérifier la logique, les edge cases, la lisibilité, les tests, pas juste le style |
| **Différence stack overflow** | Récursion infinie ou trop profonde — la stack d'appels déborde |
