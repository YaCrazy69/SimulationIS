from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
from Modeles.Utilisateur import Utilisateur
from fastapi import HTTPException

def create_utilisateur_service(User,db):
    User_exist=db.query(Utilisateur).filter(
        and_(
            Utilisateur.email==User.email
        )
    ).first()
    if not User_exist:
        new_User=Utilisateur(
            Nom_User=User.Nom_User,
            email=User.email,
            mot_de_passe=User.mot_de_passe
        )
        try:
            db.add(new_User)
            db.commit()
            db.refresh(new_User)
        except IntegrityError as e:
            print(e)
        return {
            "Nom_User":new_User.Nom_User
        }
    else:
        raise HTTPException(
            status_code=409,
            detail="Email Deja associé à un compte"
        )

def get_utilisateurs_service(db):
    return db.query(Utilisateur).all()

def get_utilisateur_service(db, utilisateur_id):
    utilisateur=db.query(Utilisateur).filter(Utilisateur.id_User==utilisateur_id).first()
    if not utilisateur:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return utilisateur

def update_utilisateur_service(db, utilisateur_id, User):
    utilisateur=db.query(Utilisateur).filter(Utilisateur.id_User==utilisateur_id).first()
    if not utilisateur:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    utilisateur.Nom_User=User.Nom_User
    utilisateur.email=User.email
    utilisateur.mot_de_passe=User.mot_de_passe
    db.commit()
    db.refresh(utilisateur)
    return utilisateur

def delete_utilisateur_service(db, utilisateur_id):
    utilisateur=db.query(Utilisateur).filter(Utilisateur.id_User==utilisateur_id).first()
    if not utilisateur:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    db.delete(utilisateur)
    db.commit()
    return {"detail": "Utilisateur supprimé"}
