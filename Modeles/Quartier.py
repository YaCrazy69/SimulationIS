from database.database import Base
from sqlalchemy import Integer,Column,String,Numeric
from sqlalchemy.orm import relationship

class Quartier(Base):
    __tablename__='quartier'
    id_quartier=Column(Integer,primary_key=True,autoincrement=True,index=True)
    Nom_quartier=Column(String)
    Popu_Quartier=Column(Integer)
    Conso_Moyen=Column(Numeric)
    Canalisation=relationship("Canalisation",back_populates="Quartier")
