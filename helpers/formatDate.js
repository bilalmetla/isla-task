

module.exports = (dateString) => {
    if (!dateString || dateString.length !== 8) {
      throw new Error('Invalid date format');
    }
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
}
  