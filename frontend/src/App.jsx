import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Review from './Components/Dashboard';
import Privacy from './Components/Privacy';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/callback" element={<Review />} />
            <Route path="/privacy-policy" element={<Privacy/>} />
        </Routes>
    </Router>
);

export default App;
