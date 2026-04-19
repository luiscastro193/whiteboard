"use strict";
const main = document.querySelector('main');
let startY;

function fits() {
	return main.scrollWidth <= main.clientWidth && main.scrollHeight <= main.clientHeight;
}

function setFactor() {
	localStorage.setItem("whiteboard", main.innerHTML);
	let factor = 1;
	main.style.setProperty('--factor', factor);
	if (fits()) return;
	let low = 0, high = 1;
	
	while (high - low > 1e-4) {
		factor = (low + high) / 2;
		main.style.setProperty('--factor', factor);
		if (fits()) low = factor;
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

if (!main.innerHTML) main.innerHTML = localStorage.getItem("whiteboard");

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
