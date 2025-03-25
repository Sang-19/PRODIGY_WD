let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let interval;
let isRunning = false;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapList = document.getElementById('lapList');

function startStopwatch() {
    if (!isRunning) {
        isRunning = true;
        interval = setInterval(updateTime, 10);
        startBtn.disabled = true;
        pauseBtn.disabled = false;
    }
}

function pauseStopwatch() {
    isRunning = false;
    clearInterval(interval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function resetStopwatch() {
    isRunning = false;
    clearInterval(interval);
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
    updateDisplay();
    lapList.innerHTML = '';
    startBtn.disabled = false;
    pauseBtn.disabled = false;
}

function updateTime() {
    milliseconds++;
    if (milliseconds === 100) {
        milliseconds = 0;
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
    }
    updateDisplay();
}

function updateDisplay() {
    minutesDisplay.textContent = padNumber(minutes);
    secondsDisplay.textContent = padNumber(seconds);
    millisecondsDisplay.textContent = padNumber(milliseconds);
}

function padNumber(number) {
    return number.toString().padStart(2, '0');
}

function addLap() {
    if (isRunning) {
        const lapTime = `${padNumber(minutes)}:${padNumber(seconds)}:${padNumber(milliseconds)}`;
        const lapItem = document.createElement('li');
        lapItem.textContent = `Lap ${lapList.children.length + 1}: ${lapTime}`;
        lapList.appendChild(lapItem);
    }
}

startBtn.addEventListener('click', startStopwatch);
pauseBtn.addEventListener('click', pauseStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', addLap);