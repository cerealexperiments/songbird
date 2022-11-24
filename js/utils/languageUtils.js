import {linkNamesEn, linkNamesRu} from "../data/linkNames.js";
import { sectionNamesEn, sectionNamesRu } from "../data/sectionNames.js";

export function changeSectionsLanguage(language, sectionElements) {
  let sectionNames = language === "en" ? sectionNamesEn : sectionNamesRu;
  for(let i = 0; i < sectionElements.length; i++) {
    sectionElements[i].textContent = sectionNames[i];
  }
}

export function changeOptionsLanguage(optionElements, sectionIndex, birdsData) {
  for(let i = 0; i < optionElements.length; i++) {
    optionElements[i].lastChild.textContent = birdsData[sectionIndex][i].name;
  }
}

export function changeLinksLanguage(language, linkElements) {
  let linkNames = language === "en" ? linkNamesEn : linkNamesRu;
  for(let i = 0; i < linkElements.length; i++) {
    if(language === "en") {
      linkElements[i].textContent = linkNames[i];
    } else {
      linkElements[i].textContent = linkNames[i];
    }
  }
}