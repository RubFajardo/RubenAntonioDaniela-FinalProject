from flask import request, jsonify, Blueprint
from api.models import db, Goals, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import date, timedelta

api = Blueprint('goals_api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/goals", methods=["POST"])
@jwt_required()
def new_goal():
    current_user_id = get_jwt_identity()
    body = request.get_json()

    today = date.today()
    start_of_the_week = today - timedelta(days=today.weekday())
    end_of_the_week = start_of_the_week + timedelta(days=6)

    existing_goal = Goals.query.filter(
        Goals.user_id == current_user_id,
        Goals.calorias == body["calorias"],
        Goals.proteinas == body["proteinas"],
        Goals.entrenamientos == body["entrenamientos"],
        Goals.start_date == start_of_the_week,
        Goals.end_date == end_of_the_week,
    ).first()

    if existing_goal:
        return jsonify({
            "message": "Ya hay una meta establecida para esta semana",
            "goal": existing_goal.serialize()
        }), 400
    
    new_goal = Goals(
        user_id=current_user_id,
        calorias = body["calorias"],
        proteinas = body["proteinas"],
        entrenamientos = body["entrenamientos"],
        start_date = start_of_the_week,
        end_date = end_of_the_week
    )

    db.session.add(new_goal)
    db.session.commit()

    return jsonify({
        "message": "Nueva meta creada",
        "goal": new_goal.serialize()
    }), 201


@api.route("/goals", methods=["GET"])
@jwt_required()
def get_goal():
    current_user_id = get_jwt_identity()

    today = date.today()
    start_of_the_week = today - timedelta(days=today.weekday())
    end_of_the_week = start_of_the_week + timedelta(days=6)

    goals = Goals.query.filter(
        Goals.start_date == start_of_the_week, 
        Goals.end_date == end_of_the_week, 
        Goals.user_id == current_user_id
    ).all()

    result = []
    for goal in goals:
        result.append(goal.serialize())
    
    return jsonify({"goals": result}), 200


@api.route("/goals/<int:goal_id>", methods=["PUT"])
@jwt_required()
def edit_goal(goal_id):
    current_user = get_jwt_identity()
    body = request.get_json()

    goal = Goals.query.filter_by(id = goal_id, user_id=current_user).first()
    if not goal:
        return jsonify({"message": "Meta no encontrada"}), 404
    
    if "calorias" in body:
        goal.calorias = body["calorias"]
    if "proteinas" in body:
        goal.proteinas = body["proteinas"]
    if "entrenamientos" in body:
        goal.entrenamientos = body["entrenamientos"]

    db.session.commit()

    return jsonify({"message": "Meta actualizada", "goal": goal.serialize()}), 200