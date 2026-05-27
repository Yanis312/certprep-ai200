export default function VueGlobale() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-800 via-slate-700 to-indigo-900 text-white p-8 mb-10 shadow-lg">
        <div className="relative z-10">
          <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-2">AI-200 — Vue globale</p>
          <h1 className="text-3xl font-bold mb-3">Pourquoi tout est lié</h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Avant de plonger dans chaque service Azure, comprends l'histoire complète.
            Chaque Learning Path apporte une pièce d'un même puzzle : déployer une application IA
            en production de façon fiable, sécurisée et scalable.
          </p>
        </div>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
      </div>

      {/* L'analogie du restaurant */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">L'infrastructure — C'est quoi concrètement ?</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="text-slate-700 text-sm leading-relaxed mb-4">
            Imagine que tu veux ouvrir un restaurant. <strong>Ton code = la recette et les plats que tu sers.</strong>
            L'infrastructure, c'est tout ce qui fait tourner ton restaurant sans être les plats eux-mêmes.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { infra: "Le bâtiment", azure: "Les serveurs physiques (datacenters Azure)" },
              { infra: "L'électricité", azure: "Le réseau et l'alimentation du datacenter" },
              { infra: "La cuisine équipée", azure: "L'OS, Docker, les runtimes" },
              { infra: "Le personnel de salle", azure: "Le load balancer qui dirige le trafic" },
              { infra: "Le système de sécurité", azure: "Firewalls, certificats SSL, identités" },
              { infra: "Le gestionnaire de stock", azure: "Les bases de données et le cache" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-amber-100 p-3">
                <p className="text-xs font-bold text-amber-700 mb-0.5">🍽️ {item.infra}</p>
                <p className="text-xs text-slate-500">{item.azure}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Les 3 niveaux */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Les 3 niveaux d'abstraction</h2>
        <div className="space-y-3">
          {[
            {
              level: "IaaS — Infrastructure as a Service",
              emoji: "🖥️",
              manage: "Tu gères : app + OS + runtime + Docker",
              azure: "Exemple : VM Azure",
              color: "border-red-200 bg-red-50",
              badge: "bg-red-100 text-red-700",
            },
            {
              level: "PaaS — Platform as a Service",
              emoji: "⚙️",
              manage: "Tu gères : ton app seulement",
              azure: "Exemples : App Service, Container Apps, AKS",
              color: "border-indigo-200 bg-indigo-50",
              badge: "bg-indigo-100 text-indigo-700",
            },
            {
              level: "SaaS — Software as a Service",
              emoji: "☁️",
              manage: "Tu gères : rien — tu utilises juste",
              azure: "Exemples : Office 365, GitHub, Gmail",
              color: "border-emerald-200 bg-emerald-50",
              badge: "bg-emerald-100 text-emerald-700",
            },
          ].map((item, i) => (
            <div key={i} className={`rounded-2xl border p-5 ${item.color}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.emoji}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${item.badge}`}>{item.level}</span>
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-0.5">{item.manage}</p>
              <p className="text-xs text-slate-500">{item.azure}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">
          La certification AI-200 se concentre sur le <strong>PaaS</strong> — tu fournis le code et l'image, Azure gère l'infrastructure.
        </p>
      </section>

      {/* L'histoire complète */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2">L'histoire d'une application IA en production</h2>
        <p className="text-sm text-slate-500 mb-6">Imagine que tu construis une API d'inférence IA — elle reçoit des documents, les analyse et retourne des résultats. Voici pourquoi tu as besoin de chaque service.</p>

        <div className="space-y-4">

          {/* Étape 1 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-indigo-600 px-5 py-3 flex items-center gap-3">
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-lg">LP1</span>
              <p className="text-white font-bold text-sm">Tu packages et déploies ton app</p>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600 mb-4">Ton code Python + modèle ML → image Docker → tu as besoin de la stocker et la faire tourner.</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs font-bold text-indigo-700 mb-1">📦 ACR — Azure Container Registry</p>
                  <p className="text-xs text-slate-600">Entrepôt privé de tes images Docker. Comme GitHub mais pour les images.</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs font-bold text-indigo-700 mb-1">🌐 App Service</p>
                  <p className="text-xs text-slate-600">Déploie une API simple sans gérer de serveurs. Scaling, logs, config — tout inclus.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Étape 2 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-violet-600 px-5 py-3 flex items-center gap-3">
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-lg">LP2</span>
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-lg">LP3</span>
              <p className="text-white font-bold text-sm">Ton app grossit — plusieurs services</p>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600 mb-4">Une seule API devient plusieurs microservices qui se parlent. Tu as besoin d'orchestration.</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                  <p className="text-xs font-bold text-violet-700 mb-1">🐳 Container Apps (LP2)</p>
                  <p className="text-xs text-slate-600">Plusieurs containers qui s'appellent entre eux. Scaling par 0 — tu ne paies que ce que tu utilises.</p>
                </div>
                <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                  <p className="text-xs font-bold text-violet-700 mb-1">☸️ Kubernetes / AKS (LP3)</p>
                  <p className="text-xs text-slate-600">Contrôle total. Des centaines de containers, des déploiements complexes, une infra custom.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Étape 3 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-emerald-600 px-5 py-3 flex items-center gap-3">
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-lg">LP4</span>
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-lg">LP5</span>
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-lg">LP6</span>
              <p className="text-white font-bold text-sm">Ton app a besoin de données</p>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600 mb-4">Une API IA sans données ne sert à rien. Selon le type de données, tu choisis le bon service.</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { lp: "LP4", name: "Cosmos DB", emoji: "🌌", desc: "Données NoSQL, JSON, recherche vectorielle pour l'IA. Ultra-scalable." },
                  { lp: "LP5", name: "PostgreSQL", emoji: "🐘", desc: "Données relationnelles classiques. Tables, SQL, relations entre entités." },
                  { lp: "LP6", name: "Redis", emoji: "⚡", desc: "Cache ultra-rapide. Résultats déjà calculés, sessions, données temporaires." },
                ].map((item, i) => (
                  <div key={i} className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-700 mb-1">{item.emoji} {item.name} ({item.lp})</p>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-xs text-slate-500 italic">
                  <strong>Exemple concret :</strong> L'API reçoit un document → vérifie dans <strong>Redis</strong> (cache, 1ms) → si absent, appelle le modèle ML → stocke dans <strong>Cosmos DB</strong> → met en cache dans <strong>Redis</strong> → retourne le résultat.
                </p>
              </div>
            </div>
          </div>

          {/* Étape 4 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-amber-600 px-5 py-3 flex items-center gap-3">
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-lg">LP7</span>
              <p className="text-white font-bold text-sm">Tes services doivent se parler</p>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600 mb-3">Ton app n'est pas seule. Elle reçoit des documents, envoie des résultats, déclenche des notifications.</p>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-xs text-slate-600 italic">
                  <strong>Service Bus / Event Grid / API Management</strong> — les tuyaux qui connectent tous tes services de façon fiable et asynchrone.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Utilisateur uploade un document → <strong>Event Grid</strong> notifie ton API → ton API traite → <strong>Service Bus</strong> envoie le résultat → service de notification envoie un email.
                </p>
              </div>
            </div>
          </div>

          {/* Étapes 5 et 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-rose-600 px-5 py-3 flex items-center gap-3">
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-lg">LP8</span>
                <p className="text-white font-bold text-sm">Sécuriser les secrets</p>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-600 mb-3">Clés API, passwords DB, tokens — jamais dans le code.</p>
                <div className="bg-rose-50 rounded-xl p-3 border border-rose-100">
                  <p className="text-xs font-bold text-rose-700 mb-1">🔐 Key Vault + Managed Identity</p>
                  <p className="text-xs text-slate-500">Key Vault stocke les secrets. Managed Identity permet aux services de les lire sans credentials stockés nulle part.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-slate-600 px-5 py-3 flex items-center gap-3">
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-lg">LP9</span>
                <p className="text-white font-bold text-sm">Surveiller la production</p>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-600 mb-3">En production, des choses cassent. Tu dois savoir quand et pourquoi.</p>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs font-bold text-slate-700 mb-1">📊 Azure Monitor + Log Analytics</p>
                  <p className="text-xs text-slate-500">Centralise tous les logs, crée des alertes, visualise les performances de toute l'infra.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Infra classique vs Azure */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Infra classique vs Infrastructure Azure — Ce qui change</h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-slate-100">
            <div className="p-5">
              <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3">❌ Avant le cloud</p>
              <ul className="space-y-2">
                {[
                  "Tu achètes des serveurs physiques",
                  "Tu installes l'OS, Docker, la DB toi-même",
                  "Un serveur tombe = downtime",
                  "Tu scales manuellement (acheter + configurer)",
                  "Secrets dans des fichiers .env",
                  "Logs dans des fichiers sur chaque serveur",
                  "Mettre en prod : des semaines",
                ].map((item, i) => (
                  <li key={i} className="text-xs text-slate-500 flex gap-2"><span className="shrink-0">•</span>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-5">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">✅ Avec Azure (AI-200)</p>
              <ul className="space-y-2">
                {[
                  "Tu paies uniquement ce que tu consommes",
                  "Azure gère tout ça comme service managé",
                  "Azure gère la redondance automatiquement",
                  "App Service / AKS scale automatiquement",
                  "Key Vault + Managed Identity — zéro fichier",
                  "Azure Monitor centralise tout",
                  "Mettre en prod : quelques heures",
                ].map((item, i) => (
                  <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="shrink-0">•</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Le fil rouge */}
      <section>
        <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white text-center">
          <p className="text-indigo-200 text-xs uppercase tracking-widest mb-2">Le fil rouge de la certification</p>
          <p className="text-xl font-bold mb-3">
            Comment déployer une application IA en production<br />
            de façon fiable, sécurisée et scalable —<br />
            sans gérer l'infrastructure toi-même ?
          </p>
          <p className="text-indigo-200 text-sm">
            Chaque Learning Path apporte une pièce du puzzle.<br />
            À la fin tu sais construire une infrastructure IA complète de A à Z sur Azure.
          </p>
        </div>
      </section>

    </div>
  );
}
