function main() {
    window.spotify.login()
    for (const song of window.songs) {
        document.getElementById("playlist").innerHTML +=
            "<div style='background-color: " + songToColour(song) + "' class='button' id='" + song.feeling + "'> <img src='play.svg'>&emsp;" + song.feeling + "</div>";
    }

    let slider = document.getElementById("slider");
    window.spotify.setVolume(slider.value)
    slider.onchange = function () { window.spotify.setVolume(slider.value) }

    for (const song of window.songs) {
        document.getElementById(song.feeling).onclick = function () { window.spotify.playSong(song.uri, song.offset_ms) }
        document.getElementById(song.feeling).onpress = function () { window.spotify.playSong(song.uri, song.offset_ms) }
    }
    document.getElementById("togglePlay").onclick = window.spotify.pause
    document.getElementById("togglePlay").onpress = window.spotify.pause
}
main()
