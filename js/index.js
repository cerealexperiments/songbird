import { linkNamesEn, linkNamesRu } from "./data/linkNames.js";
import { changeLinksLanguage } from "./utils/languageUtils.js";

if(!localStorage.getItem("language")) {
  localStorage.setItem("language", "en");
}

let navigationLinks = document.querySelectorAll(".navigation__link");
let languageSelector = document.querySelector(".header__language");
let heading = document.querySelector(".main__heading");
let text = document.querySelector(".main__text");

changeLinksLanguage(localStorage.getItem("language"), navigationLinks);

if(localStorage.getItem("language") === "en") {
  heading.textContent = "Welcome to SongBird";
  text.textContent = "SongBird is a game where you have to guess the birds by their voices."
  languageSelector.textContent = "EN";
} else {
  heading.textContent = "Добро пожаловать в SongBird";
  text.textContent = "SongBird - это игра в которой вы угадываете птиц по их голосам."
  languageSelector.textContent = "RU";

}

languageSelector.addEventListener("click", changeLanguage);


function changeLanguage() {
  if(localStorage.getItem("language") === "en") {
    heading.textContent = "Добро пожаловать в SongBird";
    text.textContent = "SongBird - это игра в которой вы угадываете птиц по их голосам."
    localStorage.setItem("language", "ru");
    languageSelector.textContent = "RU";
    changeLinksLanguage(localStorage.getItem("language"), navigationLinks);
  } else {
    heading.textContent = "Welcome to SongBird";
    text.textContent = "SongBird is a game where you have to guess the birds by their voices."
    localStorage.setItem("language", "en");
    languageSelector.textContent = "EN";
    changeLinksLanguage(localStorage.getItem("language"), navigationLinks);
  }
}

