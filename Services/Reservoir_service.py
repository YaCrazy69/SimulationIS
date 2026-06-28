from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
from Modeles.Reservoir import Reservoir
from fastapi import HTTPException

def create_reservoir_service(db,Res):
    new_reservoir=Reservoir(
        nom_reservoir=Res.nom_reservoir,
        capacite_res=Res.capacite_res,
        niveau_init_res=Res.niveau_init_res,
        debit_res=Res.debit_res
    )
    try:
        db.add(new_reservoir)
        db.commit()
        db.refresh(new_reservoir)
    except IntegrityError as e:
        print(e)
    return {
        "nom_reservoir":new_reservoir.nom_reservoir,
        "capacite_res":new_reservoir.capacite_res,
        "niveau_init_res":new_reservoir.niveau_init_res,
        "debit_res":new_reservoir.debit_res
    }

def get_reservoirs_service(db):
    return db.query(Reservoir).all()

def get_reservoir_by_id_service(db, reservoir_id):
    reservoir=db.query(Reservoir).filter(Reservoir.id_reservoir==reservoir_id).first()
    if not reservoir:
        raise HTTPException(status_code=404, detail="Reservoir non trouvé")
    return reservoir

def update_reservoir_service(db, reservoir_id, Res):
    existing=db.query(Reservoir).filter(Reservoir.id_reservoir==reservoir_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Reservoir non trouvé")
    existing.nom_reservoir=Res.nom_reservoir
    existing.capacite_res=Res.capacite_res
    existing.niveau_init_res=Res.niveau_init_res
    existing.debit_res=Res.debit_res
    db.commit()
    db.refresh(existing)
    return existing

def delete_reservoir_service(db, reservoir_id):
    reservoir=db.query(Reservoir).filter(Reservoir.id_reservoir==reservoir_id).first()
    if not reservoir:
        raise HTTPException(status_code=404, detail="Reservoir non trouvé")
    db.delete(reservoir)
    db.commit()
    return {"detail": "Reservoir supprimé"}

