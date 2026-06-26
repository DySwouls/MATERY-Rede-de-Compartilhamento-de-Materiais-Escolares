const materiaisBase = [
    {
        id: "livro-matematica-9",
        titulo: "Livro de Matemática 9º ano",
        categoria: "Livros",
        estado: "Bom",
        cidade: "Goiânia",
        bairro: "Setor Bueno",
        doador: "Mariana",
        data: "2026-06-18",
        descricao: "Livro com exercícios resolvidos e pequenos sinais de uso nas bordas."
    },
    {
        id: "apostila-enem",
        titulo: "Apostila preparatória ENEM",
        categoria: "Apostilas",
        estado: "Ótimo",
        cidade: "Aparecida de Goiânia",
        bairro: "Jardim Luz",
        doador: "Rafael",
        data: "2026-06-20",
        descricao: "Conteúdo de ciências humanas, matemática e redação em ótimo estado."
    },
    {
        id: "mochila-azul",
        titulo: "Mochila escolar azul",
        categoria: "Materiais gerais",
        estado: "Usado",
        cidade: "Goiânia",
        bairro: "Campinas",
        doador: "Letícia",
        data: "2026-06-12",
        descricao: "Mochila resistente, com dois compartimentos e zíper funcionando."
    },
    {
        id: "cadernos-universitarios",
        titulo: "Kit de cadernos universitários",
        categoria: "Cadernos",
        estado: "Novo",
        cidade: "Trindade",
        bairro: "Centro",
        doador: "Gustavo",
        data: "2026-06-22",
        descricao: "Três cadernos sem uso, com 10 matérias cada."
    },
    {
        id: "livro-portugues",
        titulo: "Gramática de Língua Portuguesa",
        categoria: "Livros",
        estado: "Ótimo",
        cidade: "Goiânia",
        bairro: "Jardim América",
        doador: "Ana",
        data: "2026-06-15",
        descricao: "Livro indicado para ensino médio, sem páginas rasgadas."
    },
    {
        id: "estojo-canetas",
        titulo: "Estojo com canetas e lápis",
        categoria: "Materiais gerais",
        estado: "Bom",
        cidade: "Senador Canedo",
        bairro: "Vila Galvão",
        doador: "Carlos",
        data: "2026-06-10",
        descricao: "Estojo simples com canetas azuis, lápis, borracha e apontador."
    }
];

const chavesLocalStorage = [
    "materiais",
    "materiaisMatery",
    "materiaisDoacao",
    "doacoes",
    "doacoesMatery"
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
                        categoria: item.categoria || item.tipo || "Materiais gerais",
                        estado: item.estado || item.conservacao || "Bom",
                        cidade: item.cidade || "Cidade não informada",
                        bairro: item.bairro || item.local || "Local a combinar",
                        doador: item.doador || item.nomeDoador || item.responsavel || "Doador MATERY",
                        data: item.data || item.criadoEm || new Date().toISOString().slice(0, 10),
                        descricao: item.descricao || item.observacao || "Material cadastrado pela comunidade."
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
            <button class="botao-secundario-geral" type="button" data-interesse="${escaparHtml(material.id)}">Tenho interesse</button>
            <a class="botao-primario-geral" href="doar.html">Doar também</a>
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
    elementos.modalConteudo.innerHTML = `
        <div class="detalhe-material">
            <p><strong>Material:</strong> ${escaparHtml(material.titulo)}</p>
            <p><strong>Doador:</strong> ${escaparHtml(material.doador)}</p>
            <p><strong>Retirada:</strong> ${escaparHtml(material.bairro)} - ${escaparHtml(material.cidade)}</p>
            <p><strong>Conservação:</strong> ${escaparHtml(material.estado)}</p>
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

configurarFiltros();
atualizarIndicadores();
renderizarMateriais();
