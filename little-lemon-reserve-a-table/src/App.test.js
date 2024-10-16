import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

import {initializeTimes, updateTimes, submitAPI} from './App';
import App from './App';
import ReserveATable, {validateReserveForm} from './Pages/ReserveATable';
import ConfirmReservation, {validateConfirmForm} from './Pages/ConfirmReservation';
import HeaderProvider from './Components/HeaderProvider';

beforeEach(() => {
  localStorage.removeItem("TableReservation-2024-10-11-17:00");
});

test('Renders the "Submit" button for the first page of the reservation form', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );
  const submitButton = screen.getByText(/Submit Reservation/i);
  expect(submitButton).toBeInTheDocument();
});

test('initializeTimes returns a non-empty array', () => {
  expect(initializeTimes().length).toBeGreaterThan(0);
});

test('updateTimes works', () => {
  let newDate = new Date("2024-10-11");
  newDate.setDate(newDate.getDate() + 1);

  expect(updateTimes(["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"], {type: "changed_date", newDate: newDate})).toStrictEqual(["17:00", "17:30", "18:30", "19:00", "20:30", "21:00", "22:00", "23:30"]);
});

test('First part of the reservation form can be submitted', () => {
  render(
    <React.StrictMode>
      <BrowserRouter>
        <HeaderProvider>
          <App/>
        </HeaderProvider>
      </BrowserRouter>
    </React.StrictMode>
  );

  const reserveButton = screen.getByText(/Reserve a Table/i)
  fireEvent.click(reserveButton);

  // !!! THIS ONLY WORKS BECAUSE EVERYTHING ON THE FIRST PAGE !!! //
  // !!! OF THE FORM HAPPENS TO BE VALID BY DEFAULT. UPDATE   !!! //
  // !!! THIS TEST CASE IF THAT CHANGES.                      !!! //
  const submitButton = screen.getByText(/Submit Reservation/i);
  fireEvent.click(submitButton);

  const newHeader = screen.getByText(/Confirm your Reservation/i);
  expect(newHeader).toBeInTheDocument();
});

test('Reservation data is written to local storage.', () => {
  submitAPI({
    resDate: "2024-10-11",
    resTime: "17:00",
    resGuests: 1,
    resSeating: "No Preference",
    resOccasion: "nothing",
    resComments: ""
  });
  submitAPI({
    resDate: "2024-10-11",
    resTime: "17:00",
    resFirstName: "Collin",
    resLastName: "Vesel",
    resPhone: "",
    resEmail: "cvesel217@gmail.com",
    resCCName: "Collin vesel",
    resAddress: "318 S Clayton Ave.",
    resAddress2: "",
    resCity: "Maryville",
    resState: "MO",
    resZip: "64468",
    resCCNum: "0000 0000 0000 0000",
    resExpDate: "10/27",
    res3Digit: "000"
  });

  expect(JSON.parse(localStorage.getItem("TableReservation-2024-10-11-17:00"))).toStrictEqual({
    resDate: "2024-10-11",
    resTime: "17:00",
    resGuests: 1,
    resSeating: "No Preference",
    resOccasion: "nothing",
    resComments: "",
    resFirstName: "Collin",
    resLastName: "Vesel",
    resPhone: "",
    resEmail: "cvesel217@gmail.com",
    resCCName: "Collin vesel",
    resAddress: "318 S Clayton Ave.",
    resAddress2: "",
    resCity: "Maryville",
    resState: "MO",
    resZip: "64468",
    resCCNum: "0000 0000 0000 0000",
    resExpDate: "10/27",
    res3Digit: "000"
  });
});

test('Reservation date is required.', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const dateElement = screen.getByLabelText(/Choose a date:/);
  expect(dateElement).toHaveAttribute("required");
});

test('Reservation date is type date.', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const dateElement = screen.getByLabelText(/Choose a date:/);
  expect(dateElement).toHaveAttribute("type", "date");
});

