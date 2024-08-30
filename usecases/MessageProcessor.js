const PatientInfo = require('../entities/PatientInfo');

class MessageProcessor {
  parseMessage(message) {
    const lines = message.trim().split('\n');
    const patientInfo = new PatientInfo();

    lines.forEach(line => {
      const segments = line.trim().split('|');
      switch (segments[0]) {
        case 'PRS':
          const nameComponents = segments[4].split('^');
          patientInfo.fullName.lastName = nameComponents[0] || '';
          patientInfo.fullName.firstName = nameComponents[1] || '';
          patientInfo.fullName.middleName = nameComponents[2] || '';
          patientInfo.dateOfBirth = this.formatDate(segments[8]);
          break;
        case 'DET':
          patientInfo.primaryCondition = segments[4] || '';
          break;
        default:
          break;
      }
    });

    return patientInfo;
  }

 

  validateData(data) {
    if (!data.fullName.lastName || !data.fullName.firstName) {
      throw new Error('Invalid name data');
    }
    if (!data.dateOfBirth) {
      throw new Error('Invalid date of birth');
    }
    if (!data.primaryCondition) {
      throw new Error('Invalid primary condition');
    }
  }

  processMessage(message) {
    try {
      const extractedData = this.parseMessage(message);
      this.validateData(extractedData);
      return extractedData;
    } catch (error) {
      console.error('Error processing message:', error.message);
      return error
    }
  }
}

module.exports = MessageProcessor;