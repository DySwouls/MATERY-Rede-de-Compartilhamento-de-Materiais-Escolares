/**
 * doar.js — Lógica da Tela 3: Formulário de Doação de Materiais
 *
 * Responsabilidades:
 *  1. (Futuro) Guarda de rota: verificar matery_currentUser no LocalStorage.
 *  2. Capturar o submit do formulário e construir o objeto de item.
 *  3. Salvar o item no array "matery_items" do LocalStorage.
 *  4. Renderizar a lista de itens já publicados (todos os cadastrados).
 *  5. Permitir remover um item da lista.
 *  6. Tratar o upload de foto com a FileReader API (base64 reduzido).
 */

/* ============================================================
   CONFIGURAÇÕES
   ============================================================ */
const CHAVE_ITEMS = 'matery_items';       // Chave no LocalStorage para materiais
const CHAVE_USUARIO = 'matery_currentUser'; // Chave do usuário logado (futuro uso)

/* ============================================================
   GUARDA DE ROTA (comentado — liberado conforme solicitado)
   Descomente o bloco abaixo quando a autenticação estiver pronta.
   ============================================================ */
(function verificarAutenticacao() {
    const usuarioLogado = localStorage.getItem(CHAVE_USUARIO);
    if (!usuarioLogado) {
        window.location.replace('login.html?redirect=doar.html');
    }
})();

/* ============================================================
   UTILITÁRIOS DE LOCALSTORAGE
   ============================================================ */

/**
 * Retorna o array de itens do LocalStorage.
 * Se não existir ainda, retorna um array vazio.
 * @returns {Array} Lista de objetos de materiais.
 */
function carregarItems() {
    const dados = localStorage.getItem(CHAVE_ITEMS);
    return dados ? JSON.parse(dados) : [];
}

/**
 * Salva o array de itens no LocalStorage.
 * @param {Array} listaItems - Array de objetos de materiais.
 */
function salvarItems(listaItems) {
    localStorage.setItem(CHAVE_ITEMS, JSON.stringify(listaItems));
}

/**
 * Gera um ID único simples para cada item.
 * @returns {string} ID baseado em timestamp + número aleatório.
 */
