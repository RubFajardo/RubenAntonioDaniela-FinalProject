from flask import request, jsonify, Blueprint
from api.models import db, Daily, Habit, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

api = Blueprint('daily_api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/daily_habits/<string:date>", methods=["POST"])
@jwt_required()
def new_daily(date):
    current_user_id = get_jwt_identity()
    body = request.get_json()

    target_date = datetime.strptime(date, "%Y-%m-%d").date()

    existing_daily = Daily.query.filter_by(user_id=current_user_id, date=target_date).first()
    if existing_daily: 
        return jsonify({"message": "Ya existe un registro para esta fecha"}), 400
    
    new_daily = Daily(user_id=current_user_id, date=target_date)

    db.session.add(new_daily)
    db.session.flush()

    habits = body.get("habits", {})

    habit = Habit(
        daily_id=new_daily.id,
        entreno=habits["entreno"],
        ejercicio=habits["ejercicio"],
        sueño=habits["sueño"],
        calorias=habits["calorias"],
        proteinas=habits["proteinas"],
        breakfast=habits["breakfast"],
        lunch=habits["lunch"],
        dinner=habits["dinner"],
    )
        
    db.session.add(habit)
    db.session.commit()

    return jsonify({"message": "nuevo registro creado"}), 200

@api.route("/daily_habits/<string:date>", methods=["PUT"])
@jwt_required()
def edit_habit(date):
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    target_date = datetime.strptime(date, "%Y-%m-%d").date()

    daily = Daily.query.filter_by(user_id=user.id, date=target_date).first()
    if not daily:
        return jsonify({"message": "No hay registros para esa fecha"}), 404
    
    body = request.get_json()

    habits = body.get("habits", {})
    if not habits:
        return jsonify({"message": "No se recibieron habitos para actualizar"}), 400

    habit = Habit.query.filter_by(daily_id=daily.id).first()
    if not habit:
        return jsonify({"message": "No hay habitos registrados para esta fecha"}), 404
    
    habit.entreno = habits["entreno"]
    habit.ejercicio = habits["ejercicio"]
    habit.sueño = habits["sueño"]
    habit.calorias = habits["calorias"]
    habit.proteinas = habits["proteinas"]
    habit.breakfast = habits["breakfast"]
    habit.lunch = habits["lunch"]
    habit.dinner = habits["dinner"]

    db.session.commit()

    return jsonify({"message": "Habitos actualizados"}), 200

@api.route("/daily_habits/<string:date>", methods=["GET"])
@jwt_required()
def get_daily_habits(date):
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    target_date = datetime.strptime(date, "%Y-%m-%d").date()

    daily = Daily.query.filter_by(date=target_date, user_id=user.id).first()
    if not daily:
        return jsonify({"habits": None}), 200

    habit = Habit.query.filter_by(daily_id=daily.id).first()
    if not habit:
        return jsonify({"message": "No hay hábitos registrados para esta fecha"}), 404

    return jsonify({
        "id": daily.id,
        "date": daily.date.strftime("%Y-%m-%d"),
        "habits": habit.serialize()
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

    daily_records = Daily.query.filter(Daily.user_id == user.id, Daily.date.between(start_dt, end_dt)).all()
    if not daily_records:
        return jsonify([]), 200

    result = []
    for daily in daily_records:
        habit = Habit.query.filter_by(daily_id=daily.id).first()
        habits_data = habit.serialize() if habit else None
        result.append({
            "id": daily.id,
            "date": daily.date.strftime("%Y-%m-%d"),
            "habits": habits_data
        })

    return jsonify(result), 200

@api.route("/all_habits", methods=["GET"])
@jwt_required()
def get_all_habits():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    all_records = Daily.query.filter_by(user_id=user.id).all()

    habits_list = []
    for daily_record in all_records:
        habit = Habit.query.filter_by(daily_id=daily_record.id).first()
        if habit:
            habits_list.append({
                "date": daily_record.date.isoformat(),
                "habits": habit.serialize()
            })

    return jsonify(habits_list), 200
