const params = new URLSearchParams(window.location.search);

const id = parseInt(params.get("id"));
const idLimite = parseInt(sessionStorage.getItem("id_max"));

const container = document.getElementById("content_container");

const pega_json = async (caminho) => {
    const resposta = await fetch(caminho);
    const dados = await resposta.json();
    return dados;
}

const verificaId = () => {
    if (id > idLimite || id < 1) {
        return true;
    } else {
        return false;
    }
}

const urlBase = "https://botafogo-atletas.mange.li/2024-1/";

const dadosSessionStorage = sessionStorage.getItem('dados');

const montaPagina = async (dados) => {
    if (sessionStorage.getItem('login')) {
        if (verificaId()) {
            document.body.innerHTML = '<h1 class="no_permission">ID não encontrado</h1>';
        } else {
            const container = document.getElementById('content_container');
            container.innerHTML = '';

            const name = document.createElement('h1');
            name.innerHTML = dados.nome;
            name.className = 'name_content';
            container.appendChild(name);

            const card = document.createElement('div');
            card.className = 'card';
            container.appendChild(card);

            const containerInfo = document.createElement('div');
            containerInfo.className = 'container_info';
            card.appendChild(containerInfo);

            const img = document.createElement('img');
            img.alt = 'img atleta';
            img.src = dados.imagem;
            img.className = 'img';
            containerInfo.appendChild(img);

            const descricao = document.createElement('p');
            descricao.innerHTML = dados.detalhes;
            descricao.className = 'descricao';
            containerInfo.appendChild(descricao);

            const containerStatus = document.createElement('div');
            containerStatus.className = 'container_status';
            card.appendChild(containerStatus);

            const nJogos = document.createElement('p');
            nJogos.innerText = `Número de jogos: ${dados.n_jogos}`;
            nJogos.className = 'stats';
            containerStatus.appendChild(nJogos);

            const elenco = document.createElement('p');
            elenco.innerText = `Elenco: ${dados.elenco}`;
            elenco.className = 'stats';
            containerStatus.appendChild(elenco);

            const ntimedsd = document.createElement('p');
            ntimedsd.innerText = `No time desde: ${dados.no_botafogo_desde}`;
            ntimedsd.className = 'stats';
            containerStatus.appendChild(ntimedsd);

            const posicao = document.createElement('p');
            posicao.innerText = `Posição: ${dados.posicao}`;
            posicao.className = 'stats';
            containerStatus.appendChild(posicao);

            const altura = document.createElement('p');
            altura.innerText = `Altura: ${dados.altura}`;
            altura.className = 'stats';
            containerStatus.appendChild(altura);

            const naturalidade = document.createElement('p');
            naturalidade.innerText = `Naturalidade: ${dados.naturalidade}`;
            naturalidade.className = 'stats';
            containerStatus.appendChild(naturalidade);

            const nascimento = document.createElement('p');
            nascimento.innerText = `Nascimento: ${dados.nascimento}`;
            nascimento.className = 'stats';
            containerStatus.appendChild(nascimento);

            const botao = document.createElement('button');
            botao.className = 'btn_back content';
            botao.innerText = 'Back';
            botao.onclick = () => {
                window.location.href = 'index.html';
            }
            container.appendChild(botao);
        }
    } else {
        document.body.innerHTML = '<h1 class="no_permission">Você precisa estar logado para ter acesso</h1>';
    }
}

pega_json(`https://botafogo-atletas.mange.li/2024-1/${id}`).then(
    (r) => montaPagina(r)
);


