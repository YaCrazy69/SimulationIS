from database.database import Base
from sqlalchemy import Integer, Column, String, Interval, Numeric, ForeignKey
from sqlalchemy.orm import relationship


class PointSim(Base):
    __tablename__ = 'pointSim'
    Id_Pt = Column(Integer, primary_key=True, autoincrement=True, index=True)
    Temps_Sim = Column(Interval)
    Nv_eau = Column(Numeric)
    Volume = Column(Numeric)
    Simulation_id = Column(Integer, ForeignKey('simulation.Id_sim'))
    Simulation = relationship('Simulation', back_populates='PointSim')


from Modeles.Simulation import Simulation  # noqa: F401, E402