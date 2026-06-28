from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class Create_Canalisation(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    Longueur_Canal: Decimal
    Debit_max: Decimal
    Reservoir_id: int
    Quartier_id: int