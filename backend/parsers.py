from flask_restful import reqparse

# Parser for ModelListResource
model_list_parser = reqparse.RequestParser()
model_list_parser.add_argument('csv_file', type=str, required=True, help='You need to provide a CSV file path')
model_list_parser.add_argument('target', type=str, required=True, help='You need to provide a target column name')
model_list_parser.add_argument('model_name', type=str, required=True, help='You need to provide a model name')
model_list_parser.add_argument('model_number', type=float, help='You can provide a model number')

# Parser for ModelResource
model_resource_parser = reqparse.RequestParser()
model_resource_parser.add_argument('data', type=str, required=True, help='You need to provide the data for the model')

# Parser for ModelPredictResource
model_predict_parser = reqparse.RequestParser()
model_predict_parser.add_argument('data', type=str, required=True, help='You need to provide the data for the model')
model_predict_parser.add_argument('model_id', type=int, required=True, help='You need to provide the model id')

# Additional parsers
data_parser2 = reqparse.RequestParser()
data_parser2.add_argument('data', type=str, required=True)

# Data arguments
data_parser = reqparse.RequestParser()
data_parser.add_argument('data', type=str, help="Data to be used for training", required=True)
data_parser.add_argument('mode', type=str, help="Mode of training (classification or regression)", required=True)
data_parser.add_argument('model_name', type=str, help="Naming")

# TPOT arguments
args_parser = reqparse.RequestParser()
args_parser.add_argument('generations', type=str, help="Number of generations for training")
args_parser.add_argument('population_size', type=int, help="Number of individuals to be retained every generation")
args_parser.add_argument('offspring_size', type=str, help="Number of individuals to produce every generation")
args_parser.add_argument('mutation_rate', type=float, help="How many pipelines to randomly change")
args_parser.add_argument('crossover_rate', type=float, help="How many pipelines to randomly breed")
args_parser.add_argument('scoring', type=str, help="String name of a scikit-learn scoring function")
args_parser.add_argument('cv', type=int, help="Number of cross-validation folds")
args_parser.add_argument('subsample', type=float, help="Fraction of training samples to be used in optimization")
args_parser.add_argument('n_jobs', type=int, help="Number of processes to use")
args_parser.add_argument('max_time_mins', type=str, help="How many minutes TPOT has to optimize")
args_parser.add_argument('max_eval_time_mins', type=float, help="How many minutes TPOT has to evaluate a single pipeline")
args_parser.add_argument('random_state', type=str, help="The seed for the pseudo-random number generator used in TPOT")
args_parser.add_argument('config_dict', type=str, help="The name of the TPOT config to be used")
args_parser.add_argument('template', type=str, help="The pipeline template to be observed by TPOT")
args_parser.add_argument('warm_start', type=bool, help="Whether or not to reuse populations from previous evaluations")
args_parser.add_argument('use_dask', type=bool, help="Whether or not to use Dask for parallel training")
args_parser.add_argument('early_stop', type=str, help="Number of generations TPOT tolerates no improvements")
args_parser.add_argument('verbosity', type=int, help="How much information TPOT displays while training")
args_parser.add_argument('log_file', type=str, default="backend/static/logs.txt", help="Directory for logging")