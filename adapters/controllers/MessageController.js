const MessageProcessor = require('../../usecases/MessageProcessor');
const PatientRepository = require('../repositories/InPatientRepository');

class MessageController {
  constructor() {
    this.messageProcessor = new MessageProcessor();
    this.patientRepository = new PatientRepository();
  }

  processMessage(req, res) {
    const message = req.body;
    const result = this.messageProcessor.processMessage(message);

    if (result) {
      // Store the processed patient information
      this.patientRepository.addPatient(result);
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: 'Invalid message format' });
    }
  }

  getAllPatients(req, res) {
    const patients = this.patientRepository.getAllPatients();
    res.status(200).json(patients);
  }
}

module.exports = MessageController;