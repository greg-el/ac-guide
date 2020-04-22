from flask import Flask, request
app = Flask(__name__, static_folder='../static')
app.config.from_mapping(
    DATABASE=os.path.join(app.instance_path, "ac-guide")
)
from app import routes




    
