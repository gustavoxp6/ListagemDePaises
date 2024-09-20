# ListagemDePaises
Uma página HTML, CSS e JavaScript que consome a API RestCountries para listar e exibir informações sobre países. Esta página será interativa, responsiva e permitirá aos usuários explorar a lista de países, aplicar filtros e ordenações, além de visualizar detalhes específicos de cada país.
REST Countries ExplorerClick to open website
Aqui está uma explicação das principais partes do código:

HTML:

Estrutura básica da página com cabeçalho, área de filtros, lista de países e um modal para detalhes.
Os filtros incluem uma barra de pesquisa, um seletor de região e uma opção de ordenação.


CSS:

Estilização responsiva usando grid para a lista de países.
Estilo para os cartões de país, modal e elementos de filtro.


JavaScript:

fetchCountries(): Função assíncrona para buscar dados da API RestCountries.
displayCountries(): Renderiza a lista de países na página.
showCountryDetails(): Exibe informações detalhadas de um país no modal.
filterCountries(): Aplica filtros e ordenação à lista de países.
Event listeners para interatividade (pesquisa, filtros, ordenação, cliques nos cartões).



Esta aplicação oferece as seguintes funcionalidades:

-Lista todos os países com bandeiras e informações básicas.
-Permite pesquisar países por nome.
-Oferece filtro por região.
-Permite ordenar por nome, população ou área.
-Exibe detalhes adicionais de um país ao clicar no cartão.
