import './ReserveATable.css';

import restaurant from "../Assets/restaurant.jpg";

import ReservationHero from '../Components/ReservationHero'

import { useEffect } from 'react';

const currentDate = new Date();

const seatingChoices = [
    {value: "Inside", defaultChecked: false},
    {value: "Outside", defaultChecked: false},
    {value: "No Preference", defaultChecked: true}
];

const occasions = [
    {value: "nothing", displayMsg: "Nothing special"},
    {value: "birthday", displayMsg: "Birthday"},
    {value: "engagement", displayMsg: "Engagement"},
    {value: "anniversary", displayMsg: "Anniversary"},
    {value: "other", displayMsg: 'Other (Explain in "Additional comments")'}
];

function timeTo12Hour(time) {
    let [hour, minute] = time.split(":");
    let suffix = " P.M.";
    if (parseInt(hour) > 12) {
        hour %= 12;
    } else {
        suffix = " A.M.";
        if (parseInt(hour) === 0) {
            hour = 12;
        }
    }

    return hour + ":" + minute + suffix;
}

// Validation functions.
function validateDate(dateToCheck) {
    // Check if date is missing.
    if (!dateToCheck)
        return "This field is required and must be a valid date.";
    // Check if date is not a valid yyyy-mm-dd date.
    // (I know the regex isn't perfect, also it's based on this: https://regex101.com/library/NXvFly?orderBy=RELEVANCE&search=date&filterFlavors=javascript.)
    if (Date.parse(dateToCheck) === NaN || !dateToCheck.match(/^\d{4}-(?:0[1-9]|1[0-2])-\d{2}$/))
        return "The date must be a valid date.";
    // Check if date is in the past.
    if (dateToCheck < `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate()).toPrecision(2)}`)
        return "The date can't be in the past.";
    // Date is valid here.
    return "";
}

function validateTime(availableTimesToCheck, timeToValidate) {
    // Check if time is missing or not a valid choice.
    if (!timeToValidate || !availableTimesToCheck.includes(timeToValidate))
        return "Please choose from the available times.";
    // Time is valid here.
    return "";
}

function validateGuests(guestsToValidate) {
    // Check if number of guests is missing.
    if (!guestsToValidate && guestsToValidate !== 0)
        return "This field is required.";
    // Check if number of guests is not a number or is not a whole number.
    if ((isNaN(guestsToValidate) || guestsToValidate % 1 !== 0) && guestsToValidate !== 0)
        return "Number of guests must be a whole number.";
    // Check if number of guests is too small or too big.
    if (parseInt(guestsToValidate) < 1 || parseInt(guestsToValidate) > 10)
        return "Number of guests must be between 1 and 10.";
    // Number of guests is valid here.
    return "";
}

function validateSeating(seatingToValidate) {
    // Check if seating choice is missing or invalid.
    if (!seatingToValidate || !seatingChoices.map(current => current.value).includes(seatingToValidate))
        return "Please choose one of these options.";
    // Seating choice is valid here.
    return "";
}

function validateOccasion(occasionToValidate) {
    // Check if occasion is msising or invalid.
    if (!occasionToValidate || !occasions.map(current => current.value).includes(occasionToValidate))
        return 'Please choose from the available options, or choose "Other" and explain in the comments.';
    // Occasion is valid here.
    return "";
}

function validateComments(occasionToCheck, commentsToValidate) {
    // Check if occasion is "other" and comments are blank.
    if (occasionToCheck === "other" && !commentsToValidate)
        return 'If you set the "Occasion" field to "Other", please use this comments box to explain what the occasion is.';
    // Comments are valid here.
    return "";
}

// Returns true if any of the form fields are invalid.
export function validateReserveForm(reserveInfo) {
    // All of these functions return an error
    // message if the field that they test is
    // invalid, so if they are all falsy (they
    // don't return a message), then the form
    // is valid.
    return validateDate(reserveInfo.resDate) ||
           validateTime(reserveInfo.availableTimes, reserveInfo.resTime) ||
           validateGuests(reserveInfo.resGuests) ||
           validateSeating(reserveInfo.resSeating) ||
           validateOccasion(reserveInfo.resOccasion) ||
           validateComments(reserveInfo.resOccasion, reserveInfo.resComments);
}

