
module.exports = (segment, patientInfo) => {
    // Extract the primary condition from DET
    const primaryCondition = segment.split('|')[4] || '';
    patientInfo.primaryCondition = primaryCondition;
}
  