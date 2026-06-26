/**
 * nav.js — Gerenciamento de autenticação no menu de navegação
 *
 * Responsabilidades:
 *  1. Verificar se o usuário está logado via matery_currentUser no localStorage.
 *  2. Se logado, exibir botão "Sair" no nav com o nome do usuário.
 *  3. Ao clicar em "Sair", remover a sessão e redirecionar para index.html.
 */

const CHAVE_USUARIO_NAV = 'matery_currentUser';

(function iniciarNav() {
    const nav = document.querySelector('.menu-topo nav');
    if (!nav) return;

    let usuarioAtual = null;

    try {
        usuarioAtual = JSON.parse(localStorage.getItem(CHAVE_USUARIO_NAV));
    } catch {
        localStorage.removeItem(CHAVE_USUARIO_NAV);
    }

    if (!usuarioAtual) return;

    // Cria o separador visual
    const separador = document.createElement('span');
    separador.className = 'nav-separador';
    separador.setAttribute('aria-hidden', 'true');

    // Cria a saudação com o nome do usuário
    const saudacao = document.createElement('span');
    saudacao.className = 'nav-usuario';
    saudacao.textContent = `Olá, ${usuarioAtual.nome.split(' ')[0]}`;

    // Cria o botão de sair
    const botaoSair = document.createElement('button');
    botaoSair.className = 'nav-botao-sair';
    botaoSair.id = 'botaoSair';
    botaoSair.type = 'button';
    botaoSair.textContent = 'Sair';
    botaoSair.setAttribute('aria-label', 'Encerrar sessão');

    botaoSair.addEventListener('click', () => {
        localStorage.removeItem(CHAVE_USUARIO_NAV);
        window.location.href = 'index.html';
    });

    nav.appendChild(separador);
    nav.appendChild(saudacao);
    nav.appendChild(botaoSair);
})();
