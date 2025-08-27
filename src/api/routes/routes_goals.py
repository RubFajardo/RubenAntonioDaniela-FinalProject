from flask import request, jsonify, Blueprint
from api.models import db, Goals, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

api = Blueprint('goals_api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/goals", methods=["POST"])
@jwt_required()
def new_goal():
    current_user_id = get_jwt_identity()
    body = request.get_json()

    today = datetime.date.today()
    start_of_the_week = today - datetime.timedelta(days=today.weekday())
    end_of_the_week = start_of_the_week + datetime.timedelta(days=6)

    existing_goal = Goals.query.filter(
        Goals.user_id == current_user_id,
        Goals.type == body["type"],
        Goals.value == body["value"],
        Goals.start_date == start_of_the_week,
        Goals.end_end == end_of_the_week,
    ).first()

    if existing_goal:
        return jsonify({
            "message": "Ya hay una meta establecida para esta semana",
            "goal": existing_goal.serialize()
        }), 200
    
    new_goal = Goals(
        user_id=current_user_id,
        type = body["type"],
        value = body["value"],
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

    today = datetime.date.today()
    start_of_the_week = today - datetime.timedelta(days=today.weekday())
    end_of_the_week = start_of_the_week + datetime.timedelta(days=6)

    goals = Goals.query.filter(
        Goals.week_start == start_of_the_week, 
        Goals.week_end == end_of_the_week, 
        Goals.user_id == current_user_id
    ).all()

    if not goals:
        return jsonify({"goals": None}), 200
    
    result = [
        for goal in goals:
        result.append(goal.serialize())
    ]

    return jsonify({"goals": result}), 200

@api.route("/goals/<int:goal_id>", methods=["PUT"])
@jwt_required()
def edit_goal(goal_id):
    current_user = get_jwt_identity()
    body = request.get_json()

    goal = Goals.query.filter_by(id = goal_id, user_id=current_user_id).first()
    if not goal:
        return jsonify({"message": "Meta no encontrada"}), 404
    
    if "type" in body:
        goal.type = body["type"]
    if "value" in body:
        goal.value = body["value"]

    db.session.commit()

    return jsonify({"message": "Meta actualizada", "goal": goal.serialize()}), 200