const materiaisBase = [
    {
        id: "livro-matematica-9",
        titulo: "Livro de Matemática 9º ano",
        categoria: "Livros",
        estado: "Bom",
        cidade: "Goiânia",
        bairro: "Setor Bueno",
        doador: "Mariana",
        telefone: "+55 62 98123-4567",
        data: "2026-06-18",
        descricao: "Livro com exercícios resolvidos e pequenos sinais de uso nas bordas.",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvzxQrOtYlPoR7X1ZK7-SIX5DdxrdrUvWzql0TOPKrbw&s=10"
    },
    {
        id: "apostila-enem",
        titulo: "Apostila preparatória ENEM",
        categoria: "Apostilas",
        estado: "Ótimo",
        cidade: "Aparecida de Goiânia",
        bairro: "Jardim Luz",
        doador: "Rafael",
        telefone: "+55 62 99222-3344",
        data: "2026-06-20",
        descricao: "Conteúdo de ciências humanas, matemática e redação em ótimo estado.",
        foto: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80"
    },
    {
        id: "mochila-azul",
        titulo: "Mochila escolar azul",
        categoria: "Materiais gerais",
        estado: "Usado",
        cidade: "Goiânia",
        bairro: "Campinas",
        doador: "Letícia",
        telefone: "+55 62 98888-7766",
        data: "2026-06-12",
        descricao: "Mochila resistente, com dois compartimentos e zíper funcionando.",
        foto: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
    },
    {
        id: "cadernos-universitarios",
        titulo: "Kit de cadernos universitários",
        categoria: "Cadernos",
        estado: "Novo",
        cidade: "Trindade",
        bairro: "Centro",
        doador: "Gustavo",
        telefone: "+55 62 99777-6655",
        data: "2026-06-22",
        descricao: "Três cadernos sem uso, com 10 matérias cada.",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxGzp8JBnSHMCYy2X2nSvmVgmEyn0jhU9K0R9qOqnEUA&s=10"
    },
    {
        id: "livro-portugues",
        titulo: "Gramática de Língua Portuguesa",
        categoria: "Livros",
        estado: "Ótimo",
        cidade: "Goiânia",
        bairro: "Jardim América",
        doador: "Ana",
        telefone: "+55 62 99444-5566",
        data: "2026-06-15",
        descricao: "Livro indicado para ensino médio, sem páginas rasgadas.",
        foto: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80"
    },
    {
        id: "estojo-canetas",
        titulo: "Estojo com canetas e lápis",
        categoria: "Materiais gerais",
        estado: "Bom",
        cidade: "Senador Canedo",
        bairro: "Vila Galvão",
        doador: "Carlos",
        telefone: "+55 62 99333-2211",
        data: "2026-06-10",
        descricao: "Estojo simples com canetas azuis, lápis, borracha e apontador.",
        foto: "https://m.media-amazon.com/images/I/71qaEl30vyL._AC_UY1000_.jpg"
    }
];

const chavesLocalStorage = [
    "materiais",
    "materiaisMatery",
    "materiaisDoacao",
    "doacoes",
    "doacoesMatery",
    "matery_items"
];

const elementos = {
    lista: document.querySelector("#listaMateriais"),
    vazio: document.querySelector("#estadoVazio"),
    busca: document.querySelector("#buscaMaterial"),
    categoria: document.querySelector("#filtroCategoria"),
    estado: document.querySelector("#filtroEstado"),
    cidade: document.querySelector("#filtroCidade"),
    ordenacao: document.querySelector("#ordenacao"),
    limpar: document.querySelector("#limparFiltros"),
    textoResultado: document.querySelector("#textoResultado"),
    totalMateriais: document.querySelector("#totalMateriais"),
    totalCategorias: document.querySelector("#totalCategorias"),
    totalCidades: document.querySelector("#totalCidades"),
    modal: document.querySelector("#modalInteresse"),
    modalConteudo: document.querySelector("#modalConteudo")
};

function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function formatarData(data) {
    const dataObj = new Date(`${data}T12:00:00`);

    if (Number.isNaN(dataObj.getTime())) {
        return "Data não informada";
    }

    return dataObj.toLocaleDateString("pt-BR");
}

