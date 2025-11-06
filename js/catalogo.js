const searchInput = document.getElementById("search");
const bookList = document.getElementById("bookList");
const editModal = document.getElementById("editModal");
const reserveModal = document.getElementById("reserveModal");
const studentListContainer = document.getElementById("studentListContainer");
const cancelarReservaBtn = document.getElementById("cancelarReserva");

let editIndex = null;
let reserveBookIndex = null;

function carregarLivros() {
  bookList.innerHTML = "";
  let livros = JSON.parse(localStorage.getItem("livros")) || [];

  livros.forEach((livro, index) => {
    let card = document.createElement("div");
    card.classList.add("book");
    card.innerHTML = `
      <span class="remove-btn" data-index="${index}">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
      </span>
      <span class="edit-btn" data-index="${index}">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
          <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
        </svg>
      </span>
      <span class="reserve-btn" data-index="${index}">+</span>

      <img src="${livro.imagem || "https://via.placeholder.com/200x280?text=Sem+Capa"}" alt="${livro.nome}">
      <p><strong>${livro.autor}</strong> - ${livro.nome}<br>
      <small>${livro.localizacao}</small></p>
    `;
    bookList.appendChild(card);
  });

  adicionarEventosRemover();
  adicionarEventosEditar();
  adicionarEventosReserva();
}

// === Função para remover (Existente) ===
function adicionarEventosRemover() {
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      let index = this.getAttribute("data-index");
      if (confirm("Tem certeza que deseja excluir este livro?")) {
        let livros = JSON.parse(localStorage.getItem("livros")) || [];
        livros.splice(index, 1);
        localStorage.setItem("livros", JSON.stringify(livros));
        carregarLivros();
      }
    });
  });
}

// === Função para editar (Existente) ===
function adicionarEventosEditar() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      editIndex = this.getAttribute("data-index");
      let livros = JSON.parse(localStorage.getItem("livros")) || [];
      let livro = livros[editIndex];

      document.getElementById("editNome").value = livro.nome;
      document.getElementById("editAutor").value = livro.autor;
      document.getElementById("editSumario").value = livro.sumario;
      document.getElementById("editLocalizacao").value = livro.localizacao;
      document.getElementById("editImagem").value = livro.imagem;

      editModal.style.display = "flex";
    });
  });
}

function adicionarEventosReserva() {
  document.querySelectorAll(".reserve-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      reserveBookIndex = this.getAttribute("data-index"); 
      carregarAlunosParaReserva(reserveBookIndex);
      reserveModal.style.display = "flex";
    });
  });
}

function carregarAlunosParaReserva(livroIndex) {
  studentListContainer.innerHTML = "";
  
  let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
  let livros = JSON.parse(localStorage.getItem("livros")) || [];
  let livro = livros[livroIndex];

  document.querySelector('#reserveModal h2').textContent = `Reservar: ${livro.nome}`;
  
  if (livro.reservadoPor) {
    // LIVRO JÁ RESERVADO: Mostra opção de cancelamento
    document.querySelector('#reserveModal p').textContent = "O livro está reservado. Deseja liberar?";
    
    studentListContainer.innerHTML = `
      <p><strong>Status: Reservado</strong></p>
      <p>Reservado por: <strong>${livro.reservadoPor}</strong></p>
      <button id="liberarLivroBtn" class="cancel-reservation-btn">
        Cancelar Reserva
      </button>
    `;
    
    document.getElementById("liberarLivroBtn").addEventListener("click", () => {
      liberarLivro(livroIndex, livro.reservadoPor);
    });

    return;
  }
  
  // LIVRO DISPONÍVEL: Lista os alunos
  document.querySelector('#reserveModal p').textContent = "Selecione um aluno para reservar o livro:";

  if (alunos.length === 0) {
    studentListContainer.innerHTML = "<p>Nenhum aluno cadastrado para reserva.</p>";
    return;
  }

  alunos.forEach(aluno => {
    let alunoItem = document.createElement("div");
    alunoItem.classList.add("student-item");
    alunoItem.textContent = `${aluno.nome} - Turma: ${aluno.turma}`;
    alunoItem.addEventListener("click", () => {
      reservarLivro(livroIndex, aluno.nome);
    });
    studentListContainer.appendChild(alunoItem);
  });
}

// === Lógica de Reserva ===
function reservarLivro(livroIndex, nomeAluno) {
  let livros = JSON.parse(localStorage.getItem("livros")) || [];
  
  if (confirm(`Confirmar reserva do livro "${livros[livroIndex].nome}" para o aluno: ${nomeAluno}?`)) {
    
    livros[livroIndex].reservadoPor = nomeAluno;
    
    localStorage.setItem("livros", JSON.stringify(livros));
    
    alert(`Livro reservado com sucesso para ${nomeAluno}!`);
    
    reserveModal.style.display = "none";
    carregarLivros(); 
  }
}

// === Lógica de Liberação/Cancelamento da Reserva ===
function liberarLivro(livroIndex, nomeAluno) {
  if (confirm(`Tem certeza que deseja CANCELAR a reserva de "${JSON.parse(localStorage.getItem("livros"))[livroIndex].nome}" feita por ${nomeAluno}?`)) {
    
    let livros = JSON.parse(localStorage.getItem("livros")) || [];
    
    // Limpa a propriedade de reserva
    livros[livroIndex].reservadoPor = null; 
    
    localStorage.setItem("livros", JSON.stringify(livros));
    
    alert(`Reserva de ${nomeAluno} cancelada. Livro liberado!`);
    
    reserveModal.style.display = "none";
    carregarLivros(); 
  }
}
document.getElementById("cancelarEdicao").addEventListener("click", () => {
  editModal.style.display = "none";
});

document.getElementById("salvarEdicao").addEventListener("click", () => {
  let livros = JSON.parse(localStorage.getItem("livros")) || [];

  livros[editIndex] = {
    nome: document.getElementById("editNome").value,
    autor: document.getElementById("editAutor").value,
    sumario: document.getElementById("editSumario").value,
    localizacao: document.getElementById("editLocalizacao").value,
    imagem: document.getElementById("editImagem").value,
    reservadoPor: livros[editIndex].reservadoPor 
  };

  localStorage.setItem("livros", JSON.stringify(livros));
  editModal.style.display = "none";
  carregarLivros();
});

// === Modal: fechar reserva (NOVO) ===
cancelarReservaBtn.addEventListener("click", () => {
  reserveModal.style.display = "none";
});


// === Fechar modal ao clicar fora (Atualizado para 2 modais) ===
window.addEventListener("click", e => {
  if (e.target === editModal) editModal.style.display = "none";
  if (e.target === reserveModal) reserveModal.style.display = "none";
});

// === Pesquisa (Existente) ===
searchInput.addEventListener("input", function () {
  let searchText = this.value.toLowerCase();
  let books = bookList.querySelectorAll(".book");

  books.forEach(book => {
    let title = book.innerText.toLowerCase();
    book.style.display = title.includes(searchText) ? "block" : "none"; 
  });
});

// === Inicializa ===
carregarLivros();
