from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('user_api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/register", methods=["POST"])
def new_user():
    
    body = request.get_json()

    if not body.get("name"):
        return jsonify({"error": "el nombre no puede estar vacio"}), 400

    if not body.get("email") or "@" not in body["email"]:
        return jsonify({"error": "email no valido o vacio"}), 400
    
    if User.query.filter_by(email=body["email"]).first():
        return jsonify({"error": "email ya registrado"}), 400
    
    if not body.get("password"):
        return jsonify({"error": "la contraseña no puede estar vacia"}), 400
    
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

    if not body.get("email") or "@" not in body["email"]:
        return jsonify({"error": "email no valido"}), 400
    
    if not body.get("password"):
        return jsonify({"error": "Contraseña requerida."}), 400

    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        return jsonify("usuario no encontrado"), 404
    
    user_data = user.serialize()
    
    if bcrypt.checkpw(body["password"].encode(), user.password.encode()):
        access_token = create_access_token(identity=str(user_data["id"]))
        return jsonify({"token": access_token, "user": user_data}), 200

    return jsonify("contraseña incorrecta"), 401

@api.route("/profile", methods=["GET"])
@jwt_required()
def get_user():

    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    if user is None:
        return jsonify("usuario no encontrado"), 404
    return jsonify({"user": user.serialize()}), 200

@api.route("/edit_profile", methods=["PUT"])
@jwt_required()
def edit_profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    body = request.get_json()
    if "name" in body:
        user.name = body["name"]
    if "email" in body:
        user.email = body["email"]
    if "password" in body:
        coded_password = bcrypt.hashpw(body["password"].encode(), bcrypt.gensalt())
        user.password = coded_password.decode()
    return jsonify({"message": "Datos de usuario actualizados"}), 200

@api.route("/delete_user", methods=["DELETE"])
@jwt_required()
def delete_user():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Usuario eliminado"}), 200

    

""" @api.route("/users", methods=["GET"])
def users():
    all_users = User.query.all()
    return jsonify({"users": [user.serialize() for user in all_users]}) """

