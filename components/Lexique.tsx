"use client";

import { useState } from "react";

type Term = {
  word: string;
  definition: string;
  example: string;
  tag?: string;
};

const terms: Term[] = [
  // Docker / Containers
  {
    word: "Image Docker",
    definition: "Une photo figée de ton application avec TOUT ce qu'il lui faut pour tourner : le code, les dépendances, la config système. Elle ne change pas.",
    example: "Comme une clé USB qui contient ton projet prêt à lancer sur n'importe quel ordi.",
    tag: "Docker",
  },
  {
    word: "Container",
    definition: "Une image en train de tourner. L'image est la recette, le container est le plat cuisiné.",
    example: "Tu peux lancer 10 containers depuis la même image — 10 plats identiques, même recette.",
    tag: "Docker",
  },
  {
    word: "Layer / Couche",
    definition: "Une image Docker est faite de couches empilées. Chaque instruction dans un Dockerfile crée une couche. Les couches communes entre images ne sont stockées qu'une seule fois.",
    example: "Image A : Python (200 MB) + ton code (50 MB). Image B : Python (200 MB) + autre code (60 MB). Python est stocké une seule fois en commun.",
    tag: "Docker",
  },
  {
    word: "Registry",
    definition: "Un entrepôt dans le cloud qui stocke et distribue des images Docker. Comme GitHub mais pour les images.",
    example: "Docker Hub = registry public gratuit. ACR = registry privé Azure.",
    tag: "Docker",
  },
  // Concepts clés
  {
    word: "Immuable",
    definition: "Quelque chose qui ne peut JAMAIS changer. Si le contenu change, c'est une nouvelle version avec un nouvel identifiant.",
    example: "Un digest sha256 est immuable — sha256:a1b2c3... identifie toujours exactement la même image, pour toujours.",
    tag: "Concept",
  },
  {
    word: "Mutable",
    definition: "Quelque chose qui PEUT changer et pointer vers autre chose à tout moment.",
    example: "Le tag :latest est mutable — aujourd'hui il pointe sur v1.2, demain quelqu'un peut pousser v1.3 sous :latest et ça change.",
    tag: "Concept",
  },
  {
    word: "Tag",
    definition: "Un nom lisible qu'on donne à une version d'image. Il est mutable — on peut le réassigner.",
    example: ":latest, :prod, :v1.2.3 sont des tags. Plusieurs tags peuvent pointer vers la même image.",
    tag: "Concept",
  },
  {
    word: "Digest",
    definition: "L'empreinte digitale unique d'une image, calculée à partir de son contenu exact. Toujours immuable.",
    example: "sha256:a1b2c3d4... — si même un seul octet change dans l'image, le digest change entièrement.",
    tag: "Concept",
  },
  {
    word: "Artifact",
    definition: "N'importe quoi stocké dans un registry : image Docker, chart Helm, module WASM... Le terme générique.",
    example: "Un chart Helm pour déployer ta base de données = un artifact stocké dans ACR.",
    tag: "Concept",
  },
  // Azure
  {
    word: "ACR",
    definition: "Azure Container Registry — le registre privé de Microsoft pour stocker tes images Docker de façon sécurisée, intégré nativement à Azure.",
    example: "myapp.azurecr.io — c'est l'URL de ton registre privé. Seul ton équipe peut y accéder.",
    tag: "Azure",
  },
  {
    word: "AKS",
    definition: "Azure Kubernetes Service — le service Azure qui gère et orchestre tes containers automatiquement : démarre, redémarre si crash, scale selon la charge.",
    example: "Tu définis 'je veux 3 copies de mon API', AKS s'assure qu'il y en a toujours 3 qui tournent, même si une plante.",
    tag: "Azure",
  },
  {
    word: "Namespace (ACR)",
    definition: "Un préfixe dans le registry pour organiser les images par équipe ou par projet.",
    example: "frontend/web-app et ml/model-server sont dans le même registry mais dans des namespaces différents — chaque équipe accède seulement au sien.",
    tag: "Azure",
  },
  {
    word: "Manifest",
    definition: "Le fichier JSON qui décrit une image : la liste de ses layers, son architecture (amd64/arm64), sa configuration. Identifié par un digest.",
    example: "Quand tu fais docker pull, Docker lit d'abord le manifest pour savoir quels layers télécharger.",
    tag: "Azure",
  },
  // Semver
  {
    word: "Semver",
    definition: "Versioning sémantique — format MAJEUR.MINEUR.PATCH pour numéroter les versions de façon standardisée.",
    example: "v1.0.0 → v1.0.1 (bug fix) → v1.1.0 (nouvelle feature) → v2.0.0 (changement qui casse la compatibilité).",
    tag: "Concept",
  },
  // App Service
  {
    word: "PaaS",
    definition: "Platform as a Service — tu fournis le code ou l'image, la plateforme gère tout le reste (OS, scaling, patches, infra). Opposé de IaaS où tu gères tout.",
    example: "App Service = PaaS. Tu donnes ton image Docker, Azure s'occupe du reste. Une VM = IaaS, tu gères l'OS toi-même.",
    tag: "Concept",
  },
  {
    word: "App Service Plan",
    definition: "L'unité de facturation et de capacité pour App Service. Définit la région, la puissance CPU/RAM et le tier (Free, Basic, Standard, Premium). Plusieurs apps peuvent partager un même plan.",
    example: "Plan Standard S2 = 2 CPU, 3.5 GB RAM, 250 GB stockage. Tu peux y héberger 5 apps — elles partagent les ressources.",
    tag: "Azure",
  },
  {
    word: "Managed Identity",
    definition: "Une identité Azure gérée automatiquement, sans mot de passe à stocker. Permet à un service Azure de s'authentifier auprès d'autres services Azure sans credentials.",
    example: "App Service avec une managed identity peut puller des images ACR ou lire des secrets Key Vault — sans aucun username/password dans la config.",
    tag: "Azure",
  },
  {
    word: "Cold Start",
    definition: "Le délai de démarrage quand une app était en veille et doit redémarrer (après ~20 min d'inactivité), ou quand de nouvelles instances démarrent au scale-out.",
    example: "Ton API de ML met 3 minutes à charger son modèle. Sans Always-on, chaque période d'inactivité = 3 minutes d'attente pour le premier utilisateur.",
    tag: "Concept",
  },
  {
    word: "Always-on",
    definition: "Fonctionnalité App Service qui envoie des pings périodiques pour maintenir l'app active en permanence. Élimine les cold starts. Requiert le tier Basic minimum.",
    example: "Sans Always-on : app en veille après 20 min → cold start de 2 min. Avec Always-on : app toujours chaude → réponse immédiate.",
    tag: "Azure",
  },
  {
    word: "Deployment Slot",
    definition: "Un environnement séparé (staging, dev...) dans le même App Service plan. Chaque slot a sa propre URL et config. Un 'swap' échange deux slots sans downtime.",
    example: "Tu déploies en staging (myapp-staging.azurewebsites.net), tu testes, puis tu 'swappes' staging ↔ production en 1 clic. Zéro downtime.",
    tag: "Azure",
  },
  {
    word: "Slot Setting",
    definition: "Un App Setting ou Connection String marqué pour rester attaché à un slot lors d'un swap — il ne suit pas le code swappé.",
    example: "ENVIRONMENT=production est un slot setting. Après le swap, la prod garde ENVIRONMENT=production même si tout le code de staging est arrivé.",
    tag: "Azure",
  },
  {
    word: "Key Vault Reference",
    definition: "Syntaxe spéciale dans un App Setting pour référencer un secret Azure Key Vault. App Service résout la valeur et l'injecte comme variable d'env — le code ne voit pas la référence.",
    example: "API_KEY = @Microsoft.KeyVault(SecretUri=https://vault.azure.net/secrets/api-key). Ton code lit juste os.environ.get('API_KEY').",
    tag: "Azure",
  },
  {
    word: "Kudu (SCM)",
    definition: "Console de diagnostic avancée pour App Service. Accès via <app>.scm.azurewebsites.net. Permet de voir les variables d'env, les fichiers /home, les logs. NE PEUT PAS accéder au filesystem interne du container.",
    example: "Pour voir les variables injectées : https://monapp.scm.azurewebsites.net/Env. Pour SSH dans le container : utiliser le portail Azure.",
    tag: "Azure",
  },
  {
    word: "WEBSITES_PORT",
    definition: "Variable d'environnement App Service qui indique sur quel port le container écoute. App Service route le trafic vers ce port. Par défaut : 80 ou 8080.",
    example: "Ton Flask écoute sur 5000 → WEBSITES_PORT=5000. Sans ça, App Service essaie le port 80 et ne trouve rien → 404.",
    tag: "Azure",
  },
  {
    word: "AcrPull",
    definition: "Rôle Azure RBAC minimal requis pour qu'un service puisse télécharger (pull) des images depuis Azure Container Registry. Ne permet ni le push ni l'administration.",
    example: "Tu assignes AcrPull à la managed identity de ton App Service → il peut puller les images ACR sans credentials stockés.",
    tag: "Azure",
  },
];

