import birdsDataEn from "./data/birdsDataEn.js";
import birdsDataRu from "./data/birdsDataRu.js";
import { linkNamesEn, linkNamesRu } from "./data/linkNames.js";
import { loadAudio, playAudio, pauseAudio, resetAudio, updateAudio, slide, changeVolume } from "./utils/audioUtils.js";
import { changeLinksLanguage, changeSectionsLanguage } from "./utils/languageUtils.js";
import {getCorrectAnswerIndex} from "./utils/guessUtils.js";

// config
if(!localStorage.getItem("language")) {
  localStorage.setItem("language", "en");
}
let birdsData = localStorage.getItem("language") === "en" ? birdsDataEn : birdsDataRu;
let totalScore = 0;
let currentScore = 5;
let sectionIndex = 0;
let correctAnswerIndex = getCorrectAnswerIndex();
let isPlaying = {
  isPlaying: false
};
let isPlayingChoice = {
  isPlaying: false
};
let scored = false;
let markedOptions = [];

// dom selectors
let navigationLinks = document.querySelectorAll(".navigation__link");
let gameWrapper = document.querySelector(".game").children[0];
let gameOngoing = document.querySelector(".game__ongoing");
let sections = document.querySelectorAll(".section");
let score = document.querySelector(".game__score");
let languageSelector = document.querySelector(".header__language");
let currentQuestionName = document.querySelector(".current-question__name");
let currentQuestionImage = document.querySelector(".current-question__image");
let currentQuestionPlaypause = document.querySelector(".player__playpause");
let currentQuestionSlider = document.querySelector(".slider");
let currentQuestionCurrentTime = document.querySelector(".duration_current");
let currentQuestionTotalTime = document.querySelector(".duration_total");
let volumeSlider = document.querySelector(".volume__slider");
let choice = document.querySelector(".choice");
let choiceContent = document.createElement("div");
choiceContent.classList.add("choice__content");
let choiceImage = document.createElement("img");
choiceImage.classList.add("choice__image");
let choiceMain = document.createElement("div");
choiceMain.classList.add("choice__main");
choiceContent.append(choiceImage);
let choiceName = document.createElement("p");
choiceName.classList.add("choice__name");
let choiceLatin = document.createElement("p");
choiceLatin.classList.add("choice__latin");
let choiceAudioPlayer = document.createElement("div");
choiceAudioPlayer.classList.add("choice__audio-player", "audio-player");
let choicePlayer = document.createElement("div");
choicePlayer.classList.add("choice__player", "player");
let choicePlaypause = document.createElement("img");
choicePlaypause.src = "img/icons/play.svg";
choicePlaypause.classList.add("choice__playpause", "play", "player__playpause");
let choiceSlider = document.createElement("input");
choiceSlider.classList.add("choice__slider", "slider");
choiceSlider.type = "range";
choiceSlider.value = 0;
choiceSlider.min = 1;
choiceSlider.max = 100;
let choiceDurations = document.createElement("div");
choiceDurations.classList.add("durations", "choice__durations");
let choiceDurationTotal = document.createElement("p");
choiceDurationTotal.classList.add("duration", "duration_current", "choice__duration_current");
let choiceDurationCurrent = document.createElement("p");
choiceDurationCurrent.classList.add("duration", "duration_total", "choice__duration_total");
let choiceDescription = document.createElement("p");
choiceDescription.classList.add("choice__description");

let volumeLabel = document.querySelector(".volume__label");
volumeLabel.textContent = localStorage.getItem("language") === "en" ? "Volume" : "Громкость";

choiceAudioPlayer.append(choicePlayer);
choiceAudioPlayer.append(choiceDurations);

choicePlayer.append(choicePlaypause);
choicePlayer.append(choiceSlider);

choiceDurations.append(choiceDurationCurrent);
choiceDurations.append(choiceDurationTotal);

choiceMain.append(choiceName);
choiceMain.append(choiceLatin);
choiceMain.append(choiceAudioPlayer);

choiceContent.append(choiceMain);

let options = document.querySelectorAll(".option");
let nextButton = document.querySelector(".next");
nextButton.textContent = localStorage.getItem("language") === "en" ? "Next level" : "Следующий уровень";

//elements creation
let currentQuestionAudio = document.createElement("audio");
let choiceAudio = document.createElement("audio");

