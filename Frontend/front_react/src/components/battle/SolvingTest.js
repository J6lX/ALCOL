// import { React, useState, useMemo } from "react";
// import { RecoilRoot, atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
// import axios from "axios";
// import $ from "jquery";
// import Logo from "../../assets/alcol_empty_black.png";
// import Dots from "../../assets/dots.png";
// import CountDownTimer from "./CountDownTimer";
// import CodeMirror from "@uiw/react-codemirror";
// import { python } from "@codemirror/lang-python";
// import { java } from "@codemirror/lang-java";
// import { darcula } from "@uiw/codemirror-theme-darcula";
// import "./SolvingPage.css";
// import { Button, Modal } from "antd";
// import { userCode } from "../../states/atoms";
// import "animate.css";
// import { useTable } from "react-table";

// let allheight = window.innerHeight;

// const isClickState3 = atom({
//   key: "isClickState3",
//   default: false,
// });

// const solvingHeightState3 = atom({
//   key: "solvingHeightState3",
//   default: allheight * 0.46,
// });

// const consoleHeightState3 = atom({
//   key: "consoleHeightState3",
//   default: allheight * 0.35,
// });

// const submitMessageState3 = atom({
//   key: "submitMessageState3",
//   default: "",
// });

// const BattleNav = ({ userInfo, mode }) => {
//   // const mode = useRecoilValue(selectedMode);
//   let battlemode;
//   if (mode[0] === "speed") {
//     battlemode = "스피드";
//   } else if (mode[0] === "optimization") {
//     battlemode = "최적화";
//   }

//   console.log("배틀 모드", mode);

//   console.log("userInfosolving", userInfo);
//   return (
//     <div className="BattleNav">
//       <img src={Logo} alt="alcol_logo_black" style={{ height: "5vh", marginLeft: "20px" }} />
//       <div style={{ display: "flex", marginRight: "10vw" }}>
//         <p
//           className="NanumSquare"
//           style={{ color: "black", fontSize: "2.5vh", marginRight: "3vw" }}>
//           {battlemode}
//         </p>
//         <p className="NanumSquare" style={{ color: "black", fontSize: "2.5vh" }}>
//           {userInfo.other.nick}
//         </p>
//         <p className="NanumSquare" style={{ color: "black", fontSize: "2.5vh" }}>
//           Vs.
//         </p>
//         <p className="NanumSquare" style={{ color: "black", fontSize: "2.5vh" }}>
//           {userInfo.user.nick}
//         </p>
//       </div>
//       <div style={{ width: "200px", height: "auto" }}>
//         <CountDownTimer className="timer" />
//       </div>
//     </div>
//   );
// };

// const ExampleTable = ({ inputData, outputData }) => {
//   const columns = [
//     {
//       accessor: "input",
//       Header: "Input",
//     },
//     {
//       accessor: "output",
//       Header: "Output",
//     },
//   ];

//   const data = useMemo(
//     () => [
//       {
//         input: inputData,
//         output: outputData,
//       },
//     ],
//     [inputData, outputData]
//   );

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
//     columns,
//     data,
//   });

//   return (
//     <table {...getTableProps}>
//       <thead>
//         {headerGroups.map((headerGroup) => (
//           <tr {...headerGroup.getHeaderGroupProps()}>
//             {headerGroup.headers.map((column) => (
//               <th {...column.getHeaderProps()}>{column.render("Header")}</th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody {...getTableBodyProps()}>
//         {rows.map((row) => {
//           prepareRow(row);
//           return (
//             <tr {...row.getRowProps()}>
//               {row.cells.map((cell) => {
//                 return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
//               })}
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// };

