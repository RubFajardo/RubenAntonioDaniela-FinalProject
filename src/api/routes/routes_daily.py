from flask import request, jsonify, Blueprint
from api.models import db, Daily, Habit, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('daily_api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/daily_habits", methods=["POST"])
@jwt_required()
def new_daily():
    current_user_id = get_jwt_identity()
    body = request.get_json()

    new_daily = Daily(user_id=current_user_id, date=body["date"])

    db.session.add(new_daily)
    db.session.flush()

    for habit in body["habits"]:
        data = Habit(
            daily_id = new_daily.id,
            entreno = habit["entreno"],
            ejercicio = habit["ejercicio"],
            sueño = habit["sueño"],
            calorias = habit["calorias"],
            proteinas = habit["proteinas"],
        )
        
        db.session.add(data)

    db.session.commit()

    return jsonify({"message": "nuevo registro creado"}), 200

@api.route("/daily_habits", methods=["PUT"])
@jwt_required()
def edit_habit():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    body = request.get_json()

    daily = Daily.query.filter_by(user_id=user.id, date=body["date"]).first()
    habits_data = body.get("habits")

    for habit_data in habits_data:
        habit_id = habit_data.get("id")
        habit = Habit.query.filter_by(id=habit_id, daily_id=daily.id).first()

        if "entreno" in habit_data:
            habit.entreno = habit_data["entreno"]
        if "ejercicio" in habit_data:
            habit.ejercicio = habit_data["ejercicio"]
        if "sueño" in habit_data:
            habit.sueño = habit_data["sueño"]
        if "calorias" in habit_data:
            habit.calorias = habit_data["calorias"]
        if "proteinas" in habit_data:
            habit.proteinas = habit_data["proteinas"]
    
    db.session.commit()

    return jsonify({"message": "Habitos actualizados"}), 200

@api.route("/daily_habits", methods=["GET"])
@jwt_required()
def get_daily_habits():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    daily_habits = Daily.query.filter_by(user_id=user.id).all()

    if not daily_habits:
        return jsonify({"message": "No hay registros"}), 404

    result = []
    for daily in daily_habits:
        habits = Habit.query.filter_by(daily_id=daily.id).all()
        habits_data = [{
            "id": habit.id,
            "entreno": habit.entreno,
            "ejercicio": habit.ejercicio,
            "sueño": habit.sueño,
            "calorias": habit.calorias,
            "proteinas": habit.proteinas
        } for habit in habits]

        result.append({
            "id": daily.id,
            "date": daily.date,
            "habits": habits_data
        })

    return jsonify(result), 200
