from sqlalchemy.exc import IntegrityError
from Modeles.Quartier import Quartier
from fastapi import HTTPException

def create_quartier_service(db, quartier):
    new_quartier=Quartier(
        Nom_quartier=quartier.Nom_quartier,
        Popu_Quartier=quartier.Popu_Quartier,
        Conso_Moyen=quartier.Conso_Moyen
    )
    try:
        db.add(new_quartier)
        db.commit()
        db.refresh(new_quartier)
    except IntegrityError as e:
        print(e)
    return {
        "Nom_quartier":new_quartier.Nom_quartier,
        "Popu_Quartier":new_quartier.Popu_Quartier,
        "Conso_Moyen":new_quartier.Conso_Moyen
    }

def get_quartiers_service(db):
    return db.query(Quartier).all()

def get_quartier_by_id_service(db, quartier_id):
    quartier=db.query(Quartier).filter(Quartier.id_quartier==quartier_id).first()
    if not quartier:
        raise HTTPException(status_code=404, detail="Quartier non trouvé")
    return quartier

def update_quartier_service(db, quartier_id, quartier):
    existing=db.query(Quartier).filter(Quartier.id_quartier==quartier_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Quartier non trouvé")
    existing.Nom_quartier=quartier.Nom_quartier
    existing.Popu_Quartier=quartier.Popu_Quartier
    existing.Conso_Moyen=quartier.Conso_Moyen
    db.commit()
    db.refresh(existing)
    return existing

def delete_quartier_service(db, quartier_id):
    quartier=db.query(Quartier).filter(Quartier.id_quartier==quartier_id).first()
    if not quartier:
        raise HTTPException(status_code=404, detail="Quartier non trouvé")
    db.delete(quartier)
    db.commit()
    return {"detail": "Quartier supprimé"}
