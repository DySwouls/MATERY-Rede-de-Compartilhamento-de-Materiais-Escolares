document.addEventListener("DOMContentLoaded", () => {
    const inputBusca = document.getElementById("input-busca");
    const btnAbrirFiltros = document.getElementById("btn-abrir-filtros");
    const abaFiltros = document.getElementById("aba-filtros");
    const btnSalvarFiltros = document.getElementById("btn-salvar-filtros");
    
    const itensMaterial = document.querySelectorAll(".card-material");

    // Abre e fecha a aba suspensa
    btnAbrirFiltros.addEventListener("click", (e) => {
        e.stopPropagation();
        abaFiltros.classList.toggle("hidden");
    });

    // Fecha a aba ao clicar fora
    document.addEventListener("click", (e) => {
        if (!abaFiltros.contains(e.target) && e.target !== btnAbrirFiltros) {
            abaFiltros.classList.add("hidden");
        }
    });

    function obtenerValoresMarcados(classeCheckbox) {
        return Array.from(document.querySelectorAll(`${classeCheckbox}:checked`))
                    .map(cb => cb.value);
    }

    // Função de filtragem cruzada inteligente
    function filtrarCatalogo() {
        const termoBusca = inputBusca.value.toLowerCase().trim();
        
        const categoriasMarcadas = obtenerValoresMarcados(".filtro-categoria");
        const conservacoesMarcadas = obtenerValoresMarcados(".filtro-conservacao");

        itensMaterial.forEach(item => {
            const textoItem = item.textContent.toLowerCase();
            
            // Pega as propriedades exatas guardadas nas tags do card
            const categoriaItem = item.getAttribute("data-categoria");
            const conservacaoItem = item.getAttribute("data-conservacao");

            // 1. Filtro da barra de texto
            const bateBusca = textoItem.includes(termoBusca);

            // 2. Filtro das Categorias/Disciplinas unificadas
            const bateCategoria = categoriasMarcadas.length === 0 || categoriasMarcadas.includes(categoriaItem);

            // 3. Filtro de Estado de Conservação
            const bateConservacao = conservacoesMarcadas.length === 0 || conservacoesMarcadas.includes(conservacaoItem);

            // Exibe se passar em todas as condições
            if (bateBusca && bateCategoria && bateConservacao) {
                item.style.display = "block"; 
            } else {
                item.style.display = "none";
            }
        });
    }

    // Escuta a barra de busca em tempo real
    inputBusca.addEventListener("input", filtrarCatalogo);

    // Aplica os checkboxes apenas ao clicar em Salvar
    btnSalvarFiltros.addEventListener("click", () => {
        filtrarCatalogo();
        abaFiltros.classList.add("hidden");
    });
});