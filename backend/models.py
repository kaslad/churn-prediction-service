import sqlite3
import dill

def write_model_to_db(serialized_model, name, number):
    conn = sqlite3.connect('churn.db')
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE IF NOT EXISTS models (id INTEGER PRIMARY KEY, model BLOB, name TEXT, number FLOAT)')
    cursor.execute('INSERT INTO models (model, name, number) VALUES (?, ?, ?)', (serialized_model, name, number))
    conn.commit()
    conn.close()

def read_model_from_db():
    conn = sqlite3.connect('churn.db')
    cursor = conn.cursor()
    cursor.execute('SELECT model FROM models')
    serialized_model = cursor.fetchmany(4)[3][0]
    conn.close()
    return serialized_model

def read_models_from_db():
    conn = sqlite3.connect('churn.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, number FROM models")
    rows = cursor.fetchall()
    model_list = [ {"id": row[0], "name": row[1], "number": row[2]} for row in rows ]
    conn.close()
    return model_list

def deserialize_model(serialized_model):
    pipeline_optimizer = dill.loads(serialized_model)
    return pipeline_optimizer
