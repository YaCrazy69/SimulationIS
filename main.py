from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from database.database import engine,Base

from Controllers.Utilisateur_Route import router as utilisateur_router
from Controllers.Simulation_Route import router as simulation_router
from Controllers.Reservoir_Route import router as reservoir_router
from Controllers.SimResultat_Route import router as resultat_router
from Controllers.Canalisation_Route import router as canalisation_router
from Controllers.Quartier_Route import router as quartier_router

app = FastAPI(title="SimulationIS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(utilisateur_router)
app.include_router(simulation_router)
app.include_router(reservoir_router)
app.include_router(resultat_router)
app.include_router(canalisation_router)
app.include_router(quartier_router)


@app.get("/")
def root():
    return {"message": "API SimulationIS démarrée"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
