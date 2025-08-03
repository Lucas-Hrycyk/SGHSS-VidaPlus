const USERS_KEY = 'sghss_users';
const SESSION_KEY = 'sghss_session';


function registerUser(email, password, role) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    if (users.find(user => user.email === email)) {
        return "Este e-mail já está cadastrado.";
    }
    users.push({ email, password, role });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
}



function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find(u => u.email === email && u.password === password);
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
        logoutUser();
        return;
    }
    if (!allowedRoles.includes(currentUser.role)) {
        alert('Acesso negado! Você não tem permissão para ver esta página.');
        logoutUser();
    }
}
