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
    constructor(code, text, index) {
        this.code = code;
        this.text = text;
        this.datetime = '';
        this.setDatetime();
        this.index =index;
    }
    setDatetime() {
        const currDate = new Date();
        this.datetime += `${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()} `;
    }
}


let num = 0;
let commentNum = [];
function Connector(props) {
    const [questionArray, setQuestionArray] = React.useState(props.questionStorage);
    const [commentArray, setCommentArray] = React.useState(props.commentStorage);
    const [write, setWrite] = React.useState(0);
    const [isUpdate, setIsUpdate] = React.useState(false);
    const [titleElem, setTitleElem] = React.useState('');
    const [codeElem, setCodeElem] = React.useState('');
    const [textElem, setTextElem] = React.useState('');

    const [commentCode, setCommentCode] =  React.useState('');
    let [commentText, setCommentText] = React.useState('');

    const writeDialogElem = React.useRef('');






    const submitHandler = () => {

        if (titleElem === '') {
            alert('제목을 입력해주세요.');
        } else {
            if (isUpdate) {
                questionArray[num] = new Question(titleElem, codeElem, textElem, Question);
                writeDialogElem.current.open = '';
                setIsUpdate(false);
            } else {
                questionArray.push(new Question(titleElem, codeElem, textElem, Question));
                writeDialogElem.current.open = '';
            }

            setQuestionArray(questionArray);
            window.localStorage.setItem('questionStorage', JSON.stringify(questionArray));
            setWrite(write + 1);
        }


    }

    const commentHandler = (event) => {
        if(commentText === ''){
            alert('답변을 입력해 주세요.');
        }else{
            commentArray.push(new Comment(commentCode, commentText, event.target.name, Comment));
            setCommentArray(commentArray);
            setCommentCode('');
            setCommentText('');
            window.localStorage.setItem('commentStorage', JSON.stringify(commentArray));
            setWrite(write + 1);
        }
    }



    const updateHandler = (event) => {
        window.document.querySelector(`#dialog${event.target.name}`).open = '';
        writeDialogElem.current.open = 'open';
        num = event.target.name;
        setTitleElem(questionArray[num].title);
        setCodeElem(questionArray[num].code);
        setTextElem(questionArray[num].text);
        setIsUpdate(true);
    }

    const deleteHandler = (event) => {
        if (window.confirm(`삭제하시겠습니까?`)) {
            window.document.querySelector(`#dialog${event.target.name}`).open = '';
            questionArray.splice(event.target.name, 1);
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


            <button onClick={() => {
                if (isUpdate) {
                    alert('현재 글을 수정 중 입니다.');
                } else {
                    writeDialogElem.current.open = 'open';
                    setTitleElem('');
                    setCodeElem('');
                    setTextElem('');
                }
            }
            }>글쓰기</button>



            <dialog id="writeDialog" ref={writeDialogElem} open=''>
                <label>제목 <input onChange={(event) => setTitleElem(event.target.value)} placeholder="제목을 입력해주세요." value={titleElem} /></label>
                <hr />
                <textarea placeholder="Code" onChange={(event) => setCodeElem(event.target.value)} value={codeElem}></textarea>
                <br />
                <input placeholder="게 시글을 300자 이내로 작성해 주세요" onChange={(event) => setTextElem(event.target.value)} value={textElem} />
                <hr />
                {isUpdate ? <button onClick={submitHandler}>수정</button> : <button onClick={submitHandler}>작성</button>}
                {isUpdate ? <button onClick={() => { writeDialogElem.current.open = ''; setIsUpdate(false) }}>취소</button> 
                          : <button onClick={() => { writeDialogElem.current.open = '' }}>취소</button>}
            </dialog>




            <fieldset>
                <legend>게시판</legend>
                <Sort />

                <ol>
                    {questionArray.map((question, index) => {
                        return (
                            <>
                                <li key={index}><span onMouseOver={(event) => event.target.style.color = 'red'} onMouseOut={(event) => event.target.style.color = 'black'} onClick={() => isUpdate ? alert('현재 글을 수정 중 입니다.') : window.document.querySelector(`#dialog${index}`).open = 'open'}>{question.title}</span> | {question.datetime} <span>comments : {commentNum[index]}</span></li>

                                <dialog open='' id={'dialog' + index}>
                                    <p> {question.title} | {question.datetime}  <span><button onClick={() => window.document.querySelector(`#dialog${index}`).open = ''}>X</button></span></p>
                                    <hr />

                                    <div>
                                        <fieldset>{question.code}</fieldset>
                                        <p>{question.text}</p>
                                    </div>

                                    <button onClick={updateHandler} name={index}>수정</button>
                                    <button onClick={deleteHandler} name={index}>삭제</button>
                                    <hr />
                                    <filedset>
                                    <textarea placeholder="답변 코드를 입력해주세요." onChange={(event) => setCommentCode(event.target.value)} value={commentCode}></textarea>
                                    <br />
                                    <input placeholder="답변을 입력해주세요."onChange={(event) => setCommentText(event.target.value)} value={commentText}/>
                                    </filedset>
                                    

                                    <button onClick={commentHandler} name={index}>입력</button>
                                    
                                    <hr />
                                    {commentNum[index]=commentArray.filter(v=>v.index===index.toString()).length}
                                    <ol>
                                        {commentArray.filter(v=>v.index===index.toString()).map((comment) => {
                                            return(
                                            <li><filedset>{comment.code} | {comment.datetime}</filedset><br /><p>{comment.text}</p></li>
                                            )
                                        
                                        })}
                                        
                                    </ol>

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