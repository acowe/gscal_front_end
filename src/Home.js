import {Container, Row, Col, Button, Card, Dropdown} from "react-bootstrap";
import './Home.css'
import {useState, useEffect} from "react";
import { initializeApp } from "firebase/app";
import {getFirestore, collection, doc, addDoc, getDocs, query, orderBy, getDoc} from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA6Bx3J-IB1EnvqSE5Pja7r2R5ykJOjsFA",
    authDomain: "gscaltest.firebaseapp.com",
    projectId: "gscaltest",
    storageBucket: "gscaltest.appspot.com",
    messagingSenderId: "977140376530",
    appId: "1:977140376530:web:44496ec55fc6235d8f5e0b",
    measurementId: "G-5E3SBZM1QD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function num_to_month(n){
    switch (n) {
        case 1:
            return "january";
            break;
        case 2:
            return "february";
            break;
        case 3:
            return "march";
            break;
        case 4:
            return "april";
            break;
        case 5:
            return "may";
            break;
        case 6:
            return "june";
            break;
        case 7:
            return "july";
            break;
        case 8:
            return "august";
            break;
        case 9:
            return "september";
            break;
        case 10:
            return "october";
            break;
        case 11:
            return "november";
            break;
        case 12:
            return "december";
            break;
        default:
            return "month";
    }
}

