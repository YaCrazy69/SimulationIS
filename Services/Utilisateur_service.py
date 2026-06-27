from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
from Modeles.Utilisateur import Utilisateur
from fastapi import HTTPException
def create_Utilisateur(User,db):
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
