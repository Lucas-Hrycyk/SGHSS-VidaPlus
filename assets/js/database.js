const APPOINTMENTS_KEY = 'sghss_appointments';
const PRONTUARIOS_KEY = 'sghss_prontuarios';

function saveAppointment(appointmentData) {
    const allAppointments = getAppointments();

    const isConflict = allAppointments.some(
        app => app.date === appointmentData.date && 
               app.specialty === appointmentData.specialty && 
               app.status !== 'Cancelada' 
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

function updateAppointmentStatus(appointmentId, newStatus) {
    let appointments = getAppointments();
    const index = appointments.findIndex(app => app.id === appointmentId);
    if (index !== -1) {
        appointments[index].status = newStatus;
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
        return true;
    }
    return false;
}

function cancelAppointment(appointmentId) {
    return updateAppointmentStatus(appointmentId, 'Cancelada');
}

function confirmAppointment(appointmentId) {
    return updateAppointmentStatus(appointmentId, 'Confirmada');
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
    return (allProntuarios[patientEmail] || []).sort((a, b) => new Date(b.date) - new Date(a.date));
}