from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from resources import SetupTrainTPOT, Predict, Feature_importance, Models

app = Flask(import_name=__name__)
CORS(app)
api = Api(app=app)

api.add_resource(SetupTrainTPOT, "/setup-train-tpot")
api.add_resource(Predict, "/predict")
api.add_resource(Feature_importance, "/feature_importance_plot")
api.add_resource(Models, "/models")

if __name__ == "__main__":
    import os
    app.run()