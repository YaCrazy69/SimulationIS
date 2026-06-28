from sqlalchemy.exc import IntegrityError
from Modeles.Canalisation import Canalisation
from fastapi import HTTPException

def create_canalisation_service(db, canalisation):
    new_canal=Canalisation(
        Longueur_Canal=canalisation.Longueur_Canal,
        Debit_max=canalisation.Debit_max,
        Reservoir_id=canalisation.Reservoir_id,
        Quartier_id=canalisation.Quartier_id,
    )
    try:
        db.add(new_canal)
        db.commit()
        db.refresh(new_canal)
    except IntegrityError as e:
        print(e)
    return {
        "Id_Canal": new_canal.Id_Canal,
        "Longueur_Canal": new_canal.Longueur_Canal,
        "Debit_max": new_canal.Debit_max,
        "Reservoir_id": new_canal.Reservoir_id,
        "Quartier_id": new_canal.Quartier_id,
    }

def get_canalisation_service(db):
    return db.query(Canalisation).all()

def get_canalisation_by_id_service(db, canalisation_id):
    canalisation=db.query(Canalisation).filter(Canalisation.Id_Canal==canalisation_id).first()
    if not canalisation:
        raise HTTPException(status_code=404, detail="Canalisation non trouvée")
    return canalisation

def update_canalisation_service(db, canalisation_id, canalisation):
    existing=db.query(Canalisation).filter(Canalisation.Id_Canal==canalisation_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Canalisation non trouvée")
    existing.Longueur_Canal=canalisation.Longueur_Canal
    existing.Debit_max=canalisation.Debit_max
    existing.Reservoir_id=canalisation.Reservoir_id
    existing.Quartier_id=canalisation.Quartier_id
    db.commit()
    db.refresh(existing)
    return existing

def delete_canalisation_service(db, canalisation_id):
    canalisation=db.query(Canalisation).filter(Canalisation.Id_Canal==canalisation_id).first()
    if not canalisation:
        raise HTTPException(status_code=404, detail="Canalisation non trouvée")
    db.delete(canalisation)
    db.commit()
    return {"detail": "Canalisation supprimée"}
