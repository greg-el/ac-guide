from flask import Flask

import firebase_admin
from firebase_admin import credentials
import psycopg2.pool
import psycopg2
import os
import re


app = Flask(__name__, static_folder='./static',instance_relative_config=True)
app.config.from_object('config.DevelopmentConfig')

#Firebase init
cred = credentials.Certificate({"type": "service_account",
"private_key": os.environ['PRIVATE_KEY'].replace('\\n', '\n'),
"client_email": os.environ['CLIENT_EMAIL'],
"project_id": os.environ['PROJECT_ID'],
"token_uri": "https://oauth2.googleapis.com/token"})
ac_firebase = firebase_admin.initialize_app(cred)

sslmode = 'disable' if '127.0.0.1' in os.environ['DATABASE_URL'] else 'require'
mypool = psycopg2.pool.ThreadedConnectionPool(1, 20, os.environ['DATABASE_URL'], sslmode=sslmode)

import routes


if __name__ == "__main__":
    app.run()