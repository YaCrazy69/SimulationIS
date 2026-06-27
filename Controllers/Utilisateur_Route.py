from fastapi import APIRouter
from database.database import db_dependancy
from Schemas.Utilisateur_sch import Create_User
from Services.Utilisateur_service import create_Utilisateur
router=APIRouter(prefix="/utilisateur",tags=["Utilisateur"])

@router.post("/Create")
def Create_Utilisateur(
    db:db_dependancy,
    utilisateur: Create_User
    ):
    return create_Utilisateur(utilisateur,db)
    