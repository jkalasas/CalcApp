const screen = document.querySelector(".screen");

// theming variables
let curTheme = 0;
const themeButton = document.querySelector(".theme-button");
const themes = [
	{
		mainbg: "hsl(222, 26%, 31%)",
		textColor: "white",
		screenbg: "hsl(224, 36%, 15%)",

		keypadbg: "hsl(224, 36%, 15%)",
		Pkeybg: "white",
		Pkeyshadow: "grey",
		Pkeytext: "hsl(224, 36%, 15%)",

		Skeybg: "hsl(225, 21%, 49%)",
		Skeyshadow: "hsl(224, 28%, 35%)",
		Skeytext: "white",

		Tkeybg: "hsl(6, 63%, 50%)",
		Tkeyshadow: "hsl(6, 70%, 34%)",
		Tkeytext: "white"
	},
	{
		mainbg: "hsl(0, 0%, 90%)",
		textColor: "hsl(60, 10%, 19%)",
		screenbg: "hsl(0, 0%, 93%)",

		keypadbg: "hsl(0, 5%, 81%)",
		Pkeybg: "hsl(45, 7%, 89%)",
		Pkeyshadow: "hsl(35, 11%, 61%)",
		Pkeytext: "hsl(60, 10%, 19%)",

		Skeybg: "hsl(185, 42%, 37%)",
		Skeyshadow: "hsl(185, 58%, 25%)",
		Skeytext: "white",

		Tkeybg: "hsl(25, 98%, 40%)",
		Tkeyshadow: "hsl(25, 99%, 27%)",
		Tkeytext: "white"
	},
	{
		mainbg: "hsl(268, 75%, 9%)",
		textColor: "hsl(52, 100%, 62%)",
		screenbg: "hsl(268, 71%, 12%)",

		keypadbg: "hsl(268, 71%, 12%)",
		Pkeybg: "hsl(268, 47%, 21%)",
		Pkeyshadow: "hsl(290, 70%, 36%)",
		Pkeytext: "hsl(52, 100%, 62%)",

		Skeybg: "hsl(281, 89%, 26%)",
		Skeyshadow: "hsl(285, 91%, 52%)",
		Skeytext: "white",

		Tkeybg: "hsl(176, 100%, 44%)",
		Tkeyshadow: "hsl(177, 92%, 70%)",
		Tkeytext: "hsl(198, 20%, 13%)"
	}
];

//keys variables

const keys = document.querySelectorAll(".key");

const expr = {
	first: null,
	op: null,
	second: null
};

function evalNum() {
	let value = 0;
	if (!screen.innerText.length) return value;
	else {
		value = Number(screen.innerText);
	}
	return value;
}

function updateScreen(value) {
	if (screen.innerText[0] === "0" && value !== ".") {
		screen.innerText = "" + value;
		return;
	}
	if (value === "." && screen.innerText.includes(".")) {
		return;
	} else if (value === "0" && screen.innerText[0] === "0" && screen.innerText.length===1) {
		return;
	}
	screen.innerText += value;
	console.log(screen.innerText);
	return
}

function delDigit() {
	if (!screen.innerText.length) return;
	else if (screen.innerText.length === 1) {
		screen.innerText = "";
		return;
	}
	screen.innerText = screen.innerText.slice(0, screen.innerText.length-1);
}

function resetCalc() {
	expr.first = null;
	expr.second = null;
	expr.op = null;
	screen.innerText = "";
}

function resetExpr() {
	expr.first = null;
	expr.second = null;
	expr.op = null;
}

function pressedKey(key) {
	if (key.value === "=") {
		key.style.backgroundColor = themes[curTheme].Tkeyshadow;
		setTimeout(() => key.style.backgroundColor = themes[curTheme].Tkeybg, 200);
	} else if (key.getAttribute("keytype") === "func") {
		key.style.backgroundColor = themes[curTheme].Skeyshadow;
		setTimeout(() => key.style.backgroundColor = themes[curTheme].Skeybg, 200);
	} else {
		key.style.backgroundColor = themes[curTheme].Pkeyshadow;
		setTimeout(() => key.style.backgroundColor = themes[curTheme].Pkeybg, 200);
	}
}