// const Problem = () => {
//   const problem = {
//     prob_no: 2,
//     prob_name: "A-B",
//     prob_content: "두 정수 A와 B를 입력받은 다음, A-B를 출력하는 프로그램을 작성하시오.",
//     prob_input_content: "첫째 줄에 A와 B가 주어진다. (0 < A, B < 10)",
//     prob_output_content: "첫째 줄에 A-B를 출력한다.",
//     prob_time_limit: 2,
//     prob_memory_limit: 128,
//     prob_input_testcase: "3 2", //여기
//     prob_output_testcase: "1", //여기
//     prob_tier: "BRONZE4",
//   };
//   return (
//     <div style={{ border: "0.1px solid gray" }}>
//       <div style={{ width: "29.6vw", height: "7vh", border: "0.1px solid gray" }}>
//         <p
//           className="NanumSquare"
//           style={{ color: "white", fontSize: "2.5vh", fontWeight: "bold", padding: "2%" }}>
//           {problem.prob_name}
//         </p>
//       </div>
//       <div
//         className="scrollDesign"
//         style={{
//           width: "29.6vw",
//           height: "84.7vh",
//           overflowY: "scroll",
//           backgroundColor: "#1D1E22",
//         }}>
//         <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
//           문제 내용
//         </p>
//         <hr style={{ height: "1px", background: "gray" }} />
//         <p
//           className="NanumSquare"
//           style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
//           {problem.prob_content}
//         </p>
//         <br />
//         <hr style={{ height: "1px", background: "gray" }} />
//         <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
//           입력
//         </p>
//         <hr style={{ height: "1px", background: "gray" }} />
//         <p
//           className="NanumSquare"
//           style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
//           {problem.prob_input_content}
//         </p>
//         <p
//           className="NanumSquare"
//           style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
//           ex. {problem.prob_input_testcase}
//         </p>
//         <br />
//         <hr style={{ height: "1px", background: "gray" }} />
//         <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
//           출력
//         </p>
//         <hr style={{ height: "1px", background: "gray" }} />
//         <p
//           className="NanumSquare"
//           style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
//           {problem.prob_output_content}
//         </p>
//         <p
//           className="NanumSquare"
//           style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
//           ex. {problem.prob_output_testcase}
//         </p>
//         <hr style={{ height: "1px", background: "gray" }} />
//         <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
//           입출력 예제
//         </p>
//         <hr style={{ height: "1px", background: "gray" }} />
//         <ExampleTable
//           inputData={problem.prob_input_testcase}
//           outputData={problem.prob_output_testcase}
//         />
//         <br />
//       </div>
//     </div>
//   );
// };

// const CodingPlace = ({ problemNumber, language, submitcode, clickSurrender, codeEmit }) => {
//   const [solvingHeight, setHeight] = useRecoilState(solvingHeightState3);
//   const [isClick, setIsClick] = useRecoilState(isClickState3);
//   const setConsoleHeight = useSetRecoilState(consoleHeightState3);
//   const [code, setCode] = useRecoilState(userCode);
//   const setSubmitMessage = useSetRecoilState(submitMessageState3);
//   // const problem_number = 1;

//   console.log("배틀 언어", language);

//   const onChange = (newValue) => {
//     setCode(newValue);
//     codeEmit(newValue);
//     console.log(newValue);
//     console.log("code ", code);
//   };

//   document.addEventListener("mouseup", (e) => {
//     setIsClick(false);
//   });

//   const upMouse = (event) => {
//     setIsClick(false);
//     console.log(isClick);
//   };

//   const downMouse = (event) => {
//     setIsClick(true);
//   };

//   const moveMouse = (event) => {
//     if (isClick === true) {
//       let y = event.clientY - allheight * 0.13;
//       setConsoleHeight(y);
//       if (solvingHeight < y && solvingHeight < allheight * 0.6) {
//         setHeight(solvingHeight + 3);
//       } else if (solvingHeight > y && solvingHeight > allheight * 0.2) {
//         setHeight(solvingHeight - 3);
//       }
//       console.log(event);
//       console.log(event.clientY);
//       console.log(y);
//     }
//   };

//   const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
//   const showSubmitModal = () => {
//     setIsSubmitModalOpen(true);
//   };
//   const submitHandleOk = () => {
//     clickSubmit();
//     setIsSubmitModalOpen(false);
//   };
//   const submitHandleCancel = () => {
//     setIsSubmitModalOpen(false);
//   };

