from database.database import Base
from sqlalchemy import Integer,Column,String,Numeric
from sqlalchemy.orm import relationship

class Reservoir(Base):
    __tablename__='reservoir'
    id_reservoir=Column(Integer,primary_key=True,autoincrement=True,index=True)
    nom_reservoir=Column(String)
    capacite_res=Column(Numeric)
    niveau_init_res=Column(Numeric)
    debit_res=Column(Numeric)
    Canalisation=relationship('Canalisation',back_populates='Reservoir')
