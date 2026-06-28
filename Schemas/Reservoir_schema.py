from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class Create_Reservoir(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nom_reservoir: str
    capacite_res: Decimal
    niveau_init_res: Decimal
    debit_res: Decimal
