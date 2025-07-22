"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/register", methods=["POST"])
def new_user():
    body = request.get_json()

    coded_password = bcrypt.hashpw(body["password"].encode(), bcrypt.gensalt())

    new_user = User()
    new_user.name = body["name"]
    new_user.email = body["email"]
    new_user.password = coded_password.decode()
    new_user.is_active = True

    db.session.add(new_user)
    db.session.commit()

    return jsonify("usuario registrado"), 200

@api.route("/login", methods=["POST"])
def login():
    body = request.get_json()

    user = User.query.filter_by(email=body["email"]).first()
    user_data = user.serialize()

    if user is None:
        return jsonify("usuario no encontrado"), 404
    
    if bcrypt.checkpw(body["password"].encode(), user.password.encode()):
        access_token = create_access_token(identity=str(user_data["id"]))
        return jsonify({"token": access_token, "user": user_data}), 200

    return jsonify("contraseña incorrecta"), 401

@api.route("/private", methods=["GET"])
@jwt_required()
def get_user():

    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    if user is None:
        return jsonify("usuario no encontrado"), 404
    return jsonify({"user": user.serialize()}), 200

