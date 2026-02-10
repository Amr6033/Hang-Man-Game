
let start = document.querySelector(".start-btn");
let audio = document.querySelector(".bgMusic");
let logScreeen = document.querySelector(".back");
let startScreen = document.querySelector(".start-screen");
let settingicon = document.querySelector(".settings-icon");
let settingCup = document.querySelector(".cups-count");
let levelElement = document.querySelector(".level");
let inputt = document.querySelector(".username");
let usersSettings = document.querySelector(".users-list");
let game = document.querySelector(".game");
// ================= Hint =================
let hintListener = null
settingicon.addEventListener("click", () => {
  setting1()
  settingicon.classList.add("settings-icon-hover")
})

window.onload = () => {
  audio.pause()
};
start.addEventListener("click", () => {
  playPart()
  startScreen.style.display = "none";
  logScreeen.style.display = "flex";
  inputt.focus();
});
let log = document.querySelector(".log");
let randomWord;
let wrongAttepets = 0;
let tryes = [];
let find = [];
log.addEventListener("click", () => {
  playPart()
  let username = inputt.value.trim().toLowerCase();
  if (!username) {
    document.querySelector(".error").style.display = "block";
  }
  else {
    soundVloume();
    let logScreeen = document.querySelector(".back");
    let game = document.querySelector(".game");
    let startScreen = document.querySelector(".start-screen");
    logScreeen.style.display = "none";

    game.style.display = "block";
    startScreen.style.display = "none";
    document.body.style.overflow = "auto";
    document.body.style.margin = "10px";
    let users = JSON.parse(localStorage.getItem("users")) || {};
    //let username = prompt("Enter Your Name")

    // تعريف cup و currentLevel قبل استخدامهم
    let cup = 0;
    let currentLevel = 0;



    // لو اليوزر موجود مسبقًا
    if (users[username]) {
      cup = users[username].cups || 0;
      currentLevel = users[username].currentLevel || 0;
    } else {
      // لو جديد
      users[username] = { cups: 0, currentLevel: 0 };
      // خزنه فورًا
      localStorage.setItem("users", JSON.stringify(users));
    }
    setting()


    // ================= Letters =================
    let letters = "QWERTYUIOPASDFGHJKLZXCVBNM";
    let lettersArray = Array.from(letters);
    let lettersContainer = document.querySelector(".letters");
    let cups = document.querySelector(".cups")
    if (localStorage.getItem("users")) {
      cups.innerHTML = users[username].cups
      settingCup.innerHTML = users[username].cups
      currentLevel = parseInt(users[username].currentLevel)
      document.querySelector(".level").innerHTML = users[username].currentLevel
    }

    // ================= Fetch JSON =================
    // ================= Load Words =================
    wrongAttepets = 0;
    tryes = [];
    find = [];
    let gameData;
    async function loadGame() {
      const res = await fetch("words.json");
      gameData = await res.json();
      startGame();
    }

    loadGame();

    function startGame() {
      // reset level state
      wrongAttepets = 0;
      tryes = [];
      find = [];

      document.querySelectorAll(".wrong").forEach(e => e.classList.remove("wrong"));


      levelElement.innerHTML = currentLevel + 1;

      let levelData = gameData.levels[currentLevel];
      let words = levelData.words;
      randomWord = words[Math.floor(Math.random() * words.length)];
      document.querySelector(".category span").innerHTML = randomWord;  // ================= Create Guess Spans =================
      let lettersGuess = document.querySelector(".letters-guess");
      lettersGuess.innerHTML = ""; // reset

      // convert word to array
      // ⚠️ Important: keep spaces as spaces
      let lettersAndSpace = Array.from(randomWord);

      lettersAndSpace.forEach((letter) => {
        let span = document.createElement("span");
        if (letter === " ") {
          span.className = "with-space";
        }
        lettersGuess.append(span);
      });

      // 🔴 الحل - امسح الحروف القديمة وأعد إنشائها
      lettersContainer.innerHTML = ""; // امسح الحروف القديمة
      checkLetter(); // أعد إنشاء الحروف من جديد
      let guessSpans = document.querySelectorAll(".letters span");
      let arrspans = Array.from(guessSpans);

      arrspans.forEach((span) => {
        span.addEventListener("click", (e) => {


          let clickedLetter = e.target.innerHTML.toLowerCase();
          let wordLetters = Array.from(randomWord.toLowerCase());
          let guessedSpans = document.querySelectorAll(".letters-guess span");

          let foundLetters = [];
          for (let i = 0; i < wordLetters.length; i++) {
            if (wordLetters[i] === clickedLetter && guessedSpans[i].innerHTML === "") {
              foundLetters.push(clickedLetter);
            }
          }

          if (tryes.includes(clickedLetter) && !foundLetters.includes(clickedLetter)) {
            let message = document.querySelector(".repeat-tooltip")
            message.classList.add("show")
            playPart()
            setTimeout(() => {
              message.classList.remove("show");
            }, 1000);
          } else {
            let found = false;

            for (let i = 0; i < wordLetters.length; i++) {
              if (wordLetters[i] === clickedLetter && guessedSpans[i].innerHTML === "") {
                let sound = new Audio("Audio hang man/universfield-game-bonus-02-294436.mp3");
                sound.currentTime = 0.05;
                let vol = document.querySelector(".volume")
                sound.volume = vol.value
                sound.play();


                found = true;
                guessedSpans[i].innerHTML = clickedLetter;
                find.push(clickedLetter);
                cup += 10
                cups.innerHTML = cup
                settingCup.innerHTML = cup
                saveUser()
                break;
              }
            }

            if (!found) {
              wrongAttepets++;
              if (cup > 0) {
                cup -= 10

              }
              cups.innerHTML = cup
              settingCup.innerHTML = cup
              saveUser()

              e.target.classList.add("wrongs")
              e.target.classList.add("shake")
              let loseSound = new Audio("Audio hang man/qbertapply-falled-sound-effect-278635.mp3");
              loseSound.currentTime = 0.04;
              let vol = document.querySelector(".volume")
              loseSound.volume = vol.value

              loseSound.play();

            }
            drawAndLose();
          }

          tryes.push(clickedLetter);
          if (checkWin()) {
            if (currentLevel == 49) {
              WinGame()
            }
            else {
              win()
            }
            saveUser()
          }


          if (cup >= 10 && document.querySelector(".hint span").innerHTML > 0) {
            document.querySelector(".hint").classList.remove("disapled")
          }
          else {
            document.querySelector(".hint").classList.add("disapled")
          }
        });


      });

      let startIcon = document.querySelector(".settings-icon")
      startIcon.addEventListener("click", () => {
        document.getElementById("overlay").style.display = "block"
        document.getElementById("overlay").classList.remove("closep")
      })

      hint()
    }

    function hint() {
      let hintNums = 3;
      let hintBtn = document.querySelector(".hint");
      let hintSpan = document.querySelector(".hint span");
      hintBtn.classList.add("disapled");
      hintSpan.innerHTML = hintNums;

      if (hintListener) {
        hintBtn.removeEventListener("click", hintListener);
      }

      hintListener = () => {
        // ❌ لو الكؤوس أقل من 10

        playPart();

        // ✅ خصم 10 cups
        cup -= 10;
        cups.innerHTML = cup;
        settingCup.innerHTML = cup;
        saveUser()
        hintNums--;
        hintSpan.innerHTML = hintNums;

        if (hintNums === 0 || cup < 10) {
          hintBtn.classList.add("disapled");
        }
        if (hintNums != 0 && cup > 10) {
          hintBtn.classList.remove("disapled")
          hintSpan.innerHTML = hintNums
        }
        let spans = document.querySelectorAll(".letters-guess span");
        let emptyIndexes = [];

        spans.forEach((span, index) => {
          if (span.textContent === "" && !span.classList.contains("with-space")) {
            emptyIndexes.push(index);
          }
        });

        if (emptyIndexes.length === 0) return;

        let randomIndex =
          emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

        spans[randomIndex].textContent = randomWord[randomIndex];
        spans[randomIndex].classList.add("hint-letter");

        tryes.push(randomWord[randomIndex]);

        if (checkWin()) {
          if (currentLevel == 49) {
            WinGame()
          }
          else {
            win()
          }
          saveUser()
        }


      };

      hintBtn.addEventListener("click", hintListener);
      // 🔒 لو خلصت hints أو cups

    }
    // ================= Draw =================
    function drawAndLose() {
      if (wrongAttepets === 1) {
        document.querySelector(".the-draw").classList.add("wrong");
      } else if (wrongAttepets === 2) {
        document.querySelector(".the-stand").classList.add("wrong");
      } else if (wrongAttepets === 3) {
        document.querySelector(".the-hang").classList.add("wrong");
      } else if (wrongAttepets === 4) {
        document.querySelector(".the-rope").classList.add("wrong");
      } else if (wrongAttepets === 5) {
        document.querySelector(".head").classList.add("wrong");
      } else if (wrongAttepets === 6) {
        document.querySelector(".hands").classList.add("wrong");
      } else if (wrongAttepets === 7) {
        document.querySelector(".body").classList.add("wrong");
      } else if (wrongAttepets === 8) {
        document.querySelector(".legs").classList.add("wrong");
        document.querySelector(".fail").play();

        let audio = document.querySelector(".bgMusic")
        audio.pause()

        let loseWord = document.getElementById("loseWord")
        loseWord.innerHTML = randomWord
        if (cup >= 30) {

          cup -= 20
          cups.innerHTML = cup
          saveUser()
        }
        else if (cup = 20) {

          cup -= 20
          cups.innerHTML = cup
          saveUser()
        }
        document.querySelector(".letters").classList.add("disapled");
        document.getElementById("loseOverlay").classList.add("active");

        document.getElementById("again").onclick = () => {
          playPart()
          soundVloume()
          document.querySelector(".letters").classList.remove("disapled");
          document.getElementById("loseOverlay").classList.remove("active");
          startGame()
        };
        let restart = document.getElementById("resettt")
        restart.onclick = () => location.reload()

      }
    }



    function win() {
      let winWord = document.getElementById("winWord")
      winWord.innerHTML = randomWord
      document.querySelector(".success").play();
      document.querySelector(".letters").classList.add("disapled");
      document.getElementById("winOverlay").style.display = "flex";
      document.querySelector(".win-popup").classList.add("win")
      let audio = document.querySelector(".bgMusic")
      audio.pause()
      document.getElementById("play-again").onclick = () => {
        audio.play()
        playPart()
        document.querySelector(".success").pause();
        document.querySelector(".letters").classList.remove("disapled");
        document.getElementById("winOverlay").style.display = "none";
      }
      nextLevel()
      document.querySelector("#restart").onclick = () => {
        location.reload()
        playPart()
      }
    }

    function checkWin() {
      let guessedSpans = document.querySelectorAll(".letters-guess span");
      let wordLetters = Array.from(randomWord);

      for (let i = 0; i < wordLetters.length; i++) {
        // تجاهل المسافات
        if (wordLetters[i] === " ") continue;

        if (guessedSpans[i].textContent === "") {
          return false;
        }
      }
      return true;
    }
    function WinGame() {
      let winWord = document.getElementById("winWord")
      winWord.innerHTML = randomWord
      document.getElementById("winOverlay").classList.add("win-game-overlay")
      document.querySelector(".win-Game").play()
      document.querySelector(".letters").classList.add("disapled");
      document.getElementById("winOverlay").style.display = "flex";
      let audio = document.querySelector(".bgMusic")
      audio.pause()
      document.getElementById("play-again").style.display = "none"
      document.querySelector("#restart").onclick = () => {
        location.reload()
        playPart()
      }
    }
    function nextLevel() {
      setTimeout(() => {
        currentLevel++; // زود الـ level الحالي

        // خزنه في users و localStorage
        users[username].currentLevel = currentLevel;
        localStorage.setItem("users", JSON.stringify(users));

        // حد أقصى للـ levels
        if (currentLevel < 50) {
          startGame();


          hint();
        }
      }, 1000);
    }

    function checkLetter() {
      lettersArray.forEach((letter) => {
        let span = document.createElement("span");
        span.classList.add("letter-box");
        span.textContent = letter;
        lettersContainer.append(span);
      });
    }
    function saveUser() {
      users[username].cups = cup;
      users[username].currentLevel = currentLevel;
      localStorage.setItem("users", JSON.stringify(users));
    }
  }

  function setting() {
    let icon = document.querySelector(".game-setting")
    let user = document.querySelector(".user-name")
    user.innerHTML = username[0].toUpperCase() + username.slice(1)
    icon.addEventListener("click", () => {
      icon.classList.add("game-setting-hover")
      document.getElementById("overlay").style.display = "flex"
      document.getElementById("overlay").classList.remove("closep")
    })
    document.querySelector(".users").style.display = "block"
    let restart = document.querySelector(".restart")
    restart.addEventListener("click", () => {
      playPart()
      location.reload()
    })

    const clearData = document.getElementById("clear-data");
    clearData.addEventListener("click", () => {
      playPart()
      localStorage.clear()
      location.reload()
    })
    let reset = document.querySelector(".reset")
    reset.addEventListener("click", () => {
      let key = document.querySelector(".user-name")
      let users = JSON.parse(localStorage.getItem("users"))
      delete users[key.innerHTML.toLowerCase()]
      localStorage.setItem("users", JSON.stringify(users))
      location.reload()
      playPart()
    })
    const close = document.getElementById("closeSettings");
    const overlay = document.getElementById("overlay");

    close.addEventListener("click", () => {
      overlay.classList.add("closep");
      setTimeout(() => {
        document.getElementById("overlay").style.display = "none"

      }, 1000)

      icon.classList.remove("game-setting-hover")
      playPart()
    });

    let users = JSON.parse(localStorage.getItem("users"))
    let keys = Object.keys(users)
    for (let i = 0; i < keys.length; i++) {
      usersSettings.innerHTML += `<div class ="user-row"><span class="key">${keys[i][0].toUpperCase()}${keys[i].slice(1)}</span>
       <span class="user-cup">${users[keys[i]].cups}</span>
       <span class="current-level">${users[keys[i]].currentLevel + 1}</span>
       <button class="loginBtn">LogIn</button>
       </div>`

    }
    let loginBtn = document.querySelectorAll(".loginBtn")
    loginBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        overlay.classList.add("closep");
        setTimeout(() => {
          document.getElementById("overlay").style.display = "none"

        }, 1000)
        icon.classList.remove("game-setting-hover")
        username = btn.parentElement.querySelector(".key").innerHTML.toLowerCase()
        inputt.value = username
        usersSettings.innerHTML = ""
        // 🔥 reset game state
        randomWord = "";
        tryes = [];
        find = [];
        wrongAttepets = 0;

        // امسح الـ letters
        document.querySelector(".letters").innerHTML = "";
        document.querySelector(".letters-guess").innerHTML = "";

        // شيل أي wrong قديم
        document.querySelectorAll(".wrong").forEach(e => e.classList.remove("wrong"));
        log.click()


      })
    })
  }

})

