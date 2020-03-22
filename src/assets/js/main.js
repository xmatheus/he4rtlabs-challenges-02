// Este será o objeto principal no qual você irá se basear para as funções do desafio!
// Caso haja dúvidas de como prosseguir, favor consultar a sala #js no nosso discord!

const calcFeatureValue = (devHours, testHours) => {
  let hourValue = document.getElementById("hourValue").value;
  let result = Math.floor((devHours + testHours) * hourValue);
  return result;
};
const selectRow = event => {
  let rows = document.getElementsByTagName("tr");
  for (let row of rows) {
    row.className = "";
  }
  event.target.parentNode.classList.add("table-active");
};

const generateTableRow = (id, data) => {
  return `
    <tr onclick="selectRow(event)" data-index="${id}">
      <td>${data.feature}</td>
      <td>${data.devHours}h</td>
      <td>${data.testHours}h</td>
      <td>R$ ${calcFeatureValue(data.devHours, data.testHours)}</td>
    </tr>
  `;
};

let totalAmount = 0;
let features = [
  {
    feature: "Authentication #1",
    devHours: 1,
    testHours: 2
  }
];

const refreshGUI = () => {
  totalAmount = 0;
  let table = document.getElementById("mainTable");
  table.innerHTML = "";
  features.forEach((feature, i) => {
    let row = generateTableRow(i, feature);
    table.insertAdjacentHTML("beforeend", row);
  });
  document.getElementById("totalDev").innerHTML = features.reduce(
    (acc, feature) => (acc += feature.devHours),
    0
  );
  document.getElementById("totalTest").innerHTML = features.reduce(
    (acc, feature) => (acc += feature.testHours),
    0
  );
  document.getElementById("totalValue").innerHTML = features.reduce(
    (acc, feature) =>
      (acc += calcFeatureValue(feature.devHours, feature.testHours)),
    0
  );
};

const init = () => refreshGUI();
init();

document.getElementById("hourValue").addEventListener("keyup", () => {
  refreshGUI();
});

document.getElementById("btnFinishFeature").addEventListener("click", e => {
  e.preventDefault();

  let inputFeature = document.getElementById("inputFeature");
  let inputDev = document.getElementById("inputDev");
  let inputTest = document.getElementById("inputTest");
  let feature = {
    feature: inputFeature.value,
    devHours: parseInt(inputDev.value),
    testHours: parseInt(inputTest.value)
  };
  document.getElementById("mainForm").reset();

  features.push(feature);
  refreshGUI();
  $("#addModal").modal("toggle");
});

document.getElementById("btnDelete").addEventListener("click", e => {
  e.preventDefault();
  let rows = document.getElementsByClassName("table-active");
  if (!rows.length) {
    alert("Selecione um campo para ser deletado");
    return false;
  }
  let index = parseInt(rows[0].getAttribute("data-index"));

  features = features.filter((data, i) => i !== index);
  refreshGUI();
});

document.getElementById("btnImport").addEventListener("change", e => {
  let file = e.target.files[0];
  let reader = new FileReader();

  reader.readAsText(file);
  reader.onloadend = () => {
    let result = JSON.parse(reader.result);
    features = result;
    refreshGUI();
  };
});

document.getElementById("btnExport").addEventListener("click", () => {
  let element = document.getElementById("download");
  element.href =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(features));
  element.setAttribute("download", "heartlabs02.json");
  element.click();
});

document.getElementById("labelImport").addEventListener("click", () => {
  document.getElementById("btnImport").click();
});