function escaparHtml(valor) {
    return String(valor || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function carregarMateriaisSalvos() {
    const materiaisSalvos = [];

    chavesLocalStorage.forEach((chave) => {
        try {
            const dados = JSON.parse(localStorage.getItem(chave));

            if (Array.isArray(dados)) {
                dados.forEach((item, indice) => {
                    materiaisSalvos.push({
                        id: item.id || `${chave}-${indice}`,
                        titulo: item.titulo || item.nome || item.material || "Material escolar",
                        categoria: item.categoria || item.tipo || item.disciplina || "Materiais gerais",
                        estado: item.estado || item.conservacao || "Bom",
                        cidade: item.cidade || "Cidade não informada",
                        bairro: item.bairro || item.local || "Local a combinar",
                        doador: item.doador || item.nomeDoador || item.responsavel || "Doador MATERY",
                        data: item.data || item.dataPublicacao || item.criadoEm || new Date().toISOString().slice(0, 10),
                        descricao: item.descricao || item.observacao || "Material cadastrado pela comunidade.",
                        foto: item.foto || ''
                    });
                });
            }
        } catch {
            localStorage.removeItem(chave);
        }
    });

    return materiaisSalvos;
}

const materiais = [...carregarMateriaisSalvos(), ...materiaisBase];

function preencherSelect(select, valores) {
    valores
        .sort((a, b) => a.localeCompare(b, "pt-BR"))
        .forEach((valor) => {
            const option = document.createElement("option");
            option.value = valor;
            option.textContent = valor;
            select.appendChild(option);
        });
}

function atualizarIndicadores() {
    const categorias = new Set(materiais.map((material) => material.categoria));
    const cidades = new Set(materiais.map((material) => material.cidade));

    elementos.totalMateriais.textContent = materiais.length;
    elementos.totalCategorias.textContent = categorias.size;
    elementos.totalCidades.textContent = cidades.size;
}

function configurarFiltros() {
    const categorias = [...new Set(materiais.map((material) => material.categoria))];
    const cidades = [...new Set(materiais.map((material) => material.cidade))];

    preencherSelect(elementos.categoria, categorias);
    preencherSelect(elementos.cidade, cidades);
}

function filtrarMateriais() {
    const busca = normalizarTexto(elementos.busca.value);
    const categoria = elementos.categoria.value;
    const estado = elementos.estado.value;
    const cidade = elementos.cidade.value;

    return materiais.filter((material) => {
        const textoBusca = normalizarTexto([
            material.titulo,
            material.categoria,
            material.estado,
            material.cidade,
            material.bairro,
            material.doador,
            material.descricao
        ].join(" "));

        const combinaBusca = !busca || textoBusca.includes(busca);
        const combinaCategoria = categoria === "todos" || material.categoria === categoria;
        const combinaEstado = estado === "todos" || material.estado === estado;
        const combinaCidade = cidade === "todos" || material.cidade === cidade;

        return combinaBusca && combinaCategoria && combinaEstado && combinaCidade;
    });
}

function ordenarMateriais(lista) {
    const ordenacao = elementos.ordenacao.value;
    const ordenados = [...lista];

    if (ordenacao === "titulo") {
        return ordenados.sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
    }

    if (ordenacao === "categoria") {
        return ordenados.sort((a, b) => a.categoria.localeCompare(b.categoria, "pt-BR"));
    }

    return ordenados.sort((a, b) => new Date(b.data) - new Date(a.data));
}

function criarCard(material) {
    const card = document.createElement("article");
    card.className = "card-material";
    card.innerHTML = `
        ${material.foto ? `
            <div class="card-imagem">
                <img src="${escaparHtml(material.foto)}" alt="Foto de ${escaparHtml(material.titulo)}">
            </div>
        ` : `
            <div class="card-imagem-placeholder">📦</div>
        `}
        <div class="card-cabecalho">
            <span class="card-categoria">${escaparHtml(material.categoria)}</span>
            <span class="card-estado">${escaparHtml(material.estado)}</span>
        </div>
        <h3>${escaparHtml(material.titulo)}</h3>
        <p>${escaparHtml(material.descricao)}</p>
        <div class="card-dados">
            <div><span>Cidade</span><strong>${escaparHtml(material.cidade)}</strong></div>
            <div><span>Bairro</span><strong>${escaparHtml(material.bairro)}</strong></div>
            <div><span>Doador</span><strong>${escaparHtml(material.doador)}</strong></div>
            <div><span>Publicado</span><strong>${formatarData(material.data)}</strong></div>
        </div>
        <div class="card-acoes">
            <button class="botao-primario-geral" type="button" data-interesse="${escaparHtml(material.id)}">Tenho interesse</button>
        </div>
    `;

    return card;
}

function renderizarMateriais() {
    const resultado = ordenarMateriais(filtrarMateriais());

    elementos.lista.innerHTML = "";
    elementos.textoResultado.textContent = `${resultado.length} ${resultado.length === 1 ? "item" : "itens"}`;
    elementos.vazio.hidden = resultado.length > 0;

    resultado.forEach((material) => {
        elementos.lista.appendChild(criarCard(material));
    });
}

function abrirModal(material) {
    // Formata número para wa.me (apenas dígitos, remove sinais)
    const telefoneRaw = material.telefone || '';
    const telefoneDigits = telefoneRaw.replace(/\D+/g, '');

    const mensagemPadrao = `Olá ${material.doador}, tenho interesse no material "${material.titulo}".`;
    const whatsappUrl = telefoneDigits
        ? `https://wa.me/${telefoneDigits}?text=${encodeURIComponent(mensagemPadrao)}`
        : null;

    elementos.modalConteudo.innerHTML = `
        <div class="detalhe-material">
            <p><strong>Material:</strong> ${escaparHtml(material.titulo)}</p>
            <p><strong>Doador:</strong> ${escaparHtml(material.doador)}</p>
            <p><strong>Retirada:</strong> ${escaparHtml(material.bairro)} - ${escaparHtml(material.cidade)}</p>
            <p><strong>Conservação:</strong> ${escaparHtml(material.estado)}</p>
            ${telefoneRaw ? `<p><strong>Telefone:</strong> <a href="tel:${escaparHtml(telefoneRaw)}">${escaparHtml(telefoneRaw)}</a></p>` : ''}
        </div>
        <div class="modal-acoes">
            ${whatsappUrl ? `<a class="botao-whatsapp" href="${whatsappUrl}" target="_blank" rel="noopener">💬 Conversar no WhatsApp</a>` : `<button class="botao-secundario-geral" disabled>Telefone indisponível</button>`}
            <button class="botao-secundario-geral" data-fechar>Voltar</button>
        </div>
    `;

    if (typeof elementos.modal.showModal === "function") {
        elementos.modal.showModal();
    } else {
        alert(`Interesse registrado em: ${material.titulo}`);
    }
}

function limparFiltros() {
    elementos.busca.value = "";
    elementos.categoria.value = "todos";
    elementos.estado.value = "todos";
    elementos.cidade.value = "todos";
    elementos.ordenacao.value = "recentes";
    renderizarMateriais();
}

[elementos.busca, elementos.categoria, elementos.estado, elementos.cidade, elementos.ordenacao]
    .forEach((elemento) => {
        elemento.addEventListener("input", renderizarMateriais);
        elemento.addEventListener("change", renderizarMateriais);
    });

elementos.limpar.addEventListener("click", limparFiltros);

elementos.lista.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-interesse]");

    if (!botao) {
        return;
    }

    const material = materiais.find((item) => item.id === botao.dataset.interesse);

    if (material) {
        abrirModal(material);
    }
});

elementos.modal.addEventListener("close", () => {
    if (elementos.modal.returnValue === "confirmar") {
        alert("Interesse registrado! O próximo passo é combinar a retirada com o doador.");
    }

    elementos.modal.returnValue = "";
});

// Fecha o modal quando o botão com atributo data-fechar for clicado
elementos.modalConteudo.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-fechar]');
    if (!btn) return;

    if (typeof elementos.modal.close === 'function') {
        elementos.modal.close();
    } else {
        elementos.modal.returnValue = '';
    }
});

configurarFiltros();
atualizarIndicadores();
renderizarMateriais();
