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

  for (const song of window.songs) {
    document.getElementById(song.feeling).onclick = function () {
      // Let's make sure that the track is repeated.
      window.spotify.setRepeat("track")
      window.spotify.playSong(song.uri, song.offset_ms);
    };
    document.getElementById(song.feeling).onpress = function () {
      window.spotify.playSong(song.uri, song.offset_ms);
    };
  }
}
main();
