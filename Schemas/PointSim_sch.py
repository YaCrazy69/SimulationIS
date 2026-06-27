from datetime import timedelta
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class Create_PointSim(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    Temps_Sim: timedelta
    Nv_eau: Decimal
    Volume: Decimal