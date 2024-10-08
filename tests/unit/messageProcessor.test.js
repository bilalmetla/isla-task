const { expect } = require('chai');
// const assert = require('chai').assert;

const MessageProcessor = require('../../usecases/MessageProcessor');

describe('MessageProcessor', () => {
  let messageProcessor;

  beforeEach(() => {
    messageProcessor = new MessageProcessor();
  });

  it('should parse a valid message and return patient info', () => {
    const message = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
      EVT|TYPE|20230502112233
      PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
      DET|1|I|^^MainDepartment^101^Room 1|Common Cold
    `;

    const expectedOutput = {
      fullName: {
        lastName: 'Smith',
        firstName: 'John',
        middleName: 'A'
      },
      dateOfBirth: '1980-01-01',
      primaryCondition: 'Common Cold'
    };

      const result = messageProcessor.processMessage(message);
      expect(result).to.deep.equal(expectedOutput);
    //   console.log('Actual Result:', result);
    //   console.log('Expected Output:', expectedOutput);
    //   assert.deepEqual(result, expectedOutput, 'The result does not match the expected output');

  });
    
  it('should throw an error for invalid date format', () => {
    const message = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
      EVT|TYPE|20230502112233
      PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|198001
      DET|1|I|^^MainDepartment^101^Room 1|Common Cold
    `;
      let result = messageProcessor.processMessage(message);
    
    expect(result.errorMessage).to.equal('Invalid date format');
  });
    
  it('should throw an error for missing patient name', () => {
    const message = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
      EVT|TYPE|20230502112233
      PRS|1|9876543210^^^Location^ID||||M|19800101|
      DET|1|I|^^MainDepartment^101^Room 1|Common Cold
    `;
      let result =  messageProcessor.processMessage(message)
     
    expect(result.errorMessage).to.equal('Invalid name data');
  });

  it('should throw an error for missing primary condition', () => {
    const message = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
      EVT|TYPE|20230502112233
      PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
      DET|1|I|^^MainDepartment^101^Room 1|
    `;

      let result = messageProcessor.processMessage(message);
      
    expect(result.errorMessage).to.equal('Invalid primary condition');
  });

  it('should throw an error if there are multiple MSG segments', () => {
    const message = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233
      EVT|TYPE|20230502112233
      PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
      DET|1|I|^^MainDepartment^101^Room 1|Common Cold
    `;

    expect(() => messageProcessor.parseMessage(message)).to.throw('Message must contain exactly one of each segment: MSG, EVT, PRS, DET');
  });

  it('should throw an error if there are missing segments', () => {
    const message = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233
      PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
    `;

    expect(() => messageProcessor.parseMessage(message)).to.throw('Message must contain exactly one of each segment: MSG, EVT, PRS, DET');
  });
  

  it('should process a message with additional segments without errors', () => {
    const message = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233
      ADD|1|Some additional data
      EVT|TYPE|20230502112233
      PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
      ADD|2|More additional data
      DET|1|I|^^MainDepartment^101^Room 1|Common Cold
      ADD|3|Even more additional data
    `;

    const result = messageProcessor.parseMessage(message);

    expect(result).to.deep.equal({
      fullName: {
        lastName: 'Smith',
        firstName: 'John',
        middleName: 'A'
      },
      dateOfBirth: '1980-01-01',
      primaryCondition: 'Common Cold'
    });
  });


  it('should handle missing fields by setting them to empty', () => {
    const message = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233
      EVT|TYPE|20230502112233
      PRS|1|9876543210^^^Location^ID||Smith^John|||M|19800101|
      DET|1|I|^^MainDepartment^101^Room 1|
    `;

    const result = messageProcessor.parseMessage(message);

    expect(result).to.deep.equal({
      fullName: {
        lastName: 'Smith',
        firstName: 'John',
        middleName: '' // Middle name is missing and should be an empty string
      },
      dateOfBirth: '1980-01-01',
      primaryCondition: '' // Primary condition is missing and should be an empty string
    });
  });

  it('should handle segments and fields with and without trailing pipes', () => {
    const messageWithTrailingPipes = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233|
      EVT|TYPE|20230502112233|
      PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
      DET|1|I|^^MainDepartment^101^Room 1|Common Cold|
    `;

    const messageWithoutTrailingPipes = `
      MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233
      EVT|TYPE|20230502112233
      PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101
      DET|1|I|^^MainDepartment^101^Room 1|Common Cold
    `;

    const expectedOutput = {
      fullName: {
        lastName: 'Smith',
        firstName: 'John',
        middleName: 'A'
      },
      dateOfBirth: '1980-01-01',
      primaryCondition: 'Common Cold'
    };

    const resultWithTrailingPipes = messageProcessor.parseMessage(messageWithTrailingPipes);
    const resultWithoutTrailingPipes = messageProcessor.parseMessage(messageWithoutTrailingPipes);

    expect(resultWithTrailingPipes).to.deep.equal(expectedOutput);
    expect(resultWithoutTrailingPipes).to.deep.equal(expectedOutput);
  });

  
});