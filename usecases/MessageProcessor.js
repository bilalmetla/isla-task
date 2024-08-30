const PatientInfo = require('../entities/PatientInfo');
const parsePRS = require('../helpers/parsePRS');
const parseDET = require('../helpers/parseDET');
const { validateSegments } = require('../validators/messageValidator');
const logger = require('../libs/logger');



class MessageProcessor {
  parseMessage(message) {
    logger.info('Parsing message');

    const patientInfo = new PatientInfo();
    const segments = message.split('\n').map(line => line.trim()); // Split the message into segments
    this.validateSegments(segments);

    segments.forEach(segment => {
      if (segment.startsWith('PRS')) {
        parsePRS(segment, patientInfo);
      } else if (segment.startsWith('DET')) {
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
      this.validateParsedData(extractedData);
      return extractedData;
    } catch (error) {
      logger.error('Error processing message:', error.message);
      return { errorMessage: error.message }
    }
  }
}

module.exports = MessageProcessor;