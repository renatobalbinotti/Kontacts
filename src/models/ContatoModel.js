const mongoose = require("mongoose");
const validator = require("validator");

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  telefone: { type: String, required: false, default: "" },
  criador: { type: String, required: true, default: "" },
  dataCriacao: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model("Contato", ContatoSchema);

class Contato {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contato = {};
  }

  async register(user) {
    this.valida();

    if (this.errors.length > 0) return;
    this.body.criador = user.email;

    this.contato = await ContatoModel.create(this.body);
  }

  async edit(id) {
    if (typeof id !== "string") return;
    this.valida();
    if (this.errors.length > 0) return;

    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
      new: true,
    });
  }

  valida() {
    this.cleanUp();
    if (this.body.email && !validator.isEmail(this.body.email))
      this.errors.push("E-mail inválido");

    if (!this.body.nome) this.errors.push("Nome é um campo obrigatório");

    if (!this.body.email && !this.body.telefone)
      this.errors.push(
        "Pelo menos um contato precisa ser enviado: E-mail ou Telefone"
      );
  }

  cleanUp() {
    for (let key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone,
    };
  }

  static async buscaPorId(id) {
    if (typeof id !== "string") return;
    const contato = await ContatoModel.findById(id);
    return contato;
  }

  static async buscaContatos(criador) {
    if (criador) {
      const contatos = await ContatoModel.find({ criador: criador.email }).sort({ dataCriacao: -1 });
      return contatos
    }

    const contatos = await ContatoModel.find().sort({ dataCriacao: -1 });
    return contatos;
  }

  static async delete(id) {
    if (typeof id !== "string") return;
    console.log("oie");
    const contato = await ContatoModel.findByIdAndDelete({ _id: id });
    return contato;
  }
}

module.exports = Contato;
