from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class Create_Quartier(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    Nom_quartier: str
    Popu_Quartier: int
    Conso_Moyen: Decimal
