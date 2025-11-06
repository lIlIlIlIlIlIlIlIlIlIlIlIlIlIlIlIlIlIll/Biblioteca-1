// Constantes para chaves do Local Storage
const DADOS_KEY = {
    LIVROS: "livros",
    ALUNOS: "alunos"
};

// Referências aos elementos da interface (DOM)
const DOMElements = {
    search: document.getElementById("search"),
    bookList: document.getElementById("bookList"),
    editModal: document.getElementById("editModal"),
    reserveModal: document.getElementById("reserveModal"),
    studentListContainer: document.getElementById("studentListContainer"),
};

let editIndex = null;
let reserveBookIndex = null;

// Helpers para ler e salvar dados no Local Storage
const getDados = (key) => JSON.parse(localStorage.getItem(key)) ?? [];
const setDados = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Função utilitária para formatar a data (YYYY-MM-DD) para o input type="date"
const getTodayDateString = () => {
    const today = new Date();
    // Ajusta o fuso horário para garantir que seja a data de hoje
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
};

// Renderiza a lista de livros
function carregarLivros() {
    DOMElements.bookList.innerHTML = "";
    const livros = getDados(DADOS_KEY.LIVROS);

    livros.forEach((livro, index) => {
        const card = document.createElement("div");
        card.classList.add("book");
        
        // Determina o status da reserva e a data de devolução
        let reserveInfo = '';
        if (livro.reservadoPor) {
            reserveInfo = `<p class="reserved-status">Reservado para: <strong>${livro.reservadoPor}</strong>`;
            if (livro.dataDevolucao) {
                // Formata a data para exibição (DD/MM/AAAA)
                const dateParts = livro.dataDevolucao.split('-');
                const displayDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                reserveInfo += `<br><small>Devolução: ${displayDate}</small></p>`;
            } else {
                reserveInfo += `</p>`;
            }
        }
        
        // Cria o card do livro com botões de ação
        card.innerHTML = `
            <span class="action-btn remove-btn" data-action="remove" data-index="${index}">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </span>
            <span class="action-btn edit-btn" data-action="edit" data-index="${index}">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
            </span>
            <span class="action-btn reserve-btn" data-action="reserve" data-index="${index}">+</span>
            <img src="${livro.imagem || "https://via.placeholder.com/200x280?text=Sem+Capa"}" alt="${livro.nome}">
            <p><strong>${livro.autor}</strong> - ${livro.nome}<br>
            <small>${livro.localizacao}</small></p>
            ${reserveInfo} 
        `;
        DOMElements.bookList.appendChild(card);
    });
}

// Funções de Gerenciamento CRUD (Remover, Editar, Reservar)
// ... (removerLivro, abrirEdicao, salvarEdicao permanecem as mesmas)

const removerLivro = (index) => {
    if (confirm("Tem certeza que deseja excluir este livro?")) {
        const livros = getDados(DADOS_KEY.LIVROS);
        livros.splice(index, 1);
        setDados(DADOS_KEY.LIVROS, livros);
        carregarLivros();
    }
};

const abrirEdicao = (index) => {
    editIndex = index;
    const livro = getDados(DADOS_KEY.LIVROS)[index];
    
    // Popula o modal de edição
    document.getElementById("editNome").value = livro.nome;
    document.getElementById("editAutor").value = livro.autor;
    document.getElementById("editSumario").value = livro.sumario;
    document.getElementById("editLocalizacao").value = livro.localizacao;
    document.getElementById("editImagem").value = livro.imagem;

    DOMElements.editModal.style.display = "flex";
};

const salvarEdicao = () => {
    if (editIndex === null) return;
    
    const livros = getDados(DADOS_KEY.LIVROS);
    
    // Atualiza o objeto no array
    livros[editIndex] = {
        ...livros[editIndex], 
        nome: document.getElementById("editNome").value,
        autor: document.getElementById("editAutor").value,
        sumario: document.getElementById("editSumario").value,
        localizacao: document.getElementById("editLocalizacao").value,
        imagem: document.getElementById("editImagem").value,
    };

    setDados(DADOS_KEY.LIVROS, livros);
    DOMElements.editModal.style.display = "none";
    carregarLivros();
};

// Lógica de Reserva

