"use strict";
const main = document.querySelector('main');
const text = document.createRange();
let startY;

function fits(mainRect) {
	const textRect = text.getBoundingClientRect();
	return textRect.width <= mainRect.width && textRect.height <= mainRect.height;
}

function setFactor() {
	localStorage.setItem("whiteboard", main.textContent);
	let factor = 1;
	main.style.setProperty('--factor', factor);
	
	if (!main.textContent) {
		main.innerHTML = '';
		return;
	}
	
	const mainRect = main.getBoundingClientRect();
	text.selectNodeContents(main);
	if (fits(mainRect)) return;
	let low = 0, high = 1;
	
	while (high - low > 1e-4) {
		factor = (low + high) / 2;
		main.style.setProperty('--factor', factor);
		if (fits(mainRect)) low = factor;
		else high = factor;
	}
	
	main.style.setProperty('--factor', low);
}

document.addEventListener('touchstart', event => {
	startY = event.changedTouches[0].pageY;
});

document.addEventListener('touchend', event => {
	if (startY - event.changedTouches[0].pageY > 50) main.blur();
});

document.addEventListener('keydown', event => {
	if (event.key == 'Escape') main.blur();
});

if (!main.textContent) main.textContent = localStorage.getItem("whiteboard");

await document.fonts.ready;
main.oninput = setFactor;
new ResizeObserver(setFactor).observe(main);

addEventListener('beforeprint', () => {
	main.classList.add("print");
	setFactor();
});

addEventListener('afterprint', () => {
	main.classList.remove("print");
	setFactor();
});
