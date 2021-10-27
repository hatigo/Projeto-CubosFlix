const body = document.querySelector('body');
const movies = document.querySelector('.movies');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const linkVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightDescription = document.querySelector('.highlight__description');
const hightlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightVideo = document.querySelector('.highlight__video');
const highlightVideoLink = document.querySelector('.highlight__video-link');
const btnTheme = document.querySelector('.btn-theme');
const BTNs = document.querySelectorAll('#BTN');
const input = document.querySelector('.input');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalRating = document.querySelector('.modal__average');
const modalGenres = document.querySelector('.modal__genres');


fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR').then(async response => {
    const resposta = await response.json();
    let dados = resposta;
    selectPoster(0, resposta);

    BTNs.forEach(btn => {
        btn.addEventListener('click', function (event) {
            scrollList(event, dados);
        });
    })

    function selectPoster(index, data) {
        const size = data.results.length >= 5 ? 5 : data.results.length;
        dados = data;
        for (let i = 0; i < size; i++) {
            const movieId = data.results[index].id;
            const moviePosterPath = data.results[index].poster_path;
            const title = data.results[index].title;
            const rating = data.results[index].vote_average;
            const divMovie = document.createElement('div');
            const divMovieInfo = document.createElement('div');
            const spanMovieTitle = document.createElement('span');
            const spanMovieRating = document.createElement('span');
            const starImg = document.createElement('img');

            divMovie.id = movieId;
            divMovie.classList.add('movie');
            divMovieInfo.classList.add('movie__info');
            spanMovieTitle.classList.add('movie__title');
            spanMovieRating.classList.add('movie__rating');

            starImg.src = './assets/estrela.svg';
            starImg.style.setProperty('margin-right', '5px');
            divMovie.style.setProperty('background-image', `url('https://image.tmdb.org/t/p/w185${moviePosterPath}')`);

            spanMovieTitle.append(title);
            spanMovieRating.append(starImg, rating);
            divMovieInfo.append(spanMovieTitle, spanMovieRating);
            divMovie.append(divMovieInfo);
            movies.append(divMovie);

            
            divMovie.addEventListener('click', abrirModal);

            index++;

        }

    }

   

    

    async function abrirModal() {
        const movieId = this.id;
        modal.classList.remove('hidden');
        modalClose.addEventListener('click', fecharModal);
        modal.addEventListener('click', fecharModal);
        const modalMovie = await (await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movieId}?language=pt-BR`)).json();
        modalTitle.textContent = modalMovie.title;
        modalImg.src = modalMovie.backdrop_path;
        modalDescription.textContent = modalMovie.overview;
        modalRating.textContent = modalMovie.vote_average;
        modalMovie.genres.forEach(genre => {
            const spanGenre = document.createElement('span');
            spanGenre.classList.add('modal__genre');
            spanGenre.textContent = genre.name;
            modalGenres.append(spanGenre);
        })

    }

    function fecharModal() {
        modal.classList.add('hidden');
        const size = modalGenres.children.length;
        for (let i = 0; i < size; i++) {
            modalGenres.lastChild.remove();
        }
    }


    function apagarDivs() {
        const size = movies.children.length;
        for (let i = 0; i < size; i++) {
            movies.lastChild.remove();
        }
    }

    function updateMovies(index, data) {
        apagarDivs();
        selectPoster(index, data);
    }

    function scrollList(event, data) {
        const img4 = `https://image.tmdb.org/t/p/w185${data.results[4].poster_path}`;
        const img9 = `https://image.tmdb.org/t/p/w185${data.results[9].poster_path}`;
        const img14 = `https://image.tmdb.org/t/p/w185${data.results[14].poster_path}`;
        const img19 = `https://image.tmdb.org/t/p/w185${data.results[19].poster_path}`;

        const lastImgSrc = movies.lastChild.style.getPropertyValue('background-image');

        if (lastImgSrc === `url("${img4}")`) {
            event.target.className === 'btn-next' ? updateMovies(5, data) : updateMovies(15, data);
        } else if (lastImgSrc === `url("${img9}")`) {
            event.target.className === 'btn-next' ? updateMovies(10, data) : updateMovies(0, data);
        } else if (lastImgSrc === `url("${img14}")`) {
            event.target.className === 'btn-next' ? updateMovies(15, data) : updateMovies(5, data);
        } else if (lastImgSrc === `url("${img19}")`) {
            event.target.className === 'btn-next' ? updateMovies(0, data) : updateMovies(10, data);
        }

    }

    input.addEventListener('keydown', async function (event) {
        if (event.key !== 'Enter') return;
        updateMovies(0, resposta);
        if (!event.target.value) return;
        const movieToBeFinded = event.target.value;
        const findedMovie = await (await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${movieToBeFinded}`)).json();
        updateMovies(0, findedMovie);
        event.target.value = '';

    });



})


fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(async response => {
    const resposta = await response.json();
    const respostaVideos = await (await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR')).json();
    const keyVideo = respostaVideos.results[1].key;
    const month = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    const highlightPath = resposta.backdrop_path;
    const date = new Date(resposta.release_date);
    const formatedDate = ((date.getDate() + " DE " + month[date.getMonth()] + " DE " + date.getFullYear()));

    for (let i = 0; i < resposta.genres.length; i++) {
        const virgula = i === 0 ? '' : ', ';
        hightlightGenres.textContent += `${virgula} ` + resposta.genres[i].name;
    }

    highlightVideo.style.setProperty('background-image', `url("${highlightPath}")`);
    highlightLaunch.textContent = formatedDate;
    highlightTitle.textContent = resposta.title;
    highlightRating.textContent = resposta.vote_average;
    highlightDescription.textContent = resposta.overview;
    highlightVideoLink.href = `https://www.youtube.com/watch?v=${keyVideo}`;


})





btnTheme.addEventListener('click', darkMode);


function darkMode() {
    btnTheme.src = './assets/dark-mode.svg'
    body.style.setProperty('--background-color', '#242424');
    body.style.setProperty('--highlight-background', '#454545');
    body.style.setProperty('--highlight-description', '#FFF');
    body.style.setProperty('--highlight-color', '#FFFFFFB2');
    body.style.setProperty('--color', '#FFF');
    body.style.setProperty('--input-border-color', '#FFF');
    body.style.setProperty('--shadow-color', '0px 4px 8px rgba(255, 255, 255, 0.15)');
    btnPrev.src = './assets/seta-esquerda-branca.svg';
    btnNext.src = './assets/seta-direita-branca.svg';

    btnTheme.removeEventListener('click', darkMode);
    btnTheme.addEventListener('click', lightmode);
}

function lightmode() {
    btnTheme.src = './assets/light-mode.svg'
    body.style.setProperty('--background-color', '#FFF');
    body.style.setProperty('--highlight-background', '#FFF');
    body.style.setProperty('--highlight-description', '#000');
    body.style.setProperty('--highlight-color', 'rgba(0, 0, 0, 0.7)');
    body.style.setProperty('--color', '#000');
    body.style.setProperty('--input-border-color', '#979797');
    body.style.setProperty('--shadow-color', '0px 4px 8px rgba(0, 0, 0, 0.15)');
    btnPrev.src = './assets/seta-esquerda-preta.svg';
    btnNext.src = './assets/seta-direita-preta.svg';

    btnTheme.removeEventListener('click', lightmode);
    btnTheme.addEventListener('click', darkMode);
}