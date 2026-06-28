from fastapi import APIRouter
from database.database import db_dependancy
from Schemas.Reservoir_schema import Create_Reservoir
from Services.Reservoir_service import (
    create_reservoir_service,
    get_reservoirs_service,
    get_reservoir_by_id_service,
    update_reservoir_service,
    delete_reservoir_service
)
router=APIRouter(prefix="/Reservoir_create",tags=["Reservoir"])

@router.post("/Create_reservoir")
def create_reservoir(
    db:db_dependancy,
    Reservoir:Create_Reservoir
    ):
    return create_reservoir_service(db,Reservoir)

@router.get("/all")
def get_reservoirs(
    db:db_dependancy
    ):
    return get_reservoirs_service(db)

@router.get("/{reservoir_id}")
def get_reservoir(
    db:db_dependancy,
    reservoir_id: int
    ):
    return get_reservoir_by_id_service(db, reservoir_id)

@router.put("/update/{reservoir_id}")
def update_reservoir(
    db:db_dependancy,
    reservoir_id: int,
    Reservoir: Create_Reservoir
    ):
    return update_reservoir_service(db, reservoir_id, Reservoir)

@router.delete("/delete/{reservoir_id}")
def delete_reservoir(
    db:db_dependancy,
    reservoir_id: int
    ):
    return delete_reservoir_service(db, reservoir_id)
