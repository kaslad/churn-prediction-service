# utils.py
from sklearn.preprocessing import StandardScaler
import pandas as pd

def preprocess(df):
    scaler = StandardScaler()
    scaler.fit(df)
    norm = scaler.transform(df)
    return norm

def encode_and_bind(original_dataframe, feature_to_encode):
    dummies = pd.get_dummies(original_dataframe[[feature_to_encode]])
    res = pd.concat([original_dataframe, dummies], axis=1)
    res = res.drop([feature_to_encode], axis=1)
    return res

def preprocess_categorial(df):
    cat_types = ['bool', 'object', 'category']
    data_clean = df.copy()
    data_clean[data_clean.select_dtypes(cat_types).columns] = data_clean.select_dtypes(cat_types).apply(
        lambda x: x.astype('category'))

    features_to_encode = data_clean.select_dtypes('category').columns.to_list()
    print(features_to_encode)
    for feature in features_to_encode:
        data_clean = encode_and_bind(data_clean, feature)
    print(data_clean)
    return data_clean
