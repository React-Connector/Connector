import React from 'react';
import ReactDOM from 'react-dom/client';
import Connector from './Mu/Connector';


const root = ReactDOM.createRoot(document.getElementById('root'));
let questionStorage = window.localStorage.getItem('questionStorage');
let commentStorage = window.localStorage.getItem('commentStorage');


if(!questionStorage){
  questionStorage = [];
}else{
  questionStorage = JSON.parse(questionStorage);
}


if(!commentStorage){
  commentStorage = [];
}else{
  commentStorage = JSON.parse(commentStorage);
}


root.render(
  <React.StrictMode>
  <Connector questionStorage={questionStorage} commentStorage={commentStorage}/>
  </React.StrictMode>
);
