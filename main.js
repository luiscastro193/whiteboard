"use strict";
const main = document.querySelector('main');
const root = document.querySelector(':root');
const text = document.createRange();

function fits(mainRect) {
	const textRect = text.getBoundingClientRect();
	return textRect.width <= mainRect.width && textRect.height <= mainRect.height;
}

function setFactor() {
	localStorage.setItem("whiteboard", main.textContent);
	const mainRect = main.getBoundingClientRect();
	text.selectNodeContents(main);
	let factor = 1;
	root.style.setProperty('--factor', factor);
	if (!main.textContent || fits(mainRect)) return;
	let low = 0, high = 1;
	
	while (high - low > 1e-4) {
		factor = (low + high) / 2;
		root.style.setProperty('--factor', factor);
		if (fits(mainRect)) low = factor;
		else high = factor;
	}
	
	root.style.setProperty('--factor', low);
}

main.onfocus = () => {
	if (!history.state?.focused)
		history.pushState({focused: true}, '');
};

window.onpopstate = () => main.blur();
main.blur();
if (!main.textContent) main.textContent = localStorage.getItem("whiteboard");

await document.fonts.ready;
main.oninput = setFactor;
new ResizeObserver(setFactor).observe(main);