test("Reservation date has today's date as the minimum.", () => {
  const currentDate = new Date();
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const dateElement = screen.getByLabelText(/Choose a date:/);
  expect(dateElement).toHaveAttribute("min", `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate()).toPrecision(2)}`);
});

test('Reservation time is required.', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const timeElement = screen.getByLabelText(/Choose a time:/);
  expect(timeElement).toHaveAttribute("required");
});

test('Reservation number of guests is required.', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const dateElement = screen.getByLabelText(/Number of guests:/);
  expect(dateElement).toHaveAttribute("required");
});

test('Reservation number of guests is type number.', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const dateElement = screen.getByLabelText(/Number of guests:/);
  expect(dateElement).toHaveAttribute("type", "number");
});

test('Reservation number of guests has 1 as the minimum.', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const dateElement = screen.getByLabelText(/Number of guests:/);
  expect(dateElement).toHaveAttribute("min", "1");
});

test('Reservation number of guests has 10 as the maximum.', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const dateElement = screen.getByLabelText(/Number of guests:/);
  expect(dateElement).toHaveAttribute("max", "10");
});

test('Reservation number of guests has 1 as the step amount.', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const dateElement = screen.getByLabelText(/Number of guests:/);
  expect(dateElement).toHaveAttribute("step", "1");
});

test('Reservation seating choice is required.', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const seatingElement = screen.getByLabelText(/No Preference/);
  expect(seatingElement).toHaveAttribute("required");
});

test('Reservation occasion is required.', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const occasionElement = screen.getByLabelText(/Is it a special occasion\?/);
  expect(occasionElement).toHaveAttribute("required");
});

test('Reservation comments is not required normally.', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const commentsElement = screen.getByLabelText(/Additional comments\? \(i\.e\.\, any special isntructions or accommodations needed\):/);
  expect(commentsElement).not.toHaveAttribute("required");
});