function Home(props){

    const current = new Date();
    const date = current.getDate();
    const day = current.getDay();
    const current_wk_start = date - day + 1;
    const current_wk_end = current_wk_start + 6;
    const month_num = current.getMonth()+1;
    const month = num_to_month(month_num);
    const year = current.getFullYear();
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [dueTimes, setDueTimes] = useState([]);
    const [numAssignments, setNumAssignements] = useState(-1);



    function display_cal_event(d_id) {
        const listLen = numAssignments;
        if (listLen > 3) {
            document.getElementById(d_id).classList.add("many");
        }
    }

    function pdfToDownload(){
        let rand = Math.floor(Math.random() * 6),
        element = document.getElementById("cal_dnload");
        console.log(rand);
        if (rand === 5){
            element.href = "Matt.pdf";
        }
        else{
            element.href = "hi.pdf";
        }
    }

    async function getAssignments(){
        const docRef = doc(db,"GSCalTestCol", "testCalData", "testWeeks","week_1","days","monday")
        const colRef = collection(db, "GSCalTestCol", "testCalData", "testWeeks","week_1","days","monday","assignments");
        const q = query(colRef, orderBy("due"))
        const docSnap = await getDoc(docRef);
        const querySnap = await getDocs(q);
        const assignArr = querySnap.docs.map(doc => doc.data().name);
        const courseArr = querySnap.docs.map(doc => doc.data().course)
        const dueArr = querySnap.docs.map(doc => doc.data().due)
        setNumAssignements(docSnap.data().num_assignments)
        setAssignments(assignArr);
        setCourses(courseArr);
        setDueTimes(dueArr);
    }

    const displayAssignments = assignments.map((a,i) =>
    {
        let course = courses[i];
        return (<li key={i} className={course}><div className={"to_do_text"}>{a}</div></li>);
    });

    const displayDue = dueTimes.map((t,i) =>
        {
            let time = new Date(t.seconds*1000);
            let isAm = (time.getHours() < 12 ? true : false)
            let hour = (isAm ? time.getHours() : time.getHours() - 12);
            let min = (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
            let ampm = (isAm ? "AM": "PM")
            return (<li>
                    <div className={"list_content"}>
                        <div className={"course_text"}>{courses[i]}</div>
                        <div className={"list_time"}>
                            <p className={"mb-0 list_time_text"}>{hour +  ":" + min + " " + ampm}</p>
                        </div>
                    </div>
            </li>);
        }
    );

    useEffect(() =>
        {
            getAssignments();
            let i = 1;
            for(i;i<15;i++){
                let idstr = "d"+i;
                display_cal_event(idstr);
            }
        }, []
    );



    return (
        <div className={"gsc_div"}>
            <Container fluid className={"gscal"}>
                <Row className={"py-4 header"}>
                    <Col xs={2} sm={2} md={3} lg={2} className={"h_other"}>
                        <h5 className={"my-0 px-2 h_other_text"}>Hello Student!</h5>
                    </Col>
                    <Col xs={8} sm={8} md={6} lg={8} className={"d-flex justify-content-center align-middle"}>
                        <h5 className={"my-0 fs-4 fw-bold text-light h_title"}>gradescope calendar</h5>
                    </Col>
                    <Col xs={2} sm={2} md={3} lg={2} className={"h_other"}>
                        <button className={"w-75 py-0 btn btn-light btn-block shadow-none border-0 rounded-pill h_other_text"}>
                            sign out
                        </button>
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-basic" className={"shadow-none h_dropdown"}>
                                <i className="fa-solid fa-bars"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/user">Hello student!</Dropdown.Item>
                                <Dropdown.Item className={"text-danger"}>Sign out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>


                    </Col>
                </Row>

                <Row className={"contents"}>
                    <Col lg={8} className={"px-0 cal_col"}>
                        <div className={"mx-md-5 mx-3 my-3 my-md-4 mt-lg-4 mb-lg-3 pb-2 pb-lg-4 pb-xl-3 cal_card"}>
                            <h1 className={"cal_head"}>{month + " " + year}</h1>
                            <Row className={"mx-0 mt-2 mt-sm-3 mt-md-3 px-0 cal_days"}>
                                <Col style={{width:"14.28%"}} className={"px-0"}>
                                    <p className={"my-0 px-1 fs-6 dow_full"}>sunday</p>
                                    <p className={"my-0 px-1 fs-6 dow_short"}>sun</p>
                                </Col>
                                <Col style={{width:"14.28%"}} className={"px-0"}>
                                    <p className={"my-0 px-1 fs-6 dow_full"}>monday</p>
                                    <p className={"my-0 px-1 fs-6 dow_short"}>mon</p>
                                </Col>
                                <Col style={{width:"14.28%"}} className={"px-0"}>
                                    <p className={"my-0 px-1 fs-6 dow_full"}>tuesday</p>
                                    <p className={"my-0 px-1 fs-6 dow_short"}>tues</p>
                                </Col>
                                <Col style={{width:"14.28%"}} className={"px-0"}>
                                    <p className={"my-0 px-1 fs-6 dow_full"}>wednesday</p>
                                    <p className={"my-0 px-1 fs-6 dow_short"}>wed</p>
                                </Col>
                                <Col style={{width:"14.28%"}} className={"px-0"}>
                                    <p className={"my-0 px-1 fs-6 dow_full"}>thursday</p>
                                    <p className={"my-0 px-1 fs-6 dow_short"}>thu</p>
                                </Col>
                                <Col style={{width:"14.28%"}} className={"px-0"}>
                                    <p className={"my-0 px-1 fs-6 dow_full"}>friday</p>
                                    <p className={"my-0 px-1 fs-6 dow_short"}>fri</p>
                                </Col>
                                <Col style={{width:"14.28%"}} className={"px-0"}>
                                    <p className={"my-0 px-1 fs-6 dow_full"}>saturday</p>
                                    <p className={"my-0 px-1 fs-6 dow_short"}>sat</p>
                                </Col>
                            </Row>
                            <Container className={"mx-sm-0 px-0 cal"}>
                                <Row className={"mx-0 cal_wk_fst"}>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_sun"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>1</p>
                                        <div id="d1" className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>2</p>
                                        <div id="d2" className={"cal_content"}>
                                            <ul>
                                                {displayAssignments}
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>3</p>
                                        <div id="d3" className={"cal_content"}>
                                            <ul>
                                                <li className={"course_2"}>
                                                    <div className={"to_do_text"}>Homework 3A</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>4</p>
                                        <div id="d4" className={"cal_content"} >
                                            <ul>
                                                <li className={"course_1"}>
                                                    <div className={"to_do_text"}>9.1 Preclass</div>
                                                </li>
                                                <li className={"course_1"}>
                                                    <div className={"to_do_text"}>HW3</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>5</p>
                                        <div id="d5" className={"cal_content"} >
                                            <ul>
                                                <li className={"course_3"}>
                                                    <div className={"to_do_text"}>Recitation #5</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>6</p>
                                        <div id={"d6"} className={"cal_content"}>
                                            <ul>
                                                <li className={"course_1"}>
                                                    <div className={"to_do_text"}>9.2 Preclass</div>
                                                </li>
                                                <li className={"course_2"}>
                                                    <div className={"to_do_text"}>Homework 3B</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_sat"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>7</p>
                                        <div id={"d7"} className={"cal_content"}></div>
                                    </Col>
                                </Row>
                                <Row className={"mx-0 cal_wk"}>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_sun"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>8</p>
                                        <div id="d8" className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>9</p>
                                        <div id="d9" className={"cal_content"}>
                                            <ul>
                                                <li className={"course_3"}>
                                                    <div className={"to_do_text"}>Homework 6</div>
                                                </li>
                                                <li className={"course_1"}>
                                                    <div className={"to_do_text"}>9.1 Preclass</div>
                                                </li>
                                                <li className={"course_1"}>
                                                    <div className={"to_do_text"}>Quiz 3</div>
                                                </li>
                                                <li className={"course_4"}>
                                                    <div className={"to_do_text"}>Homework #3 Written: rateSeqChange.txt</div>
                                                </li>
                                                <li className={"course_4"}>
                                                    <div className={"to_do_text"}>Homework #3 Code: dist.py</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>10</p>
                                        <div id="d10" className={"cal_content"}>
                                            <ul>
                                                <li className={"course_2"}>
                                                    <div className={"to_do_text"}>Homework 3A</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>11</p>
                                        <div id="d11" className={"cal_content"} >
                                            <ul>
                                                <li className={"course_1"}>
                                                    <div className={"to_do_text"}>9.1 Preclass</div>
                                                </li>
                                                <li className={"course_1"}>
                                                    <div className={"to_do_text"}>HW3</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>12</p>
                                        <div id="d12" className={"cal_content"} >
                                            <ul>
                                                <li className={"course_3"}>
                                                    <div className={"to_do_text"}>Recitation #5</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>13</p>
                                        <div id={"d13"} className={"cal_content"}>
                                            <ul>
                                                <li className={"course_1"}>
                                                    <div className={"to_do_text"}>9.2 Preclass</div>
                                                </li>
                                                <li className={"course_2"}>
                                                    <div className={"to_do_text"}>Homework 3B</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_sat"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>14</p>
                                        <div id={"d14"}className={"cal_content"}></div>
                                    </Col>
                                </Row>

                                <Row className={"mx-0 cal_wk"}>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_sun"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>15</p>
                                        <div className={"cal_content"}>
                                        </div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>16</p>
                                        <div className={"cal_content"}>
                                            <ul>{displayAssignments}</ul>
                                        </div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>17</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>18</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>19</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>20</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_sat"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>21</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                </Row>

                                <Row className={"mx-0 cal_wk"}>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_sun"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>22</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>23</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>24</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>25</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>26</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>27</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_sat"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>28</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                </Row>

                                <Row className={"mx-0 cal_wk_last"}>

                                    <Col style={{width:"14.28%"}} className={"px-0 cal_sun"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>29</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <p className={"mb-0 pe-1 text-end cal_date"}>30</p>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_wkday"}>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                    <Col style={{width:"14.28%"}} className={"px-0 cal_sat"}>
                                        <div className={"cal_content"}></div>
                                    </Col>
                                </Row>
                            </Container>
                            <div className={"my-3 ps-0 cal_key"}>
                                <div className={"text-start mb-0 pe-0 key"}>
                                    <h4 className={"mb-0 key_text"}>View by class:</h4></div>
                                <div className={"courses"}>
                                    <ul className={"ps-0"}>
                                        <li className={"ms-3 me-3 py-2 course_1"}>
                                            chem
                                        </li>
                                        <li className={"ms-2 me-3 py-2 course_2"}>
                                            math
                                        </li>
                                        <li className={"ms-2 me-3 py-2 course_3"}>
                                            phys
                                        </li>
                                        <li className={"ms-2 me-3 py-2 course_4"}>
                                            bio
                                        </li>
                                        <li className={"ms-2 me-3 py-2 course_5"}>
                                            csci
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <a id="cal_dnload" href="test_cal.ics" download="test_calendar">
                            <button style={{width:"40%"}} className={"shadow-none btn btn-primary"}>
                                download calendar
                            </button>
                        </a>
                    </Col>

                    <Col lg={4} className={"px-0 pt-lg-4 pt-md-0 list_col"}>
                        <div className={"ms-lg-0 me-lg-5 mx-md-5 mx-3 pb-2 mt-4 mt-lg-0 mb-lg-0 task_card"}>
                            <div className={"task_card_contents"}>
                                <div className={"mx-2 mx-sm-3 mt-1 mb-2 task_day_entry"}>
                                    <h2 className={"fs-3"}>monday</h2>
                                    <ul className={"mb-5 task_day_list"}>
                                        {displayDue}
                                    </ul>
                                    <div className={"tde_bottom"}> </div>
                                </div>
                                <div className={"ms-3 me-2 mb-2 task_day_entry"}>
                                    <h2 className={"fs-3"}>tuesday</h2>
                                    <ul className={"mb-5 task_day_list"}>
                                        <li>
                                            <div className={"list_content"}>
                                                <p className={"my-0"}>HMC Math 73</p>
                                                <span className={"float-start"}>
                                                    SP22
                                                </span>
                                                <span className={"float-end list_time"}>
                                                    10:00 PM
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                    <div className={"tde_bottom"}> </div>
                                </div>
                                <div className={"ms-3 me-2 mb-2 task_day_entry"}>
                                    <h2 className={"fs-3"}>wednesday</h2>
                                    <ul className={"mb-5 task_day_list"}>
                                        <li>
                                            <div className={"list_content"}>
                                                <p className={"my-0"}>HMC Chemistry</p>
                                                <span className={"float-start"}>
                                                    23B SP22
                                                </span>
                                                <span className={"float-end list_time"}>
                                                    10:00 AM
                                                </span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={"list_content"}>
                                                <p className={"my-0"}>HMC Chemistry</p>
                                                <span className={"float-start"}>
                                                    23B SP22
                                                </span>
                                                <span className={"float-end list_time"}>
                                                    5:00 PM
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                    <div className={"tde_bottom"}> </div>
                                </div>
                                <div className={"ms-3 me-2 mb-2 task_day_entry"}>
                                    <h2 className={"fs-3"}>thursday</h2>
                                    <ul className={"mb-5 task_day_list"}>
                                        <li>
                                            <div className={"list_content"}>
                                                <p className={"my-0"}>HMC Phys 24</p>
                                                <span className={"float-start"}>
                                                    Sec 1-8 SP22
                                                </span>
                                                <span className={"float-end list_time"}>
                                                    8:00 AM
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                    <div className={"tde_bottom"}> </div>
                                </div>
                                <div className={"ms-3 me-2 mb-2 task_day_entry"}>
                                    <h2 className={"fs-3"}>friday</h2>
                                    <ul className={"mb-5 task_day_list"}>
                                        <li>
                                            <div className={"list_content"}>
                                                <p className={"my-0"}>HMC Chemistry</p>
                                                <span className={"float-start"}>
                                                    23B SP22
                                                </span>
                                                <span className={"float-end list_time"}>
                                                    10:00 AM
                                                </span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={"list_content"}>
                                                <p className={"my-0"}>HMC Math 73</p>
                                                <span className={"float-start"}>
                                                    SP22
                                                </span>
                                                <span className={"float-end list_time"}>
                                                    10:00 PM
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                    <div className={"tde_bottom"}> </div>
                                </div>
                                <div className={"ms-3 me-2 me-2 mb-2 task_day_entry"}>
                                    <h2 className={"fs-3"}>saturday</h2>
                                    <ul className={"mb-5 none_type"}>
                                        <li>none!</li>
                                    </ul>
                                    <div className={"tde_bottom"}> </div>
                                </div>
                                <div className={"ms-3 me-2 mt-3 mb-2 task_day_entry"}>
                                    <h2 className={"fs-3"}>sunday</h2>
                                    <ul className={"mb-5 none_type"}>
                                        <li>none!</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={"mt-lg-4 dl_button_group"}>
                            <a href={"/gscal_front_end/#/wk_overview"} className={"mb-3 shadow-none btn btn-primary"}>view weekly overview</a>
                        </div>

                    </Col>
                </Row>
                <Row className={"cover_up"}>
                </Row>


            </Container>


        </div>
    );
};

export default Home;