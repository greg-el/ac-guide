from flask import Flask, request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String
import sqlalchemy.pool as pool
import psycopg2
import os


app = Flask(__name__, static_folder='./static',instance_relative_config=True)
app.config.from_object('config.DevelopmentConfig')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
#engine = create_engine(os.environ['DATABASE_URL'], pool_size=20, max_overflow=0)
#Session = sessionmaker(bind=engine)
#session = Session()
def getconn():
    c = psycopg2.connect(os.environ['DATABASE_URL'])
    return c

mypool = pool.QueuePool(getconn, max_overflow=10, pool_size=5)

import routes

class InventoryModel(db.Model):
    __tablename__ = 'inventory'

    uid = Column(String, primary_key=True)
    pocket = Column(JSONB)

    def __init__(self, uid, pocket):
        self.uid = uid
        self.pocket = pocket

    def __repr__(self):
        return f"User {self.uid}"
    
if __name__ == "__main__":
    app.run()