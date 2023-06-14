import React from 'react';
import Navbar from './navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TrainPage from "./TrainPage.js"
import PredictPage from "./PredictPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<TrainPage />} />
        <Route path='/learn' element={<PredictPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;