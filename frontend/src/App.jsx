import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Review from './Components/Dashboard';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/callback" element={<Review />} />
        </Routes>
    </Router>
);

export default App;
