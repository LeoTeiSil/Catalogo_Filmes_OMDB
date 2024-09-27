document.getElementById('siteTitle').addEventListener('click', function() {
    window.location.reload();
});

document.addEventListener('DOMContentLoaded', (event) => {
    const savedOrder = JSON.parse(localStorage.getItem('filmOrder'));
    if (savedOrder) {
        const filmList = document.getElementById('filmList');
        const films = Array.from(filmList.children);
        films.sort((a, b) => savedOrder.indexOf(a.dataset.id) - savedOrder.indexOf(b.dataset.id));
        films.forEach(film => filmList.appendChild(film));
    }
});

function saveFilmOrder() {
    const filmList = document.getElementById('filmList');
    const order = Array.from(filmList.children).map(film => film.dataset.id);
    localStorage.setItem('filmOrder', JSON.stringify(order));
}

const apikey = '69bc4860&i';
const translateApiUrl = 'https://libretranslate.de/translate';

const frmPesquisa = document.querySelector("form");

frmPesquisa.onsubmit = (ev) => {
    ev.preventDefault();

    const pesquisa = ev.target.pesquisa.value;

    if (pesquisa === "") {
        alert('Preencha o campo!');
        return;
    }

    fetch(`https://www.omdbapi.com/?s=${pesquisa}&apikey=${apikey}`)
        .then(result => result.json())
        .then(json => carregaLista(json))
        .catch(error => console.error('Erro:', error));
}

const carregaLista = (json) => {
    const lista = document.querySelector("div.lista");
    lista.innerHTML = "";

    if (json.Response === "False") {
        lista.innerHTML = `<p>Filme não encontrado.</p>`;
        return;
    }

    json.Search.forEach(element => {
        let item = document.createElement("div");
        item.classList.add("item");

        item.innerHTML = `<img src="${element.Poster}" alt="Poster de ${element.Title}"/><h2>${element.Title}</h2><button class="detalhes" onclick="carregaDetalhes('${element.imdbID}')">Detalhes</button>`;
        lista.appendChild(item);
    });
}

const carregaDetalhes = (id) => {
    fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${apikey}`)
        .then(result => result.json())
        .then(json => {
            document.querySelector("div.lista").style.display = "none";
            const detalhes = document.querySelector("div.detalhes");

            detalhes.querySelector("#Title").innerText = json.Title;
            detalhes.querySelector("#Year").innerText = json.Year;
            detalhes.querySelector("#Poster").src = json.Poster;
            detalhes.querySelector("#Plot").innerText = json.Plot;
            detalhes.querySelector("#Genre").innerText = json.Genre;
            detalhes.querySelector("#Director").innerText = json.Director;
            detalhes.querySelector("#Actors").innerText = json.Actors;
            detalhes.querySelector("#imdbRating").innerText = json.imdbRating;
            detalhes.querySelector("#BoxOffice").innerText = json.BoxOffice;

            translatePlot(json.Plot);

            detalhes.style.display = "block";
        })
        .catch(error => console.error('Erro:', error));
};

const translatePlot = (plot) => {
    const data = {
        q: plot,
        source: 'en',
        target: 'pt'
    };

    fetch('https://cors-anywhere.herokuapp.com/https://libretranslate.de/translate', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(result => {
        document.querySelector("#Plot").innerText = result.translatedText;
    })
    .catch(error => console.error('Erro ao traduzir:', error));
};
