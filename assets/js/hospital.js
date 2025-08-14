const LEITOS_KEY = 'sghss_leitos';
const TOTAL_LEITOS = 20;

function initializeLeitos() {
    const leitos = getLeitos();
    if (leitos.length === 0) {
        const novosLeitos = [];
        for (let i = 1; i <= TOTAL_LEITOS; i++) {
            novosLeitos.push({
                id: i,
                status: 'Livre', 
                patientEmail: null
            });
        }
        localStorage.setItem(LEITOS_KEY, JSON.stringify(novosLeitos));
    }
}

function getLeitos() {
    return JSON.parse(localStorage.getItem(LEITOS_KEY)) || [];
}

function updateLeitoStatus(leitoId, newStatus, patientEmail = null) {
    let leitos = getLeitos();
    const index = leitos.findIndex(l => l.id === leitoId);
    if (index !== -1) {
        leitos[index].status = newStatus;
        leitos[index].patientEmail = newStatus === 'Ocupado' ? patientEmail : null;
        localStorage.setItem(LEITOS_KEY, JSON.stringify(leitos));
    }
}

initializeLeitos();