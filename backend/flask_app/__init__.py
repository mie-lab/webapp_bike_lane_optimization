import os
from flask import Flask, request, jsonify
from flask_failsafe import failsafe
#from .utils.database.database import Database

@failsafe
def create_app():
    app = Flask(__name__)
    
    with app.app_context():
        from . import routes
        #db = Database()
        #db.create_tables(purge=True)
        
    return app

@app.route('/articles', methods=['GET'])
def get_articles():
    return jsonify({'articles': 'articles'})