from database.database import Base
from sqlalchemy import Integer, Column, String, DateTime, Interval, Numeric, ForeignKey
from sqlalchemy.orm import relationship


class Simulation(Base):
    __tablename__ = 'simulation'
    Id_sim = Column(Integer, primary_key=True, autoincrement=True, index=True)
    Date_sim = Column(DateTime, nullable=False)
    methode = Column(String, nullable=False)
    Duree = Column(Interval, nullable=False)
    Interval_pas = Column(Numeric, nullable=False)
    Utilisateur_id = Column(Integer, ForeignKey("utilisateur.id_User"))
    Utilisateur = relationship("Utilisateur", back_populates="Simulation")
    PointSim = relationship("PointSim", back_populates="Simulation")
    ResultatSim = relationship("ResultatSim", back_populates="Simulation", uselist=False)


from Modeles.PointSim import PointSim  # noqa: F401, E402
from Modeles.ResultatSim import ResultatSim  # noqa: F401, E402