//   const clickSubmit = () => {
//     if (code.trim() === "") {
//       setSubmitMessage("코드를 입력해주세요.");
//     } else {
//       let codedata = "";
//       for (let i = 0; i < code.length; i++) {
//         if (code[i] === "\n") {
//           codedata += "\n";
//           console.log("enter", code[i]);
//           for (let j = 1; j < code.length - i - 1; j += 2) {
//             if (code[i + j] === " " && code[i + j + 1] === " ") {
//               codedata += "\t";
//               console.log("tab", code[i + j]);
//             } else {
//               i += j - 1;
//               break;
//             }
//           }
//         } else {
//           console.log(code[i]);
//           codedata += code[i];
//         }
//       }
//       setTimeout(() => {
//         submitcode(codedata, problemNumber);
//       }, 500);
//     }
//   };

//   const surrend = () => {
//     clickSurrender();
//   };

//   console.log("참인가요?", language[0] === "Java", language);

//   return (
//     <div onMouseUp={upMouse} onMouseMove={moveMouse}>
//       <div style={{ width: "69vw", height: "7vh", border: "0.1px solid gray", textAlign: "right" }}>
//         <p
//           className="NanumSquare"
//           style={{ color: "white", fontSize: "2vh", height: "100%", padding: "2%" }}>
//           코딩할 언어: {language}
//         </p>
//       </div>
//       <div
//         id="console"
//         style={{
//           width: "69vw",
//           height: `${solvingHeight}px`,
//           verticalAlign: "top",
//         }}>
//         {language === "Java" && (
//           <CodeMirror
//             onmousedown="return false"
//             onselectstart="return false"
//             id="IDE"
//             value={code}
//             width="69vw"
//             height={`${solvingHeight}px`}
//             extensions={[java({ jsx: true })]}
//             onChange={onChange}
//             theme={darcula}
//           />
//         )}
//         {language === "Python3" && (
//           <CodeMirror
//             id="IDE"
//             value={code}
//             width="69vw"
//             height={`${solvingHeight}px`}
//             extensions={[python({ jsx: true })]}
//             onChange={onChange}
//             theme={darcula}
//           />
//         )}
//         {language === "Cpp" && (
//           <CodeMirror
//             id="IDE"
//             value={code}
//             width="69vw"
//             height={`${solvingHeight}px`}
//             extensions={[java({ jsx: true })]}
//             onChange={onChange}
//             theme={darcula}
//           />
//         )}
//       </div>
//       <div
//         role="button"
//         onMouseDown={downMouse}
//         onMouseMove={moveMouse}
//         onMouseUp={upMouse}
//         style={{ position: "relative", width: "69vw", height: "1vh", background: "gray" }}>
//         <img
//           onMouseDown={downMouse}
//           onMouseMove={moveMouse}
//           onMouseUp={upMouse}
//           src={Dots}
//           alt="dots"
//           style={{
//             position: "absolute",
//             top: "20%",
//             left: "50%",
//             transform: "(-50%, -50%)",
//             height: "5px",
//           }}
//         />
//       </div>
//       <div
//         style={{
//           width: "69vw",
//           height: "5.3vh",
//           border: "0.1px solid gray",
//         }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             height: "100%",
//           }}>
//           <p
//             className="NanumSquare"
//             style={{ color: "white", marginLeft: "10px", fontSize: "2.1vh" }}>
//             결과창
//           </p>
//           <div>
//             <Button className="NanumSquare" style={{ margin: "5px" }} onClick={showSubmitModal}>
//               제출
//             </Button>
//             <Button className="NanumSquare" style={{ margin: "5px" }} onClick={surrend}>
//               항복
//             </Button>
//           </div>
//         </div>
//       </div>
//       <Modal
//         title="제출하시겠습니까?"
//         open={isSubmitModalOpen}
//         onOk={submitHandleOk}
//         okText="제출"
//         onCancel={submitHandleCancel}
//         cancelText="취소">
//         <p>코드를 제출하면 채점이 시작됩니다.</p>
//         <p>채점 결과가 나오기까지 시간이 조금 걸릴 수 있습니다.</p>
//         <small>제출하지 않으려면 취소를 누르세요!</small>
//       </Modal>
//     </div>
//   );
// };

// const Console = () => {
//   const submitMessage = useRecoilValue(submitMessageState3);
//   // const solvingHeight = useRecoilValue(solvingHeightState);
//   const consoleHeight = useRecoilValue(consoleHeightState3);
//   // window.onload();

