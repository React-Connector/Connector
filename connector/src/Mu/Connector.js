import React from "react";
import Sort from "./Sort";


class Question {
    constructor(title, code, text) {
        this.title = title;
        this.code = code;
        this.text = text;
        this.datetime = '';
        this.setDatetime();
    }

    setDatetime() {
        const currDate = new Date();
        this.datetime += `${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()} `;
    }
}

class Comment {
    constructor(comment) {
        this.code = comment.code;
        this.text = comment.text;
    }
}


let num = 0;

function Connector(props) {
    const [questionArray, setQuestionArray] = React.useState(props.questionStorage);
    const [write, setWrite] = React.useState(0);
    const [isUpdate, setIsUpdate] = React.useState(false);
    let writeDialogElem = React.useRef('');
    let titleElem = React.useRef('');
    let codeElem = React.useRef('');
    let textElem = React.useRef('');



    const submitHandler = () => {
        questionArray.push(new Question(titleElem.current.value, codeElem.current.value, textElem.current.value, Question));
        setQuestionArray(questionArray);
        window.localStorage.setItem('questionStorage', JSON.stringify(questionArray));
        writeDialogElem.current.open = '';
        setWrite(write + 1);
        if (isUpdate) {
            setIsUpdate(!isUpdate);
        }
    }

    const updateHandler = (event) => {
        window.document.querySelector(`#dialog${event.target.name}`).open = '';
        writeDialogElem.current.open = 'open';
        num=event.target.name;
        setIsUpdate(!isUpdate);
        

    }

    const deleteHandler = (event) => {
        if (window.confirm(`삭제하시겠습니까?`)) {
            window.document.querySelector(`#dialog${event.target.name}`).open = '';
            questionArray.splice(event.target.name, 1)
            setQuestionArray(questionArray);
            setWrite(write + 1);
            window.localStorage.setItem('questionStorage', JSON.stringify(questionArray));

        }



    }




    return (

        <div>
            <h4>Connector</h4>

            <h3>개발자 Q&A 게시판</h3>
            <hr />


            <button onClick={() => writeDialogElem.current.open = 'open'}>글쓰기</button>

            <dialog id="writeDialog" ref={writeDialogElem} open=''>
                <label>제목 <input ref={titleElem} placeholder="제목을 입력해주세요." /></label>
                <hr />
                <textarea placeholder="Code" ref={codeElem}></textarea>
                <br />
                <input placeholder="게시글을 300자 이내로 작성해 주세요" ref={textElem} />
                <hr />
                <button onClick={submitHandler}>작성</button>
                <button onClick={() => writeDialogElem.current.open = ''}>취소</button>

            </dialog>





            <fieldset>
                <legend>게시판</legend>
                <Sort />

                <ol>
                    {questionArray.map((question, index) => {
                        return (
                            <>
                                <li key={index}><span onMouseOver={(event) => event.target.style.color = 'red'} onMouseOut={(event) => event.target.style.color = 'black'} onClick={() => window.document.querySelector(`#dialog${index}`).open = 'open'}>{question.title}</span> | {question.datetime}</li>

                                <dialog open='' id={'dialog' + index}>
                                    <p> {question.title} | {question.datetime}</p>
                                    <hr />

                                    <div>
                                        <fieldset>{question.code}</fieldset>
                                        <p>{question.text}</p>
                                    </div>

                                    <button onClick={updateHandler} name={index}>수정</button>
                                    <button onClick={deleteHandler} name={index}>삭제</button>
                                    <hr />
                                    {/* <CommentList /> */}

                                </dialog>

                            </>
                        )
                    })}
                </ol>
            </fieldset>
        </div>
    )
}

export default Connector;