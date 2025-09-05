    //Pegando elementos do formulário pelo ID
      const loginForm = document.getElementById('loginForm');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const emailError = document.getElementById('emailError');
      const passwordError = document.getElementById('passwordError');

    //Função de validação ao enviar o formulário
      loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

    //Limpa mensagens de erro
        emailError.textContent = "";
        passwordError.textContent = "";

        let valid = true;

    //Validação do email não estiver no formato correto
        if (emailInput.value.trim() === "") {
          emailError.textContent = "Por favor, insira seu email.";
          valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
          emailError.textContent = "Digite um email válido.";
          valid = false;
        }

    //Validação da senha estiver vazio
        if (passwordInput.value.trim() === "") {
          passwordError.textContent = "Por favor, insira sua senha.";
          valid = false;
        }

    //Se tudo estiver válido
        if (valid) {
          //Redirecionar patra a pagina principal
          window.location.href = "../index.html";
        }
      });
