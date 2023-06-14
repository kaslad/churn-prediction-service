# Importing dependencies
from flask import Flask, send_file
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import shap
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from tpot import TPOTClassifier, TPOTRegressor
import numpy as np
import pandas as pd
import dask, dask_ml
import dill
import io
import matplotlib
matplotlib.use('Agg')  # Set the backend to Agg
from sklearn import inspection
import matplotlib.pyplot as plt

from .parsers import data_parser, data_parser2, args_parser
from .models import write_model_to_db, read_model_from_db, read_models_from_db, deserialize_model
from .utils import preprocess, preprocess_categorial


class Predict(Resource):
    def post(self):
        # Retrieve the serialized model from the database
        serialized_model = read_model_from_db()

        # Deserialize the model
        model = deserialize_model(serialized_model)

        # Read the data for prediction
        print("parsed")
        data_args = data_parser2.parse_args()
        df = pd.io.json.read_json(data_args["data"])

        features = df.drop(["is_churn"], axis=1)
        features = preprocess_categorial(features)
        features = preprocess(features)
        # features = df.to_numpy().astype(np.float64)
        print("parsed features")

        # Make predictions using the model
        predictions = model.predict(features)

        print(predictions)
        # Create a CSV string with predictions
        csv_data = "prediction\n" + "\n".join(map(str, predictions))

        # Set the response headers to indicate a CSV file
        headers = {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=predictions.csv",
        }

        print("feature importances")

        # Return the CSV data as a response
        return csv_data, 200, headers

class SetupTrainTPOT(Resource):

    def post(self):
        data_args = data_parser.parse_args()
        config_args = args_parser.parse_args()

        # Defining the argument keys that may be None
        none_keys = [
            "generations",
            "offspring_size",
            "max_time_mins",
            "random_state",
            "config_dict",
            "template",
            "n_jobs",
            "early_stop",
        ]

        # Defining numeric argument kays that may be None
        numeric_none_keys = [
            "generations",
            "offspring_size",
            "max_time_mins",
            "random_state",
            "n_jobs",
            "early_stop",
        ]

        # Handling possible None values
        for key in none_keys:
            # Converting non-None numeric values from string to int
            if config_args[key] != "" and key in numeric_none_keys:
                config_args[key] = int(config_args[key])
            # Replacing string "None" to datatype None
            elif config_args[key] == "":
                config_args[key] = None

        print(config_args)
        # Choosing training mode
        if data_args["mode"] == "Classification":
            pipeline_optimizer = TPOTClassifier(**config_args)
        elif data_args["mode"] == "Regression":
            pipeline_optimizer = TPOTRegressor(**config_args)

        # Reading and preprocessing the JSON dataset
        df = pd.io.json.read_json(data_args["data"])

        print("x")
        features = df.drop(["is_churn"], axis=1)

        features = preprocess_categorial(features)
        print(features.head(3))
        features = preprocess(features)

        # features = df.drop(["is_churn"], axis=1).to_numpy().astype(np.float64)
        labels = df["is_churn"].to_numpy().astype(np.int32)

        # Fitting the optimizer
        print(features)
        pipeline_optimizer.fit(features, labels)

        # Exporting the best pipeline
        pipeline_optimizer.export("backend/static/script.py")

        serialized_model = dill.dumps(pipeline_optimizer.fitted_pipeline_)

        pipeline_optimizer2 = dill.loads(serialized_model)

        print(pipeline_optimizer2.predict(features))

        print(serialized_model)

        file_name = data_args["model_name"]
        number = 2

        print("filename")
        print(file_name)
        write_model_to_db(serialized_model, name=file_name, number=number)

        # Returning the prediction
        return {"Output": "Train sucessfyuly completed!"}, 200



class Feature_importance(Resource):
    def post(self):
        serialized_model = read_model_from_db()

        # Deserialize the model
        model = deserialize_model(serialized_model)

        # Read the data for prediction
        print("parsed")
        data_args = data_parser2.parse_args()
        df = pd.io.json.read_json(data_args["data"])

        test_dataset2 = df.drop(["is_churn"], axis=1)

        test_dataset3 = df.drop(["is_churn"], axis=1)
        test_dataset4 = preprocess_categorial(test_dataset3)

        # Access the target variable column for permutation importance
        target_variable = test_dataset4.iloc[:, -1]

        test_dataset = preprocess(test_dataset4)
        # Calculate feature importances and create the plot
        shap_values = None  # Initialize the variable

        # Get the final model from TPOT
        final_model = model

        feature_names = test_dataset4.columns
        print("test2")
        print(test_dataset2)
        print("test1")
        print(test_dataset)

        # Check if the model supports feature importances
        if hasattr(final_model, 'feature_importances_'):
            # Extract feature importances
            feature_importances = final_model.feature_importances_

            # Print or visualize the feature importances
            if feature_importances is not None:
                print("Feature Importances:")
                for feature_name, importance in zip(feature_names, feature_importances):
                    print(f"{feature_name}: {importance}")
                # Create a bar plot to visualize the feature importances
                plt.barh(range(len(feature_names)), feature_importances)
                plt.yticks(range(len(feature_names)), feature_names)
                plt.xlabel("Feature Importance")
                plt.ylabel("Feature")
                plt.title("Feature Importances")
                plt.show()

        else:
            print("Feature importances not available for this model.")

            if isinstance(final_model, RandomForestClassifier):
                # For RandomForestClassifier, extract feature importances using `shap`
                explainer = shap.Explainer(final_model)
                shap_values = explainer(test_dataset)

                # Plot SHAP summary plot
                shap.summary_plot(shap_values, test_dataset, feature_names=feature_names)

            else:
                # Calculate feature importances using permutation importance
                result = inspection.permutation_importance(final_model, test_dataset, target_variable, n_repeats=10)
                feature_importances = result.importances_mean

                # Print or visualize the feature importances
                if feature_importances is not None:
                    print("Feature Importances:")

                    # Sort the feature importances based on absolute importance
                    sorted_feature_importances = sorted(zip(feature_names, feature_importances),
                                                        key=lambda x: abs(x[1]), reverse=False)

                    # Extract the feature names and importances in the sorted order
                    sorted_feature_names = [feature_name for feature_name, _ in sorted_feature_importances]
                    sorted_importances = [importance for _, importance in sorted_feature_importances]

                    # Create a bar plot
                    plt.figure(figsize=(12, 8))  # Increase the figure size for better readability
                    plt.barh(range(len(sorted_feature_names)), sorted_importances, align='center')

                    # Customize the plot
                    plt.yticks(range(len(sorted_feature_names)), sorted_feature_names)
                    plt.xlabel('Feature Importance')
                    plt.ylabel('Feature')
                    plt.title('Feature Importances (Sorted by Absolute Importance)')

                    # Show the plot
                    plt.tight_layout()

        print("plot")
        # Save the plot to a BytesIO object
        img_bytes = io.BytesIO()
        plt.savefig(img_bytes, format='png')
        plt.close()

        # Reset the BytesIO object for reading
        img_bytes.seek(0)

        # Return the plot as a file to the client
        return send_file(img_bytes, mimetype='image/png')

class Models(Resource):
    def get(self):
        model_list = read_models_from_db()
        return model_list, 200