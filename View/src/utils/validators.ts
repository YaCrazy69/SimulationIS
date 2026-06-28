import { z } from "zod";

// ─── Utilisateur ─────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  Nom_User: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Adresse email invalide."),
  mot_de_passe: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

// Le backend PUT exige les 3 champs (pas de partial). mot_de_passe obligatoire.
export const utilisateurUpdateSchema = z.object({
  Nom_User: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Adresse email invalide."),
  mot_de_passe: z.string().min(1, "Le mot de passe est requis pour la mise à jour."),
});
export type UtilisateurUpdateFormValues = z.infer<typeof utilisateurUpdateSchema>;

// ─── Réservoir ────────────────────────────────────────────────────────────────

export const reservoirSchema = z.object({
  nom_reservoir: z.string().min(2, "Nom requis."),
  capacite_res: z.coerce.number().positive("La capacité doit être positive."),
  niveau_init_res: z.coerce.number().min(0, "Le niveau initial doit être positif ou nul."),
  debit_res: z.coerce.number().min(0, "Le débit doit être positif ou nul."),
});
export type ReservoirFormValues = z.infer<typeof reservoirSchema>;

// ─── Quartier ─────────────────────────────────────────────────────────────────

export const quartierSchema = z.object({
  Nom_quartier: z.string().min(2, "Nom requis."),
  Popu_Quartier: z.coerce.number().int("La population doit être un entier.").positive("La population doit être positive."),
  Conso_Moyen: z.coerce.number().min(0, "La consommation doit être positive ou nulle."),
});
export type QuartierFormValues = z.infer<typeof quartierSchema>;

// ─── Canalisation ─────────────────────────────────────────────────────────────
// Reservoir_id et Quartier_id sont des entiers côté backend (ForeignKey int)

export const canalisationSchema = z.object({
  Longueur_Canal: z.coerce.number().positive("La longueur doit être positive."),
  Debit_max: z.coerce.number().positive("Le débit maximal doit être positif."),
  Reservoir_id: z.coerce.number().int().positive("Sélectionnez un réservoir."),
  Quartier_id: z.coerce.number().int().positive("Sélectionnez un quartier."),
});
export type CanalisationFormValues = z.infer<typeof canalisationSchema>;

// ─── Simulation ───────────────────────────────────────────────────────────────
// Duree et Interval_pas sont envoyés comme secondes (Decimal/Numeric côté backend).
// Le backend accepte un nombre brut pour Interval_pas et une timedelta pour Duree.
// FastAPI parse automatiquement un nombre de secondes comme timedelta via Pydantic.

export const simulationSchema = z.object({
  Date_sim: z.string().min(1, "Date requise."),
  methode: z.string().min(1, "Méthode requise."),
  Duree: z.coerce.number().positive("La durée doit être positive (en secondes)."),
  Interval_pas: z.coerce.number().positive("Le pas doit être positif (en secondes)."),
});
export type SimulationFormValues = z.infer<typeof simulationSchema>;
