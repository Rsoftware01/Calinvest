const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware para parsear o corpo das requisições POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do Nodemailer com suas credenciais de e-mail
const transporter = nodemailer.createTransport({
  service: "gmail", // Por exemplo, para Gmail
  auth: {
    user: "rafael.almeida221010@gmail.com",
    pass: "Phdsec321@!#",
  },
});

app.post("/send-email", (req, res) => {
  const { fullName, email, phone } = req.body;
  console.log("Received data:", { fullName, email, phone });

  const mailOptions = {
    from: "rafael.almeida221010@gmail.com",
    to: "rafael.almeida221010@gmail.com", // Para onde você quer enviar
    subject: "Novo Contato Recebido",
    text: `Você recebeu um novo contato de: ${fullName}, E-mail: ${email}, Telefone: ${phone}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("E-mail enviado com sucesso: " + info.response);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