test('Reservation comments is required if occasion is "other".', () => {
  const reserveInfo = {
    resDate: "2024-10-11",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 1,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "other",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ReserveATable reserveInfo={reserveInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const commentsElement = screen.getByLabelText(/Additional comments\? \(i\.e\.\, any special isntructions or accommodations needed\):/);
  expect(commentsElement).toHaveAttribute("required");
});

test('Reservation form page 1 can be submitted when all fields are valid.', async () => {
  // Leave most things as their default values because those are all valid.
  // Change resDate and resGuests, since their default values are boundary
  // cases that other tests cover.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeFalsy();
});

test('Reservation form page 1 cannot be submitted when date is missing.', () => {
  // Everything stays the same as the "happy path" test case above, but no date.
  const reserveInfo = {
    resDate: "",
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when date is in the past.', () => {
  // Everything stays the same as the "happy path" test case above, but date is in the past.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `1900-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when date is yesterday.', async () => {
  // (Boundary case. Should be invalid.)
  // Everything stays the same as the "happy path" test case above, but date is yesterday.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() - 1).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when date is not a date.', () => {
  // Everything stays the same as the "happy path" test case above, but date is not a valid date.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 can be submitted when date is today.', () => {
  // (Boudary case. Data should be valid.)
  // Everything stays the same as the "happy path" test case, but the date is today.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate()).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeFalsy();
});

test('Reservation form page 1 cannot be submitted when time is invalid.', () => {
  // Everything is the same as the "happy path" test case, but the time is not in the list.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "8:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when time is missing.', () => {
  // Everything is the same as the "happy path" test case, but the time is missing.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when number of guests is missing.', () => {
  // Everything is the same as the "happy path" test case, but the number of guests is missing.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: "",
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when number of guests is not a number.', () => {
  // Everything is the same as the "happy path" test case, but the number of guests is something other than a number.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: "abc",
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when number of guests < 1.', () => {
  // Everything is the same as the "happy path" test case, but the number of guests is too low.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: "-2",
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when number of guests === 0.', () => {
  // (Boundary case. Should be invalid.)
  // Everything is the same as the "happy path" test case, but the number of guests is 0.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: "0",
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when number of guests > 10.', () => {
  // Everything is the same as the "happy path" test case, but the number of guests is too high.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: "13",
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when number of guests === 11.', () => {
  // (Boundary case. Should be invalid.)
  // Everything is the same as the "happy path" test case, but the number of guests is 11.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: "11",
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when number of guests is not a whole number.', () => {
  // Everything is the same as the "happy path" test case, but the number of guests is not a whole number.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: "1.5",
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 can be submitted when number of guests === 1.', () => {
  // (Boudary case. Should be valid.)
  // Everything is the same as the "happy path" test case, but the number of guests is 1.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: "1",
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeFalsy();
});

test('Reservation form page 1 can be submitted when number of guests === 10.', () => {
  // (Boudary case. Should be valid.)
  // Everything is the same as the "happy path" test case, but the number of guests is 10.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: "10",
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeFalsy();
});

test('Reservation form page 1 cannot be submitted when seating choice is missing.', () => {
  // Everything is the same as the "happy path" test case, but no seating choice.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when seating choice is invalid.', () => {
  // Everything is the same as the "happy path" test case, but seating choice is invalid.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "idk wut 2 put hear ¯\_(ツ)_/¯",
    setResSeating: jest.fn(),
    resOccasion: "nothing",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when occasion is missing.', () => {
  // Everything is the same as the "happy path" test case, but no occasion.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when occasion is invalid.', () => {
  // Everything is the same as the "happy path" test case, but occasion is invalid.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "...something",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 cannot be submitted when occasion is "other" and no comments.', () => {
  // Everything is the same as the "happy path" test case, but occasion is "other" and no comments.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "other",
    setResOccasion: jest.fn(),
    resComments: "",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeTruthy();
});

test('Reservation form page 1 can be submitted when occasion is "other" and comments are present.', () => {
  // Everything is the same as the "happy path" test case, but occasion is "other" and comments are present.
  const currentDate = new Date(Date.now());
  const reserveInfo = {
    resDate: `${(currentDate.getFullYear()).toPrecision(4)}-${(currentDate.getMonth() + 1).toPrecision(2)}-${(currentDate.getDate() + 3).toPrecision(2)}`,
    setResDate: jest.fn(),
    availableTimes: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    setAvailableTimes: jest.fn(),
    resTime: "17:00",
    setResTime: jest.fn(),
    resGuests: 3,
    setResGuests: jest.fn(),
    resSeating: "No Preference",
    setResSeating: jest.fn(),
    resOccasion: "other",
    setResOccasion: jest.fn(),
    resComments: "Testing the tests.",
    setResComments: jest.fn()
  };

  expect(validateReserveForm(reserveInfo)).toBeFalsy();
});

test('Reservation first name is required.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const fNameElement = screen.getByLabelText(/First name:/);
  expect(fNameElement).toHaveAttribute("required");
});

test('Reservation last name is required.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const lNameElement = screen.getByLabelText(/Last name:/);
  expect(lNameElement).toHaveAttribute("required");
});

test('Reservation phone is type tel', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const phoneElement = screen.getByLabelText(/Phone #:/);
  expect(phoneElement).toHaveAttribute("type", "tel");
});

test('Reservation phone must be exactly 12 characters long', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const phoneElement = screen.getByLabelText(/Phone #:/);
  expect(phoneElement).toHaveAttribute("minLength", "12");
  expect(phoneElement).toHaveAttribute("maxLength", "12");
});

test('Reservation phone must be a phone number', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const phoneElement = screen.getByLabelText(/Phone #:/);
  expect(phoneElement).toHaveAttribute("pattern", "^\\d{3}-\\d{3}-\\d{4}$");
});

test('Reservation email name is required.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const emailElement = screen.getByLabelText(/Email:/);
  expect(emailElement).toHaveAttribute("required");
});

