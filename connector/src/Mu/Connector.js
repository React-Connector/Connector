import React from "react";


class Question {
    constructor(title, code, text,commArray,commentNum) {
        this.title = title;
        this.code = code;
        this.text = text;
        this.datetime = '';
        this.timer = 0;
        this.setDatetime();
        this.commArray = commArray;
        this.commentNum = commentNum;
    }

    setDatetime() {
        const currDate = new Date();
        this.datetime += `${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()} `;
        this.timer = currDate.getTime();
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

function Connector(props) {
    const [questionArray, setQuestionArray] = React.useState(props.questionStorage);
    const [commentArray, setCommentArray] = React.useState(props.commentStorage);
    const [write, setWrite] = React.useState(0);
    const [isUpdate, setIsUpdate] = React.useState(false);
    const [titleElem, setTitleElem] = React.useState('');
    const [codeElem, setCodeElem] = React.useState('');
    const [textElem, setTextElem] = React.useState('');
    const [isWrite, setIsWrite] = React.useState(false);
    const [commentCode, setCommentCode] =  React.useState('');
    let [commentText, setCommentText] = React.useState('');
    const [sortValue, setSortValue] = React.useState('recent');
    const writeDialogElem = React.useRef('');

    const [hot, setHot] = React.useState([...questionArray].sort((a,b)=>b.commentNum-a.commentNum));



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
                setIsWrite(false);
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
            window.localStorage.setItem('commentStorage', JSON.stringify(commentArray));
            questionArray[event.target.name] = new Question(questionArray[event.target.name].title, questionArray[event.target.name].code, questionArray[event.target.name].text, commentArray.filter(v=>v.index===event.target.name.toString()),commentArray.filter(v=>v.index===event.target.name.toString()).length,Question)
            setQuestionArray(questionArray);
            window.localStorage.setItem('questionStorage', JSON.stringify(questionArray));
            setCommentCode('');
            setCommentText('');
            setHot([...questionArray].sort((a,b)=>b.commentNum-a.commentNum));
            
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


    const sortArray = (event) => {
        setSortValue(event.target.value);
        if(event.target.value === 'last'){
        questionArray.sort((a,b)=> a.timer-b.timer);
        setQuestionArray(questionArray);
        }else if(event.target.value === 'recent'){
        questionArray.sort((a,b)=> b.timer-a.timer);
        setQuestionArray(questionArray);
        }else{
        questionArray.sort((a,b)=>b.commentNum-a.commentNum);
        setQuestionArray(questionArray);
        }
    }

   const ago = (time) => {
    let diff = new Date().getTime() - time;
    let diffSeconds = Math.floor(diff/1000);
    let diffMinutes = Math.floor(diff/60000);
    let diffHours = Math.floor(diff/3600000);
    let diffDays = Math.floor(diff/86400000);
    let diffMonths = Math.floor(diff/2592000000);
    let diffYears = Math.floor(diff/31104000000);

    if(diffYears > 0){
        return diffYears + '년 전';
    }else if(diffMonths > 0){
        return diffMonths + '개월 전';
    }else if(diffDays > 0){
        return diffDays + '일 전';
    }else if(diffHours > 0){
        return diffHours + '시간 전';
    }else if(diffMinutes > 0){
        return diffMinutes + '분 전';
    }else if(diffSeconds > 10){
        return diffSeconds + '초 전';
    }else{
        return '방금';
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
                }else if(isWrite){
                    alert('현재 글을 작성 중 입니다.');
                } 
                else {
                    writeDialogElem.current.open = 'open';
                    setTitleElem('');
                    setCodeElem('');
                    setTextElem('');
                    setIsWrite(true);
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
                          : <button onClick={() => { writeDialogElem.current.open = ''; setIsWrite(false)}}>취소</button>}
            </dialog>




            <fieldset>
                <legend>게시판</legend>
                <h4>Hot</h4>
                <ol>
                {hot.map((question, index) => {
                    if(index < 2){
                        return (
                            <>
                             <li><span onMouseOver={(event) => event.target.style.color = 'red'} onMouseOut={(event) => event.target.style.color = 'black'} onClick={() => isUpdate ? alert('현재 글을 수정 중 입니다.') : isWrite ? alert('현재 글을 작성 중 입니다.') : window.document.querySelector(`#hotDialog${index}`).open = 'open'}>{question.title}</span> | {ago(question.timer)} <span>comments : {question.commentNum ? question.commentNum : 0}</span></li>
                            
                             <dialog open='' id={'hotDialog' + index}>
                             <p> {question.title} | {question.datetime}  <span><button onClick={() => window.document.querySelector(`#hotDialog${index}`).open = ''}>X</button></span></p>
                                    <hr />

                                    <div>
                                        <fieldset>{question.code}</fieldset>
                                        <p>{question.text}</p>
                                    </div>
                                    
                                    <hr />
                                    <span>comments : {question.commentNum ? question.commentNum : 0}</span>
                                    {hot[index].commentNum > 0 ? <ol>
                                        {hot[index].commArray.map((comment) => {
                                            return(
                                            <li><filedset>{comment.code} | {comment.datetime}</filedset><br /><p>{comment.text}</p></li>
                                            )
                                        
                                        })}
                                        
                                    </ol>: <></>}

                             </dialog>
                            </>
                        )
                    }
                })}

                </ol>
                
                <hr/>
                <select onChange={sortArray}>
                <option value='recent'>최신 순</option>
                <option value='last'>오래된 순</option>
                <option value='comment'>댓글 순</option>
                </select>


                <ol>
                    {questionArray.map((question, index) => {
                        return (
                            <>
                                <li key={index}><span onMouseOver={(event) => event.target.style.color = 'red'} onMouseOut={(event) => event.target.style.color = 'black'} onClick={() => isUpdate ? alert('현재 글을 수정 중 입니다.') : isWrite ? alert('현재 글을 작성 중 입니다.') : window.document.querySelector(`#dialog${index}`).open = 'open'}>{question.title}</span> | {ago(question.timer)} <span>comments : {question.commentNum ? question.commentNum : 0}</span></li>

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
                                    <span>comments : {question.commentNum ? question.commentNum : 0}</span>
                                    {questionArray[index].commentNum > 0 ? <ol>
                                        {questionArray[index].commArray.map((comment) => {
                                            return(
                                            <li><filedset>{comment.code} | {comment.datetime}</filedset><br /><p>{comment.text}</p></li>
                                            )
                                        
                                        })}
                                        
                                    </ol>: <></>}
                                    

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