function evalExpr(op=null) {
	if (!expr.first && evalNum(screen.innerText) != NaN && op) {
		expr.first = screen.innerText;
		expr.op = op;
		screen.innerText = "";
	} else if (op) {
		expr.op = op;
		expr.second = (!screen.innerText) ? 0 : screen.innerText;
		answer = eval(`${expr.first} ${op} ${expr.second}`);
		if ((new String(answer)).length > 8) answer = answer.toPrecision(8);
		screen.innerText = answer.toString();
		resetExpr();
	} else if (expr.first && expr.op) {
		expr.second = (!screen.innerText) ? 0 : screen.innerText;
		answer = eval(`${expr.first} ${expr.op} ${expr.second}`);
		if ((new String(answer)).length > 8) answer = answer.toPrecision(8);
		screen.innerText = answer.toString();
		resetExpr();
	} else if (!expr.first && !expr.second) return;
	else {
		screen.innerText = "SYNTAX ERROR";
		resetExpr();
	}
}

function mapKeys() {
	for (let key of keys) {
		if (key.getAttribute("keytype") === "operator") {
			if (key.value === "+") 
				key.addEventListener("click", () => { evalExpr(op="+"); pressedKey(key); });
			else if (key.value === "-")
				key.addEventListener("click", () => { evalExpr(op="-"); pressedKey(key); });
			else if (key.value === "*")
				key.addEventListener("click", () => { evalExpr(op="*"); pressedKey(key); });
			else if (key.value === "/")
				key.addEventListener("click", () => { evalExpr(op="/"); pressedKey(key); });
			else if (key.value === "=")
				key.addEventListener("click", () => { evalExpr(); pressedKey(key); });
		} else if (key.getAttribute("keytype") === "func") {
			if (key.value === "del")
				key.addEventListener("click", () => { delDigit(); pressedKey(key); });
			if (key.value === "reset")
				key.addEventListener("click", () => { resetCalc(); pressedKey(key); });
		} else {
			key.addEventListener("click", () => {
				updateScreen(key.value);
				pressedKey(key);
			});
		}
	}

	themeButton.addEventListener("click", changeTheme);
}

function changeTheme() {
	curTheme += 1;
	if (curTheme > 2) curTheme = 0;

	if (curTheme === 0) themeButton.style.justifyContent = "start";
	else if (curTheme === 1) themeButton.style.justifyContent = "center";
	else if (curTheme === 2) themeButton.style.justifyContent = "end";
	for (let key of keys) {
		key.style.transition = "all 2s ease";
	}
	setTimeout(()=> {
		for (let key of keys) {
			key.style.transition = "";
		}}, 2000);
	setTheme();
}

function setTheme() {
	let src = document.querySelector(".screen");
	let body = document.body;
	let keypad = document.querySelector(".key-container");
	let header = document.querySelector("header")

	body.style.backgroundColor = themes[curTheme].mainbg;
	body.style.color = themes[curTheme].textColor;

	header.style.color = themes[curTheme].textColor;

	themeButton.style.backgroundColor = themes[curTheme].keypadbg;
	themeButton.childNodes[1].style.backgroundColor = themes[curTheme].Tkeybg;

	src.style.backgroundColor = themes[curTheme].screenbg;
	src.style.color = themes[curTheme].textColor;

	keypad.style.backgroundColor = themes[curTheme].keypadbg;
	for (let key of keys) {
		if (key.getAttribute("keytype") === "func") {
			key.style.backgroundColor = themes[curTheme].Skeybg;
			key.style.color = themes[curTheme].Skeytext;
			key.style.boxShadow = `0px 3px ${themes[curTheme].Skeyshadow}`;
		} else {
			if (key.value === "=") {
				key.style.backgroundColor = themes[curTheme].Tkeybg;
				key.style.color = themes[curTheme].Tkeytext;
				key.style.boxShadow = `0px 3px ${themes[curTheme].Tkeyshadow}`;
			} else {
				key.style.backgroundColor = themes[curTheme].Pkeybg;
				key.style.color = themes[curTheme].Pkeytext;
				key.style.boxShadow = `0px 3px ${themes[curTheme].Pkeyshadow}`;
			}
		}
	}
}

mapKeys();
setTheme();