test('Reservation email is type email.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const emailElement = screen.getByLabelText(/Email:/);
  expect(emailElement).toHaveAttribute("type", "email");
});

test('Reservation CC name is required.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const ccNameElement = screen.getByLabelText(/Name on credit card:/);
  expect(ccNameElement).toHaveAttribute("required");
});

test('Reservation address is required.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const addressElement = screen.getByLabelText(/Address:/);
  expect(addressElement).toHaveAttribute("required");
});

test('Reservation city is required.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const cityElement = screen.getByLabelText(/City:/);
  expect(cityElement).toHaveAttribute("required");
});

test('Reservation state is required.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const stateElement = screen.getByLabelText(/State:/);
  expect(stateElement).toHaveAttribute("required");
});

test('Reservation zip is required.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const zipElement = screen.getByLabelText(/ZIP code:/);
  expect(zipElement).toHaveAttribute("required");
});

test('Reservation zip is type tel.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const zipElement = screen.getByLabelText(/ZIP code:/);
  expect(zipElement).toHaveAttribute("type", "tel");
});

test('Reservation zip must be exactly 5 characters long.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const zipElement = screen.getByLabelText(/ZIP code:/);
  expect(zipElement).toHaveAttribute("minLength", "5");
  expect(zipElement).toHaveAttribute("maxLength", "5");
});

test('Reservation zip must be a zip code.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const zipElement = screen.getByLabelText(/ZIP code:/);
  expect(zipElement).toHaveAttribute("pattern", "^\\d{5}$");
});

test('Reservation CC number is required.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const ccNumElement = screen.getByLabelText(/Credit card number:/);
  expect(ccNumElement).toHaveAttribute("required");
});

test('Reservation CC number is type tel.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const ccNumElement = screen.getByLabelText(/Credit card number:/);
  expect(ccNumElement).toHaveAttribute("type", "tel");
});

test('Reservation CC number must be 19 characters long.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const ccNumElement = screen.getByLabelText(/Credit card number:/);
  expect(ccNumElement).toHaveAttribute("minLength", "19");
  expect(ccNumElement).toHaveAttribute("maxLength", "19");
});

test('Reservation CC number must be a CC number.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const ccNumElement = screen.getByLabelText(/Credit card number:/);
  expect(ccNumElement).toHaveAttribute("pattern", "^\\d{4}\\u{0020}\\d{4}\\u{0020}\\d{4}\\u{0020}\\d{4}$");
});

test('Reservation exp date is required.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const expDateElement = screen.getByLabelText(/Expiration date:/);
  expect(expDateElement).toHaveAttribute("required");
});

test('Reservation exp date is type tel.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const expDateElement = screen.getByLabelText(/Expiration date:/);
  expect(expDateElement).toHaveAttribute("type", "tel");
});

test('Reservation exp date must be 5 characters long.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const expDateElement = screen.getByLabelText(/Expiration date:/);
  expect(expDateElement).toHaveAttribute("minLength", "5");
  expect(expDateElement).toHaveAttribute("maxLength", "5");
});

test('Reservation exp date must be an exp date.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const expDateElement = screen.getByLabelText(/Expiration date:/);
  expect(expDateElement).toHaveAttribute("pattern", "^(?:0[1-9]|1[0-2])\\/\\d{2}$");
});

test('Reservation 3-digit code is required.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const threeDigitElement = screen.getByLabelText(/3-digit code:/);
  expect(threeDigitElement).toHaveAttribute("required");
});

test('Reservation 3-digit code is type tel.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const threeDigitElement = screen.getByLabelText(/3-digit code:/);
  expect(threeDigitElement).toHaveAttribute("type", "tel");
});

test('Reservation 3-digit code must be 3 characters long.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const threeDigitElement = screen.getByLabelText(/3-digit code:/);
  expect(threeDigitElement).toHaveAttribute("minLength", "3");
  expect(threeDigitElement).toHaveAttribute("maxLength", "3");
});

