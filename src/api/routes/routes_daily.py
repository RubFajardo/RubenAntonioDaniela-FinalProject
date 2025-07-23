from flask import request, jsonify, Blueprint
from api.models import db, Daily, Habit
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