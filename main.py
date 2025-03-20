from flask import Flask
from flask_cors import CORS
from app.routes.user_routes import user_bp
from app.routes.idea_validation_routes import idea_validation_bp

app = Flask(__name__)
app.register_blueprint(user_bp)
app.register_blueprint(idea_validation_bp)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1001, debug=True)