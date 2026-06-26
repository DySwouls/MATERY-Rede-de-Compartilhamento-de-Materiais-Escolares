const CHAVE_USUARIOS = "matery_users";
const CHAVE_USUARIO_ATUAL = "matery_currentUser";

const formularioLogin = document.querySelector("#form-login");
const mensagemLogin = document.querySelector("#mensagem-login");
const campoEmail = document.querySelector("#email");
const campoSenha = document.querySelector("#senha");
const linkCadastro = document.querySelector("#link-cadastro");
const textoRedirecionamento = document.querySelector("#texto-redirecionamento");

function carregarUsuarios() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
    } catch {
        localStorage.removeItem(CHAVE_USUARIOS);
        return [];
    }
}

function exibirMensagem(texto, tipo) {
    mensagemLogin.textContent = texto;
    mensagemLogin.className = `mensagem-login ${tipo}`;
}

function obterDestinoSeguro() {
    const parametros = new URLSearchParams(window.location.search);
    const redirect = parametros.get("redirect");

    if (!redirect) {
        return "catalogo.html";
    }

    const destinoLimpo = redirect.replace(/^\.?\//, "");
    const destinoPermitido = /^[a-z0-9_-]+\.html(?:#[a-z0-9_-]+)?$/i.test(destinoLimpo);

    return destinoPermitido ? destinoLimpo : "catalogo.html";
}

const destinoAposLogin = obterDestinoSeguro();

if (destinoAposLogin === "doar.html") {
    textoRedirecionamento.textContent = "Faça login ou crie uma conta para acessar a página de doação.";
}

linkCadastro.href = `cadastro.html?redirect=${encodeURIComponent(destinoAposLogin)}`;

formularioLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const email = campoEmail.value.trim().toLowerCase();
    const senha = campoSenha.value;

    if (!email || !senha) {
        exibirMensagem("Informe e-mail e senha para continuar.", "erro");
        return;
    }

    if (!campoEmail.validity.valid) {
        exibirMensagem("Informe um e-mail válido.", "erro");
        campoEmail.focus();
        return;
    }

    const usuarios = carregarUsuarios();
    const usuarioEncontrado = usuarios.find((usuario) => usuario.email === email && usuario.senha === senha);

    if (!usuarioEncontrado) {
        exibirMensagem("E-mail ou senha incorretos. Cadastre-se caso ainda não tenha uma conta.", "erro");
        return;
    }

    const usuarioAtual = {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        curso: usuarioEncontrado.curso || "",
        cidade: usuarioEncontrado.cidade || "",
        telefone: usuarioEncontrado.telefone || "",
        email: usuarioEncontrado.email
    };

    localStorage.setItem(CHAVE_USUARIO_ATUAL, JSON.stringify(usuarioAtual));

    exibirMensagem("Login realizado com sucesso. Redirecionando...", "sucesso");

    setTimeout(() => {
        window.location.href = destinoAposLogin;
    }, 800);
});
