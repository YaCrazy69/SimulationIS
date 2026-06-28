from datetime import timedelta
from decimal import Decimal

from sqlalchemy.exc import IntegrityError
from Modeles.Simulation import Simulation
from Modeles.PointSim import PointSim
from Modeles.ResultatSim import ResultatSim
from Modeles.Canalisation import Canalisation
from Modeles.Quartier import Quartier
from fastapi import HTTPException
from Maths.Runge_kutta import calculer_points


def create_sim_service(db, simulation_data, current_user):
    duree_value = simulation_data.Duree
    if isinstance(duree_value, (int, float, Decimal)):
        duree_value = timedelta(seconds=float(duree_value))

    new_sim = Simulation(
        Date_sim=simulation_data.Date_sim,
        methode=simulation_data.methode,
        Duree=duree_value,
        Interval_pas=simulation_data.Interval_pas,
        Utilisateur_id=current_user.id_User,
    )

    try:
        db.add(new_sim)
        db.commit()
        db.refresh(new_sim)
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "message": "Simulation créée",
        "id_sim": new_sim.Id_sim,
    }


def run_simulation_service(db, simulation_id, current_user):
    simulation = db.query(Simulation).filter(Simulation.Id_sim == simulation_id).first()
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation non trouvée")
    if simulation.Utilisateur_id != current_user.id_User:
        raise HTTPException(status_code=403, detail="Accès refusé")

    try:
        # Supprimer les anciens points et résultats si on relance
        db.query(PointSim).filter(PointSim.Simulation_id == simulation_id).delete()
        existing_resultat = db.query(ResultatSim).filter(ResultatSim.Simulation_id == simulation_id).first()
        if existing_resultat:
            db.delete(existing_resultat)
        db.flush()

        points_data = calculer_points(
            volume_initial=Decimal("5000"),
            duree=simulation.Duree,
            pas=simulation.Interval_pas,
        )

        for entry in points_data:
            db.add(
                PointSim(
                    Temps_Sim=timedelta(seconds=float(entry["temps"])),
                    Nv_eau=entry["niveau"],
                    Volume=entry["volume"],
                    Simulation=simulation,
                )
            )

        db.flush()

        # Calcul du résultat final
        volume_final = points_data[-1]["volume"] if points_data else Decimal("0")

        canalisations = db.query(Canalisation).all()
        quartiers_alimentes = []
        quartiers_penurie = []

        for canal in canalisations:
            quartier = db.query(Quartier).filter(Quartier.id_quartier == canal.Quartier_id).first()
            if not quartier:
                continue
            # Un quartier est alimenté si le volume final couvre sa consommation moyenne
            if volume_final >= Decimal(str(quartier.Conso_Moyen)):
                quartiers_alimentes.append(quartier.Nom_quartier)
            else:
                quartiers_penurie.append(quartier.Nom_quartier)

        # Dédoublonner (un quartier peut avoir plusieurs canalisations)
        quartiers_alimentes = list(dict.fromkeys(quartiers_alimentes))
        quartiers_penurie   = list(dict.fromkeys(quartiers_penurie))

        # Si aucune canalisation n'est définie, on marque tout comme alimenté par défaut
        if not canalisations:
            quartiers_alimentes = ["Aucune canalisation définie"]

        new_resultat = ResultatSim(
            Volume_Final=volume_final,
            Quartier_alimentes=", ".join(quartiers_alimentes) if quartiers_alimentes else "Aucun",
            Quartiers_penurie=", ".join(quartiers_penurie) if quartiers_penurie else "Aucun",
            Simulation_id=simulation_id,
        )
        db.add(new_resultat)

        db.commit()
        db.refresh(simulation)
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "message": "Simulation lancée",
        "id_sim": simulation.Id_sim,
        "points_generated": len(simulation.PointSim),
    }


def get_simulation_points_service(db, simulation_id, current_user):
    simulation = db.query(Simulation).filter(Simulation.Id_sim == simulation_id).first()
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation non trouvée")
    if simulation.Utilisateur_id != current_user.id_User:
        raise HTTPException(status_code=403, detail="Accès refusé")

    points = db.query(PointSim).filter(PointSim.Simulation_id == simulation_id).all()
    return [
        {
            "Id_Pt": point.Id_Pt,
            "Temps_Sim": float(point.Temps_Sim.total_seconds()),
            "Nv_eau": float(point.Nv_eau),
            "Volume": float(point.Volume),
        }
        for point in points
    ]


def get_simulation_result_service(db, simulation_id, current_user):
    simulation = db.query(Simulation).filter(Simulation.Id_sim == simulation_id).first()
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation non trouvée")
    if simulation.Utilisateur_id != current_user.id_User:
        raise HTTPException(status_code=403, detail="Accès refusé")

    resultat = db.query(ResultatSim).filter(ResultatSim.Simulation_id == simulation_id).first()
    if not resultat:
        raise HTTPException(status_code=404, detail="Résultat de simulation non trouvé")

    return {
        "Volume_Final": float(resultat.Volume_Final),
        "Quartier_alimentes": resultat.Quartier_alimentes,
        "Quartiers_penurie": resultat.Quartiers_penurie,
    }


def get_all_simulations(db):
    return db.query(Simulation).all()


def get_simulation_by_id(db, sim_id):
    return db.query(Simulation).filter(Simulation.Id_sim == sim_id).first()

