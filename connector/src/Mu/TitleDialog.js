import React from "react";
import CommentList from "./CommentList";
function TitleDialog(props){

    const updateHandler = () => {
        props.dialogElem.current.open=''
    }
    const deleteHandler = () => {
        if(window.confirm(`삭제하시겠습니까?`)){
            props.dialogElem.current.open=''
            }
        
    }

    return(
        <dialog ref={props.dialogElem} open=''>
            <p>제목 | 날짜</p>
            <hr />
            <div>
                <textarea>코드</textarea>
                <p>내용</p>
            </div>
            <button onClick={updateHandler}>수정</button>
            <button onClick={deleteHandler}>삭제</button>
            <hr />
            
            <input placeholder="답변을 입력해주세요." />
            
            <button>입력</button>
            <hr />
            <ol>
                <li>답변1</li>
            </ol>
      
        </dialog>
    )
}

export default TitleDialog;