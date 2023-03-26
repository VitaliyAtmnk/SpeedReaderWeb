pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js";

const fileInput = document.getElementById('file-input');
const fileIcon = document.getElementById('file-icon');
const focusPoint = document.getElementById('focus-point');
const playPauseBtn = document.getElementById('play-pause-btn');
const speedSlider = document.getElementById('speed-slider');
const wpm = document.getElementById('slider-speed');
const pages = document.getElementById('pages');
const newDiv = document.createElement('div');
newDiv.setAttribute('id', 'circle');

let words = [];
let currentWordIndex = 0;
let isPaused = true;
let timeout;

fileIcon.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file.type === 'application/pdf') {
        words = await readPdf(file);
    } else if (file.type === 'text/plain') {
        words = await readTxt(file);
    }
    currentWordIndex = 0;
});

playPauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    playPauseBtn.textContent = !isPaused ? '❚❚' : '▶';
    if (!isPaused) {
        displayWords();
    } else {
        clearTimeout(timeout);
    }
});

speedSlider.addEventListener("input", function() {
    let speed = -speedSlider.value + 800;
    let wordsPerMinute = Math.floor((1000/speed) * 60);
    wpm.innerHTML = wordsPerMinute;
  });

async function readPdf(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    let text = '';
    pages.innerText= `0/${numPages}`;
    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + ' ';
    }

    return text.split(/\s+/);
}
async function readTxt(file) {
    const text = await file.text();
    return text.split(/\s+/);
}

function displayWords() {
    if (currentWordIndex >= words.length) {
        isPaused = true;
        playPauseBtn.textContent = '▶';
        return;
    }
    
    let speed = -speedSlider.value + 800;
    focusPoint.textContent = words[currentWordIndex++];
    focusPoint.appendChild(newDiv);
    timeout = setTimeout(displayWords, speed);
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// create fireflies array
let fireflies = [];

// define firefly class
class Firefly {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.opacity = Math.random();
    this.radius = Math.random() * 3;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.01;
    if (this.opacity < 0) {
      this.opacity = 1;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
    }
    this.draw();
  }
}

// create initial fireflies
for (let i = 0; i < 30; i++) {
  fireflies.push(new Firefly());
}

// animate fireflies
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < fireflies.length; i++) {
    fireflies[i].update();
  }
}

animate();
