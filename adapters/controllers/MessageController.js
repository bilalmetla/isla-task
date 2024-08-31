const MessageProcessor = require('../../usecases/MessageProcessor');
const PatientRepository = require('../repositories/InPatientRepository');
const logger = require('../../libs/logger');
const { errorMessages, responseStatusCodes } = require('../../constants');

class MessageController {
  constructor() {
    this.messageProcessor = new MessageProcessor();
    this.patientRepository = new PatientRepository();
  }

  processMessage(req, res) {
    try {
      const message = req.body;
      const result = this.messageProcessor.processMessage(message);

      if (result) {
        
        this.patientRepository.addPatient(result);
        res.status(responseStatusCodes.SUCCESS).json(result);
      } else {
        res.status(responseStatusCodes.BAD_REQUEST).json({ error: errorMessages.INVALID_MESSAHE_FORMAT });
      }

    } catch (error) {
      logger.error(error)
      res.status(responseStatusCodes.BAD_REQUEST).json({ error: errorMessages.INTERNAL_SERVER_ERROR });
    }
    
  }

  getAllPatients(req, res) {
    try {

      const patients = this.patientRepository.getAllPatients();
      res.status(responseStatusCodes.SUCCESS).json(patients);

    } catch (error) {
      logger.error(error)
      res.status(responseStatusCodes.BAD_REQUEST).json({ error: errorMessages.INTERNAL_SERVER_ERROR });
    }
   
  }
}

module.exports = MessageController;