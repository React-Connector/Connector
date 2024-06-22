import React from 'react';
import ReactDOM from 'react-dom/client';
import Connector from './Mu/Connector';


const root = ReactDOM.createRoot(document.getElementById('root'));
let questionStorage = window.localStorage.getItem('questionStorage');

if(!questionStorage){
  questionStorage = [];
}else{
  questionStorage = JSON.parse(questionStorage);
}

root.render(
  <React.StrictMode>
  <Connector questionStorage={questionStorage}/>
  </React.StrictMode>
);
