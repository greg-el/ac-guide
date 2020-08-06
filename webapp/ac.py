from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import firebase_admin
from firebase_admin import credentials, initialize_app
import psycopg2.pool
import psycopg2
import os
from flask_migrate import Migrate
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import String
from sqlalchemy import Column


app = Flask(__name__, static_folder='./static', instance_relative_config=True)
app.config.from_object('webapp.config.DevelopmentConfig')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
db = SQLAlchemy(app)
migrate = Migrate(app, db)



class Inventory(db.Model):
    __tablename__ = "inventory"

    firebase_user_id = Column(String, primary_key=True, nullable=True)
    chores = Column(JSONB, nullable=True)
    fish = Column(JSONB, nullable=True)
    bugs = Column(JSONB, nullable=True)
    dive = Column(JSONB, nullable=True)

    def __repr__(self):
        return "<User(uid='%s', pocket='%s')>" % (self.uid, self.pocket)


if not firebase_admin._apps:
    cred = credentials.Certificate({
        "type": "service_account",
        "private_key": os.environ['PRIVATE_KEY'].replace('\\n', '\n'),
        "client_email": os.environ['CLIENT_EMAIL'],
        "project_id": os.environ['PROJECT_ID'],
        "token_uri": "https://oauth2.googleapis.com/token"})

    ac_firebase = initialize_app(cred)

sslmode = 'disable' if '127.0.0.1' in os.environ['DATABASE_URL'] else 'require'
mypool = psycopg2.pool.ThreadedConnectionPool(1, 20, os.environ['DATABASE_URL'], sslmode=sslmode)

from webapp.routes import *

if __name__ == "__main__":
    app.run()
