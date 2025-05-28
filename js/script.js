// Music Player Functionality
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

function toggleMusic() {
    const toggleBtn = document.getElementById('musicToggle');
    
    if (isPlaying) {
        bgMusic.pause();
        toggleBtn.textContent = '♫ Play Our Song';
    } else {
        bgMusic.play().catch(e => {
            // Handle autoplay restrictions
            toggleBtn.textContent = 'Click to Play';
            console.log("Audio playback prevented:", e);
        });
        toggleBtn.textContent = '♫ Pause Music';
    }
    
    isPlaying = !isPlaying;
}

// Envelope Functionality
function openEnvelope() {
    const envelope = document.querySelector('.envelope');
    envelope.classList.toggle('open');
    
    if (envelope.classList.contains('open')) {
        envelope.style.cursor = 'default';
        createConfetti();
    }
}

// Confetti Effect
function createConfetti() {
    const confettiCount = 100;
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.borderRadius = '50%';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;

        confettiContainer.appendChild(confetti);
    }

    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize - check if user has interacted before playing music
document.addEventListener('click', function() {
    if (!isPlaying && bgMusic.paused) {
        // User has interacted, we can now play music when they click play
        console.log("Page interacted with, music can now play");
    }
}, { once: true });

// Draggable Papers Functionality
let highestZ = 1;

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
    this.currentPaperX = Math.random() * window.innerWidth - 100;
    this.currentPaperY = Math.random() * window.innerHeight - 100;
    this.rotating = false;
  }

  init(paper) {
    paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;

    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      if(e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Prevent context menu on right click
    paper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
}

// Initialize all papers
document.addEventListener('DOMContentLoaded', () => {
  const papers = Array.from(document.querySelectorAll('.paper'));
  papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
  });
  
  // Initialize music player interaction
  document.addEventListener('click', function() {
    if (!isPlaying && bgMusic.paused) {
      console.log("Page interacted with, music can now play");
    }
  }, { once: true });
});

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
  /*this.element.style.display = 'block';*/
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

// Toggle menu items
function toggleMenuItem(item) {
  item.classList.toggle('active');
  
  // Close other open items when one is clicked
  if (item.classList.contains('active')) {
    document.querySelectorAll('.menu-item').forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        otherItem.classList.remove('active');
      }
    });
  }
  
  // Add cute bounce animation when opening
  if (item.classList.contains('active')) {
    const emoji = item.querySelector('.menu-emoji');
    emoji.style.transform = 'scale(1.2)';
    setTimeout(() => {
      emoji.style.transform = 'scale(1) rotate(15deg)';
    }, 200);
  }
}

// Add hover effects to menu items
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    if (!item.classList.contains('active')) {
      const emoji = item.querySelector('.menu-emoji');
      emoji.style.transform = 'translateY(-5px)';
    }
  });
  
  item.addEventListener('mouseleave', () => {
    if (!item.classList.contains('active')) {
      const emoji = item.querySelector('.menu-emoji');
      emoji.style.transform = 'translateY(0)';
    }
  });
});

// Tabbed Menu Toggle
const tabButtons = document.querySelectorAll('.tab-button');
const tabSections = document.querySelectorAll('.tab-section');

if (tabButtons.length > 0) {
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabSections.forEach(sec => sec.classList.remove('active'));

      // Add to clicked
      button.classList.add('active');
      const target = button.getAttribute('data-tab');
      document.getElementById(target).classList.add('active');
    });
  });
}

window.addEventListener('scroll', () => {
  const menuSection = document.querySelector('.tab-menu');
  const waiter = document.getElementById('waiterImage');

  if (!waiter.classList.contains('waiter-slide-in')) {
    const rect = menuSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (inView) {
      waiter.classList.add('waiter-slide-in');
    }
  }
});

// Timeline Slideshow
let currentMonth = 1;
const totalMonths = 12; // Update this to your actual number of months

// Initialize timeline
function initTimeline() {
  // Create month indicators
  const indicators = document.querySelector('.month-indicators');
  for (let i = 1; i <= totalMonths; i++) {
    const indicator = document.createElement('div');
    indicator.className = 'month-indicator';
    if (i === 1) indicator.classList.add('active');
    indicator.dataset.month = i;
    indicator.addEventListener('click', () => goToMonth(i));
    indicators.appendChild(indicator);
  }
}

// Move to specific month
function goToMonth(month) {
  if (month < 1 || month > totalMonths) return;
  
  const prevSlide = document.querySelector(`.timeline-slide[data-month="${currentMonth}"]`);
  const nextSlide = document.querySelector(`.timeline-slide[data-month="${month}"]`);
  
  prevSlide.classList.remove('active');
  prevSlide.classList.add('prev');
  
  nextSlide.classList.add('active');
  nextSlide.classList.remove('prev');
  
  // Update indicators
  document.querySelectorAll('.month-indicator').forEach(ind => {
    ind.classList.remove('active');
    if (parseInt(ind.dataset.month) === month) {
      ind.classList.add('active');
    }
  });
  
  // Update progress bar
  document.querySelector('.progress-bar').style.width = `${(month / totalMonths) * 100}%`;
  
  currentMonth = month;
}

// Move slides
function moveSlide(direction) {
  goToMonth(currentMonth + direction);
}

// Auto-advance (optional)
let slideInterval;
function startAutoSlide() {
  slideInterval = setInterval(() => {
    moveSlide(1);
    if (currentMonth === totalMonths) {
      goToMonth(1);
    }
  }, 5000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initTimeline();
  // startAutoSlide(); // Uncomment if you want auto-advancing
  
  // Pause auto-slide on hover
  document.querySelector('.timeline-slides').addEventListener('mouseenter', () => {
    if (slideInterval) clearInterval(slideInterval);
  });
  
  document.querySelector('.timeline-slides').addEventListener('mouseleave', () => {
    if (slideInterval) startAutoSlide();
  });
});