function soundVloume() {
  let success = document.querySelector(".success")
  let fail = document.querySelector(".fail")
  let audio = document.querySelector(".bgMusic");
  let volumeRange = document.querySelector(".volume");
  let winGamee = document.querySelector(".win-Game")



  // مستوى الصوت الافتراضي
  audio.volume = volumeRange.value;
  success.volume = volumeRange.value
  winGamee.volume = volumeRange.value
  fail.volume = volumeRange.value
  // لما تحرّك السلايدر
  volumeRange.addEventListener("input", () => {
    audio.volume = volumeRange.value;
    success.volume = volumeRange.value
    fail.volume = volumeRange.value
    winGamee.volume = volumeRange.value
  });

  audio.play()
  // لما الصفحة تتقفل أو تتغير
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      audio.pause();
    }
    else if (document.querySelector(".win-overlay").style.display == "flex" || document.getElementById("loseOverlay").classList.contains("active")) {
      audio.pause()
    }
    else {
      audio.play();
    }
  })
}

function setting1() {
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("overlay").classList.remove("closep")
  document.querySelector(".users").style.display = "none"
  let restart = document.querySelector(".restart")
  restart.addEventListener("click", () => {
    playPart()
    location.reload()
  })
  const clearData = document.getElementById("clear-data");
  clearData.addEventListener("click", () => {
    playPart()
    localStorage.clear()
    location.reload()
  })
  const close = document.getElementById("closeSettings");
  const overlay = document.getElementById("overlay");

  close.addEventListener("click", () => {
    overlay.classList.add("closep");
    settingicon.classList.remove("settings-icon-hover")
    playPart()
  });
}
function playPart() {
  //let sound = new Audio("Audio hang man/mixkit-select-click-1109.wav");
  let sound = document.querySelector(".click")
  let vol = document.querySelector(".volume")
  sound.volume = vol.value
  sound.currentTime = 0.04;
  sound.play();

  sound.ontimeupdate = () => {
    if (sound.currentTime >= 0.05) {
      sound.pause();
      sound.ontimeupdate = null;
    }
  };
}
