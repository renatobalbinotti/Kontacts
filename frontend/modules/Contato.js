import validator from "validator";

export default class Contato {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validate(e);
    });
  }

  validate(e) {
    const el = e.target;
    const nomeInput = el.querySelector('input[name="nome"]');
    // const sobrenomeInput = el.querySelector('input[name="sobrenome"]');
    const emailInput = el.querySelector('input[name="email"]');
    const telefoneInput = el.querySelector('input[name="telefone"]');
    let error = false;

    if (!nomeInput.value) {
      alert("Nome precisa ser informado");
      error = true;
    }

    if (!emailInput.value && !telefoneInput.value) {
      alert("Pelo menos um contato precisa ser enviado: E-mail ou Telefone");
      error = true;
    }

    if (emailInput && !validator.isEmail(emailInput.value)) {
      alert("Email informado é inválido");
      error = true;
    }

    if (!error) el.submit();
  }
}
