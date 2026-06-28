from fastapi import APIRouter
from database.database import db_dependancy
from Schemas.Canalisation_schema import Create_Canalisation
from Services.Canalisation_service import (
    create_canalisation_service,
    get_canalisation_service,
    get_canalisation_by_id_service,
    update_canalisation_service,
    delete_canalisation_service
)
router=APIRouter(prefix="/canalisation",tags=["Canalisation"])

@router.post("/Create_Canalisation")
def create_canalisation(
    db:db_dependancy,
    canalisation:Create_Canalisation
    ):
    return create_canalisation_service(db,canalisation)

@router.get("/all")
def get_canalisation(
    db:db_dependancy
    ):
    return get_canalisation_service(db)

@router.get("/{canalisation_id}")
def get_canalisation_by_id(
    db:db_dependancy,
    canalisation_id: int
    ):
    return get_canalisation_by_id_service(db, canalisation_id)

@router.put("/update/{canalisation_id}")
def update_canalisation(
    db:db_dependancy,
    canalisation_id: int,
    canalisation: Create_Canalisation
    ):
    return update_canalisation_service(db, canalisation_id, canalisation)

@router.delete("/delete/{canalisation_id}")
def delete_canalisation(
    db:db_dependancy,
    canalisation_id: int
    ):
    return delete_canalisation_service(db, canalisation_id)
