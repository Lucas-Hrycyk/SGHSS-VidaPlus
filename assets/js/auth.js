const USERS_KEY = 'sghss_users';
const SESSION_KEY = 'sghss_session';

function registerUser(nome, cpf, email, password, role) {
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedCPF = cpf.trim().replace(/[.\-]/g, '');

    if (!nome || !cleanedCPF || !cleanedEmail || !password || !role) {
        return "Todos os campos são obrigatórios.";
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    
    if (users.find(user => user.email === cleanedEmail)) {
        return "Este e-mail já está cadastrado.";
    }
    if (users.find(user => user.cpf === cleanedCPF)) {
        return "Este CPF já está cadastrado.";
    }
    
    users.push({ nome, cpf: cleanedCPF, email: cleanedEmail, password, role });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
}

function loginUser(email, password) {
    const cleanedEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find(u => u.email === cleanedEmail && u.password === password);
    
    if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return user;
    }
    return null;
}

function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '../index.html';
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
}

function protectPage(allowedRoles) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }
    if (!allowedRoles.includes(currentUser.role)) {
        alert('Acesso negado! Você não tem permissão para visualizar esta página.');
        logoutUser();
    }
}