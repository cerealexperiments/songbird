import birdsDataEn from "./data/birdsDataEn.js";
import birdsDataRu from "./data/birdsDataRu.js";
import { sectionNamesEn, sectionNamesRu } from "./data/sectionNames.js";
import { linkNamesEn, linkNamesRu } from "./data/linkNames.js";
import { loadAudio, playAudio, pauseAudio, resetAudio, slide, updateAudio} from "./utils/audioUtils.js";
import { changeLinksLanguage } from "./utils/languageUtils.js";

if(!localStorage.getItem("language")) {
  localStorage.setItem("language", "en");
}

// dom selectors
let languageSelector = document.querySelector(".header__language");
let galleryWrapper = document.querySelector(".gallery__wrapper");
let navigationLinks = document.querySelectorAll(".navigation__link");

languageSelector.addEventListener("click", changeLanguage);
languageSelector.textContent = localStorage.getItem("language") === "en" ? "EN" : "RU";

changeLinksLanguage(localStorage.getItem("language"), navigationLinks);

function changeLanguage() {
  let sectionHeadings = document.querySelectorAll(".gallery-section__heading");
  let birdNames = document.querySelectorAll(".bird__name");
  let birdDescriptions = document.querySelectorAll(".bird__description");
  if (localStorage.getItem("language") === "en") {
    for(let i = 0; i < sectionHeadings.length; i++) {
      sectionHeadings[i].textContent = sectionNamesRu[i];
    }
    let birdNamesData = birdsDataRu.map(section => {
      return section.map(bird => bird.name);
    })
    let namesResult = [];
    for(let section of birdNamesData) {
      for(let name of section) {
        namesResult.push(name);
      }
    }
    for(let i = 0; i < birdNames.length; i++) {
      birdNames[i].textContent = namesResult[i];
    }

    let birdDescriptionsData = birdsDataRu.map(section => {
      return section.map(bird => bird.description);
    })
    let descriptionsResult = [];
    for(let section of birdDescriptionsData) {
      for(let description of section) {
        descriptionsResult.push(description);
      }
    }
    for(let i = 0; i < birdDescriptions.length; i++) {
      birdDescriptions[i].textContent = descriptionsResult[i];
    }
    localStorage.setItem("language", "ru");
    languageSelector.textContent = "RU";
    changeLinksLanguage(localStorage.getItem("language"), navigationLinks);
    for(let i = 0; i < navigationLinks.length; i++) {
      navigationLinks[i].textContent = linkNamesRu[i];
    }
  } else {
    for(let i = 0; i < sectionHeadings.length; i++) {
      sectionHeadings[i].textContent = sectionNamesEn[i];
    }
    let birdNamesData = birdsDataEn.map(section => {
      return section.map(bird => bird.name);
    })
    let namesResult = [];
    for(let section of birdNamesData) {
      for(let name of section) {
        namesResult.push(name);
      }
    }
    for(let i = 0; i < birdNames.length; i++) {
      birdNames[i].textContent = namesResult[i];
    }

    let birdDescriptionsData = birdsDataEn.map(section => {
      return section.map(bird => bird.description);
    })
    let descriptionsResult = [];
    for(let section of birdDescriptionsData) {
      for(let description of section) {
        descriptionsResult.push(description);
      }
    }
    for(let i = 0; i < birdDescriptions.length; i++) {
      birdDescriptions[i].textContent = descriptionsResult[i];
    }
    localStorage.setItem("language", "en");
    languageSelector.textContent = "EN";
    changeLinksLanguage(localStorage.getItem("language"), navigationLinks);
    for(let i = 0; i < navigationLinks.length; i++) {
      navigationLinks[i].textContent = linkNamesEn[i];
    }
  }
}

for(let i = 0; i < birdsDataEn.length; i++) {
  let isPlaying = {
    isPlaying: false
  };
  let section = document.createElement("div");
  galleryWrapper.append(section);
  section.classList.add("gallery-section");
  let sectionHeading = document.createElement("h3");
  sectionHeading.classList.add("gallery-section__heading");
  sectionHeading.textContent = sectionNamesEn[i];
  section.append(sectionHeading);

  let sectionContent = document.createElement("div");
  sectionContent.classList.add("gallery-section__content");
  section.append(sectionContent);

  let birdsData = localStorage.getItem("language") === "en" ? birdsDataEn : birdsDataRu;

  for(let item of birdsData[i]) {
    let bird = document.createElement("bird");
    bird.classList.add("bird");
    sectionContent.append(bird);
    let birdImage = document.createElement("img");
    birdImage.classList.add("bird__image");
    birdImage.src = item.image;
    bird.append(birdImage);

    let birdContent = document.createElement("div");
    birdContent.classList.add("bird__content");
    bird.append(birdContent);
    let birdName = document.createElement("div");
    birdName.classList.add("bird__name");
    birdName.textContent = item.name;
    birdContent.append(birdName);
    let birdLatin = document.createElement("div");
    birdLatin.classList.add("bird__latin");
    birdLatin.textContent = item.species;
    birdContent.append(birdLatin);
    sectionContent.append(bird);

    let birdAudio = document.createElement("audio");

    let birdAudioPlayer = document.createElement("div");
    birdAudioPlayer.classList.add("choice__audio-player", "audio-player");
    bird.append(birdAudioPlayer);

    let birdPlayer = document.createElement("div");
    birdPlayer.classList.add("choice__player", "player");
    birdAudioPlayer.append(birdPlayer);

    let birdPlaypause = document.createElement("img");
    birdPlaypause.src = "img/icons/play.svg";
    birdPlaypause.classList.add("choice__playpause", "play", "player__playpause");
    birdPlayer.append(birdPlaypause);

    let birdSlider = document.createElement("input");
    birdSlider.classList.add("choice__slider", "slider");
    birdSlider.type = "range";
    birdSlider.value = 0;
    birdSlider.min = 1;
    birdSlider.max = 100;
    birdPlayer.append(birdSlider);

    let birdDurations = document.createElement("div");
    birdDurations.classList.add("durations", "choice__durations");
    birdAudioPlayer.append(birdDurations);

    let birdDurationCurrent = document.createElement("p");
    birdDurationCurrent.classList.add("duration", "duration_current", "choice__duration_current");
    birdDurations.append(birdDurationCurrent);

    let birdDurationTotal = document.createElement("p");
    birdDurationTotal.classList.add("duration", "duration_total", "choice__duration_total");
    birdDurations.append(birdDurationTotal);

    let birdDescription = document.createElement("p");
    birdDescription.classList.add("bird__description");
    birdDescription.textContent = item.description;
    bird.append(birdDescription);

    birdPlaypause.addEventListener("click", () => {
      if(!isPlaying.isPlaying) {
        playAudio(birdAudio, isPlaying, birdPlaypause);
      } else {
        pauseAudio(birdAudio, isPlaying, birdPlaypause);
      }
    })

    birdSlider.addEventListener("change", () => slide(birdAudio, birdSlider))
    loadAudio(item.audio,
      birdAudio,
      () => resetAudio(birdSlider, birdDurationCurrent, birdDurationTotal),
      () => updateAudio(birdAudio, birdSlider, birdDurationCurrent, birdDurationTotal)
    );
  }
}
