const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../frameworks/express/server'); // Adjust the path if needed
const { expect } = chai;

chai.use(chaiHttp);

describe('API Tests', () => {
  it('should process a valid message and return patient info', (done) => {
    const message = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
      EVT|TYPE|20230502112233
      PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
      DET|1|I|^^MainDepartment^101^Room 1|Common Cold
    `;

    chai.request(server)
      .post('/process-message')
      .send(message)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
          fullName: {
            lastName: 'Smith',
            firstName: 'John',
            middleName: 'A'
          },
          dateOfBirth: '1980-01-01',
          primaryCondition: 'Common Cold'
        });
        done();
      });
  });

  it('should return an error for an invalid message', (done) => {
    const message = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
      EVT|TYPE|20230502112233
      PRS|1|9876543210^^^Location^ID||||M|19800101|
      DET|1|I|^^MainDepartment^101^Room 1|
    `;

    chai.request(server)
      .post('/process-message')
      .send(message)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should retrieve all patients', (done) => {
    chai.request(server)
      .get('/patients')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});