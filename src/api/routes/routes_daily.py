from flask import request, jsonify, Blueprint
from api.models import db, Daily, Habit, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

api = Blueprint('daily_api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/daily_habits", methods=["POST"])
@jwt_required()
def new_daily():
    current_user_id = get_jwt_identity()
    body = request.get_json()

    print(body)
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
def all_habits():
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
            "date": daily.date.strftime("%Y-%m-%d"),
            "habits": habits_data
        })

    return jsonify(result), 200

@api.route("/daily_habits/<string:date>", methods=["GET"])
@jwt_required()
def get_daily_habits(date):
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    target_date = datetime.strptime(date, "%Y-%m-%d").date()

    daily = Daily.query.filter_by(date=target_date, user_id=user.id).first()

    if not daily:
        return jsonify({"message": "Registro no encontrado"}), 404

    habits = Habit.query.filter_by(daily_id=daily.id).all()
    habits_data = [{
        "id": habit.id,
        "entreno": habit.entreno,
        "ejercicio": habit.ejercicio,
        "sueño": habit.sueño,
        "calorias": habit.calorias,
        "proteinas": habit.proteinas
    } for habit in habits]

    return jsonify({
        "id": daily.id,
        "date": daily.date.strftime("%Y-%m-%d"),
        "habits": habits_data
    }), 200

@api.route("/daily_habits/<string:start_date>/<string:end_date>", methods=["GET"])
@jwt_required()
def get_habits_range(start_date, end_date):
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    if not start_date or not end_date:
        return jsonify({"message": "Fechas de inicio y fin son requeridas"}), 400

    start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
    end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()

    if start_dt > end_dt:
        return jsonify({"message": "La fecha de inicio no puede ser posterior a la fecha de fin"}), 400

    daily_records = Daily.query.filter(
        Daily.user_id == user.id,
        Daily.date.between(start_dt, end_dt)
    ).all()

    if not daily_records:
        return jsonify({"message": "No se encontraron registros en el rango especificado"}), 404

    result = []
    for daily in daily_records:
        habits = Habit.query.filter_by(daily_id=daily.id).all()
        habits_data = [habit.serialize() for habit in habits]
        result.append({
            "id": daily.id,
            "date": daily.date.strftime("%Y-%m-%d"),
            "habits": habits_data
        })

    return jsonify(result), 200