function gerarId() {
    return `item_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

/* ============================================================
   COMPRESSÃO DE IMAGEM (FileReader API)
   Reduz a imagem para 400×400 antes de salvar em base64,
   evitando estouro do LocalStorage.
   ============================================================ */

/**
 * Lê e comprime um arquivo de imagem, retornando uma Promise
 * que resolve com a string base64 comprimida.
 * @param {File} arquivo - Arquivo de imagem selecionado pelo usuário.
 * @param {number} [maxLado=400] - Tamanho máximo de lado em pixels.
 * @returns {Promise<string>} Data URL da imagem comprimida.
 */
function comprimirImagem(arquivo, maxLado = 400) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (evento) {
            const img = new Image();
            img.onload = function () {
                // Calcula as novas dimensões mantendo a proporção
                let largura = img.width;
                let altura  = img.height;

                if (largura > maxLado || altura > maxLado) {
                    if (largura > altura) {
                        altura  = Math.round((altura  * maxLado) / largura);
                        largura = maxLado;
                    } else {
                        largura = Math.round((largura * maxLado) / altura);
                        altura  = maxLado;
                    }
                }

                const canvas  = document.createElement('canvas');
                canvas.width  = largura;
                canvas.height = altura;
                const ctx     = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, largura, altura);

                resolve(canvas.toDataURL('image/jpeg', 0.75)); // Qualidade 75%
            };
            img.onerror = reject;
            img.src = evento.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(arquivo);
    });
}

/* ============================================================
   PRÉVIA DA IMAGEM NO FORMULÁRIO
   ============================================================ */
let imagemBase64 = ''; // Guarda a imagem selecionada em memória

const inputFoto       = document.getElementById('input-foto');
const previaContainer = document.getElementById('previa-foto');
const previaImg       = document.getElementById('previa-img');
const previaArquivo   = document.getElementById('previa-nome-arquivo');

inputFoto.addEventListener('change', async function () {
    const arquivo = this.files[0];
    if (!arquivo) return;

    // Validação básica de tipo
    if (!arquivo.type.startsWith('image/')) {
        exibirMensagem('Por favor, selecione um arquivo de imagem válido.', 'erro');
        return;
    }

    try {
        imagemBase64 = await comprimirImagem(arquivo);
        previaImg.src          = imagemBase64;
        previaArquivo.textContent = arquivo.name;
        previaContainer.style.display = 'block';
    } catch (erro) {
        console.error('Erro ao processar imagem:', erro);
        exibirMensagem('Não foi possível carregar a imagem. Tente novamente.', 'erro');
    }
});

/* ============================================================
   RENDERIZAÇÃO DA LISTA DE ITENS PUBLICADOS
   ============================================================ */

const listaEl = document.getElementById('lista-itens-publicados');

/**
 * Gera o badge HTML de estado de conservação.
 * @param {string} estado - "Novo", "Seminovo" ou "Usado".
 * @returns {string} HTML do badge.
 */
function gerarBadgeConservacao(estado) {
    const classes = {
        'Novo':     'badge-novo',
        'Seminovo': 'badge-seminovo',
        'Usado':    'badge-usado',
    };
    const cls = classes[estado] || '';
    return `<span class="badge-conservacao ${cls}">${estado}</span>`;
}

/**
 * Renderiza todos os itens salvos no LocalStorage na lista da página.
 */
function renderizarListaItems() {
    const items = carregarItems();
    listaEl.innerHTML = ''; // Limpa a lista antes de redesenhar

    if (items.length === 0) {
        listaEl.innerHTML = '<p class="aviso-lista-vazia">Nenhum material publicado ainda. Seja o primeiro! 📦</p>';
        return;
    }

    // Exibe os itens mais recentes primeiro
    const itemsOrdenados = [...items].reverse();

    itemsOrdenados.forEach(function (item) {
        const card = document.createElement('div');
        card.classList.add('card-item-publicado');
        card.dataset.id = item.id;

        // Thumbnail ou placeholder com emoji
        const thumbHTML = item.foto
            ? `<img class="thumb-item" src="${item.foto}" alt="Foto de ${item.nome}">`
            : `<div class="thumb-placeholder">📚</div>`;

        card.innerHTML = `
            ${thumbHTML}
            <div class="info-item-publicado">
                <div class="titulo-item">${item.nome}</div>
                <div class="meta-item">${item.disciplina}</div>
                ${gerarBadgeConservacao(item.conservacao)}
            </div>
            <button
                class="botao-remover-item"
                data-id="${item.id}"
                title="Remover este item"
                aria-label="Remover o material ${item.nome}">
                🗑️ Remover
            </button>
        `;

        listaEl.appendChild(card);
    });

    // Adiciona os listeners de remoção após criar os cards
    listaEl.querySelectorAll('.botao-remover-item').forEach(function (botao) {
        botao.addEventListener('click', function () {
            removerItem(this.dataset.id);
        });
    });
}

/* ============================================================
   REMOÇÃO DE ITEM
   ============================================================ */

/**
 * Remove um item do LocalStorage pelo seu ID e atualiza a lista.
 * @param {string} id - ID do item a ser removido.
 */
function removerItem(id) {
    const confirmar = window.confirm('Tem certeza que deseja remover este material?');
    if (!confirmar) return;

    let items = carregarItems();
    items = items.filter(function (item) { return item.id !== id; });
    salvarItems(items);

    renderizarListaItems();
    exibirMensagem('Material removido com sucesso!', 'sucesso');
}

/* ============================================================
   FEEDBACK VISUAL (mensagem de sucesso/erro)
   ============================================================ */

const mensagemEl = document.getElementById('mensagem-feedback');
let timeoutMensagem;

/**
 * Exibe uma mensagem de feedback abaixo do formulário.
 * @param {string} texto - Conteúdo da mensagem.
 * @param {'sucesso'|'erro'} tipo - Tipo visual da mensagem.
 */
function exibirMensagem(texto, tipo) {
    clearTimeout(timeoutMensagem);

    mensagemEl.textContent = texto;
    mensagemEl.className   = `mensagem-feedback ${tipo}`;
    mensagemEl.style.display = 'block';

    // Some automaticamente após 4 segundos
    timeoutMensagem = setTimeout(function () {
        mensagemEl.style.display = 'none';
    }, 4000);
}

/* ============================================================
   SUBMISSÃO DO FORMULÁRIO
   ============================================================ */

const formulario = document.getElementById('formulario-doacao');

formulario.addEventListener('submit', async function (evento) {
    evento.preventDefault(); // Impede o recarregamento da página

    // Coleta os valores dos campos
    const nome        = document.getElementById('campo-nome').value.trim();
    const descricao   = document.getElementById('campo-descricao').value.trim();
    const disciplina  = document.getElementById('campo-disciplina').value;
    const cidade      = document.getElementById('campo-cidade').value;
    const conservacao = document.querySelector('input[name="conservacao"]:checked');

    // Validações
    if (!nome) {
        exibirMensagem('Por favor, informe o nome do material.', 'erro');
        document.getElementById('campo-nome').focus();
        return;
    }

    if (!disciplina) {
        exibirMensagem('Por favor, selecione uma disciplina/categoria.', 'erro');
        document.getElementById('campo-disciplina').focus();
        return;
    }

    if (!cidade) {
        exibirMensagem('Por favor, selecione a cidade.', 'erro');
        document.getElementById('campo-cidade').focus();
        return;
    }

    if (!conservacao) {
        exibirMensagem('Por favor, selecione o estado de conservação.', 'erro');
        return;
    }

    // Monta o objeto do item de doação
    const novoItem = {
        id:             gerarId(),
        nome:           nome,
        descricao:      descricao,
        disciplina:     disciplina,
        conservacao:    conservacao.value,
        cidade:         cidade,
        foto:           imagemBase64 || '',
        dataPublicacao: new Date().toISOString().slice(0, 10),
    };

    // Salva no LocalStorage
    const items = carregarItems();
    items.push(novoItem);
    salvarItems(items);

    // Feedback e limpeza
    exibirMensagem(`✅ Material "${nome}" publicado com sucesso no catálogo!`, 'sucesso');
    formulario.reset();
    imagemBase64 = '';
    previaContainer.style.display = 'none';

    // Atualiza a lista de itens publicados
    renderizarListaItems();
});

/* ============================================================
   INICIALIZAÇÃO DA PÁGINA
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    renderizarListaItems();
});
