import './ConfirmReservation.css';

import chef from "../Assets/restaurant chef B.jpg";

import ReservationHero from '../Components/ReservationHero'

import { useEffect } from 'react';

const states = [
    {value: "AL", accessibleValue: "Alabama"},
    {value: "AK", accessibleValue: "Alaska"},
    {value: "AZ", accessibleValue: "Arizona"},
    {value: "AR", accessibleValue: "Arkansas"},
    {value: "CA", accessibleValue: "California"},
    {value: "CO", accessibleValue: "Colorado"},
    {value: "CT", accessibleValue: "Connecticut"},
    {value: "DE", accessibleValue: "Delaware"},
    {value: "DC", accessibleValue: "D.C."},
    {value: "FL", accessibleValue: "Florida"},
    {value: "GA", accessibleValue: "Georgia"},
    {value: "HI", accessibleValue: "Hawaii"},
    {value: "ID", accessibleValue: "Idaho"},
    {value: "IL", accessibleValue: "Illinois"},
    {value: "IN", accessibleValue: "Indiana"},
    {value: "KS", accessibleValue: "Kansas"},
    {value: "KY", accessibleValue: "Kentucky"},
    {value: "LA", accessibleValue: "Louisiana"},
    {value: "ME", accessibleValue: "Maine"},
    {value: "MD", accessibleValue: "Maryland"},
    {value: "MA", accessibleValue: "Massachusetts"},
    {value: "MI", accessibleValue: "Michigan"},
    {value: "MN", accessibleValue: "Minnesota"},
    {value: "MS", accessibleValue: "Mississippi"},
    {value: "MO", accessibleValue: "Missouri"},
    {value: "MT", accessibleValue: "Montana"},
    {value: "NE", accessibleValue: "Nebraska"},
    {value: "NV", accessibleValue: "Nevada"},
    {value: "NH", accessibleValue: "New Hampshire"},
    {value: "NJ", accessibleValue: "New Jersey"},
    {value: "NM", accessibleValue: "New Mexico"},
    {value: "NY", accessibleValue: "New York"},
    {value: "NC", accessibleValue: "North Carolina"},
    {value: "ND", accessibleValue: "North Dakota"},
    {value: "OH", accessibleValue: "Ohio"},
    {value: "OK", accessibleValue: "Oklahoma"},
    {value: "OR", accessibleValue: "Oregon"},
    {value: "PA", accessibleValue: "Pennsylvania"},
    {value: "RI", accessibleValue: "Rhode Island"},
    {value: "SC", accessibleValue: "South Carolina"},
    {value: "SD", accessibleValue: "South Dakota"},
    {value: "TN", accessibleValue: "Tennessee"},
    {value: "TX", accessibleValue: "Texas"},
    {value: "UT", accessibleValue: "Utah"},
    {value: "VT", accessibleValue: "Vermont"},
    {value: "VA", accessibleValue: "Virginia"},
    {value: "WA", accessibleValue: "Washington"},
    {value: "WV", accessibleValue: "West Virginia"},
    {value: "WI", accessibleValue: "Wisconsin"},
    {value: "WY", accessibleValue: "Wyoming"}
];

// Validation fucntions.
function validateFName(fNameToValidate) {
    // Check if first name is missing.
    if (!fNameToValidate)
        return "This field is required.";
    // First name is valid here.
    return "";
}

function validateLName(lNameToValidate) {
    // Check if last name is missing.
    if (!lNameToValidate)
        return "This field is required.";
    // Last name is valid here.
    return "";
}

function validatePhone(phoneToValidate) {
    // Check if phone number is invalid. (Missing IS allowed!)
    if (phoneToValidate !== "" && !phoneToValidate.match(/^\d{3}-\d{3}-\d{4}$/u))
        return "Phone number is optional, but must be a properly-formatted 10-digit phone number if present.";
    // Phone number is valid here.
    return "";
}

function validateEmail(emailToValidate) {
    // Check if email is missing or invalid.
    if (!emailToValidate || !emailToValidate.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/))
        return "This field is required and must be a valid email address.";
    // Email is valid here.
    return "";
}

