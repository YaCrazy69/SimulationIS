from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class Create_ResultatSim(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    Volume_Final: Decimal
    Quartier_alimentes: str
    Quartiers_penurie: str


class ResultatSimResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    Volume_Final: Decimal
    Quartier_alimentes: str
    Quartiers_penurie: str