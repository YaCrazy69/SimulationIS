from fastapi import FastAPI
import uvicorn
from database.database import engine,Base

from Controllers.Utilisateur_Route import router as utilisateur_router

app = FastAPI(title="SimulationIS API", version="1.0.0")
Base.metadata.create_all(bind=engine)
app.include_router(utilisateur_router)


@app.get("/")
def root():
    return {"message": "API SimulationIS démarrée"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
