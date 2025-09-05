    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const successMessage = document.getElementById('successMessage');

    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();

      //Limpa erros
      emailError.textContent = "";
      passwordError.textContent = "";
      successMessage.style.display = "none";

      let valid = true;

      //Validação de email
      const emailValue = emailInput.value.trim();
      if (emailValue === "") {
        emailError.textContent = "Por favor, insira seu email.";
        valid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(emailValue)) {
        emailError.textContent = "Digite um email válido.";
        valid = false;
      }

      const passwordValue = passwordInput.value.trim();
      if (passwordValue === "") {
        passwordError.textContent = "Por favor, insira sua senha.";
        valid = false;
      } else if (passwordValue.length < 6) {
        passwordError.textContent = "A senha deve ter pelo menos 6 caracteres.";
        valid = false;
      }

      // Se for válido
      if (valid) {
        successMessage.style.display = "block";
        // Simula redirecionamento após 2s
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 2000);
      }
    });