startGame();
changeSectionsLanguage(localStorage.getItem("language"), sections);
changeLinksLanguage(localStorage.getItem("language"), navigationLinks);

// event listeners
currentQuestionPlaypause.addEventListener("click", () => {
  if(!isPlaying.isPlaying) {
    playAudio(currentQuestionAudio, isPlaying, currentQuestionPlaypause);
  } else {
    pauseAudio(currentQuestionAudio, isPlaying, currentQuestionPlaypause);
  }
});

for(let i = 0; i < options.length; i++) {
  options[i].addEventListener("click", () => {
    isPlayingChoice.isPlaying = false;
    if(i === correctAnswerIndex) {
      currentQuestionName.textContent = options[i].textContent;
      currentQuestionImage.src = birdsData[sectionIndex][i].image;
      options[i].classList.add("option_correct")
      nextButton.disabled = false;
      nextButton.classList.add("next_active");
      let audio = new Audio("audio/correct.mp3");
      audio.volume = 0.2;
      if(scored === false) {
        audio.play();
        addScore();
        scored = true;
      }
      pauseAudio(currentQuestionAudio, isPlaying, currentQuestionPlaypause);
    } else {
      if (!scored) {
        if (!markedOptions.includes(i)) {
          if (currentScore !== 0) {
            currentScore--;
          }
          options[i].classList.add("option_wrong")
          let audio = new Audio("audio/wrong.mp3");
          audio.volume = 0.3;
          audio.play();
          markedOptions.push(i);
        }
      }
    }
    choiceName.textContent = birdsData[sectionIndex][i].name;
    choiceLatin.textContent = birdsData[sectionIndex][i].species;
    choiceImage.src = birdsData[sectionIndex][i].image;
    loadAudio(birdsData[sectionIndex][i].audio,
      choiceAudio,
      () => resetAudio(choiceSlider, choiceDurationCurrent, choiceDurationTotal),
      () => updateAudio(choiceAudio, choiceSlider, choiceDurationCurrent, choiceDurationTotal)
    );
    choiceDescription.textContent = birdsData[sectionIndex][i].description;
    choice.replaceChildren(choiceContent, choiceDescription);
  })
}

choicePlaypause.addEventListener("click", () => {
  if(!isPlayingChoice.isPlaying) {
    playAudio(choiceAudio, isPlayingChoice, choicePlaypause);
  } else {
    pauseAudio(choiceAudio, isPlayingChoice, choicePlaypause);
  }
})

nextButton.addEventListener("click", () => {
  nextSection();
})

currentQuestionSlider.addEventListener("change", () => slide(currentQuestionAudio, currentQuestionSlider));

choiceSlider.addEventListener("change", () => slide(choiceAudio, choiceSlider));

volumeSlider.addEventListener("change", () => changeVolume(currentQuestionAudio, currentQuestionSlider));

languageSelector.addEventListener("click", changeLanguage);
languageSelector.textContent = localStorage.getItem("language") === "en" ? "EN" : "RU";


function startGame() {
  totalScore = 0;
  score.textContent = localStorage.getItem("language") === "en" ? `Score: ${totalScore}` : `Счет: ${totalScore}`;
  currentScore = 5;
  sectionIndex = 0;
  correctAnswerIndex = getCorrectAnswerIndex();
  isPlaying.isPlaying = false;
  sections[sectionIndex].classList.add("section_active")
  currentQuestionName.textContent = "*".repeat(birdsData[sectionIndex][correctAnswerIndex].name.length);
  currentQuestionImage.src = "https://birds-quiz.netlify.app/static/media/bird.06a46938.jpg";
  choice.innerHTML = localStorage.getItem("language") === "en" ? "Listen to the audio above. Try to guess the bird." : "Послушайте аудио выше. Попробуйте угадать птицу."
  loadAudio(birdsData[sectionIndex][correctAnswerIndex].audio,
    currentQuestionAudio,
    () => resetAudio(currentQuestionSlider, currentQuestionCurrentTime, currentQuestionTotalTime),
    () => updateAudio(currentQuestionAudio, currentQuestionSlider, currentQuestionCurrentTime, currentQuestionTotalTime)
  );
  updateOptions();
}

