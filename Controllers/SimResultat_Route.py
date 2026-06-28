from fastapi import APIRouter
from database.database import db_dependancy
from Schemas.ResultatSim_schema import Create_ResultatSim
from Services.ResultatSim_service import create_resultat_service
router=APIRouter(prefix="/Res_sim",tags=["ResultatSim"])

@router.post("/create_resSim")
def create_res(
    db:db_dependancy,
    resultat:Create_ResultatSim
    ):
    return create_resultat_service(db,resultat)
