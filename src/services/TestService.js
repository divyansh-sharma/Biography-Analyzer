/**
 * Sample service
 */
import decorate from 'decorate-it';

// ------------------------------------
// Exports
// ------------------------------------

const TestService = {
  testMethod,helloWorld
};

decorate(TestService, 'TestService');

export default TestService;

// ------------------------------------
// Public
// ------------------------------------

/**
 * Test method
 * @returns {{success: Boolean}} the test result
 */
async function helloWorld() {
  return await Promise.resolve({success:'Hello World ! I am nodejs !'})
} 
async function testMethod() {
  return await Promise.resolve({success: true});
}

testMethod.schema = {

};
helloWorld.schema = {

};
