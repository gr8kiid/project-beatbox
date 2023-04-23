import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import './components/MusicPlayer2/musicPlayerStyles/customize-progress-bar.css';
import './components/MusicPlayer2/musicPlayerStyles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />

    </Router>
  </React.StrictMode>,
);
