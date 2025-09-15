// Obtém o formulário pelo seletor de tag 'form' dentro da div com a classe 'form'
const formulario = document.querySelector('.form form');

// Adiciona um "ouvinte" de evento para quando o formulário for enviado
formulario.addEventListener('submit', function(event) {
    // Impede o comportamento padrão de envio do formulário, que é recarregar a página
    event.preventDefault();

    // Coletando os dados do formulário
    const nomeLivro = document.getElementById('nome').value;
    const autorLivro = document.getElementById('autor').value;
    const sumarioLivro = document.getElementById('sumario').value;
    const localizacaoLivro = document.getElementById('localizacao').value;

    // Criando um objeto com os dados coletados
    const livro = {
        nome: nomeLivro,
        autor: autorLivro,
        sumario: sumarioLivro,
        localizacao: localizacaoLivro
    };

    // Exibindo os dados no console para verificação
    console.log('Livro Cadastrado:', livro);

    
    formulario.reset();

    // Exibe uma mensagem de sucesso para o usuário
    alert('Livro cadastrado com sucesso! Verifique o console para os detalhes.');
});