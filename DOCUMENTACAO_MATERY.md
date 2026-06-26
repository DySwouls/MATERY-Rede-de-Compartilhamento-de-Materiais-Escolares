# MATERY - Sistema de Compartilhamento de Materiais Escolares
**Documentação Arquitetural e Diretrizes para Desenvolvimento Agêntico**

Esta documentação serve como fonte de verdade para os parâmetros do sistema MATERY, estruturada de forma clara para guiar o desenvolvimento por IA (Agentes) e orientar a consulta de escopo.

---

## 1. Arquitetura e Fluxo de Autenticação
O sistema possui 6 telas principais. O acesso a certas rotas é protegido e dependente do estado de autenticação do usuário.

**Regras de Roteamento:**
- **Rotas Públicas (Acesso Livre):** Tela 1 (Início), Tela 2 (Login/Cadastro), Tela 6 (Fale Conosco/Suporte).
- **Rotas Protegidas (Requer Autenticação):** Tela 3 (Formulário de Doação), Tela 4 (Catálogo), Tela 5 (Detalhes do Material).
- **Comportamento de Redirecionamento:** Qualquer tentativa de acesso a uma rota protegida sem estar autenticado deve forçar um redirecionamento imediato para a Tela 2 (Login/Cadastro).

---

## 2. Escopo das Telas (Views)

### Tela 1: Início + Sobre o Projeto (Home)
- **Objetivo:** Boas-vindas, apresentação institucional e conscientização.
- **Contexto de Negócio:** Foco na problemática local e no alinhamento com a ODS 17 da ONU.
- **Elementos de UI:**
  - Landing page explicativa (texto profundo sobre o impacto da iniciativa).
  - Call to Action (CTA) ao final com 2 botões grandes: "Quero Doar" e "Olhar Catálogo".
  - *Comportamento do CTA:* Se o usuário não estiver logado, ambos os botões o redirecionarão à Tela 2.
- **Responsável:** Integrante 1.

### Tela 2: Autenticação (Login / Cadastro)
- **Objetivo:** Porta de entrada segura e controle de identidade do usuário.
- **Elementos de UI:**
  - Layout dividido ou em abas para alternar facilmente entre Login e Cadastro.
  - *Formulário de Login:* E-mail, Senha.
  - *Formulário de Cadastro:* Nome, Curso, E-mail, Senha, WhatsApp.
- **Lógica de Dados:** Validação de inputs e persistência da sessão do usuário utilizando o **LocalStorage**.
- **Responsável:** Integrante 1.

### Tela 3: Formulário de Doação (Novo Material)
- **Objetivo:** Interface dedicada e limpa para publicação de itens a serem doados.
- **Elementos de UI:**
  - Formulário focado contendo:
    - Nome do material
    - Descrição
    - Disciplina / Categoria
    - Estado de conservação (Novo, Seminovo, Usado)
    - Campo para upload/carregamento de foto
  - Botão primário: "Publicar Material".
- **Lógica de Dados:** Construção do objeto de doação e salvamento da entidade (material) no **LocalStorage**.
- **Responsável:** Integrante 2.

### Tela 4: Catálogo de Materiais (Listagem)
- **Objetivo:** Navegação e busca fluida de materiais disponíveis no sistema.
- **Elementos de UI:**
  - *Header/Topo:* Barra de pesquisa inteligente acoplada a filtros rápidos por Categoria (ex: Livros, Cadernos, Calculadoras) ou Disciplina.
  - *Corpo:* Grid ou Lista de cards visuais.
  - *Card Base:* Foto do material, Título, botão "Ver Detalhes".
- **Lógica de Dados:**
  - **Integrante 3:** Responsável pela renderização (UI/Layout) dos cards e exibição visual.
  - **Integrante 4:** Responsável EXCLUSIVAMENTE pela lógica algorítmica da barra de busca e dos filtros (ocultar/mostrar os cards de acordo com o critério).

### Tela 5: Detalhes do Material e Contato
- **Objetivo:** Visualização aprofundada do item e ponte de comunicação direta com o doador.
- **Elementos de UI:**
  - Pode ser implementada como uma página dedicada ou um *Modal Sobreposto* disparado na Tela 4.
  - Foto expandida, detalhes completos do estado do item.
  - Perfil do doador (nome, curso, etc).
  - Botão de ação (Link direto para WhatsApp): "Olá, vi seu material no MATERY e tenho interesse...".
