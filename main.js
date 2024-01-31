//import { type } from "os";
import { generateReturnsArray } from "./src/investmentGoals";
import { Chart } from "chart.js/auto";
import { createTable } from "./src/table";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById("clear-form");
let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
  { columnLabel: "Mês", accessor: "month" },
  {
    columnLabel: "Total investido",
    accessor: "investedAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Rendimento mensal",
    accessor: "interestReturns",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Rendimento total",
    accessor: "totalInterestReturns",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Quantia total",
    accessor: "totalAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
];

function formatCurrencyToTable(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCurrencyTograph(value) {
  return value.toFixed(2);
}

function renderProgression(evt) {
  evt.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }

  const tableElement = document.getElementById("results-table");
  const tableBody = tableElement.querySelector("tbody");
  const tableHead = tableElement.querySelector("thead");

  tableBody.innerHTML = "";
  tableHead.innerHTML = "";

  resetCharts();

  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod,
    taxRate
  );
  const finalInvestmentObject = returnsArray[returnsArray.length - 1];
  // console.log(returnsArray);

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total Investido", "Rendimento", "Imposto"],
      datasets: [
        {
          data: [
            formatCurrencyTograph(finalInvestmentObject.investedAmount),
            formatCurrencyTograph(
              finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrencyTograph(
              finalInvestmentObject.totalInterestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionChartReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: "Total Investido",
          data: returnsArray.map(
            (investmentObject) => investmentObject.investedAmount
          ),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Retorno do Investimento",
          data: returnsArray.map((investmentObject) =>
            formatCurrencyTograph(investmentObject.interestReturns)
          ),
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
  createTable(columnsArray, returnsArray, "results-table");
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tax-rate"].value = "";

  const tableElement = document.getElementById("results-table");
  const tableBody = tableElement.querySelector("tbody");
  const tableHead = tableElement.querySelector("thead");

  tableBody.innerHTML = "";
  tableHead.innerHTML = "";

  resetCharts();

  const errorInputContainers = document.querySelectorAll(".error");

  for (const errorInputContainer of errorInputContainers) {
    errorInputContainer.classList.remove("error");
    errorInputContainer.parentElement.querySelector("p").remove();
  }
}
function validateInput(evt) {
  if (evt.target.value === "") {
    return;
  }

  const { parentElement } = evt.target;
  const grandParentElement = evt.target.parentElement.parentElement;

  const inputValue = evt.target.value.replace(",", ".");
  if (
    !parentElement.classList.contains("error") &&
    (isNaN(inputValue) || Number(inputValue) <= 0)
  ) {
    const errorTextElement = document.createElement("p"); //<p></p>
    errorTextElement.classList.add("text-red-500"); //<p class =""></p>
    errorTextElement.classList.add("font-bold"); //<p class =""></p>
    errorTextElement.innerText = "Insira um valor maior do que zero"; //<p class="text-red-500 font-bold"> Insira um valor maior do que zero</p>

    parentElement.classList.add("error");
    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
  }
}

for (const formElement of form)
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }

const mainEl = document.querySelector("main");
const carouselEl = document.getElementById("carousel");
const nextButton = document.getElementById("slide-arrow-next");
const previousButton = document.getElementById("slide-arrow-previous");

nextButton.addEventListener("click", () => {
  carouselEl.scrollLeft += mainEl.clientWidth;
});

previousButton.addEventListener("click", () => {
  carouselEl.scrollLeft -= mainEl.clientWidth;
});

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);

// Adicione esta função para gerar o arquivo
function generateFile() {
  const fileType = prompt(
    "Escolha o tipo de arquivo (PDF ou Excel):"
  ).toLowerCase();

  if (fileType === "pdf") {
    generatePDF();
  } else if (fileType === "excel") {
    generateExcel();
  } else {
    alert("Tipo de arquivo não suportado. Por favor, escolha PDF ou Excel.");
  }
}

function generatePDF() {
  const pdf = new jsPDF();
  pdf.text("Relatório de Investimentos", 20, 10);

  // Adiciona gráfico de rosca (doughnut)
  const doughnutDataURL = finalMoneyChart.toDataURL("image/png", 1.0);
  pdf.addImage(doughnutDataURL, "PNG", 20, 30, 80, 60);

  // Adiciona gráfico de barras (progression)
  const progressionDataURL = progressionChart.toDataURL("image/png", 1.0);
  pdf.addImage(progressionDataURL, "PNG", 20, 110, 120, 60); // Ajuste a largura para 120

  // Adiciona a tabela
  pdf.autoTable({ html: "#results-table", startY: 190 });

  // Salva ou exibe o arquivo
  pdf.save("relatorio_investimentos.pdf");
}

function generateExcel() {
  const wb = XLSX.utils.book_new();

  // Adiciona a tabela
  const ws = XLSX.utils.table_to_sheet(
    document.getElementById("results-table")
  );
  XLSX.utils.book_append_sheet(wb, ws, "Investimentos");

  // Adiciona gráfico de rosca (doughnut)
  const doughnutDataURL = finalMoneyChart.toDataURL("image/png");
  const doughnutBlob = dataURLtoBlob(doughnutDataURL);
  const doughnutObject = {
    "!type": "image",
    "!data": doughnutBlob,
    "!mime": "image/png",
    "!link": "Doughnut Chart",
  };
  XLSX.utils.book_append_sheet(
    wb,
    { "!objects": [doughnutObject] },
    "Gráfico de rosca"
  );

  // Adiciona gráfico de barras (progression)
  const progressionDataURL = progressionChart.toDataURL("image/png");
  const progressionBlob = dataURLtoBlob(progressionDataURL);
  const progressionObject = {
    "!type": "image",
    "!data": progressionBlob,
    "!mime": "image/png",
    "!link": "Progression Chart",
  };
  XLSX.utils.book_append_sheet(
    wb,
    { "!objects": [progressionObject] },
    "Gráfico de barras"
  );

  // Salva ou exibe o arquivo
  XLSX.writeFile(wb, "Relatorio_investimentos.xlsx");
}

// Função auxiliar para converter Data URL para Blob
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Adicione este ouvinte de evento para o botão "Gerar arquivo"
document
  .getElementById("generate-file")
  .addEventListener("click", generateFile);
