document.addEventListener('DOMContentLoaded', () => {
    // Obtém as informações do usuário logado do localStorage
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}') as { name?: string };
    const authLink = document.getElementById('authLink') as HTMLAnchorElement;
    const userGreeting = document.getElementById('userGreeting') as HTMLSpanElement;

    if (user.name) {
        // Se o usuário estiver logado, atualiza o link de autenticação e a saudação
        authLink.textContent = 'Logout';
        authLink.href = 'logout.html'; // Link de logout
        if (userGreeting) {
            userGreeting.textContent = `Olá, ${user.name}`; // Exibe o nome do usuário
        }
    } else {
        // Se o usuário não estiver logado, mostra 'Login' e redireciona para a página de login
        authLink.textContent = 'Login';
        authLink.href = 'login.html';
        if (userGreeting) {
            userGreeting.textContent = 'Olá, Visitante'; // Saudação para visitantes não logados
        }
    }
});