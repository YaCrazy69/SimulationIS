from database.database import Base
from sqlalchemy import Integer,Column,String,Numeric,ForeignKey
from sqlalchemy.orm import relationship

class Canalisation(Base):
    __tablename__="canalisation"
    Id_Canal=Column(Integer,primary_key=True,autoincrement=True,index=True)
    Longueur_Canal=Column(Numeric)
    Debit_max=Column(Numeric)
    Reservoir_id=Column(Integer,ForeignKey('reservoir.id_reservoir'))
    Quartier_id=Column(Integer,ForeignKey('quartier.id_quartier'))
    Reservoir=relationship('Reservoir',back_populates="Canalisation")
    Quartier=relationship('Quartier',back_populates="Canalisation")