//   return (
//     <div
//       className="scrollDesign"
//       style={{
//         backgroundColor: "#16171b",
//         height: `${consoleHeight}px`,
//         overflowY: "scroll",
//       }}>
//       <p className="NanumSquare" style={{ color: "white", padding: "15px" }}>
//         &gt;&gt; {submitMessage}
//       </p>
//     </div>
//   );
// };

// const SolvingPage = ({
//   problemInfo,
//   battleMode,
//   battleLanguage,
//   battleuserinfo,
//   submit,
//   clickSurrender,
//   codeEmit,
// }) => {
//   problemInfo = {
//     prob_no: 2,
//     prob_name: "A-B",
//     prob_content: "두 정수 A와 B를 입력받은 다음, A-B를 출력하는 프로그램을 작성하시오.",
//     prob_input_content: "첫째 줄에 A와 B가 주어진다. (0 < A, B < 10)",
//     prob_output_content: "첫째 줄에 A-B를 출력한다.",
//     prob_time_limit: 2,
//     prob_memory_limit: 128,
//     prob_input_testcase: "3 2",
//     prob_output_testcase: "1",
//     prob_tier: "BRONZE4",
//   };

//   const problemNumber = 0;

//   const surrend = () => {
//     clickSurrender();
//   };

//   const codeUpdate = (code) => {
//     codeEmit(code);
//   };

//   const info = (data) => {
//     Modal.info(data);
//   };

//   $(function () {
//     $("#IDE").on("paste", function (event) {
//       // console.log(event.target.innerHTML);
//       event.preventDefault();
//       // var el = $(this);
//       // setTimeout(function () {
//       //   var text = $(el).val();
//       //   $("#IDE").val(""); //해당 text의 ID의 값을 초괴화 시킨다.
//       // }, 100);
//       const data = {
//         title: "복사나 붙여넣기 불가!",
//         content: (
//           <div>
//             <p>배틀의 공평한 진행을 위해서</p>
//             <p>복사나 붙여넣기는 불가능합니다!</p>
//             <p>코드를 직접 타이핑해주세요.</p>
//           </div>
//         ),
//         okText: "확인",
//         onOk() {},
//       };
//       info(data);
//       event.nativeEvent.stopImmediatePropagation();
//       event.target.innerHTML = " =====복붙하지말아주세요=========";
//       return false;
//     });
//   });

//   $(function () {
//     $("#IDE").on("copy", function (event) {
//       // console.log(event.target.innerHTML);
//       event.target.innerHTML = "";
//       event.preventDefault();
//       const data = {
//         title: "복사 붙여넣기 불가!",
//         content: (
//           <div>
//             <p>배틀의 공평한 진행을 위해서</p>
//             <p>복사나 붙여넣기는 불가능합니다!</p>
//             <p>코드를 직접 타이핑해주세요.</p>
//           </div>
//         ),
//         okText: "확인",
//         onOk() {},
//       };
//       info(data);
//       // event.nativeEvent.stopImmediatePropagation();
//       return false;
//     });
//   });

//   return (
//     <div id="allconsole" className="animate__animated animate__fadeIn">
//       <RecoilRoot>
//         <div>
//           {/* <BattleNav userInfo={battleuserinfo} mode={battleMode} /> */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               position: "relative",
//               border: "0.1px solid gray",
//             }}>
//             <div style={{ width: "30vw", height: "92vh", border: "0.1px solid gray" }}>
//               <Problem problemInfo={problemInfo} />
//             </div>
//             <div>
//               <div style={{ width: "69vw", height: "auto", border: "0.1px solid gray" }}>
//                 <CodingPlace
//                   problemNumber={problemNumber}
//                   language="Java"
//                   submitcode="submit"
//                   clickSurrender="surrend"
//                   codeEmit={codeEmit}
//                 />
//               </div>
//               <div style={{ width: "69vw", height: "auto" }}>
//                 <Console />
//               </div>
//             </div>
//           </div>
//         </div>
//       </RecoilRoot>
//     </div>
//   );
// };

// export default SolvingPage;
