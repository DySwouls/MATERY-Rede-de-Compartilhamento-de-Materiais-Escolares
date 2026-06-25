const listaMateriais = document.getElementById("lista-materiais");

function criarInformacaoCard(rotulo, valor) {
  const paragrafo = document.createElement("p");
  const titulo = document.createElement("strong");

  titulo.textContent = `${rotulo}: `;
  paragrafo.append(titulo, document.createTextNode(valor || "Não informado"));

  return paragrafo;
}

function renderizarMateriais(materiais) {
  listaMateriais.replaceChildren();

  if (materiais.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.classList.add("mensagem-catalogo-vazio");
    mensagem.textContent =
      "Ainda não há materiais cadastrados. Volte em breve para conferir novas doações!";
    listaMateriais.appendChild(mensagem);
    return;
  }

  materiais.forEach(function (material) {
    const card = document.createElement("article");
    card.classList.add("card-material");

    const imagem = document.createElement("img");
    imagem.classList.add("card-material__imagem");
    const caminhoImagem =
      material.imagem ||
      material.foto ||
      material.image;

    imagem.src = caminhoImagem || "img-matery/logo.png";

    if (!caminhoImagem) {
      imagem.classList.add("card-material__imagem--padrao");
    }

    imagem.alt = material.nome
      ? `Imagem do material ${material.nome}`
      : "Imagem do material";
    imagem.loading = "lazy";
    imagem.addEventListener("error", function () {
      imagem.src = "img-matery/logo.png";
      imagem.classList.add("card-material__imagem--padrao");
    }, { once: true });

    const conteudo = document.createElement("div");
    conteudo.classList.add("card-material__conteudo");

    const nome = document.createElement("h2");
    nome.classList.add("card-material__nome");
    nome.textContent = material.nome || "Material sem nome";

    const categoria =
      material.categoria || material.disciplina || "Não informado";
    const conservacao =
      material.estadoConservacao ||
      material.estado_conservacao ||
      material.conservacao ||
      material.estado ||
      "Não informado";

    const botaoDetalhes = document.createElement("button");
    botaoDetalhes.classList.add(
      "botao-secundario-geral",
      "card-material__botao-detalhes"
    );
    botaoDetalhes.type = "button";
    botaoDetalhes.textContent = "Ver Detalhes";

    conteudo.append(
      nome,
      criarInformacaoCard("Categoria ou disciplina", categoria),
      criarInformacaoCard("Estado de conservação", conservacao),
      botaoDetalhes
    );

    card.append(imagem, conteudo);
    listaMateriais.appendChild(card);
  });
}

function carregarMateriais() {
  let materiais = [];

  try {
    const materiaisSalvos = JSON.parse(
      localStorage.getItem("matery_items") || "[]"
    );

    if (Array.isArray(materiaisSalvos)) {
      materiaisSalvos.forEach(function (material) {
        if (material && typeof material === "object") {
          materiais.push(material);
        }
      });
    }
  } catch (erro) {
    console.error("Não foi possível carregar os materiais cadastrados.", erro);
  }

  renderizarMateriais(materiais);
}

document.addEventListener("DOMContentLoaded", carregarMateriais);
window.addEventListener("pageshow", carregarMateriais);
window.addEventListener("storage", function (evento) {
  if (evento.key === "matery_items") {
    carregarMateriais();
  }
});
window.addEventListener("focus", carregarMateriais);
