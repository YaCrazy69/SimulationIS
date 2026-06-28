from fastapi import APIRouter
from database.database import db_dependancy
from Schemas.Utilisateur_schema import Create_User
from Services.Utilisateur_service import (
    create_utilisateur_service,
    get_utilisateurs_service,
    get_utilisateur_service,
    update_utilisateur_service,
    delete_utilisateur_service
)
router=APIRouter(prefix="/utilisateur",tags=["Utilisateur"])

@router.post("/Create_User")
def Create_Utilisateur(
    db:db_dependancy,
    utilisateur: Create_User
    ):
    return create_utilisateur_service(utilisateur,db)

@router.get("/all")
def get_utilisateurs(
    db:db_dependancy
    ):
    return get_utilisateurs_service(db)

@router.get("/{utilisateur_id}")
def get_utilisateur(
    db:db_dependancy,
    utilisateur_id: int
    ):
    return get_utilisateur_service(db, utilisateur_id)

@router.put("/update/{utilisateur_id}")
def update_utilisateur(
    db:db_dependancy,
    utilisateur_id: int,
    utilisateur: Create_User
    ):
    return update_utilisateur_service(db, utilisateur_id, utilisateur)

@router.delete("/delete/{utilisateur_id}")
def delete_utilisateur(
    db:db_dependancy,
    utilisateur_id: int
    ):
    return delete_utilisateur_service(db, utilisateur_id)
