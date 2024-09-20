
        // Pega os elementos da página pelo seu ID
const listView = document.getElementById('list-view'); // Elemento que contém a lista de países
const detailsView = document.getElementById('details-view'); // Elemento que mostra os detalhes de um país
const countryList = document.getElementById('country-list'); // Elemento onde os países serão exibidos
const searchInput = document.getElementById('search'); // Input de pesquisa para buscar países pelo nome
const regionFilter = document.getElementById('region-filter'); // Filtro para selecionar uma região
const subregionFilter = document.getElementById('subregion-filter'); // Filtro para selecionar uma sub-região
const populationFilter = document.getElementById('population-filter'); // Filtro para selecionar uma faixa de população
const sortSelect = document.getElementById('sort'); // Seletor para ordenar os países
const countryDetails = document.getElementById('country-details'); // Área onde são exibidos os detalhes de um país
const loadMoreButton = document.getElementById('load-more'); // Botão para carregar mais países

// Variáveis para armazenar todos os países, os países filtrados e o número de página atual
let allCountries = []; // Lista completa de países
let filteredCountries = []; // Lista filtrada de países, conforme filtros aplicados
let currentPage = 1; // Página atual (para paginação)
const countriesPerPage = 20; // Quantidade de países mostrados por página

// Função assíncrona para buscar os países de uma API
async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all'); // Busca os dados da API
        allCountries = await response.json(); // Converte os dados da API para JSON e armazena em allCountries
        filteredCountries = [...allCountries]; // Inicialmente, todos os países são mostrados (sem filtro)
        populateFilters(); // Preenche os filtros de região e sub-região
        applyFiltersAndSort(); // Aplica filtros e ordenação para exibir os países
    } catch (error) {
        console.error('Erro ao buscar países:', error); // Exibe um erro se a requisição falhar
    }
}

// Função para preencher os filtros de região e sub-região
function populateFilters() {
    const regions = [...new Set(allCountries.map(country => country.region))].sort(); // Obtém todas as regiões únicas
    const subregions = [...new Set(allCountries.map(country => country.subregion).filter(Boolean))].sort(); // Obtém todas as sub-regiões únicas
    
    // Preenche o filtro de regiões com opções
    regions.forEach(region => {
        const option = document.createElement('option'); // Cria um novo elemento de opção
        option.value = region; // Define o valor da opção como o nome da região
        option.textContent = region; // Define o texto da opção como o nome da região
        regionFilter.appendChild(option); // Adiciona a opção no seletor de região
    });

    // Preenche o filtro de sub-regiões com opções
    subregions.forEach(subregion => {
        const option = document.createElement('option'); // Cria uma nova opção
        option.value = subregion; // Define o valor da opção
        option.textContent = subregion; // Define o texto exibido
        subregionFilter.appendChild(option); // Adiciona a opção no seletor de sub-regiões
    });
}

