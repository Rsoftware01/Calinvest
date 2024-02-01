// popup.js

const popupOverlay = document.createElement("div");
popupOverlay.id = "deletpopup"; // Adicione um ID aqui

export function createPopup() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePopup);
  } else {
    initializePopup(); // O DOM já está pronto
  }

  function initializePopup() {
    // Cria o popup
    const popupOverlay = document.createElement("div");
    popupOverlay.style.position = "fixed";
    popupOverlay.style.top = "0";
    popupOverlay.style.left = "0";
    popupOverlay.style.width = "100%";
    popupOverlay.style.height = "100%";
    popupOverlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    popupOverlay.style.display = "flex";
    popupOverlay.style.justifyContent = "center";
    popupOverlay.style.alignItems = "center";
    popupOverlay.style.zIndex = "1000";

    const popupContent = document.createElement("div");
    popupContent.style.padding = "20px";
    popupContent.style.backgroundColor = "#fff";
    popupContent.style.borderRadius = "5px";
    popupContent.style.textAlign = "center";
    popupContent.innerHTML = `
        <h2>Informe seus dados</h2>
        <form id="userInfoForm">
            <input type="text" id="fullName" placeholder="Nome Completo" required /><br><br>
            <input type="email" id="email" placeholder="E-mail Principal" required /><br><br>
            <input type="tel" id="phone" placeholder="Telefone" required /><br><br>
            <button type="submit">Enviar</button>
        </form>
      `;

    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);

    // Valida e envia o formulário
    document
      .getElementById("userInfoForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        fetch("/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, email, phone }),
        })
          .then((response) => response.text())
          .then((data) => {
            console.log("Success:", data);
            // Mostrar mensagem de sucesso
            showSuccessMessage();
          })
          .catch((error) => {
            console.error("Error:", error);
            // Aqui você pode mostrar uma mensagem de erro, se necessário
          });
      });
  }

  function showSuccessMessage() {
    const message = document.createElement("div");
    message.textContent = "Dados enviados com sucesso!";
    message.style.backgroundColor = "#4CAF50"; // Cor de fundo verde
    message.style.color = "white"; // Texto branco
    message.style.padding = "10px";
    message.style.marginTop = "10px";
    message.style.textAlign = "center";
    message.style.borderRadius = "5px";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Fechar";
    closeButton.style.marginTop = "10px";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", closePopup);

    const form = document.getElementById("userInfoForm");
    form.parentNode.insertBefore(message, form.nextSibling);
    form.parentNode.insertBefore(closeButton, form.nextSibling);

    // Remover mensagem e botão após alguns segundos
    setTimeout(() => {
      message.parentNode.removeChild(message);
      closeButton.parentNode.removeChild(closeButton);
    }, 5000);
  }

  function closePopup() {
    const popupOverlay = document.getElementById("deletpopup");
    document.body.removeChild(popupOverlay);
  }
}