function validateCCName(ccNameToValidate) {
    // Check if CC name is missing.
    if (!ccNameToValidate)
        return "This field is required.";
    // CC name is valid here.
    return "";
}

function validateAddress(addressToValidate) {
    // Check if address is missing.
    if (!addressToValidate)
        return "This field is required.";
    // Address is valid here.
    return "";
}

function validateCity(cityToValidate) {
    // Check if city is missing.
    if (!cityToValidate)
        return "This field is required.";
    // City is valid here.
    return "";
}

function validateState(stateToValidate) {
    // Check if state is missing or invalid.
    if (!stateToValidate || !states.map(current => current.value).includes(stateToValidate))
        return "Please choose one of the states.";
    // State is valid here.
    return "";
}

function validateZip(zipToValidate) {
    // Check if ZIP code is missing or invalid.
    if (!zipToValidate || !zipToValidate.match(/^\d{5}$/u))
        return "This field is required and must be a valid ZIP code.";
    // ZIP code is valid here.
    return "";
}

function validateCCNum(ccNumToValidate) {
    // Check if CC number is missing or invalid.
    if (!ccNumToValidate || !ccNumToValidate.match(/^\d{4}\u{0020}\d{4}\u{0020}\d{4}\u{0020}\d{4}$/u))
        return "This field is required and must be a valid credit card number.";
    // CC number is valid here.
    return "";
}

function expDateIsExpired(expDate) {
    const [expMonth, expYear] = expDate.split("/");
    const expDateAsDate = new Date("20" + expYear, expMonth - 1);
    return expDateAsDate <= new Date(Date.now());
}

function validateExpDate(expDateToValidate) {
    // Check if exp date is missing or invalid.
    if (!expDateToValidate || !expDateToValidate.match(/^(?:0[1-9]|1[0-2])\/\d{2}$/u))
        return "This field is required and must be in the form MM/YY.";
    // Check if exp date is in the past.
    if (expDateIsExpired(expDateToValidate))
        return "Expiration date can't be in the past (i.e., your card must not be expired.)";
    // Exp date is valid here.
    return "";
}

function validate3Digit(threeDigitToValidate) {
    // Check if 3-digit code is missing or invalid.
    if (!threeDigitToValidate || !threeDigitToValidate.match(/^\d{3}$/u))
        return "This field is required and must be three digits.";
    // 3-digit code is valid here.
    return "";
}

// Returns true if any of the fields are invalid.
export function validateConfirmForm(reserveUserInfo) {
    // All of these functions return an error
    // message if the field that they test is
    // invalid, so if they are all falsy (they
    // don't return a message), then the form
    // is valid.
    return validateFName(reserveUserInfo.resFirstName) ||
           validateLName(reserveUserInfo.resLastName) ||
           validatePhone(reserveUserInfo.resPhone) ||
           validateEmail(reserveUserInfo.resEmail) ||
           validateCCName(reserveUserInfo.resCCName) ||
           validateAddress(reserveUserInfo.resAddress) ||
           validateCity(reserveUserInfo.resCity) ||
           validateState(reserveUserInfo.resState)||
           validateZip(reserveUserInfo.resZip) ||
           validateCCNum(reserveUserInfo.resCCNum) ||
           validateExpDate(reserveUserInfo.resExpDate) ||
           validate3Digit(reserveUserInfo.res3Digit);
}

