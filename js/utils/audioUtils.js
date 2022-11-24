export function loadAudio(audioUrl, audioElement, resetFunction, updateFunction) {
  clearInterval();
  resetFunction();
  audioElement.src = audioUrl;
  setInterval(updateFunction, 1000);
}

export function resetAudio(sliderElement, currentTimeElement, totalTimeElement) {
  sliderElement.value = 0;
  currentTimeElement.textContent = "00:00";
  totalTimeElement.textContent = "00:00";
}

export function updateAudio(audioElement, sliderElement, currentTimeElement, totalTimeElement) {
  let sliderPosition = 0;
  if (!isNaN(audioElement.duration)) {
    sliderPosition = audioElement.currentTime * (100 / audioElement.duration);
    sliderElement.value = sliderPosition;

    let currentMinutes = Math.floor(audioElement.currentTime / 60);
    let currentSeconds = Math.floor(audioElement.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(audioElement.duration / 60);
    let durationSeconds = Math.floor(audioElement.duration - durationMinutes * 60);

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    currentTimeElement.textContent = currentMinutes + ":" + currentSeconds;
    totalTimeElement.textContent = durationMinutes + ":" + durationSeconds;
  }
}

export function playAudio(audioElement, isPlaying, playpauseElement) {
  audioElement.play();
  isPlaying.isPlaying = true;
  playpauseElement.classList.remove("play");
  playpauseElement.classList.add("pause");
  playpauseElement.src = "img/icons/pause.svg";
}

export function pauseAudio(audioElement, isPlaying, playpauseElement) {
  audioElement.pause();
  isPlaying.isPlaying = false;
  playpauseElement.classList.remove("pause");
  playpauseElement.classList.add("play");
  playpauseElement.src = "img/icons/play.svg";
}

export function slide(audioElement, sliderElement) {
  audioElement.currentTime = audioElement.duration * (sliderElement.value / 100);
}

export function changeVolume(audioElement, sliderElement) {
  let newVolume = sliderElement.value;
  audioElement.volume = newVolume / 100;
}