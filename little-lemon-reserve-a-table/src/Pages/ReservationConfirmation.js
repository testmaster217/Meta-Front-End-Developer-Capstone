import './ReservationConfirmation.css';

import marioAndAdrianB from "../Assets/Mario and Adrian b.jpg";

import ReservationHero from "../Components/ReservationHero";

export default function ReservationConfirmation() {
    return <>
        <ReservationHero headerText="Thank you for visiting!" photo={marioAndAdrianB} backLink="/"/>
        <main className="ReservationConfirmationMain">
            <p className='ParagraphText'>You should get a confirmation email shortly. We hope you enjoy your experience!</p>
        </main>
    </>;
}