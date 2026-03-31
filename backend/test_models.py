from models.issue import Base
from db.database import engine

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done.")
