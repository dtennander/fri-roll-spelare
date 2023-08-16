function stringToColour(str) {
    let hash = 0;
    str.split('').forEach(char => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for (let i = 0; i < 2; i++) {
        const value = (hash >> (i * 8)) & 0xff
        colour += "0" + value.toString(16).padStart(1, '0')
    }
    return colour + "ff"
}