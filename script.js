// Helper: Show a page and hide others
function showPage(id) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

// Quiz Logic
function checkAnswer(answer) {
  const message = document.getElementById('quizMessage');

  if (answer === 'A') {
    message.textContent = 'Correct! 🎉 Happy birthday Monik!';
    message.style.color = 'green';

    // Wait 3 seconds then go to Page 2
    setTimeout(() => {
      showPage('page2');
      playBirthdaySong();
    }, 3000);

  } else if (answer === 'B') {
    message.textContent = 'Incorrect! Who cares about mochi? Not me at least.';
    message.style.color = 'red';
  } else if (answer === 'C') {
    message.textContent = 'Incorrect. Bro, not everything is about you. 😆';
    message.style.color = 'red';
  }
}

// Play Birthday Meme Song
function playBirthdaySong() {
  const song = document.getElementById('birthdaySong');

  song.play();

  // After song ends, go directly to the card game
  song.onended = () => {
    showPage('page3');
    initMatchingGame();
  };
}

let flippedCards = [];
let matchedGroups = 0;

function initMatchingGame() {
  const grid = document.getElementById('cardGrid');
  grid.innerHTML = '';

  const types = ['cute', 'hot', 'smart'];
  const allCards = [];

  types.forEach(type => {
    // Push 3 cards of each type
    for (let i = 0; i < 3; i++) {
      allCards.push(type);
    }
  });

  // Shuffle cards
  const shuffled = allCards.sort(() => Math.random() - 0.5);

  shuffled.forEach((type, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.type = type;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">❓</div>
        <div class="card-back" style="background-image: url('assets/${type}.jpg')"></div>
      </div>
    `;

    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });

  flippedCards = [];
  matchedGroups = 0;
}


function flipCard(cardElement) {
  if (cardElement.classList.contains('flipped') || flippedCards.includes(cardElement)) return;
  if (flippedCards.length === 3) return;

  cardElement.classList.add('flipped');
  flippedCards.push(cardElement);

  if (flippedCards.length === 3) {
    const [a, b, c] = flippedCards;
    const typeA = a.dataset.type;
    const typeB = b.dataset.type;
    const typeC = c.dataset.type;

    if (typeA === typeB && typeB === typeC) {
      // Matched 3 of a kind!
      flippedCards = [];
      matchedGroups++;

      if (matchedGroups === 3) {
        setTimeout(() => {
          showPage('page4');
          loadGiftBoxes();
        }, 500);
      }
    } else {
      // Not a match – flip back
      setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
      }, 1000);
    }
  }
}


// Gift boxes

let openedBoxes = 0;
let remainingGifts = [];

function loadGiftBoxes() {
  const giftArea = document.getElementById('giftBoxes');
  giftArea.innerHTML = '';
  openedBoxes = 0;

  // Define gifts (in random order)
  const gifts = [
    { label: "❤️ A birthday card from Soklin ❤️", content: "Monik, you’re amazing and inspiring. Never stop being you! – Soklin" },
    { label: "💖 A birthday card from Sodavy 💖", content: "Wishing you endless joy and unforgettable memories today! – Sodavy" },
    { label: "💌 A birthday card from Zata 💌", content: "May your day be filled with love and cake 🍰 – Zata" },
    { 
      label: "📻 We created a song playlist for you 📻", 
      content: {
        type: "playlist",
        qr: "assets/playlist-qr.png",   // your uploaded QR image
        link: "https://open.spotify.com/playlist/5z24luFKPYXpa7ZRWZmiTO?si=HHeTfzRwRy6T_Xm0gCHAag&pi=OSiCtmRqRUS_F&pt=7a95a84bd54555abbd7d1685292e7fdf"
      }
    },

    {
    label: "😈 Rick Rolled!",
    content: {
      type: "video",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
    }
}

  ];

  // Shuffle gifts
  remainingGifts = gifts.sort(() => Math.random() - 0.5);

  // Create 5 gift boxes
  for (let i = 0; i < 5; i++) {
    const box = document.createElement('div');
    box.classList.add('gift-box');
    box.dataset.index = i;
    box.addEventListener('click', () => openGift(box, i));
    giftArea.appendChild(box);
  }
}

function openGift(boxElement, index) {
  const gift = remainingGifts[index];
  if (!gift) return;

  // Mark as opened
  boxElement.classList.add('opened');
  boxElement.removeEventListener('click', openGift);
  openedBoxes++;

  // Show gift content in modal or overlay
  const overlay = document.createElement('div');
  overlay.className = 'gift-overlay';
  overlay.innerHTML = `
    <div class="gift-popup">
      <h3>${gift.label}</h3>
      <p>${formatGiftContent(gift.content)}</p>
      ${openedBoxes < 5 ? '<button onclick="closeGiftPopup()">Next Gift</button>' : '<button onclick="restartPrompt()">Restart</button>'}
    </div>
  `;
  document.body.appendChild(overlay);

  // Remove gift from remaining
  remainingGifts[index] = null;
}

function formatGiftContent(content) {
  // If it's a playlist object
  if (typeof content === 'object' && content.type === 'playlist') {
    return `
      <img src="${content.qr}" alt="Playlist QR Code" style="width: 150px; margin-bottom: 1rem;">
      <br>
      <a href="${content.link}" target="_blank" class="playlist-button">🎶 Open Playlist</a>
    `;
  }

  // 🎥 Embed Rick Roll video
  if (typeof content === 'object' && content.type === 'video') {
    return `
      <div class="video-container">
        <iframe width="300" height="180"
          src="${content.embedUrl}"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen>
        </iframe>
      </div>
    `;
  }

  // Markdown-style link (fallback)
  if (typeof content === 'string' && content.includes("[") && content.includes("]")) {
    return content.replace(/\[(.*?)\]\((.*?)\)/, `<a href="$2" target="_blank">$1</a>`);
  }

  // Plain text
  return content;
}


function closeGiftPopup() {
  const overlay = document.querySelector('.gift-overlay');
  if (overlay) overlay.remove();
}

function restartPrompt() {
  const overlay = document.querySelector('.gift-overlay');
  if (overlay) overlay.remove();
  const confirmRestart = confirm("You've opened all the gifts! Want to restart the surprise?");
  if (confirmRestart) {
    resetGame();
  }
}

function resetGame() {
  openedBoxes = 0;
  showPage('page1');
  document.getElementById('quizMessage').textContent = '';
}


