import {Col, Row} from "react-bootstrap";
import CalDay from "./CalDay";
import { initializeApp } from "firebase/app";
import {getFirestore, collection, doc, addDoc, getDocs, query, orderBy, getDoc, where} from "firebase/firestore";
import {useEffect, useState} from "react";

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


function generateWkDates(startDate, maxDay){
    let wkDates = [];
    for (let i=0; i<7; i++){
        let dateEntry = startDate + i;
        if (dateEntry > maxDay){
            dateEntry = dateEntry-maxDay;
        }
        wkDates.push(dateEntry);
    }
    return wkDates;
}

function CalWeek(props){
    const thisWeekDates = generateWkDates(props.wk_of,props.dayInMonth);
    const startArr = [props.wk_of, props.month, props.year];

    return(
        <Row className={"mx-0 " + props.wk_type}>
            <CalDay startArr={startArr} day_type={"cal_sun"}   day_of_month={thisWeekDates[0]} day_of_week={"sunday1"}  />
            <CalDay startArr={startArr} day_type={"cal_wkday"} day_of_month={thisWeekDates[1]} day_of_week={"monday"} />
            <CalDay startArr={startArr} day_type={"cal_wkday"} day_of_month={thisWeekDates[2]} day_of_week={"tuesday"} />
            <CalDay startArr={startArr} day_type={"cal_wkday"} day_of_month={thisWeekDates[3]} day_of_week={"wednesday"}/>
            <CalDay startArr={startArr} day_type={"cal_wkday"} day_of_month={thisWeekDates[4]} day_of_week={"thursday"} />
            <CalDay startArr={startArr} day_type={"cal_wkday"} day_of_month={thisWeekDates[5]} day_of_week={"friday"} />
            <CalDay startArr={startArr} day_type={"cal_sat"} day_of_month={thisWeekDates[6]} day_of_week={"saturday"} />
        </Row>
    );
}

export default CalWeek;