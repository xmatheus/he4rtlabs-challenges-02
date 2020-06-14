let flag = false;
document
	.querySelector(".container-options-02")
	.addEventListener("click", () => {
		if (!flag) {
			flag = true;
			setDeleteButtonTr();
		} else {
			flag = false;
			removeDeleteButtonTr();
		}
	});

const removeDeleteButtonTr = () => {
	document.querySelectorAll("tr").forEach((elem, i) => {
		if (i !== 0) {
			let deletedChild = elem.querySelector(".delete-td");
			elem.removeChild(deletedChild);
		}
	});
};

const setDeleteButtonTr = () => {
	document.querySelectorAll("tr").forEach((elem, i) => {
		if (i !== 0) {
			elem.appendChild(createTdDelete());
		}
	});
};

const createTdDelete = () => {
	let mytd = document.createElement("td");
	mytd.addEventListener("click", function () {
		this.parentNode.parentNode.removeChild(this.parentNode);
		resume();
	});
	mytd.className = "delete-td";

	let myimg = document.createElement("img");
	myimg.src = "./assets/trash-red.svg";

	mytd.appendChild(myimg);
	return mytd;
};

const popup = () => {
	let popup = document.querySelector(".popup-insert");
	popup.classList.toggle("active");
};

const createRow = (name, hDevs, hTest) => {
	let hourValue = document.querySelector("#hour-value").value;

	if (!hourValue) {
		return null;
	}

	const myTr = document.createElement("tr");
	let myTds = new Array(4);
	myTds[0] = document.createElement("td");
	myTds[1] = document.createElement("td");
	myTds[2] = document.createElement("td");
	myTds[3] = document.createElement("td");

	myTds[0].innerText = name;
	myTds[1].innerText = `${hDevs}h`;
	myTds[2].innerText = `${hTest}h`;
	myTds[3].innerText = `R$ ${
		(Number(hTest) + Number(hDevs)) * Number(hourValue)
	}`;

	myTds.map((ele) => {
		myTr.appendChild(ele);
	});

	return myTr;
};

const insertRow = () => {
	let name = document.getElementById("name").value;
	let hoursDev = document.getElementById("hours-dev").value;
	let hoursTes = document.getElementById("hours-test").value;

	let myTr = createRow(name, hoursDev, hoursTes);

	if (!myTr) {
		alert("Valor da hora é 0?");
	}

	document.querySelector("table").appendChild(myTr);
	popup(); //fechar ele
	resume();
};

const resume = () => {
	let hDevs = 0;
	let hTest = 0;
	let value = 0;
	document.querySelectorAll("tr").forEach((elem, i) => {
		if (i !== 0) {
			elem.querySelectorAll("td").forEach((td, index) => {
				if (index === 1) {
					hDevs += Number(td.innerText.split("h")[0]);
				}
				if (index === 2) {
					hTest += Number(td.innerText.split("h")[0]);
				}
				if (index === 3) {
					value += Number(td.innerText.split("R$ ")[1]);
				}
			});
		}
	});

	let lbDev = document.querySelector("#dev-text");
	lbDev.innerText = `Total de dev ${hDevs}h`;

	let lbTest = document.querySelector("#test-text");
	lbTest.innerText = `Total de teste ${hTest}h`;

	let valueT = document.querySelector("#value-text");
	valueT.innerText = `Valor total R$ ${value}`;
};

function onChange(event) {
	let reader = new FileReader();
	reader.onload = onReaderLoad;
	reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
	let obj = JSON.parse(event.target.result);

	loadJson(obj);
}

document.getElementById("import").addEventListener("change", onChange);

const loadJson = (file) => {
	let hourValue = document.querySelector("#hour-value").value;

	if (!hourValue) {
		alert("Valor da hora é R$ 0?");
	}

	file.map((elem) => {
		let myTr = createRow(elem.feature, elem.devHours, elem.testHours);

		if (myTr) {
			document.querySelector("table").appendChild(myTr);
		}
	});

	resume();
};

const exportJson = () => {
	const customJson = [];

	document.querySelectorAll("tr").forEach((elem, i) => {
		if (i !== 0) {
			let feature = null;
			let devHours = null;
			let testHours = null;

			elem.querySelectorAll("td").forEach((td, index) => {
				if (index === 0) {
					feature = td.innerText;
				}
				if (index === 1) {
					devHours = Number(td.innerText.split("h")[0]);
				}
				if (index === 2) {
					testHours = Number(td.innerText.split("h")[0]);
				}
			});

			customJson.push({ feature, devHours, testHours });
		}
	});

	if (customJson.length > 0) {
		saveJson(customJson);
	}
};

const saveJson = (file) => {
	var dataStr =
		"data:text/json;charset=utf-8," +
		encodeURIComponent(JSON.stringify(file, null, 4));
	var downloadAnchorNode = document.createElement("a");
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute("download", "yourJson" + ".json");
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
};
