    const form = document.getElementById("formLivro");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const autor = document.getElementById("autor").value.trim();
      const sumario = document.getElementById("sumario").value.trim();
      const localizacao = document.getElementById("localizacao").value.trim();
      const imagem = document.getElementById("imagem").value.trim();

      if (!nome || !autor || !sumario || !localizacao || !imagem) {
        alert("⚠ Preencha todos os campos!");
        return;
      }

      if (nome.length < 3) {
        alert("⚠ Nome do livro muito curto!");
        return;
      }

      // Salva no localStorage
      const livro = { nome, autor, sumario, localizacao, imagem };
      let livros = JSON.parse(localStorage.getItem("livros")) || [];
      livros.push(livro);
      localStorage.setItem("livros", JSON.stringify(livros));

      alert("✅ Livro cadastrado com sucesso!");
      form.reset();
    });
