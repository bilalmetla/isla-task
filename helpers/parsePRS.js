

const formatDate = require('./formatDate')

module.exports = (segment, patientInfo) => {
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
    patientInfo.dateOfBirth = formatDate(dob);
}
  