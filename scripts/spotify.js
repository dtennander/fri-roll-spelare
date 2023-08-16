// Description: Spotify API wrapper
window.spotify = {
    logout: function () {
        if (localStorage.getItem('access_token')) {
            localStorage.removeItem('access_token');
            window.location.reload()
        }
    },
    login: function () {
        if(localStorage.getItem('access_token')) return;
        const client_id = "8df376a63fff4f42877c404842e093dd"
        const query_val = window.location.search;
        console.log("Logging in!")
        if (!query_val) {
            let codeVerifier = generateRandomString(128);
            generateCodeChallenge(codeVerifier)
                .then(codeChallenge => {
                    localStorage.setItem('code_verifier', codeVerifier);
                    window.location = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
                        response_type: 'code',
                        client_id: client_id,
                        scope: 'user-modify-playback-state',
                        redirect_uri: window.location.href.split('?')[0],
                        state: generateRandomString(16),
                        code_challenge_method: 'S256',
                        code_challenge: codeChallenge
                    });
                });
            return;
        }
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: new URLSearchParams(query_val).get('code'),
                redirect_uri: window.location.href.split('?')[0],
                client_id: client_id,
                code_verifier: localStorage.getItem('code_verifier')
            })
        })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('access_token', data.access_token);
                window.location = window.location.href.split('?')[0];
            })

    },
    playSong: function (uri, offset_ms) {
        fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            body: JSON.stringify({
                uris: [uri],
                position_ms: offset_ms
            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            },
        }).then(function (rsp) {
            if (rsp.status === 401) {
                window.spotify.logout()
            }
        })
    },
    pause: function () {
        fetch("https://api.spotify.com/v1/me/player/pause", {
            method: "PUT",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            }
        }).then(function (rsp) {
            if (rsp.status === 401) {
                window.spotify.logout()
            }
        })
    },
    setVolume: function (volume) {
        fetch("https://api.spotify.com/v1/me/player/volume?volume_percent=" + volume, {
            method: "PUT",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            }
        }).then(function (rsp) {
            if (rsp.status === 401) {
                window.spotify.logout()
            }
        })
    }
}

function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    return window.crypto.subtle.digest('SHA-256', data).then(base64encode);
}