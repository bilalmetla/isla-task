const PatientInfo = require('../entities/PatientInfo');
const parsePRS = require('../helpers/parsePRS');
const parseDET = require('../helpers/parseDET');
const { validateSegments } = require('../validators/messageValidator');
const logger = require('../libs/logger');
const { errorMessages } = require('../constants');
const SegtmentTypes = {PRS:'PRS',DET: 'DET'}


class MessageProcessor {
  parseMessage(message) {
    logger.info('Parsing message');

    const patientInfo = new PatientInfo();
    const segments = message.split('\n').map(line => line.trim()); // Split the message into segments
    this.validateSegments(segments);

    segments.forEach(segment => {
      if (segment.startsWith(SegtmentTypes.PRS)) {
        parsePRS(segment, patientInfo);
      } else if (segment.startsWith(SegtmentTypes.DET)) {
        parseDET(segment, patientInfo);
      }
    });

    logger.info('Message parsed successfully', patientInfo);
    return patientInfo;
  }

  validateSegments(segments) {
    const segmentCounts = {
      MSG: 0,
      EVT: 0,
      PRS: 0,
      DET: 0
    };

    segments.forEach(segment => {
      const type = segment.split('|')[0];
      if (segmentCounts.hasOwnProperty(type)) {
        segmentCounts[type]++;
      }
    });

    validateSegments(segmentCounts);
  }

  validateParsedData(data) {
    if (!data.fullName.lastName || !data.fullName.firstName) {
      throw new Error(errorMessages.INVALID_NAME);
    }
    if (!data.dateOfBirth) {
      throw new Error(errorMessages.INVALID_DATE_OF_BIRTH);
    }
    if (!data.primaryCondition) {
      throw new Error(errorMessages.INVALID_PRIMARY_CONDITION);
    }
  }

  processMessage(message) {
    try {
      const extractedData = this.parseMessage(message);
      this.validateParsedData(extractedData);
      return extractedData;
    } catch (error) {
      logger.error('Error processing message:', error.message);
      return { errorMessage: error.message }
    }
  }
}

module.exports = MessageProcessor;