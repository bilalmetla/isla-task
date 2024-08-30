const chai = require('chai');
const axios = require('axios');
const { expect } = chai;

const server = require('../../frameworks/express/server'); 
// Base URL for the server
const baseURL = 'http://localhost:3000'; // Adjust the port if needed

describe('API Tests with Axios', () => {
  // this.timeout(30000);

  it('should process a valid message and return patient info', async () => {
    const message = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
      EVT|TYPE|20230502112233
      PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
      DET|1|I|^^MainDepartment^101^Room 1|Common Cold
    `;

    try {
      const response = await axios.post(`${baseURL}/process-message`, message, {
        headers: { 'Content-Type': 'text/plain' }
      });

      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({
        fullName: {
          lastName: 'Smith',
          firstName: 'John',
          middleName: 'A'
        },
        dateOfBirth: '1980-01-01',
        primaryCondition: 'Common Cold'
      });

    } catch (error) {
      throw new Error(error.response ? error.response.data : error.errorMessage)
    }
  });

  it('should return an error for an invalid message', async () => {
    const message = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
      EVT|TYPE|20230502112233
      PRS|1|9876543210^^^Location^ID||||M|19800101|
      DET|1|I|^^MainDepartment^101^Room 1|
    `;

    try {
      const response = await axios.post(`${baseURL}/process-message`, message, {
        headers: { 'Content-Type': 'text/plain' }
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('errorMessage');
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.errorMessage)
    }
  });
  
  it('should retrieve all patients', async () => {
    try {
      const response = await axios.get(`${baseURL}/patients`);

      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');

    } catch (error) {
      throw new Error(error.response ? error.response.data : error.errorMessage)
    }
  });
});