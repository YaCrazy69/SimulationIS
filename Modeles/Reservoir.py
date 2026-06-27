from database.database import Base
from sqlalchemy import Integer,Column,String,Decimal
from sqlalchemy.orm import relationship

class Reservoir(Base):
    __tablename__='reservoir'
    id_reservoir=Column(Integer,primary_key=True,autoincrement=True,index=True)
    nom_reservoir=Column(String)
    capacite_res=Column(Decimal)
    niveau_init_res=Column(Decimal)
    debit_res=Column(Decimal)
    Canalisation=relationship('Canalisation',back_populates='Reservoir')
