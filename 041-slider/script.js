document.addEventListener("DOMContentLoaded", () => {
	const imageList = [];
	const slider = document.querySelector("#slider");
	let intervalId,
		currentImage,
		quantityImages,
		cont = 1;

	function preLoad() {
		quantityImages = 4;

		for (let i = 0; i < quantityImages; i++) {
			imageList[i] = new Image();
			imageList[i].src = `images/image${i + 1}.jpg`;
		}
	}

	function loadImage(imgId) {
		slider.style.backgroundImage = `url(${imageList[imgId].src})`;
		slider.textContent = cont;
		cont++;

		if (cont > quantityImages) cont = 1;
	}

	function changeImage() {
		currentImage++;
		if (currentImage > quantityImages - 1) currentImage = 0;
		loadImage(currentImage);
	}

	function start() {
		currentImage = 0;
		let timeSlider = 2000;
		preLoad();
		loadImage(currentImage);

		intervalId = setInterval(changeImage, timeSlider);
	}

	start();
});
