import React from "react";
import TitleDialog from "./TitleDialog";

function List(props){
    let dialogElem = React.useRef('');
    

    return(
        <ol>
            <li><span onClick={() => dialogElem.current.open='open'}>제목</span> | 날짜</li>
            <TitleDialog dialogElem={dialogElem} />
        </ol>
    )


}

export default List;