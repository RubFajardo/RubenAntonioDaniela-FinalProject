from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('user_api', __name__)

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

    if not body.get("secret_question"):
        return jsonify({"error": "Debe incluir una pregunta secreta"}), 400

    if not body.get("question_answer"):
        return jsonify({"error": "Debe incluir la respuesta de su pregunta"}), 400

    coded_password = bcrypt.hashpw(body["password"].encode(), bcrypt.gensalt())
    coded_question_answer = bcrypt.hashpw(
        body["question_answer"].encode(), bcrypt.gensalt())

    new_user = User()
    new_user.name = body["name"]
    new_user.email = body["email"]
    new_user.password = coded_password.decode()
    new_user.is_active = True
    new_user.secret_question = body["secret_question"]
    new_user.question_answer = coded_question_answer.decode()
    new_user.profile_pic = body["profile_pic"]
    new_user.chest_pr = body["chest_pr"]
    new_user.back_pr = body["back_pr"]
    new_user.legs_pr = body["legs_pr"]
    new_user.arms_pr = body["arms_pr"]

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

    if not bcrypt.checkpw(body["password"].encode(), user.password.encode()):
        return jsonify("contraseña incorrecta"), 401

    access_token = create_access_token(identity=str(user_data["id"]))
    return jsonify({"token": access_token, "user": user_data}), 200


@api.route("/edit_profile", methods=["PUT"])
@jwt_required()
def edit_profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    body = request.get_json()

    user.profile_pic = body["profile_pic"]

    db.session.commit()
    return jsonify(user.serialize()), 200

@api.route("/editPR/chest_pr", methods=["PUT"])
@jwt_required()
def edit_PR_chest():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    body = request.get_json()

    user.chest_pr = body["chest_pr"]

    db.session.commit()
    return jsonify(user.serialize()), 200

@api.route("/editPR/back_pr", methods=["PUT"])
@jwt_required()
def edit_PR_back():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    body = request.get_json()

    user.back_pr = body["back_pr"]

    db.session.commit()
    return jsonify(user.serialize()), 200

@api.route("/editPR/legs_pr", methods=["PUT"])
@jwt_required()
def edit_PR_legs():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    body = request.get_json()

    user.legs_pr = body["legs_pr"]

    db.session.commit()
    return jsonify(user.serialize()), 200

@api.route("/editPR/arms_pr", methods=["PUT"])
@jwt_required()
def edit_PR_arms():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    body = request.get_json()

    user.arms_pr = body["arms_pr"]

    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route("/delete_user/", methods=["DELETE"])
@jwt_required()
def delete_user():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Usuario eliminado"}), 200


@api.route("/recover/email", methods=["POST"])
def recovery_find_email():

    body = request.get_json()
    if not body.get("email") or "@" not in body["email"]:
        return jsonify({"error": "email no valido"}), 400

    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        return jsonify({"error": "usuario no encontrado"}), 404

    user_data = user.serialize()

    return jsonify({"user": user_data}), 200


@api.route("/recover/verify", methods=["POST"])
def recovery_verify_answer():

    body = request.get_json()
    if not body.get("email") or "@" not in body["email"]:
        return jsonify({"error": "email no valido"}), 400
    if not body.get("question_answer"):
        return jsonify({"error": "Necesita enviar una respuesta"}), 400

    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        return jsonify("usuario no encontrado"), 404

    if bcrypt.checkpw(body["question_answer"].encode(), user.question_answer.encode()):
        return jsonify("Respuesta correcta"), 200

    return jsonify({"message": "respuesta incorrecta"}), 401


@api.route("/recover/reset-password", methods=["PUT"])
def recovery_update_password():

    body = request.get_json()
    if not body.get("email") or "@" not in body["email"]:
        return jsonify({"error": "email no valido"}), 400
    if not body.get("new_password"):
        return jsonify({"error": "la contraseña no puede estar vacia"}), 400

    user = User.query.filter_by(email=body["email"]).first()
    coded_new_password = bcrypt.hashpw(
        body["new_password"].encode(), bcrypt.gensalt())
    if user is None:
        return jsonify("usuario no encontrado"), 404

    user.password = coded_new_password.decode()

    try:
        db.session.commit()
        return jsonify({"success": True, "message": "Contraseña actualizada exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": "Error al actualizar la contraseña"}), 500
