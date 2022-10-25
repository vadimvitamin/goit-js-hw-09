import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
const formRef = document.querySelector('.form');

formRef.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();

  const { delay, step, amount } = getFormData(e.target);

  // console.log('promise', delay, step, amount);
  for (let i = 0; i < amount; i += 1) {
    const promise = createPromise(i + 1, delay + i * step);
    promise
      .then(result => {
        const { position, delay } = result;

        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(result => {
        const { position, delay } = result;

        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });
  }
}

function getFormData(formRef) {
  return {
    delay: formRef.delay.valueAsNumber,
    step: formRef.step.valueAsNumber,
    amount: formRef.amount.valueAsNumber,
  };
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
