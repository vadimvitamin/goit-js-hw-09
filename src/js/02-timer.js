import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';

const DELAY_MS = 1000;
const inputRef = document.querySelector('#datetime-picker');
const btnRef = document.querySelector('[data-start]');
const outputRef = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let currentTime = null; // поточний час таймера
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    onPickerClose(selectedDates[0]);
  },
};

flatpickr(inputRef, options);
btnRef.addEventListener('click', onBtnClick);

function ticTimer() {
  if (currentTime === null) return;
  if (intervalId === null) return;

  currentTime -= DELAY_MS;
  if (currentTime < 0) {
    clearInterval(intervalId);
    intervalId = null;
    return;
  }
  updateTime(convertMs(currentTime));
  console.log('tic', currentTime);
}

function onBtnClick() {
  intervalId = setInterval(() => {
    ticTimer();
  }, DELAY_MS);
}

function onPickerClose(date) {
  const currentDate = new Date();

  if (date <= currentDate) {
    Notify.failure('Please choose a date in the future');
    return;
  }
  currentTime = date - currentDate;
  btnRef.disabled = false;
}

function updateTime(dateTime) {
  const { days, hours, minutes, seconds } = dateTime;

  outputRef.days.textContent = addLeadingZero(days);

  outputRef.hours.textContent = addLeadingZero(hours);

  outputRef.minutes.textContent = addLeadingZero(minutes);

  outputRef.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(number) {
  return String(number).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
