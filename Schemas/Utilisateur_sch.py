from pydantic import BaseModel, ConfigDict


class Create_User(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    Nom_User: str
    email: str
    mot_de_passe: str

