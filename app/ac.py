from flask import Flask, request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSONB
import os


app = Flask(__name__, static_folder='./static',instance_relative_config=True)
app.config.from_object('config.DevelopmentConfig')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


import routes

class InventoryModel(db.Model):
    __tablename__ = 'inventory'

    uid = db.Column(db.String(), primary_key=True)
    pocket = db.Column(JSONB)

    def __init__(self):
        self.uid = uid
        self.pocket = pocket

    def __repr__(self):
        return f"User {self.uid}"
    
if __name__ == "__main__":
    app.run()