export default function ConfirmReservation({reserveUserInfo, handleSubmit}) {
    useEffect(() => {
        const currentDate = new Date();
        reserveUserInfo.setResExpDate(`${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toPrecision(4).substring(2)}`);
    }, []);

    return (<>
        <ReservationHero headerText="Confirm your Reservation" photo={chef} backLink="/reserve-a-table"/>
        <main>
            <form className="ReserveConfirmForm" role='form' onSubmit={handleSubmit}>
                <fieldset>
                    <legend className="DisplayTitle">Contact Info</legend>
                    <label htmlFor="fName" className='ParagraphText'>
                        <span><span className='HighlightText' aria-hidden>*</span>First name:</span>
                        <input
                            type="text"
                            id="fName"
                            name="fName"
                            required
                            autoComplete='given-name'
                            className='FormField LeadText'
                            value={reserveUserInfo.resFirstName}
                            aria-errormessage='fNameError'
                            onChange={e => reserveUserInfo.setResFirstName(e.target.value)}
                        />
                        <p id="fNameError" className='HighlightText' role='alert'>{validateFName(reserveUserInfo.resFirstName)}</p>
                    </label>
                    <label htmlFor="lName" className='ParagraphText'>
                        <span><span className='HighlightText' aria-hidden>*</span>Last name:</span>
                        <input
                            type="text"
                            id="lName"
                            name="lName"
                            required
                            autoComplete='family-name'
                            className='FormField LeadText'
                            value={reserveUserInfo.resLastName}
                            aria-errormessage='lNameError'
                            onChange={e => reserveUserInfo.setResLastName(e.target.value)}
                        />
                        <p id="lNameError" className='HighlightText' role='alert'>{validateLName(reserveUserInfo.resLastName)}</p>
                    </label>
                    <label htmlFor="phone" className='ParagraphText'>
                        <span aria-hidden>Phone #:</span>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            autoComplete='tel'
                            minLength="12"
                            maxLength="12"
                            placeholder='###-###-####'
                            pattern='^\d{3}-\d{3}-\d{4}$'
                            className='FormField LeadText'
                            aria-label='Phone number:'
                            aria-errormessage='phoneError'
                            value={reserveUserInfo.resPhone}
                            onChange={e => {
                                if (e.target.value.match(/^(?:(?:\d{1,2})|(?:\d{3}-?)){1,2}(?:\d{1,4})?$/ug) || !e.target.value) {
                                    // If the number of digits > 4 && the number of digits % 4 === 1, and there isn't already a space before the digit that the user just typed, add one.
                                    let digits = e.target.value.length !== 0 ? e.target.value.match(/\d{1}/g).length : 0; // Finds the digits in the string.
                                    if ((digits === 4 || digits === 7) && e.target.value.at(-2) !== "-") {
                                        let valAsArray = Array.from(e.target.value);
                                        valAsArray.splice(e.target.value.length - 1, 0, "-");
                                        e.target.value = valAsArray.toString().replaceAll(",", "");
                                    }

                                    reserveUserInfo.setResPhone(e.target.value);
                                }
                            }}
                        />
                        <p id="phoneError" className='HighlightText' role='alert'>{validatePhone(reserveUserInfo.resPhone)}</p>
                    </label>
                    <label htmlFor="email" className='ParagraphText'>
                        <span><span className='HighlightText' aria-hidden>*</span>Email:</span>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder='yourname@example.com'
                            required
                            className='FormField LeadText'
                            value={reserveUserInfo.resEmail}
                            aria-errormessage='emailError'
                            onChange={e => reserveUserInfo.setResEmail(e.target.value)}
                        />
                        <p id="emailError" className='HighlightText' role='alert'>{validateEmail(reserveUserInfo.resEmail)}</p>
                    </label>
                </fieldset>

                <fieldset>
                    <legend className='DisplayTitle'>Billing Info</legend>
                    <label htmlFor="ccName" className='ParagraphText'>
                        <span><span className='HighlightText' aria-hidden>*</span>Name on credit card:</span>
                        <input
                            type="text"
                            id="ccName"
                            name="ccName"
                            required
                            autoComplete='cc-name'
                            className='FormField LeadText'
                            value={reserveUserInfo.resCCName}
                            aria-errormessage='ccNameError'
                            onChange={e => reserveUserInfo.setResCCName(e.target.value)}
                        />
                        <p id="ccNameError" className='HighlightText' role='alert'>{validateCCName(reserveUserInfo.resCCName)}</p>
                    </label>
                    <label htmlFor="address" className='ParagraphText'>
                        <span><span className='HighlightText' aria-hidden>*</span>Address:</span>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder='123 Main St.'
                            required
                            autoComplete='billing address-line1'
                            className='FormField LeadText'
                            value={reserveUserInfo.resAddress}
                            aria-errormessage='adressError'
                            onChange={e => reserveUserInfo.setResAddress(e.target.value)}
                        />
                        <p id="addressError" className='HighlightText' role='alert'>{validateAddress(reserveUserInfo.resAddress)}</p>
                    </label>
                    <label htmlFor="addressLine2" className='ParagraphText'>
                        <span>Address line 2:</span>
                        <input
                            type="text"
                            id="addressLine2"
                            name="addressLine2"
                            placeholder='Apt. #456'
                            autoComplete='billing address-line2'
                            className='FormField LeadText'
                            value={reserveUserInfo.resAddress2}
                            onChange={e => reserveUserInfo.setResAddress2(e.target.value)}
                        />
                        {/* Address line 2 doesn't have any validation at all. */}
                    </label>
                    <label htmlFor="city" className='ParagraphText'>
                        <span><span className='HighlightText' aria-hidden>*</span>City:</span>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            required
                            autoComplete='billing address-level2'
                            className='FormField LeadText'
                            value={reserveUserInfo.resCity}
                            aria-errormessage='cityError'
                            onChange={e => reserveUserInfo.setResCity(e.target.value)}
                        />
                        <p id="cityError" className='HighlightText' role='alert'>{validateCity(reserveUserInfo.resCity)}</p>
                    </label>
                    <label htmlFor="state" className='ParagraphText'>
                        <span><span className='HighlightText' aria-hidden>*</span>State:</span>
                        <select
                            id="state"
                            name="state"
                            required
                            className='FormDropDown LeadText'
                            autoComplete='billing address-level1'
                            value={reserveUserInfo.resState}
                            aria-errormessage='stateError'
                            onChange={e => reserveUserInfo.setResState(e.target.value)}
                        >
                            {states.map(currentState =>
                                <option key={currentState.value} value={currentState.value} className='LeadText' aria-label={currentState.accessibleValue}>{currentState.value}</option>
                            )}
                        </select>
                        <p id="stateError" className='HighlightText' role='alert'>{validateState(reserveUserInfo.resState)}</p>
                    </label>
                    <label htmlFor="zip" className='ParagraphText'>
                        <span><span className='HighlightText' aria-hidden>*</span>ZIP code:</span>
                        <input
                            type="tel"
                            id="zip"
                            name="zip"
                            required
                            minLength="5"
                            maxLength="5"
                            placeholder='#####'
                            pattern='^\d{5}$'
                            autoComplete='billing postal-code'
                            className='FormField LeadText'
                            value={reserveUserInfo.resZip}
                            aria-errormessage='zipError'
                            onChange={e => {
                                if (e.target.value.match(/^\d{1,5}$/) || !e.target.value)
                                    reserveUserInfo.setResZip(e.target.value);
                            }}
                        />
                        <p id="zipError" className='HighlightText' role='alert'>{validateZip(reserveUserInfo.resZip)}</p>
                    </label>
                    <label htmlFor="ccNum" className='ParagraphText'>
                        <span><span className='HighlightText' aria-hidden>*</span>Credit card number:</span>
                        <input
                            type="tel"
                            id="ccNum"
                            name="ccNum"
                            required
                            maxLength="19"
                            minLength="19"
                            placeholder='#### #### #### ####'
                            pattern='^\d{4}\u{0020}\d{4}\u{0020}\d{4}\u{0020}\d{4}$'
                            autoComplete='cc-number'
                            className='FormField LeadText'
                            value={reserveUserInfo.resCCNum}
                            aria-errormessage='ccNumError'
                            onChange={e => {
                                // reserveUserInfo.setResCCNum(e.target.value);
                                // If the input so far includes only digits (with spaces after evcery four) or is blank, then...
                                if (e.target.value.match(/^(?:(?:\d{1,3})|(?:\d{4}\u{0020}?)){1,3}(?:\d{1,4})?$/ug) || !e.target.value) {
                                    // If the number of digits > 4 && the number of digits % 4 === 1, and there isn't already a space before the digit that the user just typed, add one.
                                    let digits = e.target.value.length !== 0 ? e.target.value.match(/\d{1}/g).length : 0; // Finds the digits in the string.
                                    if (digits > 4 && digits % 4 === 1 && e.target.value.at(-2) !== " ") {
                                        let valAsArray = Array.from(e.target.value);
                                        valAsArray.splice(e.target.value.length - 1, 0, " ");
                                        e.target.value = valAsArray.toString().replaceAll(",", "");
                                    }
                                    // After that check, update the state.
                                    reserveUserInfo.setResCCNum(e.target.value);
                                }
                            }}
                        />
                        <p id="ccNumError" className='HighlightText' role='alert'>{validateCCNum(reserveUserInfo.resCCNum)}</p>
                    </label>
                    <label htmlFor="expDate" className='ParagraphText'>
                        <span><span className='HighlightText' aria-hidden>*</span>Expiration date:</span>
                        <input
                            type="tel"
                            id="expDate"
                            name="expDate"
                            required
                            maxLength="5"
                            minLength="5"
                            placeholder='MM/YY'
                            pattern='^(?:0[1-9]|1[0-2])\/\d{2}$'
                            autoComplete='cc-exp'
                            className='FormField LeadText'
                            value={reserveUserInfo.resExpDate}
                            aria-errormessage='expDateError'
                            onChange={e => {
                                // Input should be either a single digit (0 or 1) or 2 digits (0 followed by a nonzero digit,
                                // or 1 followed by 0, 1, or 2). If it's two digits, they might be followed by a /, which
                                // itself might be followed by 1 or 2 digits.
                                if (e.target.value.match(/^[0-1]$|^0[1-9]\/?(?:\d{1,2})?$|^1[0-2]\/?(?:\d{1,2})?$/g) || !e.target.value) {
                                    // If the number of digits > 2 && the number of digits % 2 === 1 && there isn't already a / before the digit that the user just typed, add one.
                                    let digits = e.target.value.length !== 0 ? e.target.value.match(/\d{1}/g).length : 0; // Finds the digits in the string.
                                    if (digits > 2 && digits % 2 === 1 && e.target.value.at(-2) !== "/") {
                                        let valAsArray = Array.from(e.target.value);
                                        valAsArray.splice(e.target.value.length - 1, 0, "/");
                                        e.target.value = valAsArray.toString().replaceAll(",", "");
                                    }
                                    // After that, update the state.
                                    reserveUserInfo.setResExpDate(e.target.value);
                                }
                            }}
                        />
                        <p id="expDateError" className='HighlightText' role='alert'>{validateExpDate(reserveUserInfo.resExpDate)}</p>
                    </label>
                    <label htmlFor="threeDigitCode" className='ParagraphText'>
                        <span><span className='HighlightText' aria-hidden>*</span>3-digit code:</span>
                        <input
                            type="tel"
                            id="threeDigitCode"
                            name="threeDigitCode"
                            required
                            placeholder='###'
                            minLength="3"
                            maxLength="3"
                            pattern='^\d{3}$'
                            autoComplete='cc-csc'
                            className='FormField LeadText'
                            value={reserveUserInfo.res3Digit}
                            aria-errormessage='threeDigitError'
                            onChange={e => {
                                if (e.target.value.match(/^\d{1,3}$/) || !e.target.value)
                                    reserveUserInfo.setRes3Digit(e.target.value);
                            }}
                        />
                        <p id="threeDigitError" className='HighlightText' role='alert'>{validate3Digit(reserveUserInfo.res3Digit)}</p>
                    </label>
                </fieldset>

                <button type="submit" className='MainButton LeadText' disabled={validateConfirmForm(reserveUserInfo)}>Confirm Reservation</button>
            </form>
        </main>
    </>);
}