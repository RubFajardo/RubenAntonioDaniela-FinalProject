from flask import request, jsonify, Blueprint
from api.models import db, Habit
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('habits_api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/habits", methods=["POST"])
def new_habit():
    body = request.get_json()

    new_habit = Habit()
    new_habit.daily_id = body["daily_id"]
    new_habit.entreno = body["entreno"]
    new_habit.ejercicio = body["ejercicio"]
    new_habit.sueño = body["sueño"]
    new_habit.calorias = body["calorias"]
    new_habit.proteinas = body["proteinas"]

    db.session.add(new_habit)
    db.session.commit()

    return jsonify("habito creado"), 200