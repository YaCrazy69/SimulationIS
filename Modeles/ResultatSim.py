from database.database import Base
from sqlalchemy import Integer, Column, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship


class ResultatSim(Base):
    __tablename__ = "resultatSim"
    Id_result = Column(Integer, primary_key=True, autoincrement=True, index=True)
    Volume_Final = Column(Numeric, nullable=False)
    Quartier_alimentes = Column(String(50), nullable=False)
    Quartiers_penurie = Column(String(50), nullable=False)
    Simulation_id = Column(Integer, ForeignKey('simulation.Id_sim'), unique=True)
    Simulation = relationship("Simulation", back_populates="ResultatSim")


from Modeles.Simulation import Simulation  # noqa: F401, E402