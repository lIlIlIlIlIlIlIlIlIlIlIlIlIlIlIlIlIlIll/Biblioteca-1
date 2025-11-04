const searchInput = document.getElementById("search");
const bookList = document.getElementById("bookList");
const modal = document.getElementById("editModal");

let editIndex = null; // Índice do livro sendo editado

// === Carrega os livros ===
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
      <img src="${livro.imagem || "https://via.placeholder.com/200x280?text=Sem+Capa"}" alt="${livro.nome}">
      <p><strong>${livro.autor}</strong> - ${livro.nome}<br>
      <small>${livro.localizacao}</small></p>
    `;
    bookList.appendChild(card);
  });

  adicionarEventosRemover();
  adicionarEventosEditar();
}

// === Função para remover ===
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

// === Função para editar ===
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

      modal.style.display = "flex";
    });
  });
}

// === Modal: cancelar e salvar ===
document.getElementById("cancelarEdicao").addEventListener("click", () => {
  modal.style.display = "none";
});

document.getElementById("salvarEdicao").addEventListener("click", () => {
  let livros = JSON.parse(localStorage.getItem("livros")) || [];

  livros[editIndex] = {
    nome: document.getElementById("editNome").value,
    autor: document.getElementById("editAutor").value,
    sumario: document.getElementById("editSumario").value,
    localizacao: document.getElementById("editLocalizacao").value,
    imagem: document.getElementById("editImagem").value
  };

  localStorage.setItem("livros", JSON.stringify(livros));
  modal.style.display = "none";
  carregarLivros();
});

// === Fechar modal ao clicar fora ===
window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

// === Pesquisa ===
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
