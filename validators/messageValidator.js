// validators/messageValidator.js
const Joi = require('joi');

const segmentSchema = Joi.object({
  MSG: Joi.number().valid(1).required(),
  EVT: Joi.number().valid(1).required(),
  PRS: Joi.number().valid(1).required(),
  DET: Joi.number().valid(1).required()
});

function validateSegments(segmentCounts) {
  const { error } = segmentSchema.validate(segmentCounts);
  if (error) {
    throw new Error('Message must contain exactly one of each segment: MSG, EVT, PRS, DET');
  }
}

module.exports = {
  validateSegments
};