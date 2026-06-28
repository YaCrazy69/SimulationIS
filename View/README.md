# Hydraulix — Frontend

Frontend complet (React + Vite + TypeScript + Tailwind) connecté à un backend FastAPI existant
de simulation hydraulique. Ce projet **ne contient aucune logique métier** : il consomme
uniquement les routes décrites dans le cahier des charges, sans les modifier.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- Axios (client API avec interception automatique du header `Authorization`)
- React Router DOM
- Zustand (état global : session utilisateur, notifications, historique de simulations)
- React Hook Form + Zod (formulaires et validation)
- Recharts (graphiques)
- Lucide React (icônes)

## Installation

```bash
cd frontend
cp .env.example .env   # ajustez VITE_API_BASE_URL si le backend n'est pas sur localhost:8000
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173` et appelle le backend sur
`http://localhost:8000` (configurable via `VITE_API_BASE_URL`).

## Authentification

⚠️ **Le backend fourni n'expose pas de route `/login`** (seulement `Create_User`,
`utilisateur/all`, `utilisateur/{id}`, etc.). Le frontend respecte cette contrainte sans
inventer de logique d'authentification côté serveur :

- **Inscription** (`/register`) : appelle `POST /utilisateur/Create_User`, récupère
  `id_User` depuis la réponse et le stocke dans `localStorage`.
- **Connexion** (`/login`) : comme aucune route de login n'existe, cette page permet
  soit de coller un `id_User` déjà connu, soit de le sélectionner dans la liste retournée
  par `GET /utilisateur/all` (vérifié ensuite via `GET /utilisateur/{id}`). C'est une pure
  commodité d'interface — aucune vérification de mot de passe n'est faite côté frontend.
- Une fois la session ouverte, **chaque requête Axios reçoit automatiquement** le header
  `Authorization: Bearer <id_User>`.

## Historique des simulations

Le backend n'expose pas de route « liste des simulations ». Les simulations créées pendant
la session sont donc conservées dans `localStorage` côté frontend (uniquement les données
déjà renvoyées par l'API, sans recalcul) afin de permettre la navigation depuis le Dashboard
et la page Simulations vers le détail des points et des résultats.

## Structure

```
src/
├── api/            # Un fichier par ressource backend (axios.ts = config centrale)
├── components/      # Composants réutilisables (Navbar, Sidebar, DataTable, Modal, etc.)
├── components/Charts/  # SimulationChart (Recharts) et NetworkDiagram
├── layouts/         # MainLayout (sidebar + navbar + garde d'authentification)
├── pages/           # Une page par écran du cahier des charges
├── stores/          # Zustand : authStore, toastStore, simulationStore
├── types/           # Interfaces TypeScript miroir des modèles backend
└── utils/           # Schémas de validation Zod
```

## Pages disponibles

| Route                  | Description                                              |
|-------------------------|-----------------------------------------------------------|
| `/register`             | Création de compte                                       |
| `/login`                | Connexion (voir note ci-dessus)                            |
| `/dashboard`             | Vue d'ensemble : stats + dernières simulations             |
| `/simulations`           | Création + lancement de simulations                       |
| `/simulation/:id`        | Graphique des points (`Volume`, `Nv_eau` vs `Temps_Sim`)   |
| `/resultats`             | Résultat final d'une simulation (volume, zones)            |
| `/reservoirs`            | CRUD réservoirs                                            |
| `/quartiers`             | CRUD quartiers                                             |
| `/canalisations`         | CRUD canalisations + schéma du réseau                      |
| `/utilisateurs`          | Liste / modification / suppression des utilisateurs        |

## Endpoints consommés (inchangés par rapport au cahier des charges)

- `POST /utilisateur/Create_User`, `GET /utilisateur/all`, `GET /utilisateur/{id}`,
  `PUT /utilisateur/update/{id}`, `DELETE /utilisateur/delete/{id}`
- `POST /Reservoir_create/Create_reservoir`, `GET /Reservoir_create/all`,
  `GET /Reservoir_create/{id}`, `PUT /Reservoir_create/update/{id}`,
  `DELETE /Reservoir_create/delete/{id}`
- `POST /quartier/Create_Quartier`, `GET /quartier/all`, `GET /quartier/{id}`,
  `PUT /quartier/update/{id}`, `DELETE /quartier/delete/{id}`
- `POST /canalisation/Create_Canalisation`, `GET /canalisation/all`,
  `GET /canalisation/{id}`, `PUT /canalisation/update/{id}`,
  `DELETE /canalisation/delete/{id}`
- `POST /simulation/Create_Sim` (avec header `Authorization: Bearer <id_User>`)
- `POST /simulation/launch/{simulation_id}`
- `GET /simulation/{simulation_id}/points`
- `GET /simulation/{simulation_id}/resultat`

## Build production

```bash
npm run build
npm run preview
```
