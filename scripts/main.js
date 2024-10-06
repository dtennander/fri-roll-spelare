function main() {
  window.spotify.login();
  for (const song of window.songs) {
    document.getElementById("playlist").innerHTML +=
      "<div style='background-color: " + songToColour(song) +
      "' class='button' id='" + song.feeling + "'> <img src='" + (song.is_pause ? "pause.svg" : "play.svg") + "'>&emsp;" +
      song.feeling + "</div>";
  }

  let slider = document.getElementById("slider");
  slider.onchange = function () {
    window.spotify.setVolume(slider.value);
  };

  const keepingConnectionAlive = function () {
    window.spotify.setVolume(slider.value);
    setTimeout(keepingConnectionAlive, 10_000);
  }
  keepingConnectionAlive();


  let activeButton = null;
  for (const song of window.songs) {
    const button = document.getElementById(song.feeling);
    const action = function() {
      // Let's make sure that the track is repeated.
      window.spotify.setRepeat("track");
      window.spotify.playSong(song.uri, song.offset_ms);
      if (activeButton) activeButton.classList.remove("active");
      button.classList.add("active");
      activeButton = button;
    }
    button.onclick = action;
    button.onpress = action;
  }
}
main();
