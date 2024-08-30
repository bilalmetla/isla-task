class PatientInfo {
    constructor(lastName = '', firstName = '', middleName = '', dateOfBirth = '', primaryCondition = '') {
      this.fullName = {
        lastName,
        firstName,
        middleName
      };
      this.dateOfBirth = dateOfBirth;
      this.primaryCondition = primaryCondition;
    }
  }
  
  module.exports = PatientInfo;