- **Responsável:** Integrante 4.

### Tela 6: Fale Conosco / Suporte
- **Objetivo:** Canal simples de contato com a equipe (reportar bugs, dúvidas simples).
- **Elementos de UI:** Interface básica com links para redes sociais ou e-mail de suporte.
- **Responsável:** Integrante 4.

---

## 3. Requisitos Funcionais (RFs)
- **RF01:** O sistema deve permitir o cadastro de materiais para doação.
- **RF02:** O sistema deve exibir uma lista com todos os materiais disponíveis.
- **RF03:** O sistema deve permitir a pesquisa de materiais por nome ou categoria.
- **RF04:** O sistema deve apresentar informações detalhadas sobre cada material.
- **RF05:** O sistema deve permitir que o usuário demonstre interesse em um material (via redirecionamento ao WhatsApp).
- **RF06:** O sistema deve permitir a remoção de materiais já doados (o usuário que doou precisa poder remover o item).
- **RF07:** O sistema deve apresentar informações de contato do doador na tela de detalhes.
- **RF08:** O sistema deve exibir informações sobre a ODS 17 e os objetivos do projeto na Home.

---

## 4. Requisitos Não Funcionais (RNFs)
- **RNF01 [Usabilidade]:** O sistema deve possuir interface simples e intuitiva.
- **RNF02 [Compatibilidade]:** O sistema deve ser compatível com navegadores modernos.
- **RNF03 [Performance]:** O sistema deve apresentar tempo de carregamento rápido.
- **RNF04 [Responsividade]:** O sistema deve possuir design responsivo, adaptável perfeitamente para computadores e dispositivos móveis (Mobile-First é recomendado).
- **RNF05 [Stack Tecnológica]:** O sistema deve ser construído utilizando puramente **HTML, CSS e JavaScript**.
- **RNF06 [Acessibilidade]:** As informações exibidas devem ser organizadas de forma clara e acessível.

---

## 5. Diretrizes para Agentes de IA (Guia de Implementação Autônoma)
*Parâmetros e instruções explícitas para Agentes interpretarem o escopo corretamente ao gerar ou refatorar código:*

1. **Stack & Persistência (Database Local):** 
   - Como estipulado no `RNF05` e nas especificações das Telas 2 e 3, não há framework backend ou SGBD real. Toda a persistência (Usuários, Sessão Ativa, Materiais) DEVE ser implementada utilizando o `window.localStorage` no formato JSON.
   - *Modelos de Dados Sugeridos:*
     - `matery_users` -> Array de objetos representando usuários.
     - `matery_currentUser` -> Objeto do usuário logado (define a sessão).
     - `matery_items` -> Array de objetos de materiais.

2. **Separação de Preocupações (Single Responsibility):** 
   - Ao criar scripts (ex: `pesquisa.js`, `catalogo.js`), mantenha o código modularizado. 
   - Observe a divisão na Tela 4: a lógica de renderização do DOM (Integrante 3) deve estar desacoplada da função de filtragem do array de dados (Integrante 4).

3. **Guarda de Rotas (Auth Guarding):** 
   - Nas Telas 3, 4 e 5, o primeiro script a rodar na tag `<head>` ou início do arquivo `.js` deve verificar a existência de `matery_currentUser` no LocalStorage.
   - Se retornar falso (null), engatilhar redirecionamento imediato: `window.location.href = "login.html"`.

4. **Design, UI e Estilos (RNF01, RNF04):** 
   - Priorize layout moderno utilizando Flexbox/CSS Grid.
   - Evite bibliotecas externas como Bootstrap ou Tailwind a menos que estipulado o contrário em um prompt. Utilize CSS puro bem estruturado.
   - Cores devem refletir um tom social/educativo, possivelmente inspiradas na paleta da ODS 17 (azul escuro/marinho).

5. **Integração com WhatsApp (Tela 5 / RF05):** 
   - O botão de contato deve ser uma tag `<a>` gerada dinamicamente onde o atributo `href` seja formatado como: `https://wa.me/55<numero_do_doador_apenas_numeros>?text=<mensagem_padrao_url_encoded>`.

6. **Manipulação de Imagens:** 
   - Como imagens base64 puras podem estourar o limite do LocalStorage rapidamente, considere usar a `FileReader API` e reduzir a resolução no lado do cliente, ou para fins didáticos e protótipo, usar links externos provisórios de imagens.
