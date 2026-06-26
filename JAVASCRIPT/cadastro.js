const CHAVE_USUARIOS = "matery_users";
const CHAVE_USUARIO_ATUAL = "matery_currentUser";

const formularioCadastro = document.querySelector("#form-cadastro");
const mensagemCadastro = document.querySelector("#mensagem-cadastro");
const campoTelefone = document.querySelector("#telefone");
const campoEmail = document.querySelector("#email");
const linkLogin = document.querySelector("#link-login");

function carregarUsuarios() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
    } catch {
        localStorage.removeItem(CHAVE_USUARIOS);
        return [];
    }
}

function salvarUsuarios(usuarios) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

function exibirMensagem(texto, tipo) {
    mensagemCadastro.textContent = texto;
    mensagemCadastro.className = `mensagem-cadastro ${tipo}`;
}

function somenteNumeros(valor) {
    return valor.replace(/\D/g, "");
}

function formatarTelefone(valor) {
    const numeros = somenteNumeros(valor).slice(0, 11);

    if (numeros.length <= 2) {
        return numeros;
    }

    if (numeros.length <= 6) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    if (numeros.length <= 10) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
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

const destinoAposCadastro = obterDestinoSeguro();

if (linkLogin) {
    linkLogin.href = `login.html?redirect=${encodeURIComponent(destinoAposCadastro)}`;
}

campoTelefone.addEventListener("input", () => {
    campoTelefone.value = formatarTelefone(campoTelefone.value);
});

formularioCadastro.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const formData = new FormData(formularioCadastro);
    const nome = String(formData.get("nome") || "").trim();
    const curso = String(formData.get("curso") || "").trim();
    const cidade = String(formData.get("cidade") || "").trim();
    const telefone = String(formData.get("telefone") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const senha = String(formData.get("senha") || "");
    const confirmarSenha = String(formData.get("confirmarSenha") || "");
    const aceitouTermos = formData.get("termos") === "on";

    if (!nome || !telefone || !email || !senha || !confirmarSenha) {
        exibirMensagem("Preencha todos os campos obrigatórios.", "erro");
        return;
    }

    if (!campoEmail.validity.valid) {
        exibirMensagem("Informe um e-mail válido.", "erro");
        campoEmail.focus();
        return;
    }

    if (somenteNumeros(telefone).length < 10) {
        exibirMensagem("Informe um WhatsApp válido com DDD.", "erro");
        campoTelefone.focus();
        return;
    }

    if (senha.length < 6) {
        exibirMensagem("A senha precisa ter pelo menos 6 caracteres.", "erro");
        return;
    }

    if (senha !== confirmarSenha) {
        exibirMensagem("As senhas não conferem.", "erro");
        return;
    }

    if (!aceitouTermos) {
        exibirMensagem("Confirme o uso dos dados para continuar.", "erro");
        return;
    }

    const usuarios = carregarUsuarios();
    const emailJaCadastrado = usuarios.some((usuario) => usuario.email === email);

    if (emailJaCadastrado) {
        exibirMensagem("Este e-mail já está cadastrado. Tente entrar pela tela de login.", "erro");
        return;
    }

    const novoUsuario = {
        id: `user_${Date.now()}`,
        nome,
        curso,
        cidade,
        telefone,
        email,
        senha,
        criadoEm: new Date().toISOString()
    };

    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);

    const usuarioAtual = {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        curso: novoUsuario.curso,
        cidade: novoUsuario.cidade,
        telefone: novoUsuario.telefone,
        email: novoUsuario.email
    };

    localStorage.setItem(CHAVE_USUARIO_ATUAL, JSON.stringify(usuarioAtual));

    exibirMensagem("Cadastro criado com sucesso. Redirecionando...", "sucesso");
    formularioCadastro.reset();

    setTimeout(() => {
        window.location.href = destinoAposCadastro;
    }, 1000);
});
