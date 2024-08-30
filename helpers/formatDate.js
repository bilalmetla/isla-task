
const { errorMessages } = require('../constants');


module.exports = (dateString) => {
    if (!dateString || dateString.length !== 8) {
      throw new Error(errorMessages.INVALID_DATE_FORMAT);
    }
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
}
  