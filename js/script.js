const audio = document.getElementById('audio');
const playlist = document.getElementById('playlist');
const playPauseBtn = document.getElementById('playPauseBtn');
const tracks = playlist.querySelectorAll('li');
const musicToggle = document.getElementById('musicToggle');
const musicDropdown = document.getElementById('musicDropdown');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');


let currentTrackIndex = 0;
let isPlaying = false;

// Initialize audio with first track
audio.src = tracks[currentTrackIndex].dataset.src;
updateActiveTrack(currentTrackIndex);

// Toggle dropdown visibility when main button clicked
musicToggle.addEventListener('click', () => {
  musicDropdown.classList.toggle('hidden');
});

// Update active track UI
function updateActiveTrack(index) {
  tracks.forEach((track, i) => {
    track.classList.toggle('active', i === index);
  });
}

// Play a specific track by index
function playTrack(index) {
  currentTrackIndex = index;
  audio.src = tracks[index].dataset.src;
  updateActiveTrack(index);
  audio.play();
  isPlaying = true;
  updatePlayPauseButton();
}

// Play/pause toggle button handler
playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    isPlaying = true;
  } else {
    audio.pause();
    isPlaying = false;
  }
  updatePlayPauseButton();
});

function updatePlayPauseButton() {
  if (isPlaying) {
    playIcon.classList.add('d-none');
    pauseIcon.classList.remove('d-none');
    playPauseBtn.title = 'Pause';
  } else {
    playIcon.classList.remove('d-none');
    pauseIcon.classList.add('d-none');
    playPauseBtn.title = 'Play';
  }
}


// Playlist item click handler
playlist.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const index = [...tracks].indexOf(e.target);
    playTrack(index);
  }
});

// Auto play next track when current ends
audio.addEventListener('ended', () => {
  currentTrackIndex++;
  if (currentTrackIndex >= tracks.length) {
    currentTrackIndex = 0; // Loop to start
  }
  playTrack(currentTrackIndex);
});

// Optional: Initialize play/pause button text
updatePlayPauseButton();

// Draggable Papers with collision detection (single global mousemove listener)
let highestZ = 1;
let activePaper = null;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.mouseTouchX = 0;
    this.mouseTouchY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = Math.random() * (window.innerWidth - 200);
    this.currentPaperY = Math.random() * (window.innerHeight - 200);
    this.rotating = false;
    this.element = null;
    this.checkScheduled = false;
  }

  init(paper) {
    this.element = paper;
    paper.style.position = 'absolute';
    paper.style.willChange = 'transform';
    this.updatePosition();

    paper.addEventListener('mousedown', (e) => {
      e.preventDefault();
      activePaper = this;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;

      this.mouseTouchX = e.clientX;
      this.mouseTouchY = e.clientY;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      this.rotating = e.button === 2;
    });

    paper.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  updatePosition() {
    this.element.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }

  getBoundingRect() {
    return this.element.getBoundingClientRect();
  }

  isCollidingWith(otherPaper) {
    const aRect = this.getBoundingRect();
    const bRect = otherPaper.getBoundingRect();

    return !(
      aRect.right < bRect.left ||
      aRect.left > bRect.right ||
      aRect.bottom < bRect.top ||
      aRect.top > bRect.bottom
    );
  }

  pushApartFrom(otherPaper) {
    const aRect = this.getBoundingRect();
    const bRect = otherPaper.getBoundingRect();

    const aCenterX = aRect.left + aRect.width / 2;
    const aCenterY = aRect.top + aRect.height / 2;
    const bCenterX = bRect.left + bRect.width / 2;
    const bCenterY = bRect.top + bRect.height / 2;

    let dx = aCenterX - bCenterX;
    let dy = aCenterY - bCenterY;

    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const minDist = (aRect.width + bRect.width) / 2;

    if (dist < minDist) {
      const overlap = minDist - dist;

      dx /= dist;
      dy /= dist;

      this.currentPaperX += dx * overlap / 2;
      this.currentPaperY += dy * overlap / 2;
      otherPaper.currentPaperX -= dx * overlap / 2;
      otherPaper.currentPaperY -= dy * overlap / 2;

      this.updatePosition();
      otherPaper.updatePosition();
    }
  }

  handleCollisions() {
    window.papersArray.forEach(other => {
      if (other !== this && this.isCollidingWith(other)) {
        this.pushApartFrom(other);
      }
    });
  }
}

