const url = "https://botafogo-atletas.mange.li/2024-1/";

const idLimite = 60;

sessionStorage.setItem('id_max', idLimite);

const container = document.getElementById("content_container");
const divBotoes = document.getElementById("buttons_div");

const manipulaClick = (e) => {
    const id = e.currentTarget.dataset.id;

    const url = `detalhes.html?id=${id}`;

    document.cookie = `id=${id}`;
    document.cookie = `nJogos=${e.currentTarget.dataset.nJogos}`;

    localStorage.setItem('id', id);
    localStorage.setItem('dados', JSON.stringify(e.currentTarget.dataset));

    sessionStorage.setItem('id', id);

    sessionStorage.setItem('dados', JSON.stringify(e.currentTarget.dataset));

    window.location.href = url;

    console.log(e.currentTarget);
}


const pega_json = async (caminho) => {
    const resposta = await fetch(caminho);
    const dados = await resposta.json();
    return dados;
}

const montaCard = (atleta) => {
    const cartao = document.createElement("article");
    const nome = document.createElement("h1");
    const imagem = document.createElement("img");


    nome.innerText = atleta.nome;
    nome.style.fontFamily= "Andale Mono, monospace";
    cartao.appendChild(nome);

    imagem.src = atleta.imagem;
    cartao.appendChild(imagem);

    cartao.dataset.id = atleta.id;
    cartao.dataset.nJogos = atleta.n_jogos;

    cartao.onclick = manipulaClick;

    return cartao;
}

const btnMasculino = () => {
    pega_json(`${url}masculino`).then(
        (r) => {
            container.innerHTML = "";
            r.forEach(
                (ele) => container.appendChild(montaCard(ele))
            )
        }
    );
}

const btnFeminino = () => {
    pega_json(`${url}feminino`).then(
        (r) => {
            container.innerHTML = "";
            r.forEach(
                (ele) => container.appendChild(montaCard(ele))
            )
        }
    );
}

const btnTodosAtletas = () => {
    pega_json(`${url}all`).then(
        (r) => {
            container.innerHTML = "";
            r.forEach(
                (ele) => container.appendChild(montaCard(ele))
            )
        }
    );
}

const criaBotoesTimes = () => {
    const botoes = document.createElement("div");
    botoes.id = "botoes";
    botoes.innerHTML = `
    <div class="botao_selecao">
        <div id="team_selection">
            <button id="btn_masculino">Time Masculino</button>
            <button id="btn_feminino">Time Feminino</button>
            <button id="btn_all">Todos os Atletas</button>
        </div>
        <input type="text" id="busca" placeholder="Insira Busca">
    </div>
    `;

    return botoes;
}

const criaSelectTimes = () => {
    const select = document.createElement("select");
    select.id = "team_selection";
    select.className = "dropdown";
    select.innerHTML = `
        <option value="masculino">Time Masculino</option>
        <option value="feminino">Time Feminino</option>
        <option value="all">Todos os Atletas</option>
    `;
    select.onchange = (e) => {
        const value = e.target.value;
        if (value === "masculino") btnMasculino();
        else if (value === "feminino") btnFeminino();
        else if (value === "all") btnTodosAtletas();
    };
    return select;
}

const configuraBotoesTimes = () => {
    if (sessionStorage.getItem('login')) {
        const teamSelection = document.getElementById("team_selection");
        if (window.innerWidth <= 768) {
            teamSelection.replaceWith(criaSelectTimes());
        } else {
            document.getElementById("btn_masculino").onclick = btnMasculino;
            document.getElementById("btn_feminino").onclick = btnFeminino;
            document.getElementById("btn_all").onclick = btnTodosAtletas;
        }
    }
}

const loginValido = () => {
    container.innerHTML = "";
    divBotoes.appendChild(criaBotoesTimes());

    setTimeout(configuraBotoesTimes, 300);

    const input = document.getElementById('busca');
    input.addEventListener('input', () => {
        const termo = input.value.toLowerCase();
        const cartoes = container.getElementsByTagName('article');

        for (let i = 0; i < cartoes.length; i++) {
            const cartao = cartoes[i];
            const nome = cartao.getElementsByTagName('h1')[0].innerText.toLowerCase();

            if (nome.includes(termo)) {
                cartao.style.display = 'block';
            } else {
                cartao.style.display = 'none';
            }
        }
    });
}

const manipulaBotaoLogin = () => {
    const texto = document.getElementById("senha_input_field").value;

    document.getElementById("senha_input_field").value = "";

    if (hex_sha256(texto) === "ce855f48b7422de36b50512a9a0a06a59d4f2f6efac6f439456777a396773cc1") {
        sessionStorage.setItem('login', true);

        document.getElementById("login_btn").style.display = "none";
        document.getElementById("senha_input_field").style.display = "none";
        document.getElementById("senha_mostra").style.display = "none";
        document.getElementById("login_card").style.display = "none";
        document.getElementById("logout_btn").style.display = "block";
        document.getElementById("logobota").style.display = "none";

        if (sessionStorage.getItem('login')) {
            loginValido();
        }
    } else {
        alert("Senha incorreta");
    }
}

document.getElementById("login_btn").onclick = manipulaBotaoLogin;

document.getElementById("logout_btn").onclick = () => {
    sessionStorage.removeItem('login');
    container.innerHTML = "";
    divBotoes.innerHTML = "";

    document.getElementById("login_btn").style.display = "inline";
    document.getElementById("senha_input_field").style.display = "inline";
    document.getElementById("senha_mostra").style.display = "block";
    document.getElementById("login_card").style.display = "flex";
    document.getElementById("logout_btn").style.display = "none";
    document.getElementById("logobota").style.display = "none";
}

const checkLoginStatus = () => {
    if (sessionStorage.getItem('login')) {
        document.getElementById("login_btn").style.display = "none";
        document.getElementById("senha_input_field").style.display = "none";
        document.getElementById("senha_mostra").style.display = "none";
        document.getElementById("login_card").style.display = "none";
        document.getElementById("logout_btn").style.display = "block";
        document.getElementById("logobota").style.display = "none";
        loginValido();
    }
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);

window.addEventListener('resize', () => {
    if (sessionStorage.getItem('login')) {
        const teamSelection = document.getElementById("team_selection");
        if (window.innerWidth <= 768 && teamSelection.tagName !== "SELECT") {
            teamSelection.replaceWith(criaSelectTimes());
        } else if (window.innerWidth > 768 && teamSelection.tagName === "SELECT") {
            teamSelection.replaceWith(criaBotoesTimes().querySelector("#team_selection"));
            configuraBotoesTimes();
        }
    }
});
