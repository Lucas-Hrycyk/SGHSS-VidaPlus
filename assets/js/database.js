const APPOINTMENTS_KEY = 'sghss_appointments';
const PRONTUARIOS_KEY = 'sghss_prontuarios';

function saveAppointment(appointmentData) {
    const allAppointments = getAppointments();
    allAppointments.push(appointmentData);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(allAppointments));
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