// Global mousemove and mouseup handlers
document.addEventListener('mousemove', (e) => {
  if (!activePaper || !activePaper.holdingPaper) return;

  e.preventDefault();

  activePaper.mouseX = e.clientX;
  activePaper.mouseY = e.clientY;
  activePaper.velX = activePaper.mouseX - activePaper.prevMouseX;
  activePaper.velY = activePaper.mouseY - activePaper.prevMouseY;

  if (!activePaper.rotating) {
    activePaper.currentPaperX += activePaper.velX;
    activePaper.currentPaperY += activePaper.velY;
  }

  activePaper.prevMouseX = activePaper.mouseX;
  activePaper.prevMouseY = activePaper.mouseY;

  activePaper.updatePosition();

  if (!activePaper.checkScheduled) {
    activePaper.checkScheduled = true;
    requestAnimationFrame(() => {
      activePaper.checkScheduled = false;
      activePaper.handleCollisions();
    });
  }
});

window.addEventListener('mouseup', () => {
  if (activePaper) {
    activePaper.holdingPaper = false;
    activePaper.rotating = false;
    activePaper = null;
  }
});

// Initialize all papers globally
document.addEventListener('DOMContentLoaded', () => {
  const papers = Array.from(document.querySelectorAll('.paper'));
  window.papersArray = [];
  papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
    window.papersArray.push(p);
  });
});

// Emoji animation code
var container = document.getElementById('animate');
var emoji = ['💖', '💃','💕⃝','🧸','😊','💌','❤️','🧡','💛','💚','💙','💜','💖', '💃','💕⃝','🧸','😊','💌','❤️','🧡','💛','💚','💙','💜'];
var circles = [];

for (var i = 0; i < 15; i++) {
  addCircle(i * 150, [10 + 0, 300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 + 0, -300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 - 200, -300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 + 200, 300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 - 400, -300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 + 400, 300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 - 600, -300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 + 600, 300], emoji[Math.floor(Math.random() * emoji.length)]);
}

function addCircle(delay, range, color) {
  setTimeout(function() {
    var c = new Circle(range[0] + Math.random() * range[1], 80 + Math.random() * 4, color, {
      x: -0.15 + Math.random() * 0.3,
      y: 1 + Math.random() * 1
    }, range);
    circles.push(c);
  }, delay);
}

function Circle(x, y, c, v, range) {
  var _this = this;
  this.x = x;
  this.y = y;
  this.color = c;
  this.v = v;
  this.range = range;
  this.element = document.createElement('span');
  this.element.style.opacity = 0;
  this.element.style.position = 'absolute';
  this.element.style.fontSize = '26px';
  this.element.style.color = 'hsl('+(Math.random()*360|0)+',80%,50%)';
  this.element.innerHTML = c;
  container.appendChild(this.element);

  this.update = function() {
    if (_this.y > 800) {
      _this.y = 80 + Math.random() * 4;
      _this.x = _this.range[0] + Math.random() * _this.range[1];
    }
    _this.y += _this.v.y;
    _this.x += _this.v.x;
    this.element.style.opacity = 1;
    this.element.style.transform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
    this.element.style.webkitTransform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
    this.element.style.mozTransform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
  };
}

function animate() {
  for (var i in circles) {
    circles[i].update();
  }
  requestAnimationFrame(animate);
}

animate();

// Add this to your JavaScript
function updateTimeTogether() {
  // Your anniversary date - May 31, 2024 at 9:53 PM Singapore time
  const anniversary = new Date('May 31, 2024 21:53:00 GMT+0800');
  const now = new Date();
  
  // Calculate difference in milliseconds
  const diff = now - anniversary;
  
  // Calculate years
  const years = now.getFullYear() - anniversary.getFullYear();
  
  // Calculate months (adjusting for year difference)
  let months = now.getMonth() - anniversary.getMonth();
  if (months < 0 || (months === 0 && now.getDate() < anniversary.getDate())) {
    months += 12;
  }
  
  // Calculate days
  const tempDate = new Date(anniversary);
  tempDate.setFullYear(now.getFullYear());
  tempDate.setMonth(anniversary.getMonth() + months);
  
  let days = Math.floor((now - tempDate) / (1000 * 60 * 60 * 24));
  
  // Calculate hours, minutes, seconds
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  // Update the display
  document.getElementById('years').textContent = years.toString().padStart(2, '0');
  document.getElementById('months').textContent = months.toString().padStart(2, '0');
  document.getElementById('days').textContent = days.toString().padStart(2, '0');
  document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
  document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Update immediately
updateTimeTogether();

// Update every second
setInterval(updateTimeTogether, 1000);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', updateTimeTogether);