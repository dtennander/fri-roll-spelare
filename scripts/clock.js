function set_up_clock() {
	const clockDiv = document.getElementById("clock")
	clockDiv.innerText = "00:00"
	let semaphore = null
	const onclick = function() {
		if (semaphore != null) {
			semaphore = null
			clockDiv.innerText = "00:00"
			return
		}
		const startTime = Date.now()
		const me = {}
		semaphore = me
		const update = function() {
			if (semaphore != me) return
			const diff = (Date.now() - startTime) / 1000
			let min = Math.floor(diff / 60)
			if (min < 10) min = "0" + min
			let s = Math.floor(diff % 60)
			if (s < 10) s = "0" + s
			clockDiv.innerText = min + ":" + s
			if (min < window.times.warning) {
				clockDiv.classList.remove("soonDone")
				clockDiv.classList.remove("done")
			}
			if (window.times.warning <= min) {
				clockDiv.classList.remove("done")
				clockDiv.classList.add("soonDone")
			} else if (window.times.end <= min) {
				clockDiv.classList.remove("soonDone")
				clockDiv.classList.add("done")
			}
			setTimeout(update, 1000)
			console.log("tick!", min, s, diff)
		}
		update()
	}
	clockDiv.onclick = onclick
	clockDiv.onpress = onclick
}

set_up_clock()
