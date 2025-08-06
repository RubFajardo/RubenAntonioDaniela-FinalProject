from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Integer, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
import datetime

db = SQLAlchemy()

class User(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(120), nullable=False)
    secret_question: Mapped[str] = mapped_column(String(100), nullable=False)
    question_answer: Mapped[str] = mapped_column(String(100), nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    daily: Mapped[List["Daily"]] = relationship(back_populates="user")


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "secret_question": self.secret_question,
            # do not serialize the password, its a security breach
        }
    
class Daily(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    user: Mapped["User"] = relationship(back_populates="daily")

    date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    
    habits: Mapped[List["Habit"]] = relationship(back_populates="daily", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user_id,
            "date": self.date,
            "habits": [habit.serialize() for habit in self.habits]
        }
    
class Habit(db.Model):

    __tableargs__ = (
        db.CheckConstraint("calorias >= 0", name="check_calorias_positive"),
        db.CheckConstraint("proteinas >= 0", name="check_proteinas_positive")
    )
    id: Mapped[int] = mapped_column(primary_key=True)

    daily_id: Mapped[int] = mapped_column(ForeignKey("daily.id"), unique=True, nullable=False)
    daily: Mapped["Daily"] = relationship(back_populates="habits")

    entreno: Mapped[bool] = mapped_column(Boolean, nullable=True)
    ejercicio: Mapped[str] = mapped_column(String(20), nullable=False)
    sueño: Mapped[str] = mapped_column(String(20), nullable=False)
    calorias: Mapped[int] = mapped_column(Integer, nullable=False)
    proteinas: Mapped[int] = mapped_column(Integer, nullable=False)
    breakfast: Mapped[str] = mapped_column(String(50), nullable=False)
    lunch: Mapped[str] = mapped_column(String(50), nullable=False)
    dinner: Mapped[str] = mapped_column(String(50), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "daily": self.daily_id,
            "entreno": self.entreno,
            "ejercicio": self.ejercicio,
            "sueño": self.sueño,
            "calorias": self.calorias,
            "proteinas": self.proteinas,
            "breakfast": self.breakfast,
            "lunch": self.lunch,
            "dinner": self.dinner,
        }
    