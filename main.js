const add = (x, y, z) => { return x + y + z }
const avg = (x, y, z) => { return (x + y + z)/3 }

const validate = async (event) => {
  console.log(`triggered validate on ${event.target.id}`)
  const isValid = event.target.checkValidity()
  if (isValid) {
    event.target.nextElementSibling.innerHTML = ''
  } else {
    event.target.nextElementSibling.innerHTML = 'Invalid input'
    event.target.focus()
  }
}

const updateWithAdd = async (event) => {
  document.querySelector('#result').innerHTML = ''
  if (document.querySelector('#firstNumber').checkValidity() && document.querySelector('#secondNumber').checkValidity() && document.querySelector('#thirdNumber').checkValidity()) {
    const regex = /[^a-zA-Z_]/g
    const s = document.querySelector('#guest').value.replace(regex, '')
    const i = parseInt(document.querySelector('#firstNumber').value)
    const j = parseInt(document.querySelector('#secondNumber').value)
    const k = parseInt(document.querySelector('#thirdNumber').value)
    const ans = `${s}, your sum is ${add(i, j, k)}.`
    document.querySelector('#result').innerHTML = ans
  }
}

const updateWithAvg = async (event) => {
  document.querySelector('#result').innerHTML = ''
  if (document.querySelector('#firstNumber').checkValidity() && document.querySelector('#secondNumber').checkValidity() && document.querySelector('#thirdNumber').checkValidity()) {
    const regex = /[^a-zA-Z_]/g
    const s = document.querySelector('#guest').value.replace(regex, '')
    const i = parseInt(document.querySelector('#firstNumber').value)
    const j = parseInt(document.querySelector('#secondNumber').value)
    const k = parseInt(document.querySelector('#thirdNumber').value)
    const ans = `${s}, your average is ${avg(i, j, k)}.`
    document.querySelector('#result').innerHTML = ans
  }
}

const updateWithJoke = async (event) => {
  document.querySelector('#result').innerHTML = ''
  const url = 'https://api.icndb.com/jokes/random?limitTo=[nerdy]'
  const response = await fetch(url)
  const obj = await response.json()
  const joke = obj.value.joke || 'No joke for you.'
  document.querySelector('#result').innerHTML = joke
}

// delegate to dynamic elements (e.g. when testing)
// focusout is like blur, but it bubbles up

document.addEventListener('focusout', event => {
  if ((event.target && event.target.id === 'firstNumber') ||
    (event.target && event.target.id === 'secondNumber')) {
    validate(event)
  }
})

document.addEventListener('click', event => {
  if (event.target && event.target.id === 'addButton') { updateWithAdd(event) }
})

document.addEventListener('click', event => {
  if (event.target && event.target.id === 'avgButton') { updateWithAvg(event) }
})

document.addEventListener('click', event => {
  if (event.target && event.target.id === 'getJokeButton') { updateWithJoke(event) }
})

class Stopwatch {
  constructor(display, results) {
      this.running = false;
      this.display = display;
      this.results = results;
      this.laps = [];
      this.reset();
      this.print(this.times);
  }
  
  reset() {
      this.times = [ 0, 0, 0 ];
  }
  
  start() {
      if (!this.time) this.time = performance.now();
      if (!this.running) {
          this.running = true;
          requestAnimationFrame(this.step.bind(this));
      }
  }
  
  lap() {
      let times = this.times;
      let li = document.createElement('li');
      li.innerText = this.format(times);
      this.results.appendChild(li);
  }
  
  stop() {
      this.running = false;
      this.time = null;
  }

  restart() {
      if (!this.time) this.time = performance.now();
      if (!this.running) {
          this.running = true;
          requestAnimationFrame(this.step.bind(this));
      }
      this.reset();
  }
  
  clear() {
      clearChildren(this.results);
  }
  
  step(timestamp) {
      if (!this.running) return;
      this.calculate(timestamp);
      this.time = timestamp;
      this.print();
      requestAnimationFrame(this.step.bind(this));
  }
  
  calculate(timestamp) {
      var diff = timestamp - this.time;
      // Hundredths of a second are 100 ms
      this.times[2] += diff / 10;
      // Seconds are 100 hundredths of a second
      if (this.times[2] >= 100) {
          this.times[1] += 1;
          this.times[2] -= 100;
      }
      // Minutes are 60 seconds
      if (this.times[1] >= 60) {
          this.times[0] += 1;
          this.times[1] -= 60;
      }
  }
  
  print() {
      this.display.innerText = this.format(this.times);
  }
  
  format(times) {
      return `\
${pad0(times[0], 2)}:\
${pad0(times[1], 2)}:\
${pad0(Math.floor(times[2]), 2)}`;
  }
}

function pad0(value, count) {
  var result = value.toString();
  for (; result.length < count; --count)
      result = '0' + result;
  return result;
}

function clearChildren(node) {
  while (node.lastChild)
      node.removeChild(node.lastChild);
}

let stopwatch = new Stopwatch(
  document.querySelector('.stopwatch'),
  document.querySelector('.results'));