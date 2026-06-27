from datetime import datetime, timedelta
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class Create_Simulation(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    Date_sim: datetime
    methode: str
    Duree: timedelta
    Interval_pas: Decimal