export default function ReserveATable({reserveInfo, handleSubmit}) {
    useEffect(() => {
        reserveInfo.setResDate(`${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate()).toPrecision(2)}`);
    }, []);

    return (<>
        <ReservationHero headerText="Reserve a Table" photo={restaurant} backLink="/"/>
        <main>
            {/* Some UI elements (namely, the radio buttons, the <option>s
            for the <select> elements throughout the pages, and the slanted
            lines in the corner of the <textarea> or whatever your browser
            uses to show that it's editable) don't look how I want them to.
            I'm not going to fix it because it would be too much work and
            I'm already late turning this in. */}
            <form className="ReserveForm" role='form' onSubmit={handleSubmit}>
                <label htmlFor="reservationDate" className='ParagraphText'>
                    <span><span className='HighlightText' aria-hidden>*</span>Choose a date:</span>
                    <input
                        type="date"
                        id="reservationDate"
                        name="reservationDate"
                        required
                        className='FormField LeadText'
                        value={reserveInfo.resDate}
                        min={`${currentDate.getFullYear().toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${currentDate.getDate().toPrecision(2)}`}
                        aria-errormessage='dateError'
                        onChange={e => {
                            reserveInfo.setResDate(e.target.value);
                            let newDate = new Date(e.target.value);
                            newDate.setDate(newDate.getDate() + 1);
                            reserveInfo.setAvailableTimes({type: "changed_date", newDate: newDate});
                        }}
                    />
                    {/* Couldn't figure out how to get the screen reader to announce when the field was NO LONGER invalid.
                    (I was using Windows Narrator in Microsoft Edge.) */}
                    <p id="dateError" className='HighlightText' role='alert'>{validateDate(reserveInfo.resDate)}</p>
                </label>
                <label htmlFor="reservationTime" className='ParagraphText'>
                    <span><span className='HighlightText' aria-hidden>*</span>Choose a time:</span>
                    <select
                        id='reservationTime'
                        name='reservationTime'
                        required
                        className='FormDropDown LeadText'
                        value={reserveInfo.resTime}
                        aria-errormessage='timeError'
                        onChange={e => reserveInfo.setResTime(e.target.value)}
                    >
                        {reserveInfo.availableTimes.map(timeSlot =>
                            <option key={timeSlot} value={timeSlot} className='LeadText'>{timeTo12Hour(timeSlot)}</option>
                        )}
                    </select>
                    <p id="timeError" className='HighlightText' role='alert'>{validateTime(reserveInfo.availableTimes, reserveInfo.resTime)}</p>
                </label>
                <label htmlFor="numOfGuests" className='ParagraphText'>
                    <span><span className='HighlightText' aria-hidden>*</span>Number of guests:</span>
                    <input
                        type="number"
                        id="numOfGuests"
                        name="numOfGuests"
                        required
                        min="1"
                        max="10"
                        step="1"
                        className='FormField LeadText'
                        value={reserveInfo.resGuests}
                        aria-errormessage='guestsError'
                        onChange={e => reserveInfo.setResGuests(e.target.value)}
                    />
                    <p id="guestsError" className='HighlightText' role='alert'>{validateGuests(reserveInfo.resGuests)}</p>
                </label>
                <fieldset
                    id="seatingChoice"
                    onChange={e => reserveInfo.setResSeating(e.target.value)}
                    aria-errormessage='seatingError'
                >
                    <legend className='ParagraphText'>
                        <span><span className='HighlightText' aria-hidden>*</span>Where would you like to sit?</span>
                    </legend>
                    {seatingChoices.map(choice =>
                        <label key={choice.value} htmlFor={choice.value.concat('Radio')} className='ParagraphText'>
                            <input
                                type='radio'
                                value={choice.value}
                                id={choice.value.concat('Radio')}
                                name='seatingChoice'
                                required
                                defaultChecked={choice.defaultChecked}
                            />
                            {choice.value}
                        </label>
                    )}
                    <p id="seatingError" className='HighlightText' role='alert'>{validateSeating(reserveInfo.resSeating)}</p>
                </fieldset>
                <label htmlFor="occasion" className='ParagraphText'>
                    <span><span className='HighlightText' aria-hidden>*</span>Is it a special occasion?</span>
                    <select
                        id="occasion"
                        name="occasion"
                        required
                        className='FormDropDown LeadText'
                        value={reserveInfo.resOccasion}
                        aria-errormessage='occasionError'
                        onChange={e => reserveInfo.setResOccasion(e.target.value)}
                    >
                        {occasions.map(current =>
                            <option key={current.value} value={current.value} className='LeadText'>{current.displayMsg}</option>
                        )}
                    </select>
                    <p id="occasionError" className='HighlightText' role='alert'>{validateOccasion(reserveInfo.resOccasion)}</p>
                </label>
                <label htmlFor="comments" className='ParagraphText'>
                    <span>{reserveInfo.resOccasion === "other" && <span className='HighlightText' aria-hidden>*</span>}Additional comments? (i.e., any special isntructions or accommodations needed):</span>
                    <textarea
                        id="comments"
                        name="comments"
                        required={reserveInfo.resOccasion === "other"}
                        className='LeadText'
                        value={reserveInfo.resComments}
                        aria-errormessage='commentsError'
                        onChange={e => reserveInfo.setResComments(e.target.value)}
                    />
                    <p id="commentsError" className='HighlightText' role='alert'>{validateComments(reserveInfo.resOccasion, reserveInfo.resComments)}</p>
                </label>
                <button type="submit" className='MainButton LeadText' disabled={validateReserveForm(reserveInfo)}>Submit Reservation</button>
            </form>
        </main>
    </>);
}