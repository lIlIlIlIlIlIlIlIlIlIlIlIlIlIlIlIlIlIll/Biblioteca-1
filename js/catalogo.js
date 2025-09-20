const searchInput = document.getElementById("search");
const bookList = document.getElementById("bookList");

// Função para carregar livros do localStorage
function carregarLivros() {
    bookList.innerHTML = "";
    let livros = JSON.parse(localStorage.getItem("livros")) || [];

    livros.forEach(livro => {
        let card = document.createElement("div");
        card.classList.add("book");
        card.innerHTML = `
          <img src="${livro.imagem}" alt="${livro.nome}">
          <p><strong>${livro.autor}</strong> - ${livro.nome}<br>
          <small>${livro.localizacao}</small></p>
        `;
        bookList.appendChild(card);
    });
}

// Pesquisa de livros
searchInput.addEventListener("input", function () {
    let searchText = this.value.toLowerCase();
    let books = bookList.querySelectorAll(".book");

    books.forEach(book => {
        let title = book.innerText.toLowerCase();
        book.style.display = title.includes(searchText) ? "block" : "none";
    });
});

carregarLivros();
