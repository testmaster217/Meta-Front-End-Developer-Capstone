import './App.css';

import Footer from './Components/Footer';
import Homepage from './Pages/Homepage';
import ReserveATable from './Pages/ReserveATable';
import ConfirmReservation from './Pages/ConfirmReservation';
import ReservationConfirmation from './Pages/ReservationConfirmation';
import NavBar from './Components/NavBar';
import { useHeaderContext } from './Components/HeaderProvider';

import { useEffect, useReducer, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

/* API functions. (Copied and pasted from the API link because it doesn't work for some reason.) */
const seededRandom = function (seed) {
    var m = 2**35 - 31;
    var a = 185852;
    var s = seed % m;
    return function () {
        return (s = s * a % m) / m;
    };
}
const fetchAPI = function(date) {
    let result = [];
    let random = seededRandom(date.getDate());

    for(let i = 17; i <= 23; i++) {
        if(random() < 0.5) {
            result.push(i + ':00');
        }
        if(random() < 0.5) {
            result.push(i + ':30');
        }
    }
    return result;
};
export const submitAPI = function(formData) {
    /* If this was a real API, it would probably be using a database instead of localStorage. */
    const localStorage = window.localStorage;

    localStorage.setItem("TableReservation-" + formData.resDate + "-" + formData.resTime, JSON.stringify(
        {
            ...JSON.parse(localStorage.getItem("TableReservation-" + formData.resDate + "-" + formData.resTime)),
            ...formData
        }
    ));

    return true;
};

export function updateTimes(availableTimes, action) {
    if (action.type === "changed_date") return fetchAPI(action.newDate);
    else return availableTimes;
}
export function initializeTimes() {
    return fetchAPI(new Date());
}

function App() {
    let location = useLocation();
    const {headerSkipTarget} = useHeaderContext();

    useEffect(() => {
        if (!location.hash) {
            headerSkipTarget.current.focus({preventScroll: true});
            window.scroll(0, 0);
        }
    }, [location]);

    const [resDate, setResDate] = useState("");
    const [availableTimes, setAvailableTimes] = useReducer(updateTimes, null, initializeTimes);
    const [resTime, setResTime] = useState(availableTimes[0]);
    const [resGuests, setResGuests] = useState(1);
    const [resSeating, setResSeating] = useState("No Preference");
    const [resOccasion, setResOccasion] = useState("nothing");
    const [resComments, setResComments] = useState("");
    const [resFirstName, setResFirstName] = useState("");
    const [resLastName, setResLastName] = useState("");
    const [resPhone, setResPhone] = useState("");
    const [resEmail, setResEmail] = useState("");
    const [resCCName, setResCCName] = useState("");
    const [resAddress, setResAddress] = useState("");
    const [resAddress2, setResAddress2] = useState("");
    const [resCity, setResCity] = useState("");
    const [resState, setResState] = useState("AL");
    const [resZip, setResZip] = useState("");
    const [resCCNum, setResCCNum] = useState("");
    const [resExpDate, setResExpDate] = useState("");
    const [res3Digit, setRes3Digit] = useState("");

    const navigate = useNavigate();

    const reserveInfo = {
        resDate: resDate,
        setResDate: setResDate,
        availableTimes: availableTimes,
        setAvailableTimes: setAvailableTimes,
        resTime: resTime,
        setResTime: setResTime,
        resGuests: resGuests,
        setResGuests: setResGuests,
        resSeating: resSeating,
        setResSeating: setResSeating,
        resOccasion: resOccasion,
        setResOccasion: setResOccasion,
        resComments: resComments,
        setResComments: setResComments
    };
    const reserveUserInfo = {
        resFirstName: resFirstName,
        setResFirstName: setResFirstName,
        resLastName: resLastName,
        setResLastName: setResLastName,
        resPhone: resPhone,
        setResPhone: setResPhone,
        resEmail: resEmail,
        setResEmail: setResEmail,
        resCCName: resCCName,
        setResCCName: setResCCName,
        resAddress: resAddress,
        setResAddress: setResAddress,
        resAddress2: resAddress2,
        setResAddress2: setResAddress2,
        resCity: resCity,
        setResCity: setResCity,
        resState: resState,
        setResState: setResState,
        resZip: resZip,
        setResZip: setResZip,
        resCCNum: resCCNum,
        setResCCNum: setResCCNum,
        resExpDate: resExpDate,
        setResExpDate: setResExpDate,
        res3Digit: res3Digit,
        setRes3Digit: setRes3Digit
    }

    function submitFormPart1() {
        if (submitAPI({
            resDate: resDate,
            resTime: resTime,
            resGuests: resGuests,
            resSeating: resSeating,
            resOccasion: resOccasion,
            resComments: resComments
        })) {
            navigate('/reserve-page-2');
        }
    }

    function submitFormPart2() {
        if (submitAPI({
            resDate: resDate,
            resTime: resTime,
            resFirstName: resFirstName,
            resLastName: resLastName,
            resPhone: resPhone,
            resEmail: resEmail,
            resCCName: resCCName,
            resAddress: resAddress,
            resAddress2: resAddress2,
            resCity: resCity,
            resState: resState,
            resZip: resZip,
            resCCNum: resCCNum,
            resExpDate: resExpDate,
            res3Digit: res3Digit
        })) {
            navigate('/reserve-confirmation');
        }
    }

    return (
        <>
            <NavBar/>
            <Routes>
                <Route path='/' element={<Homepage/>}/>
                <Route path='/reserve-a-table' element={<ReserveATable reserveInfo={reserveInfo} handleSubmit={e => {
                    e.preventDefault();
                    submitFormPart1();
                }}/>}/>
                <Route path='/reserve-page-2' element={<ConfirmReservation reserveUserInfo={reserveUserInfo} handleSubmit={e => {
                    e.preventDefault();
                    submitFormPart2();
                }}/>}/>
                <Route path='/reserve-confirmation' element={<ReservationConfirmation/>}/>
            </Routes>
            <Footer/>
        </>
    );
}

export default App;