function carregarAlunosParaReserva(livroIndex) {
    DOMElements.studentListContainer.innerHTML = "";
    reserveBookIndex = livroIndex;
    
    const livros = getDados(DADOS_KEY.LIVROS);
    const alunos = getDados(DADOS_KEY.ALUNOS);
    const livro = livros[livroIndex];
    const dataMinima = getTodayDateString(); // Data mínima para devolução é hoje

    document.querySelector('#reserveModal h2').textContent = `Reservar: ${livro.nome}`;

    if (livro.reservadoPor) {
        // Mostra opção de liberar se já reservado
        document.querySelector('#reserveModal p').textContent = "O livro está reservado. Deseja liberar?";
        
        // Exibe a data de devolução no modal
        const dataDevolucaoTexto = livro.dataDevolucao ? 
            `<p>Data de Devolução Esperada: <strong>${livro.dataDevolucao.split('-').reverse().join('/')}</strong></p>` : 
            '';

        DOMElements.studentListContainer.innerHTML = `
            <p><strong>Status: Reservado</strong></p>
            <p>Reservado por: <strong>${livro.reservadoPor}</strong></p>
            ${dataDevolucaoTexto}
            <button id="liberarLivroBtn" class="cancel-reservation-btn">Cancelar Reserva</button>
        `;
        document.getElementById("liberarLivroBtn").addEventListener("click", () => liberarLivro(livroIndex, livro.reservadoPor));
        return;
    }
    
    // Lista alunos se o livro estiver disponível
    document.querySelector('#reserveModal p').innerHTML = `
        Selecione um aluno para reservar o livro:<br><br>
        <label for="devolucao-date">Data de Devolução Esperada:</label>
        <input type="date" id="devolucao-date" min="${dataMinima}" required>
    `;

    if (alunos.length === 0) {
        DOMElements.studentListContainer.innerHTML = "<p>Nenhum aluno cadastrado para reserva.</p>";
        return;
    }

    // Verifica se o aluno já reservou um livro
    alunos.forEach(aluno => {
        const alunoJaReservou = livros.some(l => l.reservadoPor === aluno.nome);
        
        const alunoItem = document.createElement("div");
        alunoItem.classList.add("student-item");
        alunoItem.textContent = `${aluno.nome} - Turma: ${aluno.turma}`;
        
        if (alunoJaReservou) {
            alunoItem.classList.add("reserved-student"); 
            alunoItem.textContent += " (Já possui uma reserva)";
            alunoItem.onclick = () => alert(`${aluno.nome} já possui um livro reservado e não pode reservar este.`);
        } else {
            // Passa o nome do aluno para a função de reserva
            alunoItem.onclick = () => reservarLivro(livroIndex, aluno.nome);
        }
        
        DOMElements.studentListContainer.appendChild(alunoItem);
    });
}

const reservarLivro = (index, nomeAluno) => {
    const livros = getDados(DADOS_KEY.LIVROS);
    const livro = livros[index];
    
    // Captura a data de devolução do novo campo
    const dataDevolucaoInput = document.getElementById("devolucao-date");
    const dataDevolucao = dataDevolucaoInput?.value;

    if (!dataDevolucao) {
        alert("Por favor, selecione a data de devolução esperada.");
        return;
    }

    // Checagem final antes de salvar
    const alunoJaReservou = livros.some(l => l.reservadoPor === nomeAluno);
    if (alunoJaReservou) {
         alert(`${nomeAluno} já possui um livro reservado e não pode reservar este.`);
         return; // Interrompe a reserva
    }

    if (confirm(`Confirmar reserva do livro "${livro.nome}" para o aluno: ${nomeAluno}?`)) {
        livro.reservadoPor = nomeAluno;
        livro.dataDevolucao = dataDevolucao; // Salva a data de devolução
        setDados(DADOS_KEY.LIVROS, livros);
        alert(`Livro reservado para ${nomeAluno}! Devolução esperada em: ${dataDevolucao.split('-').reverse().join('/')}`);
        DOMElements.reserveModal.style.display = "none";
        carregarLivros();
    }
};

const liberarLivro = (index, nomeAluno) => {
    const livros = getDados(DADOS_KEY.LIVROS);
    const livro = livros[index];

    if (confirm(`Tem certeza que deseja CANCELAR a reserva de "${livro.nome}" feita por ${nomeAluno}?`)) {
        livro.reservadoPor = null; // Limpa a propriedade de reserva
        livro.dataDevolucao = null; // Limpa a data de devolução
        setDados(DADOS_KEY.LIVROS, livros);
        alert(`Reserva de ${nomeAluno} cancelada. Livro liberado!`);
        DOMElements.reserveModal.style.display = "none";
        carregarLivros();
    }
};

// Configuração de Eventos
// ... (Delegação e eventos de modais permanecem os mesmos)

// Delegação para cliques em botões de ação dos livros
DOMElements.bookList.addEventListener("click", (e) => {
    const targetBtn = e.target.closest(".action-btn");
    if (!targetBtn) return;

    const { action, index } = targetBtn.dataset;
    const idx = parseInt(index);

    switch (action) {
        case "remove":
            removerLivro(idx);
            break;
        case "edit":
            abrirEdicao(idx);
            break;
        case "reserve":
            carregarAlunosParaReserva(idx);
            DOMElements.reserveModal.style.display = "flex";
            break;
    }
});

// Eventos de fechar e salvar dos modais
document.getElementById("cancelarEdicao").addEventListener("click", () => {
    DOMElements.editModal.style.display = "none";
});

document.getElementById("salvarEdicao").addEventListener("click", salvarEdicao);

document.getElementById("cancelarReserva").addEventListener("click", () => {
    DOMElements.reserveModal.style.display = "none";
});

// Fecha modais ao clicar na área externa
window.addEventListener("click", e => {
    if (e.target === DOMElements.editModal) DOMElements.editModal.style.display = "none";
    if (e.target === DOMElements.reserveModal) DOMElements.reserveModal.style.display = "none";
});

// Função de pesquisa instantânea
DOMElements.search.addEventListener("input", function () {
    const searchText = this.value.toLowerCase();
    const books = DOMElements.bookList.querySelectorAll(".book");

    books.forEach(book => {
        const title = book.innerText.toLowerCase();
        book.style.display = title.includes(searchText) ? "block" : "none";
    });
});

// Inicia o carregamento dos dados
carregarLivros();