const tagColors: Record<string, string> = {
  Docker: "bg-blue-100 text-blue-700",
  Concept: "bg-violet-100 text-violet-700",
  Azure: "bg-indigo-100 text-indigo-700",
};

const tags = ["Tous", "Azure", "Docker", "Concept"];

export default function Lexique() {
  const [open, setOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState("Tous");
  const [search, setSearch] = useState("");

  const filtered = terms.filter((t) => {
    const matchTag = filter === "Tous" || t.tag === filter;
    const matchSearch = search === "" ||
      t.word.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-amber-100 border-b border-amber-200 flex items-center gap-2">
        <span className="text-lg">📌</span>
        <div>
          <p className="font-bold text-amber-900 text-sm">Lexique rapide</p>
          <p className="text-amber-600 text-xs">Les mots qui reviennent souvent</p>
        </div>
      </div>

      <div className="p-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Chercher un mot..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs px-3 py-2 rounded-lg border border-amber-200 bg-white placeholder-amber-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 mb-2"
        />

        {/* Filter tags */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                filter === t ? "bg-amber-500 text-white" : "bg-white text-amber-700 border border-amber-200 hover:bg-amber-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Terms list */}
        <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-0.5">
          {filtered.map((term, i) => (
            <div key={i} className="bg-white rounded-xl border border-amber-100 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 hover:bg-amber-50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium shrink-0 ${tagColors[term.tag ?? "Concept"]}`}>
                    {term.tag}
                  </span>
                  <span className="font-semibold text-slate-800 text-sm truncate">{term.word}</span>
                </div>
                <span className="text-slate-300 text-xs shrink-0">{open === i ? "▲" : "▼"}</span>
              </button>

              {open === i && (
                <div className="px-3 pb-3 border-t border-amber-50">
                  <p className="text-slate-600 text-xs leading-relaxed mt-2 mb-2">{term.definition}</p>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <p className="text-xs text-amber-700 font-semibold mb-0.5">Exemple</p>
                    <p className="text-xs text-amber-800 leading-relaxed italic">{term.example}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-xs text-amber-400 py-4">Aucun terme trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
}
