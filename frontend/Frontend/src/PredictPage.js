import React, { useState, useEffect } from 'react';
import { Button, Typography, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import { config } from "./config.js";
import papa from "papaparse";

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  padding: '100px 0',
});

const FileInput = styled('input')({
  display: 'none',
});

const PredictPage = () => {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState('');
  const [featureImportanceImage, setFeatureImportanceImage] = useState('');
  const [modelList, setModelList] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    fetchModelList();
  }, []);

  const fetchModelList = async () => {
    try {
      const response = await fetch(`http://${config.api_url}:${config.api_port}/models`);
      if (!response.ok) {
        throw new Error('Error: ' + response.status);
      }
      const data = await response.json();
      setModelList(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleModelSelect = (event) => {
    setSelectedModel(event.target.value);
  };

  const handlePredictClick = async () => {
    var payload = "null";
    try {
      papa.parse(file, {
        download: false,
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          console.log(results.data);
          payload = JSON.stringify({
            data: JSON.stringify(results.data),
            model: selectedModel,
          });

          var url = `http://${config.api_url}:${config.api_port}/predict`;
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: payload,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Error: ' + response.status);
              }
              return response.json();
            })
            .then((predictionsData) => {
              const predictionsText = predictionsData;
              setPredictions(predictionsText);
              console.log("setted");
            })
            .catch((error) => {
              console.error('Error:', error);
            });

          const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

          await delay(3000);

          url = `http://${config.api_url}:${config.api_port}/feature_importance_plot`;
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: payload,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Error: ' + response.status);
              }
              return response.blob();
            })
            .then((blob) => {
              const image = URL.createObjectURL(blob);
              setFeatureImportanceImage(image);
              console.log("setted");
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        },
      });

      console.log(payload);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h5">Make Predictions</Typography>
      <div>
        <Typography>Data:</Typography>
        <FileInput type="file" onChange={handleFileChange} accept=".csv" id="file-input" />
        <label htmlFor="file-input">
          <Button component="span">Choose File</Button>
        </label>
      </div>
      <div>
        <Typography>Model:</Typography>
        <Select value={selectedModel} onChange={handleModelSelect}>
          {modelList.map((model) => (
            <MenuItem key={model.id} value={model.id}>{`${model.name} ${model.number}`}</MenuItem>
          ))}
        </Select>
      </div>
      <Button variant="contained" onClick={handlePredictClick}>Predict</Button>
      {predictions && (
        <div>
          <Typography variant="h6">Predictions:</Typography>
          <a href={`data:text/json;charset=utf-8,${encodeURIComponent(predictions)}`} download="predictions.csv">
            Download Predictions
          </a>
        </div>
      )}
      {featureImportanceImage && (
        <div>
          <Typography variant="h6">Feature Importance:</Typography>
          <img src={featureImportanceImage} alt="Feature Importance Plot" />
        </div>
      )}
    </Container>
  );
};

export default PredictPage;
