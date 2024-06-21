import React from "react";

function CommentList(props) {

    return (
        <div>
        <input placeholder="답변을 입력해주세요." />
        <button>입력</button>
        <div>
            <ol>
                <li>답변1</li>
            </ol>
        </div>
         
        </div>
    )
}

export default CommentList;
