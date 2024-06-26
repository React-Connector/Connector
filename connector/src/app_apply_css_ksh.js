import React from "react";
import QnaStorage from "./model/QnaStorage_ksh";

import style from "./css/app.css";

// QnA 데이터를 저장하는 저장소
const qnaStorage = new QnaStorage();

function App(props) {
    /**
     * qnaList - localStorage에 저장되어 있는 질답 게시글 객체의 배열
     * qnaTagList - qnaList에 존재하는 질답 게시글들의 태그들을 모두 모아놓은 것
     * lastIndex - 마지막으로 확인했던 질답 게시글의 인덱스
     * --> 재렌더링 시에 마지막으로 수정/삭제했던 게시글을 펼쳐주는 역할
     */
    let qnaList, qnaTagList;
    const lastIndex = window.localStorage.getItem('lastIndex');

    /**
     * qnaList에 존재하는 태그들을 종합하는 함수
     * qnaItem은 qnaList의 요소로 model의 QuestionItem의 구조를 띔
     * qnaItem의 tags 요소는 Set(집합) 자료구조이기 때문에 순회를 위해서는 배열 구조로 변환
     * qnaItem 하위에 있는 tags 안의 태그들을 꺼내어 저장
     */

    function createQnaTagList(qnaList) {
        let qnaTagList = [];
        Array.from(qnaList).forEach(qnaItem => {
            Array.from(qnaItem.data.tags).forEach(tag => {
                qnaTagList.push(tag);
            });
        })

        return new Set(qnaTagList);
    }

    /**
     * localStorage에 qnaList가 존재하는지 확인
     */
    qnaList = window.localStorage.getItem('qnaList');
    qnaList = qnaList ? JSON.parse(qnaList) : [];
    qnaTagList = createQnaTagList(qnaList);

    const localStorage = {
        qnaList,
        qnaTagList,
        createQnaTagList,
        lastIndex
    }

    return (
        <div className="container">
            <Board localStorage={localStorage} />
        </div>
    )
}

