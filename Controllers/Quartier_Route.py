from fastapi import APIRouter
from database.database import db_dependancy
from Schemas.Quartier_schema import Create_Quartier
from Services.Quartier_service import (
    create_quartier_service,
    get_quartiers_service,
    get_quartier_by_id_service,
    update_quartier_service,
    delete_quartier_service
)
router=APIRouter(prefix="/quartier",tags=["Quartier"])

@router.post("/Create_Quartier")
def create_quartier(
    db:db_dependancy,
    quartier:Create_Quartier
    ):
    return create_quartier_service(db,quartier)

@router.get("/all")
def get_quartiers(
    db:db_dependancy
    ):
    return get_quartiers_service(db)

@router.get("/{quartier_id}")
def get_quartier(
    db:db_dependancy,
    quartier_id: int
    ):
    return get_quartier_by_id_service(db, quartier_id)

@router.put("/update/{quartier_id}")
def update_quartier(
    db:db_dependancy,
    quartier_id: int,
    quartier: Create_Quartier
    ):
    return update_quartier_service(db, quartier_id, quartier)

@router.delete("/delete/{quartier_id}")
def delete_quartier(
    db:db_dependancy,
    quartier_id: int
    ):
    return delete_quartier_service(db, quartier_id)
