const searchInput = document.getElementById("search");
    const bookList = document.getElementById("bookList");

    // Função para carregar livros do localStorage
    function carregarLivros() {
      bookList.innerHTML = "";
      let livros = JSON.parse(localStorage.getItem("livros")) || [];

      livros.forEach((livro, index) => {
        let card = document.createElement("div");
        card.classList.add("book");
        card.innerHTML = `
          <span class="remove-btn" data-index="${index}">❌</span>
          <img src="${livro.imagem || "https://via.placeholder.com/200x280?text=Sem+Capa"}" alt="${livro.nome}">
          <p><strong>${livro.autor}</strong> - ${livro.nome}<br>
          <small>${livro.localizacao}</small></p>
        `;
        bookList.appendChild(card);
      });

      adicionarEventosRemover();
    }

    // Função para remover livros
    function adicionarEventosRemover() {
      document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          let index = this.getAttribute("data-index");
          let livros = JSON.parse(localStorage.getItem("livros")) || [];
          livros.splice(index, 1); // remove pelo índice
          localStorage.setItem("livros", JSON.stringify(livros));
          carregarLivros();
        });
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

    // Inicializa
    carregarLivros();
