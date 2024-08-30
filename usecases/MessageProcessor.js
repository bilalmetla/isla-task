const PatientInfo = require('../entities/PatientInfo');

class MessageProcessor {
 
  parseMessage(message) {
    const patientInfo = new PatientInfo();

    // Split the message into segments
    const segments = message.split('\n').map(line => line.trim());

    segments.forEach(segment => {
      if (segment.startsWith('PRS')) {
        this.parsePRS(segment, patientInfo);
      } else if (segment.startsWith('DET')) {
        this.parseDET(segment, patientInfo);
      }
    });

    return patientInfo;
  }

  parsePRS(segment, patientInfo) {
    // Extract the name from PRS to |M|
    const namePart = segment.split('|M|')[0];
    const nameComponents = namePart.split('|')[4].split('^');
    patientInfo.fullName = {
      lastName: nameComponents[0] || '',
      firstName: nameComponents[1] || '',
      middleName: nameComponents[2] || ''
    };

    // Extract the date of birth from |M| to DET
    const dobPart = segment.split('|M|')[1];
    const dob = dobPart.split('|')[0];
    patientInfo.dateOfBirth = this.formatDate(dob);
  }

  parseDET(segment, patientInfo) {
    // Extract the primary condition from DET
    const primaryCondition = segment.split('|')[4] || '';
    patientInfo.primaryCondition = primaryCondition;
  }
  
  formatDate(dateString) {
    if (!dateString || dateString.length !== 8) {
      throw new Error('Invalid date format');
    }
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
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
      return { errorMessage: error.message }
    }
  }
}

module.exports = MessageProcessor;