// popup.js
// popup.js

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

        if (fullName && email && phone) {
          console.log("Dados enviados:", { fullName, email, phone });
          // Aqui você pode adicionar a lógica para enviar esses dados para um servidor
          // Por agora, vamos apenas fechar o popup
          document.body.removeChild(popupOverlay);
        } else {
          alert("Por favor, preencha todos os campos.");
        }
      });
  }
}
