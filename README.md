# 💻 Habits Tracker

### Monitoriza tu bienestar: Sueño, Nutrición y Ejercicio

Esta es una **aplicación web de seguimiento de hábitos saludables** diseñada para ayudar a los usuarios a monitorear y gestionar los tres pilares fundamentales de una vida saludable: **Sueño, Alimentación y Ejercicio**. Ofrece una interfaz intuitiva para registrar datos diarios y visualizar el progreso a lo largo del tiempo.

---

## 🚀 Tecnologías Clave

Este proyecto Full-Stack fue desarrollado utilizando una arquitectura moderna y robusta, incluyendo:

| Área | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Backend** | **Python** | Lógica del servidor, procesamiento de datos y gestión de la API. |
| **Base de Datos** | **PostgreSQL** | Almacenamiento persistente y eficiente de los datos de los usuarios y sus hábitos. |
| **Frontend** | **React** | Construcción de la interfaz de usuario moderna y dinámica. |
| **Styling** | **Bootstrap, CSS, HTML** | Diseño responsivo y estilizado de la aplicación. |
| **Comunicación** | **RESTful APIs** | Conexión e intercambio de datos entre el Frontend y el Backend. |
| **Seguridad** | **JWT (JSON Web Tokens)** | Sistema de autenticación seguro basado en tokens. |

---

## ✨ Características Principales

* **Seguimiento de Sueño:** Registra la calidad de sueño diario.
* **Diario de Alimentación:** Permite a los usuarios registrar ingestas y macronutrientes.
* **Registro de Ejercicio:** Monitoreo de sesiones de entrenamiento, tipo y metas.
* **Autenticación Segura:** Registro e inicio de sesión protegidos por **JWT**.
* **Diseño Responsivo:** Interfaz accesible desde cualquier dispositivo.

---

### Front-End Manual Installation:

-   Make sure you are using node version 20 and that you have already successfully installed and runned the backend.

1. Install the packages: `$ npm install`
2. Start coding! start the webpack dev server `$ npm run start`
git clone [URL-DE-TU-REPOSITORIO]
cd health-tracker-web-app

### Installation:

> If you use Github Codespaces (recommended) or Gitpod this template will already come with Python, Node and the Posgres Database installed. If you are working locally make sure to install Python 3.10, Node 

It is recomended to install the backend first, make sure you have Python 3.10, Pipenv and a database engine (Posgress recomended)

1. Install the python packages: `$ pipenv install`
2. Create a .env file based on the .env.example: `$ cp .env.example .env`
3. Install your database engine and create your database, depending on your database you have to create a DATABASE_URL variable with one of the possible values, make sure you replace the valudes with your database information:

| Engine    | DATABASE_URL                                        |
| --------- | --------------------------------------------------- |
| SQLite    | sqlite:////test.db                                  |
| MySQL     | mysql://username:password@localhost:port/example    |
| Postgress | postgres://username:password@localhost:5432/example |

4. Migrate the migrations: `$ pipenv run migrate` (skip if you have not made changes to the models on the `./src/api/models.py`)
5. Run the migrations: `$ pipenv run upgrade`
6. Run the application: `$ pipenv run start`

> Note: Codespaces users can connect to psql by typing: `psql -h localhost -U gitpod example`

### Undo a migration

You are also able to undo a migration by running

```
$ pipenv run downgrade
```
