import './ReservationHero.css';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from 'react-router-dom';

import { useHeaderContext } from './HeaderProvider';

export default function ReservationHero({headerText, photo, backLink}) {
    const {headerSkipTarget} = useHeaderContext();
    const navigate = useNavigate();

    return <header className="ReservationHero" ref={headerSkipTarget} tabIndex="-1">
        <div>
            <button type="button" className="BackButton" title="Back" onClick={() => navigate(backLink)}>
                <FontAwesomeIcon icon={faArrowLeft}/>
            </button>
            <h1 className='DisplayTitle'>{headerText}</h1>
        </div>
        <img src={photo} aria-hidden/>
    </header>;
}