test('Reservation 3-digit code must be a 3-digit code.', () => {
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "AL",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: "10/27",
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  render(
    <BrowserRouter>
      <HeaderProvider>
        <ConfirmReservation reserveUserInfo={reserveUserInfo}/>
      </HeaderProvider>
    </BrowserRouter>
  );

  const threeDigitElement = screen.getByLabelText(/3-digit code:/);
  expect(threeDigitElement).toHaveAttribute("pattern", "^\\d{3}$");
});

test('Reservation form page 2 can be submitted when all fields are valid.', () => {
  // Happy path.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeFalsy();
});

test('Reservation form page 2 cannot be submitted when first name is missing.', () => {
  // Same as "happy path", except no name.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when last name is missing.', () => {
  // Same as "happy path", but no last name.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when phone is present but invalid.', () => {
  // Same as "happy path", but phone is not a properly-formatted phone number.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "1234",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 can be submitted when phone is empty.', () => {
  // Same as "happy path", but phone is missing. (Should still be valid.)
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeFalsy();
});

test('Reservation form page 2 cannot be submitted when email is missing.', () => {
  // Same as "happy path", but no email.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when email is invalid.', () => {
  // Same as "happy path", but email is not a valid email.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when CC name is missing.', () => {
  // Same as "happy path", but no credit card name.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when address is missing.', () => {
  // Same as "happy path", but no address.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when city is missing.', () => {
  // Same as "happy path", but no city.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when state is missing.', () => {
  // Same as "happy path", but no state.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when state is invalid.', () => {
  // Same as "happy path", but state is not a valid state.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "ZZ",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when zip code is missing.', () => {
  // Same as "happy path", but no ZIP code.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when zip code is invalid.', () => {
  // Same as "happy path", but ZIP code is not a ZIP code.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "123",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when CC number is missing.', () => {
  // Same as "happy path", but no credit card number.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when CC number is invalid.', () => {
  // Same as "happy path", but credit card number is not a valid credit card number.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 00",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when exp date is missing.', () => {
  // Same as "happy path", but no exp date.
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: "",
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when exp date is invalid.', () => {
  // Same as "happy path", but exp date isn't MM/YY.
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: "10",
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when exp date is in the past.', () => {
  // Same as "happy path", but exp date is in the past.
  // (This case might fail in 100 years give-or-take, not sure how to fix.)
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() - 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "000",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when 3-digit code is missing.', () => {
  // Same as "happy path", but no 3-digit code.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});

test('Reservation form page 2 cannot be submitted when 3-digit code is invalid.', () => {
  // Same as "happy path", but 3-digit code is anything other than 3 digits.
  const currentDate = new Date(Date.now());
  const reserveUserInfo = {
    resFirstName: "Tester",
    setResFirstName: jest.fn(),
    resLastName: "Testerson",
    setResLastName: jest.fn(),
    resPhone: "123-456-7890",
    setResPhone: jest.fn(),
    resEmail: "tester@example.com",
    setResEmail: jest.fn(),
    resCCName: "Tester Testerson",
    setResCCName: jest.fn(),
    resAddress: "123 Main St.",
    setResAddress: jest.fn(),
    resAddress2: "",
    setResAddress2: jest.fn(),
    resCity: "Exampleville",
    setResCity: jest.fn(),
    resState: "OK",
    setResState: jest.fn(),
    resZip: "12345",
    setResZip: jest.fn(),
    resCCNum: "0000 0000 0000 0000",
    setResCCNum: jest.fn(),
    resExpDate: `${(currentDate.getMonth() + 1).toPrecision(2)}/${(currentDate.getFullYear() + 3).toString().substring(2)}`,
    setResExpDate: jest.fn(),
    res3Digit: "0",
    setRes3Digit: jest.fn()
  }

  expect(validateConfirmForm(reserveUserInfo)).toBeTruthy();
});