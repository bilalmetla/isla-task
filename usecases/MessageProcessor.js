const Joi = require('joi');

const PatientInfo = require('../entities/PatientInfo');
const parsePRS = require('../helpers/parsePRS');
const parseDET = require('../helpers/parseDET');



class MessageProcessor {
 
  parseMessage(message) {
    const patientInfo = new PatientInfo();

    // Split the message into segments
    const segments = message.split('\n').map(line => line.trim());
    this.validateSegments(segments);

    segments.forEach(segment => {
      if (segment.startsWith('PRS')) {
        parsePRS(segment, patientInfo);
      } else if (segment.startsWith('DET')) {
        parseDET(segment, patientInfo);
      }
    });

    return patientInfo;
  }

  validateSegments = (segments) => {
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

    const schema = Joi.object({
      MSG: Joi.number().valid(1).required(),
      EVT: Joi.number().valid(1).required(),
      PRS: Joi.number().valid(1).required(),
      DET: Joi.number().valid(1).required()
    });

    const { error } = schema.validate(segmentCounts);
    if (error) {
      throw new Error('Message must contain exactly one of each segment: MSG, EVT, PRS, DET');
    }
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
      console.error('Error processing message:', error.message);
      return { errorMessage: error.message }
    }
  }
}

module.exports = MessageProcessor;