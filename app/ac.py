from flask import Flask

import firebase_admin
from firebase_admin import credentials

import psycopg2.pool
import psycopg2
import os


app = Flask(__name__, static_folder='./static',instance_relative_config=True)
app.config.from_object('config.DevelopmentConfig')

#Firebase init
cred = credentials.Certificate(os.environ['GOOGLE_APPLICATION_CREDENTIALS'])
ac_firebase = firebase_admin.initialize_app(cred)

#def getconn():
#    c = psycopg2.connect(os.environ['DATABASE_URL'])
#    return c

mypool = psycopg2.pool.ThreadedConnectionPool(1, 20, database="acguide")

import routes

    
if __name__ == "__main__":
    app.run()