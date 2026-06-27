from database.database import Base
from sqlalchemy import Integer, Column, String
from sqlalchemy.orm import relationship


class Utilisateur(Base):
    __tablename__ = 'utilisateur'
    id_User = Column(Integer, primary_key=True, unique=True, autoincrement=True, index=True)
    Nom_User = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    mot_de_passe = Column(String(50), nullable=False)
    Simulation = relationship("Simulation", back_populates="Utilisateur")


from Modeles.Simulation import Simulation  # noqa: F401, E402