// Função para exibir os países filtrados e ordenados
function displayCountries(countries, replace = true) {
    if (replace) {
        countryList.innerHTML = ''; // Limpa a lista de países se for para substituir
    }
    
    // Para cada país na lista, cria um card e exibe na página
    countries.forEach(country => {
        const card = document.createElement('div'); // Cria um novo div para o card do país
        card.classList.add('country-card'); // Adiciona a classe 'country-card' ao div
        
        // Adiciona a imagem da bandeira, o nome e a capital do país dentro do card
        card.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name.common} flag"> 
            <h3>${country.name.common}</h3>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Região:</strong> ${country.region}</p>
        `;
        
        // Adiciona um evento de clique que exibe os detalhes do país ao clicar no card
        card.addEventListener('click', () => showCountryDetails(country));
        countryList.appendChild(card); // Adiciona o card na lista de países
    });
}

// Função que exibe os detalhes de um país específico
function showCountryDetails(country) {
    // Adiciona os detalhes do país (bandeira, nome, capital, população, área, etc.)
    countryDetails.innerHTML = `
        <img src="${country.flags.png}" alt="${country.name.common} flag">
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>População:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Área:</strong> ${country.area ? country.area.toLocaleString() + ' km²' : 'N/A'}</p>
        <p><strong>Região:</strong> ${country.region}</p>
        <p><strong>Sub-região:</strong> ${country.subregion || 'N/A'}</p>
        <p><strong>Idiomas:</strong> ${Object.values(country.languages || {}).join(', ') || 'N/A'}</p>
        <p><strong>Moedas:</strong> ${Object.values(country.currencies || {}).map(c => c.name).join(', ') || 'N/A'}</p>
    `;
    listView.classList.add('hidden'); // Esconde a lista de países
    detailsView.classList.remove('hidden'); // Mostra a visão de detalhes do país
}

// Função para voltar à visão da lista de países
function showListView() {
    detailsView.classList.add('hidden'); // Esconde a visão de detalhes
    listView.classList.remove('hidden'); // Mostra a lista de países
}

// Função que aplica filtros e ordenação à lista de países
function applyFiltersAndSort() {
    const searchTerm = searchInput.value.toLowerCase(); // Pega o termo de pesquisa em letras minúsculas
    const regionValue = regionFilter.value; // Pega a região selecionada
    const subregionValue = subregionFilter.value; // Pega a sub-região selecionada
    const populationValue = populationFilter.value; // Pega a faixa de população selecionada
    const sortValue = sortSelect.value; // Pega o critério de ordenação selecionado

    // Verifica se o termo pesquisado tem um sinônimo (ex: 'brasil' -> 'brazil'), fiz isso porquê não gosto de escrever brasil com "z".
    const aliases = { 'brasil': 'brazil' };
    const searchAlias = aliases[searchTerm] || searchTerm; // Usa o sinônimo, se existir
    
    // Filtra os países com base na pesquisa, região, sub-região e população
    filteredCountries = allCountries.filter(country => {               
        const countryName = country.name.common.toLowerCase();
        const matchesSearch = countryName.includes(searchAlias);
        const matchesRegion = regionValue === '' || country.region === regionValue;
        const matchesSubregion = subregionValue === '' || country.subregion === subregionValue;
        const matchesPopulation = populationValue === '' || checkPopulationRange(country.population, populationValue);
        return matchesSearch && matchesRegion && matchesSubregion && matchesPopulation;
    });

    // Ordena os países de acordo com o critério escolhido
    if (sortValue) {
        filteredCountries.sort((a, b) => {
            if (sortValue === 'name') {
                return a.name.common.localeCompare(b.name.common); // Ordena alfabeticamente
            } else if (sortValue === 'population') {
                return b.population - a.population; // Ordena por população (maior para menor)
            } else if (sortValue === 'area') {
                return (b.area || 0) - (a.area || 0); // Ordena por área
            }
        });
    }

    currentPage = 1; // Reseta a página atual para 1
    displayCountries(filteredCountries.slice(0, countriesPerPage)); // Exibe os primeiros países
    updateLoadMoreButton(); // Atualiza o botão de "Carregar Mais"
}

// Verifica se a população do país está dentro da faixa de população selecionada
function checkPopulationRange(population, range) {
    const [min, max] = range.split('-').map(Number); // Divide o intervalo (min-max)
    return population >= min && (max ? population < max : true); // Verifica se está no intervalo
}

// Função para carregar mais países quando o usuário clica no botão "Carregar Mais"
function loadMoreCountries() {
    const nextPage = currentPage + 1; // Aumenta a página em 1
    const start = (nextPage - 1) * countriesPerPage; // Calcula o índice inicial
    const end = start + countriesPerPage; // Calcula o índice final
    const moreCountries = filteredCountries.slice(start, end); // Pega os próximos países
    
    if (moreCountries.length > 0) {
        displayCountries(moreCountries, false); // Adiciona mais países à lista atual
        currentPage = nextPage; // Atualiza a página atual
        updateLoadMoreButton(); // Atualiza o botão "Carregar Mais"
    }
}

// Função para atualizar a visibilidade do botão "Carregar Mais"
function updateLoadMoreButton() {
    const remainingCountries = filteredCountries.length - (currentPage * countriesPerPage);
    loadMoreButton.style.display = remainingCountries > 0 ? 'block' : 'none'; // Mostra ou esconde o botão
}

// Adiciona eventos de escuta para aplicar filtros e ordenação ao mudar os inputs
searchInput.addEventListener('input', applyFiltersAndSort);
regionFilter.addEventListener('change', applyFiltersAndSort);
subregionFilter.addEventListener('change', applyFiltersAndSort);
populationFilter.addEventListener('change', applyFiltersAndSort);
sortSelect.addEventListener('change', applyFiltersAndSort);
loadMoreButton.addEventListener('click', loadMoreCountries); // Evento para carregar mais países

// Chama a função de buscar países ao carregar a página
fetchCountries();
 