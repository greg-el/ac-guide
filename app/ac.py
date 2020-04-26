from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column, Integer, String
import sqlalchemy.pool as pool
import psycopg2.pool
import psycopg2
import os


app = Flask(__name__, static_folder='./static',instance_relative_config=True)
app.config.from_object('config.DevelopmentConfig')
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#db = SQLAlchemy(app)

#def getconn():
#    c = psycopg2.connect(os.environ['DATABASE_URL'])
#    return c

mypool = psycopg2.pool.ThreadedConnectionPool(1, 20, database="acguide")

import routes

    
if __name__ == "__main__":
    app.run()