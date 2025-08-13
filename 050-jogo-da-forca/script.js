document.addEventListener("DOMContentLoaded", () => {
	const head = document.querySelector("#head");
	const body = document.querySelector("#body");
	const leftArm = document.querySelector(".arm.left");
	const rightArm = document.querySelector(".arm.right");
	const leftLeg = document.querySelector(".leg.left");
	const rightLeg = document.querySelector(".leg.right");
	const containerLetters = document.querySelector("#container-letters");
	const inputLetter = document.querySelector("#inputLetter");
	const pSentLetters = document.querySelector("#pSentLetters");
	const tipContent = document.querySelector("#tipContent");
	const title = document.querySelector("#title");

	let errors = 0;
	let sortedWord = "";
	let sentLetters = [];
	let filledLetters = 0;

	function generateNewWord(word, tip) {
		reset();

		sortedWord = word;

		tipContent.textContent = tip;

		let i = 1;
		containerLetters.innerHTML = "";
		while (i <= word.length) {
			containerLetters.innerHTML += `
        <input class="inputLetter" type="text" readonly name="letter${i}" id="letter${i}" title="letter" />  
        `;
			i++;
		}
	}

	function wordHasLetter(letter) {
		let lettersOfWord = sortedWord.split("");
		const inputs = containerLetters.querySelectorAll("input");

		let hasLetter = sortedWord.toLowerCase().indexOf(letter.toLowerCase());

		if (!validateLetter(letter)) return;

		if (sentLetters.includes(letter)) return;
		sentLetters.push(letter);
		pSentLetters.textContent += ` - ${letter}`;

		if (hasLetter >= 0) {
			lettersOfWord.forEach((letterWord, index) => {
				if (letter.toLowerCase() == letterWord.toLowerCase()) {
					inputs[index].value = letter;
					filledLetters++;
				}
			});

			inputLetter.value = "";

			if (filledLetters == lettersOfWord.length) {
				fireConfetti();
				title.classList.add("win");
				finish();
			}

			return;
		}

		errors++;
		if (errors >= 1) head.classList.remove("hidden");
		if (errors >= 2) body.classList.remove("hidden");
		if (errors >= 3) leftArm.classList.remove("hidden");
		if (errors >= 4) rightArm.classList.remove("hidden");
		if (errors >= 5) leftLeg.classList.remove("hidden");
		if (errors == 6) {
			rightLeg.classList.remove("hidden");
			alert("Perdeu!");
			title.classList.add("lose");
			finish();
		}
	}

	function resetPerson() {
		head.classList.add("hidden");
		body.classList.add("hidden");
		leftArm.classList.add("hidden");
		rightArm.classList.add("hidden");
		leftLeg.classList.add("hidden");
		rightLeg.classList.add("hidden");
	}

	function reset() {
		errors = 0;
		resetPerson();
		inputLetter.value = "";
		pSentLetters.textContent = "Letras já testadas: ";
		tipContent.classList.add("hidden");
		inputLetter.removeAttribute("readonly");
		btnPlay.removeAttribute("disabled");
		inputLetter.style.cursor = "text";
		inputLetter.style.borderColor = "black";
		inputLetter.removeAttribute("placeholder");
		title.className = "";
	}

	function finish() {
		inputLetter.setAttribute("readonly", "readonly");
		inputLetter.style.cursor = "not-allowed";
		btnPlay.setAttribute("disabled", "disabled");
		filledLetters = 0;
		sentLetters = [];
	}

	function validateLetter(letter) {
		if (!letter || letter.trim() === "") {
			inputLetter.style.border = "2px solid red";
			inputLetter.setAttribute("placeholder", "!");
			inputLetter.value = "";
			return false;
		}

		return true;
	}

	const btnNewWord = document.querySelector("#btnNewWord");
	btnNewWord.addEventListener("click", () => {
		searchWord();
	});

	const btnPlay = document.querySelector("#btnPlay");
	btnPlay.addEventListener("click", () => {
		wordHasLetter(inputLetter.value);
	});

	const btnTip = document.querySelector("#btnTip");
	btnTip.addEventListener("click", () => {
		tipContent.classList.toggle("hidden");
	});

	document.addEventListener("keydown", (event) => {
		if (event.key == "Enter") wordHasLetter(inputLetter.value);
	});

	function fireConfetti() {
		var count = 200;
		var defaults = {
			origin: { y: 0.7 },
		};

		function fire(particleRatio, opts) {
			confetti({
				...defaults,
				...opts,
				particleCount: Math.floor(count * particleRatio),
			});
		}

		fire(0.25, {
			spread: 26,
			startVelocity: 55,
		});
		fire(0.2, {
			spread: 60,
		});
		fire(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8,
		});
		fire(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2,
		});
		fire(0.1, {
			spread: 120,
			startVelocity: 45,
		});
	}

	async function searchWord() {
		const loading = document.querySelector("#loading-container");
		loading.classList.remove("hidden");

		try {
			const response = await fetch("https://json-server-5bev.onrender.com/jogo-da-forca");
			const data = await response.json();

			const randomIndex = Math.floor(Math.random() * data.length);
			const selectedWord = data[randomIndex].palavra;
			const tip = data[randomIndex].pista;

			generateNewWord(selectedWord, tip);
		} catch (error) {
			alert("Erro ao carregar palavra: " + error);
		} finally {
			loading.classList.add("hidden");
		}
	}

	searchWord();
});