function changeLanguage() {
  if (localStorage.getItem("language") === "en") {
    localStorage.setItem("language", "ru");
    birdsData = birdsDataRu;
    languageSelector.textContent = "RU";
    nextButton.textContent = "Следующий уровень"
    changeOptionsLanguage();
    volumeLabel.textContent = "Громкость"
    changeSectionsLanguage(localStorage.getItem("language"), sections);
    choice.innerHTML ="Послушайте аудио выше. Попробуйте угадать птицу.";
    for(let i = 0; i < navigationLinks.length; i++) {
      navigationLinks[i].textContent = linkNamesRu[i];
    }
    score.textContent = localStorage.getItem("language") === "en" ? `Score: ${totalScore}` : `Счет: ${totalScore}`;
  } else {
    localStorage.setItem("language", "en");
    birdsData = birdsDataEn;
    languageSelector.textContent = "EN";
    nextButton.textContent = "Next level"
    changeOptionsLanguage();
    volumeLabel.textContent = "Volume"
    changeSectionsLanguage(localStorage.getItem("language"), sections);
    choice.innerHTML ="Listen to the audio above. Try to guess the bird.";
    for(let i = 0; i < navigationLinks.length; i++) {
      navigationLinks[i].textContent = linkNamesEn[i];
    }
    score.textContent = localStorage.getItem("language") === "en" ? `Score: ${totalScore}` : `Счет: ${totalScore}`;
  }
}

function changeOptionsLanguage() {
  for(let i = 0; i < options.length; i++) {
    options[i].lastChild.textContent = birdsData[sectionIndex][i].name;
  }
}

function updateOptions() {
  for(let i = 0; i < options.length; i++) {
    options[i].lastChild.textContent = birdsData[sectionIndex][i].name;
    options[i].classList.remove("option_correct", "option_wrong");
  }
}

function addScore() {
  totalScore += currentScore;
  score.textContent = localStorage.getItem("language") === "en" ? `Score: ${totalScore}` : `Счет: ${totalScore}`;
}

function nextSection() {
  markedOptions = [];
  scored = false;
  currentScore = 5;
  sections[sectionIndex].classList.remove("section_active");
  sectionIndex++;
  console.log(`section index: ${sectionIndex}`);
  if(sectionIndex === birdsData.length) {
    gameWrapper.childNodes.hidden = true;
    let winningScreen = document.createElement("div");
    winningScreen.classList.add("winning-screen");
    let winningScreenText1 = document.createElement("p");
    winningScreenText1.classList.add("winning-screen__text-1");
    winningScreenText1.textContent = localStorage.getItem("language") === "en" ? "Congratulations!" : "Поздравляем!";
    winningScreen.append(winningScreenText1);
    let winningScreenText2 = document.createElement("p");
    winningScreenText2.classList.add("winning-screen__text-2");
    winningScreenText2.textContent = localStorage.getItem("language") === "en" ? `You scored ${totalScore} out of 30 points` : `Вы набрали ${totalScore} очков из 30`;
    winningScreen.append(winningScreenText2);
    let winningScreenButton = document.createElement("button");
    winningScreenButton.classList.add("winning-screen__button");
    winningScreenButton.textContent = localStorage.getItem("language") === "en" ? "Try again" : "Попробовать сначала";
    winningScreenButton.addEventListener("click", () => {
      startGame();
      winningScreen.replaceWith(gameOngoing);
    })
    totalScore !== 30 && winningScreen.append(winningScreenButton);
    gameOngoing.replaceWith(winningScreen);
    return;
  }
  currentQuestionName.textContent = birdsData[sectionIndex][correctAnswerIndex].name;
  currentQuestionImage.src = birdsData[sectionIndex][correctAnswerIndex].image;
  loadAudio(birdsData[sectionIndex][correctAnswerIndex].audio,
    currentQuestionAudio,
    () => resetAudio(currentQuestionSlider, currentQuestionCurrentTime, currentQuestionTotalTime),
    () => updateAudio(currentQuestionAudio, currentQuestionSlider, currentQuestionCurrentTime, currentQuestionTotalTime)
  );
  nextButton.disabled = true;
  nextButton.classList.remove("next_active")
  sections[sectionIndex].classList.add("section_active");
  updateOptions();
  currentQuestionPlaypause.src = "img/icons/play.svg";
  isPlaying.isPlaying = false;
  currentQuestionName.textContent = "*".repeat(birdsData[sectionIndex][correctAnswerIndex].name.length);
  currentQuestionImage.src = "https://birds-quiz.netlify.app/static/media/bird.06a46938.jpg"
  choice.innerHTML = "Listen to the audio above. Try to guess the bird."
}

