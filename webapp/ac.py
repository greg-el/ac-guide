from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from firebase_admin import credentials, initialize_app
import psycopg2.pool
import psycopg2
import os
from flask_migrate import Migrate
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.types import String
from sqlalchemy import Column
import uuid


app = Flask(__name__, static_folder='./static', instance_relative_config=True)
app.config.from_object('webapp.config.DevelopmentConfig')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://ac@127.0.0.1/acguide"
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class Inventory(db.Model):
    __tablename__ = "inventory"

    uid = Column(UUID, primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    firebase_user_id = Column(String, nullable=False)
    pocket = Column(JSONB, nullable=False)

    def __repr__(self):
        return "<User(uid='%s', pocket='%s')>" % (
                             self.uid, self.pocket)


# Firebase init
cred = credentials.Certificate({
    "type": "service_account",
    "private_key": os.environ['PRIVATE_KEY'].replace('\\n', '\n'),
    "client_email": os.environ['CLIENT_EMAIL'],
    "project_id": os.environ['PROJECT_ID'],
    "token_uri": "https://oauth2.googleapis.com/token"})

ac_firebase = initialize_app(cred)

sslmode = 'disable' if '127.0.0.1' in os.environ['DATABASE_URL'] else 'require'
mypool = psycopg2.pool.ThreadedConnectionPool(1, 20, os.environ['DATABASE_URL'], sslmode=sslmode)

import webapp.routes


if __name__ == "__main__":
    app.run()