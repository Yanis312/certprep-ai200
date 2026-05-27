# Setup script — lance apres git clone
# PowerShell : .\setup.ps1

Write-Host "======================================"
Write-Host "  CertPrep — Installation"
Write-Host "======================================"

# 1. Installer les dependances
Write-Host "`n[1/4] Installation des dependances npm..."
npm install

# 2. Generer le client Prisma
Write-Host "`n[2/4] Generation du client Prisma..."
npx prisma generate

# 3. Creer la base de donnees et les tables
Write-Host "`n[3/4] Creation de la base de donnees..."
npx prisma db push

# 4. Charger toutes les donnees (modules, unites, questions)
Write-Host "`n[4/4] Chargement des donnees..."
npx tsx prisma/seed.ts
npx tsx prisma/add-lab.ts
npx tsx prisma/add-appservice-module.ts
npx tsx prisma/add-appservice-units.ts
npx tsx prisma/update-lab-quiz.ts
npx tsx prisma/add-microsoft-assessment.ts

Write-Host "`n======================================"
Write-Host "  Setup termine !"
Write-Host "  Lance : npm run dev"
Write-Host "  Ouvre : http://localhost:3000"
Write-Host "======================================"
