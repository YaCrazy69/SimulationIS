/**
 * Types TypeScript — reflètent EXACTEMENT les modèles renvoyés par le backend FastAPI.
 * Ne pas ajouter de champs qui n'existent pas côté backend.
 */

// ─── Utilisateur ────────────────────────────────────────────────────────────

export interface Utilisateur {
  id_User: number;
  Nom_User: string;
  email: string;
  // mot_de_passe n'est jamais renvoyé par l'API, uniquement envoyé à la création
}

export interface UtilisateurCreate {
  Nom_User: string;
  email: string;
  mot_de_passe: string;
}

// Le backend exige les 3 champs en PUT (pas de partial)
export interface UtilisateurUpdate {
  Nom_User: string;
  email: string;
  mot_de_passe: string;
}

// ─── Réservoir ───────────────────────────────────────────────────────────────

export interface Reservoir {
  id_reservoir: number;
  nom_reservoir: string;
  capacite_res: number;
  niveau_init_res: number;
  debit_res: number;
}

export interface ReservoirCreate {
  nom_reservoir: string;
  capacite_res: number;
  niveau_init_res: number;
  debit_res: number;
}

// ─── Quartier ────────────────────────────────────────────────────────────────

export interface Quartier {
  id_quartier: number;
  Nom_quartier: string;
  Popu_Quartier: number;
  Conso_Moyen: number;
}

export interface QuartierCreate {
  Nom_quartier: string;
  Popu_Quartier: number;
  Conso_Moyen: number;
}

// ─── Canalisation ────────────────────────────────────────────────────────────
// Clé primaire backend : Id_Canal (pas id_canalisation)

export interface Canalisation {
  Id_Canal: number;
  Longueur_Canal: number;
  Debit_max: number;
  Reservoir_id: number;
  Quartier_id: number;
}

export interface CanalisationCreate {
  Longueur_Canal: number;
  Debit_max: number;
  Reservoir_id: number;  // int côté backend
  Quartier_id: number;   // int côté backend
}

// ─── Simulation ───────────────────────────────────────────────────────────────
// Le backend renvoie {"message": ..., "id_sim": int} à la création (pas un objet Simulation complet).
// On stocke localement ce qu'on a.

export interface SimulationCreateResponse {
  message: string;
  id_sim: number;
}

// Objet de session locale (enrichi avec les valeurs du formulaire pour l'affichage)
export interface SimulationLocal {
  id_sim: number;
  Date_sim: string;
  methode: string;
  Duree: number;        // secondes
  Interval_pas: number; // secondes
}

export interface SimulationCreate {
  Date_sim: string;    // ISO datetime, ex: "2026-06-28T00:00:00"
  methode: string;
  Duree: number;       // secondes → converti en timedelta par le backend
  Interval_pas: number;
}

export interface SimulationLaunchResponse {
  message: string;
  id_sim: number;
  points_generated: number;
}

// ─── Points de simulation ─────────────────────────────────────────────────────

export interface PointSim {
  Id_Pt: number;
  Temps_Sim: number;  // float secondes (total_seconds())
  Nv_eau: number;
  Volume: number;
}

// ─── Résultat de simulation ───────────────────────────────────────────────────

export interface ResultatSim {
  Volume_Final: number;
  Quartier_alimentes: string;  // string côté backend (String(50))
  Quartiers_penurie: string;   // string côté backend (String(50))
}

// ─── Erreur API ───────────────────────────────────────────────────────────────

export interface ApiError {
  detail?: string;
  message?: string;
}
