const USERS_KEY = 'sghss_users';
const SESSION_KEY = 'sghss_session';

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
}

function registerUser(nome, cpf, email, password, role, specialty = null) {
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedCPF = cpf.trim().replace(/[.\-]/g, '');

    if (!nome || !cleanedCPF || !cleanedEmail || !password || !role) {
        return "Todos os campos são obrigatórios.";
    }

    if (role === 'medico' && (!specialty || specialty === '')) {
        return "A especialidade é obrigatória para o perfil Médico.";
    }

    if (!validarCPF(cleanedCPF)) {
        return "CPF inválido. Por favor, verifique o número digitado.";
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    
    if (users.find(user => user.email === cleanedEmail)) {
        return "Este e-mail já está cadastrado.";
    }
    if (users.find(user => user.cpf === cleanedCPF)) {
        return "Este CPF já está cadastrado.";
    }
    
    const newUser = { nome, cpf: cleanedCPF, email: cleanedEmail, password, role };
    if (role === 'medico') {
        newUser.specialty = specialty;
    }
    
    users.push(newUser);
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