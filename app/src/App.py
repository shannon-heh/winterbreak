
from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://shannon:ci1Qg8Jevd3Wpfsf@cluster0.z66z6.mongodb.net/Cluster0?retryWrites=true&w=majority"
mongo = PyMongo(app)
