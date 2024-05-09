const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return;

    await this.isUserExists();

    if (this.errors.length > 0) return;

    const salt = bcrypt.genSaltSync();
    this.body.password = bcrypt.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }

  async login() {
    this.valida();
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push("Usuário ou senha inválidos.");
      return;
    }

    if (!bcrypt.compareSync(this.body.password, this.user.password)) {
      this.errors.push("Senha inválida");
      this.user = null;
      return;
    }
  }

  async isUserExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });

    if (this.user) this.errors.push("Usuário já existente.");
  }

  valida() {
    this.cleanUp();

    if (this.body.nome) {
      if (this.body.nome.trim() === "")
        this.errors.push("Nome precisa ser informado");
    }

    if (!validator.isEmail(this.body.email))
      this.errors.push("E-mail inválido");

    if (this.body.password.length < 3 || this.body.password.length > 50)
      this.errors.push("A senha precisa ter entre 3 e 50 caracteres");
  }

  cleanUp() {
    for (let key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      nome: this.body.nome,
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
