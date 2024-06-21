import React from "react";
import WriteButton from "./WriteButton";
import List from "./List";
import Sort from "./Sort";

class Question {
    constructor(title, code, text){
        this.title = title;
        this.code = code;
        this.text = text;
        this.datetime ='';
        this.setDatetime();
    }

    setDatetime() {
        const currDate = new Date();
        this.datetime += `${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()} `;
    }
}

class Comment {
    constructor(comment){
        this.code = comment.code;
        this.text = comment.text;
    }
}





function Connector(props){
   const [questionArray, setQuestionArray] = React.useState([]);

    return(

        <div>
            <h4>Connector</h4>

            <h3>개발자 Q&A 게시판</h3>
            <hr />
            <WriteButton questionArray={questionArray} setQuestionArray={setQuestionArray} Question={Question}/>
            <fieldset>
            <legend>게시판</legend> 
            <Sort />
            <List />
            </fieldset>
        </div>
    )
}

export default Connector;