function Board(props) {
    /**
     * list(qnaList)와 tags(qnaTagList)를 React에서 상태 관리할 수 있는 변수로 선언
     */
    const localStorage = props.localStorage;
    const [list, setList] = React.useState(localStorage.qnaList);
    const [tags, setTags] = React.useState(localStorage.qnaTagList);
    const [isNew, setIsNew] = React.useState(0);
    const [currentIndex, setCurrentIndex] = React.useState(false);

    /**
     * qnaStorage에 localStorage에 저장되어 있는 데이터를 불러와서 초기화!
     */
    qnaStorage.setList(list);
    qnaStorage.setTags(tags);

    /**
     * 게시글 작성 또는 수정할 때 모달창을 표시하는 상태 변수
     * showModal - 질문 게시글 작성/수정할 수 있는 모달을 표시
     */
    const [showModal, setShowModal] = React.useState(false);

    /**
     * 하위 컴포넌트로 넘겨줄 상태 변수들
     */
    const states = {
        currentIndex,
        setCurrentIndex,
        showModal,
        setShowModal
    }

    function setInitState() {
        setShowModal(false);
        setList(qnaStorage.list);
        setTags(localStorage.createQnaTagList(qnaStorage.list));
        setIsNew(isNew + 1);
    }

    /**
     * 글 작성 버튼을 클릭하였을 때 모달이 표시되도록 구현
     */
    const writeHandler = () => {
        if (!showModal) {
            qnaStorage.setIndexDefault();
            setCurrentIndex(-1);
            setShowModal(true);
        } else {
            window.alert('글쓰기 창이 활성화되어 있습니다! 작성 종료 후 다시 시도하세요.');
            return null;
        }
    }

    /**
     * 화면이 렌더링될 때마다 로컬 스토리지에 현재까지의 데이터를 저장
     */
    React.useEffect(() => {
        window.localStorage.setItem('qnaList', JSON.stringify(list));
        window.localStorage.setItem('qnaTagList', JSON.stringify(tags));
        window.localStorage.setItem('lastIndex', currentIndex);
    }, [isNew, list, tags, currentIndex]);

    return (
        <div className="board">
            {
                /**
                 * 모달창을 띄운 상태인지 확인하여, 모달창이 활성화(showModal === true) 된 경우에만 보이도록 구현
                 */
                showModal ? <Modal states={states} setInitState={setInitState} /> : null
            }
            <div className="board-title">
                <h1>Connector</h1>
                <h2>개발자 QnA 게시판</h2>
            </div>
            {
                /**
                 * 태그 카테고리 영역
                 * 태그를 선택하여 해당하는 태그만 조회할 수 있도록 구현
                 */
            }
            <ul className="board-tags">
                <li><button className="board-tag">All</button></li>
                {
                    Array.from(tags).map((tag) => {
                        return <li key={tag}><button className="board-tag">{tag}</button></li>
                    })
                }
            </ul>
            {
                /**
                 * 게시판 영역
                 */
            }
            <div className="board-area">
                <button className="board-button" id="write" onClick={writeHandler}>글쓰기</button>
                <table className="board-table">
                    <tbody>
                        {
                            /**
                             * qnaStorage에 있는 질문 게시글을 모두 꺼내와 표시
                             */
                            qnaStorage.list.map((item, index) => {
                                return <Post key={index} index={index} item={item} states={states} setInitState={setInitState} />
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function Post(props) {
    const [item, index] = [props.item, props.index];
    const [states, setInitState] = [props.states, props.setInitState];
    /**
    * 게시글을 선택했을 때 해당 게시글의 상세 내용을 보여주도록 하는 상태 변수들
    * showItem - 게시글의 상세 내용을 표시할 것인지 아닌지를 불린 값으로 저장하는 변수
    */
    const [showItem, setShowItem] = React.useState(false);
    /**
     * 질문 게시글을 처리하는 핸들러 함수
     */
    const readHandler = (index) => {
        if (index !== states.currentIndex) {
            qnaStorage.setCurrentIndex(index);
            states.setCurrentIndex(index);
            setShowItem(true);
        } else {
            qnaStorage.setCurrentIndex(-1);
            states.setCurrentIndex(-1);
            setShowItem(false);
        }
    }
    return (
        <>
            <tr className={`post ${index === states.currentIndex && 'clicked'}`} onClick={() => { readHandler(index); }}>
                <td className="post-item">
                    <div>
                        <p>{item.data.title}</p>
                        <p className="post-text">{item.createdDate}</p>
                        <p className="post-tags">
                            {
                                Array.from(item.data.tags).map((tag) => {
                                    return <span className="post-tag" key={tag}>{tag}</span>
                                })
                            }
                        </p>
                    </div>
                    <div className="post-reply">
                        <p className="post-reply-text">답변</p>
                        <p className="post-reply-size">{item.answerList.length}</p>
                    </div>
                </td >
            </tr >
            {
                showItem && states.currentIndex === props.index && <PostItem item={item} index={index} states={states} setInitState={setInitState} />
            }
        </>
    )
}

function PostItem(props) {
    const [item, index] = [props.item, props.index];
    const [states, setInitState] = [props.states, props.setInitState];
    /**
     * 질문 게시글 하위에 존재하는 답변 게시글에 전달해줄 상태 변수 데이터
     * 기존의 상태 변수 객체에서 questionIndex라고 하는 질문 게시글의 index값을 넘겨줌(종속성 부여)
     */
    const newStates = {
        ...states,
        'questionIndex': index
    }

    const updateHandler = (index) => {
        if (!states.showModal) {
            qnaStorage.setCurrentIndex(index);
            states.setShowModal(true);
        } else {
            window.alert('글쓰기 창이 활성화되어 있습니다! 작성 종료 후 다시 시도하세요.');
            return null;
        }
    }

    /**
     * prompt를 통해 입력받은 값과 게시글의 비밀번호 값을 비교
     * 비교 값이 참일 경우 수정 가능
     */
    const editPasswordCheckHandler = (index) => {
        if (!states.showModal) {
            const bbsPassword = prompt('비밀번호를 입력하세요.');

            if (bbsPassword === null) {
                return;
            }

            qnaStorage.setCurrentIndex(index);
            const currentItem = qnaStorage.getItem();
            const { password } = currentItem.data;

            if (bbsPassword === password) {
                updateHandler();
            } else {
                window.alert('비밀번호가 다릅니다!');
            }
        } else {
            window.alert('글쓰기 창이 활성화되어 있습니다! 작성 종료 후 다시 시도하세요.');
            return null;
        }
    }

    /**
     * prompt를 통해 입력받은 값과 게시글의 비밀번호 값을 비교
     * 비교 값이 참일 경우 삭제 가능
     */
    const deletePasswordCheckHandler = (index) => {
        if (!states.showModal) {
            const bbsPassword = prompt('비밀번호를 입력하세요.');

            if (bbsPassword === null) {
                return;
            }

            qnaStorage.setCurrentIndex(index);
            const currentItem = qnaStorage.getItem();
            const { password } = currentItem.data;

            if (bbsPassword === password) {
                deleteHandler();
            } else {
                window.alert('비밀번호가 다릅니다!');
            }
        } else {
            window.alert('글쓰기 창이 활성화되어 있습니다! 작성 종료 후 다시 시도하세요.');
            return null;
        }
    }

    const deleteHandler = (index) => {
        qnaStorage.setCurrentIndex(index);
        if (window.confirm('게시글을 삭제하시겠습니까?')) {
            let result;
            result = qnaStorage.deleteQuestion() ? '게시글이 삭제되었습니다.' : '게시글이 삭제되지 않았습니다.';
            window.window.alert(result);
        } else {
            qnaStorage.setIndexDefault();
        }
        setInitState();
    }

    return (
        <tr>
            <td>
                <div className="post-details">
                    <h3 className="post-title">{item.data.title}</h3>
                    <div className="post-dates">
                        <span className="post-text">작성: {item.createdDate}</span>
                        <span className="post-text">최종 수정: {item.modifiedDate}</span>
                    </div>
                    {item.data.code.length > 0 && <pre className="post-contents post-code">{item.data.code}</pre>}
                    <pre className="post-contents">{item.data.contents}</pre>
                    <div className="post-tags">
                        {
                            Array.from(item.data.tags).map((tag) => {
                                return <button className="board-tag" key={tag}>{tag}</button>
                            })
                        }
                    </div>
                    <div className="post-buttons">
                        <button className="board-button" onClick={() => { editPasswordCheckHandler(index) }}>수정하기</button>
                        <button className="board-button" onClick={() => { deletePasswordCheckHandler(index) }}>삭제하기</button>
                    </div>
                </div>
                <Reply states={newStates} setInitState={setInitState} />
            </td>
        </tr>
    )
}

function Reply(props) {
    const [states, setInitState] = [props.states, props.setInitState];
    const [currentReply, setCurrentReply] = React.useState(-1);

    const newStates = {
        ...states,
        currentReply,
        setCurrentReply
    }

    qnaStorage.setCurrentIndex(states.questionIndex);
    const currentItem = qnaStorage.getItem();

    /**
     * contents --> 답변 작성을 위해 사용하는 상태 변수
     * changeHandler --> textarea 값이 바뀔 때마다 contents 값을 변경하는 변수
     * password 추가
     */
    const [contents, setContents] = React.useState('');
    const [password, setPassword] = React.useState('');

    const changeHandler = (event) => {
        switch (event.target.title) {
            case 'contents':
                setContents(event.target.value);
                break;
            case 'password':
                setPassword(event.target.value.trim());
                break;
        }
    }

    const writeHandler = (event) => {
        if (contents.trim() === '') {
            window.alert('답변과 비밀번호를 정확히 입력하세요!');
            return null;
        }
        let result = qnaStorage.createAnswer({ contents, password });
        switch (result) {
            case false:
                window.alert('답변이 등록되지 않았습니다.');
                return null;
            default:
                window.alert('답변이 등록되었습니다.');
        }
        setContents('');
        setPassword('');
        setInitState();
    }

    return (
        <div className="post-details">
            <div className="answer-textarea">
                <textarea title="contents" placeholder="답변을 작성하세요." value={contents} onChange={changeHandler}></textarea>
                <input type="password" title="password" value={password}
                    onChange={changeHandler} placeholder="비밀번호를 입력하세요." />
                <button className="board-button" onClick={writeHandler}>등록하기</button>
            </div>
            {
                currentItem.answerList.map((item, index) => {
                    return <ReplyItem item={item} index={index} states={newStates} setInitState={setInitState} />
                })
            }
        </div>
    )
}

function ReplyItem(props) {
    const [item, index] = [props.item, props.index];
    const [states, setInitState] = [props.states, props.setInitState];

    const [contents, setContents] = React.useState(item.data.contents);
    const [showTextarea, setShowTextarea] = React.useState(false);
    const [answerPassword, setAnswerPassword] = React.useState(item.data.password);

    function isCurrentItem() {
        return showTextarea && index === states.currentReply;
    }

    const changeHandler = (event) => {
        setContents(event.target.value);
    }

    /**
     * prompt를 통해 입력받은 값과 답변 게시글의 비밀번호 비교 값을 반환
     */
    const passwordCheckHandler = (index) => {
        if (!states.showModal) {
            // 사용자에게 비밀번호 입력 요청
            const checkPassword = prompt('비밀번호를 입력하세요.');

            // 사용자가 취소 버튼을 클릭시
            if (checkPassword === null) {
                return;
            }

            // 현재 댓글의 데이터 반환
            qnaStorage.setCurrentIndex(index);
            const currentItem = qnaStorage.getItem();

            // 답변 게시글 비밀번호 반환
            const selectedAnswer = currentItem.answerList[index];
            const password = selectedAnswer.data.password;

            if (checkPassword === password) {
                return true;
            } else {
                window.alert('비밀번호가 다릅니다!');
                return false;
            }
        } else {
            window.alert('답변 작성 중에는 다른 작업을 할 수 없습니다. 작성을 완료하거나 취소한 후 다시 시도하세요.');
            return null;
        }
    }

    /**
     * 비밀번호 값을 비교하여 얻은 값을 통해 실행 여부
     */
    const clickHandler = (index) => {
        const confirmed = passwordCheckHandler(index);
        if (confirmed) {
            states.setCurrentReply(index);
            setShowTextarea(true);
        }
    }

    const updateHandler = (index) => {
        const result = qnaStorage.updateAnswer({ contents, password: answerPassword }, index);
        const resultText = result ? '답변이 수정되었습니다.' : '답변이 수정되지 않았습니다.';
        window.alert(resultText);
        setShowTextarea(false);
        setInitState();
    }

    /**
     * 비밀번호 값을 비교하여 얻은 값을 통해 실행 여부
     */
    const deleteHandler = (index) => {
        const confirmed = passwordCheckHandler(index);
        if (confirmed) {
            if (window.confirm('게시글을 삭제하시겠습니까?')) {
                const result = qnaStorage.deleteAnswer(index);
                const resultText = result ? '답변이 삭제되었습니다.' : '답변이 삭제되지 않았습니다.';
                window.alert(resultText);
                setInitState();
            } else {
                qnaStorage.setIndexDefault();
            }
        }
    }

    return (
        <div className="answer-item">
            <span>{index + 1}</span>
            {
                /**
                 * showTextArea === true
                 * (현재 상태가 수정모드인 경우, textarea를 보이도록 구현)
                 */
                isCurrentItem() ?
                    <textarea className="post-contents" title="contents" onChange={changeHandler} value={contents}></textarea>
                    :
                    <pre className="post-contents">{item.data.contents}</pre>
            }
            <div className="post-dates">
                <span className="post-text">작성: {item.createdDate}</span>
                <span className="post-text">최종 수정: {item.modifiedDate}</span>
            </div>
            <div className="post-buttons">
                <button className="board-button" onClick={() => {
                    if (isCurrentItem()) {
                        updateHandler(index);
                    } else {
                        clickHandler(index);
                    }
                }}>수정하기</button>
                <button className="board-button" onClick={() => {
                    if (isCurrentItem()) {
                        setShowTextarea(false);
                    } else {
                        deleteHandler(index);
                    }
                }}>{isCurrentItem() ? '취소하기' : '삭제하기'}</button>
            </div>
        </div>
    )
}

function Modal(props) {
    const [states, setInitState] = [props.states, props.setInitState];
    /**
     * [ currentItem ]
     * 현재 currentIndex가 설정된 경우, qnaStorage가 가리키고 있는 list의 배열 값
     * currentItem이 null인 건 currentIndex가 -1, 현재 가리키고 있는 값이 없음을 의미 
     * 즉 게시글을 새로 작성하는 것을 뜻함
     */
    const currentItem = qnaStorage.getItem();
    /**
     * 제목 title, 소스코드 code, 내용 contents, 태그 tags
     * 비밀번호 password 추가
     */
    const [title, setTitle] = React.useState(currentItem ? currentItem.data.title : '');
    const [code, setCode] = React.useState(currentItem ? currentItem.data.code : '');
    const [contents, setContents] = React.useState(currentItem ? currentItem.data.contents : '');
    const [password, setPassword] = React.useState(currentItem ? currentItem.data.password : '');
    const [tags, setTags] = React.useState(currentItem ? Array.from(currentItem.data.tags).join() : '');

    function initStates() {
        setTitle('');
        setContents('');
        setCode('');
        setPassword('');
        setTags('');
    }

    /**
     * [createTags]
     * 문자열로 작성된 태그(tags)를 배열 형태로 반환하는 함수
     * String.prototype.split(seperator, limit);
     */
    function createTags(tags) {
        let newTags = tags.split([',']);
        for (const i in newTags) {
            newTags[i] = newTags[i].trim();
        }
        return Array.from(new Set(newTags));
    }

    const changeHandler = (event) => {
        switch (event.target.title) {
            case 'title':
                setTitle(event.target.value);
                break;
            case 'contents':
                setContents(event.target.value);
                break;
            case 'password':
                setPassword(event.target.value.trim());
                break;
            case 'tags':
                setTags(event.target.value);
                break;
            default:
                setCode(event.target.value);
        }
    }

    /**
     * [confirmHandler]
     * 게시글 작성 완료 버튼을 눌렀을 때,
     * 새로운 데이터 값을 qnaStorage에 저장(write)하거나
     * 기존의 데이터 값을 변경(update)할 때 데이터를 처리하는 것을 담당
     */
    const confirmHandler = () => {
        const newTags = createTags(tags);
        const newItem = {
            title,
            code,
            contents,
            password,
            'tags': newTags
        }

        if (title === '' || contents === '' || password === '' || newTags.length < 1) {
            return null;
        }

        let result, resultText;
        if (currentItem) {
            result = qnaStorage.updateQuestion(newItem);
            resultText = result ? '게시글이 수정되었습니다.' : '게시글이 수정되지 않았습니다.';
        } else {
            result = qnaStorage.createQuestion(newItem);
            resultText = result ? '게시글이 등록되었습니다.' : '게시글이 등록되지 않았습니다.';
        }

        window.alert(resultText);
        setInitState();
    }

    const cancleHandler = () => {
        initStates();
        qnaStorage.setIndexDefault();
        states.setShowModal(false);
    }

    return (
        <dialog open className="modal">
            <input type="text" title="title" value={title}
                onChange={changeHandler} placeholder="제목" />
            <textarea className="post-contents post-code" title="code" value={code}
                onChange={changeHandler} placeholder="소스코드"></textarea>
            <textarea className="post-contents" title="contents" value={contents}
                onChange={changeHandler} placeholder="게시글 내용"></textarea>
            {/* 게시글 작성시만 비밀번호 입력 가능 */}
            {!currentItem && (
                <input type="password" title="password" value={password}
                    onChange={changeHandler} placeholder="비밀번호를 입력하세요." />
            )}
            <input type="text" title="tags" value={tags}
                onChange={changeHandler} placeholder="태그: 콤마(,)로 구분하여 작성하세요." />
            <div className="modal-buttons">
                <button className="board-button" onClick={confirmHandler}>등록하기</button>
                <button className="board-button" onClick={cancleHandler}>취소하기</button>
            </div>
        </dialog>
    )
}

export default App;