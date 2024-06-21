import React from "react";


function WriteButton(props){
    let dialogElem = React.useRef('');
    let titleElem = React.useRef('');
    let codeElem = React.useRef('');
    let textElem = React.useRef('');
    let Question = props.Question;
    let questionArray = props.questionArray;
    let setQuestionArray = props.setQuestionArray;
    

    const submitHandler = () => {
    questionArray.push(new Question(titleElem.current.value,codeElem.current.value, textElem.current.value, Question));
    setQuestionArray(questionArray);
    window.localStorage.setItem('questionStorage',JSON.stringify(questionArray));
    dialogElem.current.open='';
 }    

    return(
        <>
        <button onClick={() => dialogElem.current.open='open'}>글쓰기</button> 

        <dialog id="writeDialog" ref={dialogElem} open=''>
            <label>제목 <input ref={titleElem} placeholder="제목을 입력해주세요."/></label>
            <hr />
            <textarea placeholder="Code" ref={codeElem}></textarea>
            <br />
            <input placeholder="게시글을 300자 이내로 작성해 주세요" ref={textElem}/>
            <hr />
            <button onClick={submitHandler}>작성</button>
            <button onClick={() => dialogElem.current.open=''}>취소</button>
            
        </dialog>
        
        </>
    )
}

export default WriteButton;