const APPOINTMENTS_KEY = 'sghss_appointments';
const PRONTUARIOS_KEY = 'sghss_prontuarios';
const MEDICATIONS_KEY = 'sghss_medications';
const MEDICATION_LOG_KEY = 'sghss_medication_log';

function saveAppointment(appointmentData) {
    const allAppointments = getAppointments();
    const isConflict = allAppointments.some(app => app.date === appointmentData.date && app.specialty === appointmentData.specialty && app.status !== 'Cancelada');
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

function initializeMedications() {
    if (!localStorage.getItem(MEDICATIONS_KEY)) {
        const sampleMeds = [
            { id: 'med' + Date.now(), name: 'Paracetamol 500mg', quantity: 100 },
            { id: 'med' + (Date.now() + 1), name: 'Dipirona 500mg', quantity: 80 },
            { id: 'med' + (Date.now() + 2), name: 'Soro Fisiológico 500ml', quantity: 50 },
        ];
        localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(sampleMeds));
    }
}

function getMedications() {
    return JSON.parse(localStorage.getItem(MEDICATIONS_KEY)) || [];
}

function saveMedications(medications) {
    localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
}

function addMedication(name, quantity) {
    const meds = getMedications();
    if (meds.some(med => med.name.toLowerCase() === name.toLowerCase())) {
        return "Este medicamento já está cadastrado.";
    }
    const newMed = {
        id: 'med' + Date.now(),
        name: name,
        quantity: parseInt(quantity, 10) || 0
    };
    meds.push(newMed);
    saveMedications(meds);
    return true;
}

function updateMedicationStock(medicationId, quantityChange) {
    const meds = getMedications();
    const index = meds.findIndex(med => med.id === medicationId);
    if (index !== -1) {
        const newQuantity = meds[index].quantity + parseInt(quantityChange, 10);
        if (newQuantity < 0) {
            return "Estoque insuficiente para esta retirada.";
        }
        meds[index].quantity = newQuantity;
        saveMedications(meds);
        return true;
    }
    return "Medicamento não encontrado.";
}

function logMedicationUse(patientEmail, medicationId, quantityUsed) {
    const log = JSON.parse(localStorage.getItem(MEDICATION_LOG_KEY)) || [];
    const professional = getCurrentUser();
    const medication = getMedications().find(m => m.id === medicationId);
    const logEntry = {
        date: new Date().toISOString(),
        patientEmail: patientEmail,
        medicationName: medication ? medication.name : 'Desconhecido',
        quantityUsed: quantityUsed,
        professionalEmail: professional.email
    };
    log.unshift(logEntry);
    localStorage.setItem(MEDICATION_LOG_KEY, JSON.stringify(log));
}

function getMedicationLog() {
    return JSON.parse(localStorage.getItem(MEDICATION_LOG_KEY)) || [];
}

initializeMedications();