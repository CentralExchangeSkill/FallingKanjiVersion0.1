let questions = [];
let currentIndex = 0;
let score = 0;
let maxQuestions = 10;
let falling = null;
let position = 1;
let wrongCount = 0;
let fallSpeed = 2;
let fastFall = false;

async function loadQuestions() {
  const res = await fetch("kanji_falling_data.json");
  const data = await res.json();
  questions = shuffleArray(data).slice(0, maxQuestions);
  nextQuestion();
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function nextQuestion() {
  if (currentIndex >= questions.length) {
    document.getElementById("kanji").style.display = "none";
    document.getElementById("score").innerText = `Game Selesai！Skor: ${score}`;
    document.getElementById("wrong").innerText = `Jumlah Salah: ${wrongCount}`;
    return;
  }
  const q = questions[currentIndex];
  const kanjiEl = document.getElementById("kanji");
  position = 1;
  kanjiEl.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
      <span style="font-size: 1.6em;">${q.kanji}</span>
      <span style="font-size: 0.8em;">${q.kana}</span>
    </div>`;
  kanjiEl.style.left = "33%";
  kanjiEl.style.top = "0px";
  const wrongChoices = shuffleArray(questions.filter((_, i) => i !== currentIndex)).slice(0, 2).map(x => x.meaning);
  const allChoices = shuffleArray([q.meaning, ...wrongChoices]);
  allChoices.forEach((choice, idx) => {
    document.getElementById("slot-" + idx).innerText = choice;
  });

  falling = setInterval(() => {
    const top = parseInt(kanjiEl.style.top);
    kanjiEl.style.top = (top + (fastFall ? fallSpeed * 3 : fallSpeed)) + "px";
    if (top + 50 >= 250) {
      clearInterval(falling);
      const chosen = document.getElementById("slot-" + position).innerText;
      const correct = q.meaning;

      if (chosen === correct) {
        score++;
      } else {
        wrongCount++;
        document.getElementById("wrong").innerText = `Salah: ${wrongCount}`;
      }

      currentIndex++;
      document.getElementById("score").innerText = `Skor: ${score}`;
      setTimeout(nextQuestion, 500);
    }
  }, 50);
}

document.addEventListener("keydown", (e) => {
  const kanjiEl = document.getElementById("kanji");
  if (e.key === "ArrowLeft" && position > 0) position--;
  if (e.key === "ArrowRight" && position < 2) position++;
  if (e.key === "ArrowDown") fastFall = true;
  kanjiEl.style.left = position * 33 + "%";
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowDown") fastFall = false;
});

window.onload = loadQuestions;

document.getElementById("left-btn").addEventListener("click", () => {
  if (position > 0) {
    position--;
    document.getElementById("kanji").style.left = position * 33 + "%";
  }
});

document.getElementById("right-btn").addEventListener("click", () => {
  if (position < 2) {
    position++;
    document.getElementById("kanji").style.left = position * 33 + "%";
  }
});

document.getElementById("down-btn").addEventListener("mousedown", () => {
  fastFall = true;
});

document.getElementById("down-btn").addEventListener("mouseup", () => {
  fastFall = false;
});

// Untuk sentuh di mobile
document.getElementById("down-btn").addEventListener("touchstart", () => {
  fastFall = true;
});
document.getElementById("down-btn").addEventListener("touchend", () => {
  fastFall = false;
});

let startX = 0;

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
}, false);

document.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    if (Math.abs(diffX) > 30) {
        if (diffX > 0) {
            movePlayerRight(); // Geser ke kanan
        } else {
            movePlayerLeft(); // Geser ke kiri
        }
    }
}, false);
