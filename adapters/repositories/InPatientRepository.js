class PatientRepository {
    constructor() {
      // In-memory data store
      this.patients = [];
    }
  
    // Method to add a patient to the store
    addPatient(patientInfo) {
      this.patients.push(patientInfo);
      return patientInfo;
    }
  
    // Method to retrieve all patients
    getAllPatients() {
      return this.patients;
    }
  
    // Method to find a patient by full name
    findPatientByName(lastName, firstName) {
      return this.patients.find(patient =>
        patient.fullName.lastName === lastName &&
        patient.fullName.firstName === firstName
      );
    }
  }
  
  module.exports = PatientRepository;