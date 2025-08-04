const APPOINTMENTS_KEY = 'sghss_appointments';
const PRONTUARIOS_KEY = 'sghss_prontuarios';

function saveAppointment(appointmentData) {
    const allAppointments = getAppointments();

    const isConflict = allAppointments.some(
        app => app.date === appointmentData.date && app.specialty === appointmentData.specialty
    );

    if (isConflict) {
        return "Horário indisponível! Já existe uma consulta marcada para esta especialidade neste mesmo dia e hora.";
    }

    allAppointments.push(appointmentData);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(allAppointments));
    
    return true;
}

function getAppointments() {
    return JSON.parse(localStorage.getItem(APPOINTMENTS_KEY)) || [];
}

function saveProntuarioEntry(patientEmail, entryText) {
    const allProntuarios = JSON.parse(localStorage.getItem(PRONTUARIOS_KEY)) || {};
    if (!allProntuarios[patientEmail]) {
        allProntuarios[patientEmail] = [];
    }
    const newEntry = {
        date: new Date().toISOString(),
        text: entryText,
        doctor: getCurrentUser().email
    };
    allProntuarios[patientEmail].push(newEntry);
    localStorage.setItem(PRONTUARIOS_KEY, JSON.stringify(allProntuarios));
}

function getProntuario(patientEmail) {
    const allProntuarios = JSON.parse(localStorage.getItem(PRONTUARIOS_KEY)) || {};
    return allProntuarios[patientEmail] || [];
}