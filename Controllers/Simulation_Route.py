from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from database.database import db_dependancy, get_db
from Schemas.Simulation_schema import Create_Simulation
from Schemas.PointSim_schema import PointSimResponse
from Schemas.ResultatSim_schema import ResultatSimResponse
from Services.Simulation_service import (
    create_sim_service,
    run_simulation_service,
    get_simulation_points_service,
    get_simulation_result_service,
)
from Services.Utilisateur_service import get_utilisateur_service
from Modeles.Utilisateur import Utilisateur

router = APIRouter(prefix="/simulation", tags=["Simulation"])


def get_current_user(
    authorization: str | None = Header(None),
    db: Session = Depends(get_db),
) -> Utilisateur:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization scheme")

    token = authorization.split(" ", 1)[1].strip()
    if not token.isdigit():
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    return get_utilisateur_service(db, int(token))


@router.post("/Create_Sim")
def create_Sim(
    db: db_dependancy,
    simulation: Create_Simulation,
    current_user: Utilisateur = Depends(get_current_user),
):
    return create_sim_service(db, simulation, current_user)


@router.post("/launch/{simulation_id}")
def launch_simulation(
    simulation_id: int,
    db: db_dependancy,
    current_user: Utilisateur = Depends(get_current_user),
):
    return run_simulation_service(db, simulation_id, current_user)


@router.get("/{simulation_id}/points", response_model=list[PointSimResponse])
def get_simulation_points(
    simulation_id: int,
    db: db_dependancy,
    current_user: Utilisateur = Depends(get_current_user),
):
    return get_simulation_points_service(db, simulation_id, current_user)


@router.get("/{simulation_id}/resultat", response_model=ResultatSimResponse)
def get_simulation_result(
    simulation_id: int,
    db: db_dependancy,
    current_user: Utilisateur = Depends(get_current_user),
):
    return get_simulation_result_service(db, simulation_id, current_user)
    