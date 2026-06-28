from database.database import Base
from sqlalchemy import Integer, Column, Interval, Numeric, ForeignKey
from sqlalchemy.orm import relationship


class PointSim(Base):
    __tablename__ = 'point_sim'
    Id_Pt = Column(Integer, primary_key=True, autoincrement=True, index=True)
    Temps_Sim = Column(Interval, nullable=False)
    Nv_eau = Column(Numeric, nullable=False)
    Volume = Column(Numeric, nullable=False)
    Simulation_id = Column(Integer, ForeignKey('simulation.Id_sim'), nullable=False)
    Simulation = relationship('Simulation', back_populates='PointSim')


from Modeles.Simulation import Simulation  # noqa: F401, E402