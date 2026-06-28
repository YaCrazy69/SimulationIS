from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
from Modeles.ResultatSim import ResultatSim
from fastapi import HTTPException

def create_resultat_service(db,Res):
    new_res=ResultatSim(
        Volume_Final=Res.Volume_Final,
        Quartier_alimentes=Res.Quartier_alimentes,
        Quartiers_penurie=Res.Quartiers_penurie
    )
    try:
        db.add(new_res)
        db.commit()
        db.refresh(new_res)
    except IntegrityError as e:
        print(e)
    return {
        "Volume_Final":new_res.Volume_Final,
        "Quartier_alimentes":new_res.Quartier_alimentes,
        "Quartiers_penurie":new_res.Quartiers_penurie
    }
    

