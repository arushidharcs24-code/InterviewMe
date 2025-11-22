import React from 'react';
import ReactDOM from 'react-dom/client'; // <-- Still often works, but less precise
import "./index.css";
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <App />
  </React.StrictMode>
);