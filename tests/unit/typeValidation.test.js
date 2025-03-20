// tests/unit/typeValidation.test.js
const { validateFragment } = require('../../src/utils/typeValidation');

describe('Type Validation', () => {
  test('validates JSON data correctly', async () => {
    // Valid JSON
    const validJson = Buffer.from('{"name":"test","value":123}');
    await expect(validateFragment(validJson, 'application/json')).resolves.not.toThrow();
    
    // Invalid JSON
    const invalidJson = Buffer.from('{name:"test",value:123}');
    await expect(validateFragment(invalidJson, 'application/json')).rejects.toThrow();
  });

  test('validates YAML data correctly', async () => {
    // Valid YAML
    const validYaml = Buffer.from('name: test\nvalue: 123');
    await expect(validateFragment(validYaml, 'application/yaml')).resolves.not.toThrow();
    await expect(validateFragment(validYaml, 'application/yml')).resolves.not.toThrow();
    
    // Invalid YAML
    const invalidYaml = Buffer.from('name: test\nvalue: : 123');
    await expect(validateFragment(invalidYaml, 'application/yaml')).rejects.toThrow();
  });

  test('validates text data correctly', async () => {
    // Valid text (any buffer is valid text)
    const validText = Buffer.from('This is plain text');
    await expect(validateFragment(validText, 'text/plain')).resolves.not.toThrow();
    
    // Invalid (non-buffer) text
    await expect(validateFragment('string instead of buffer', 'text/plain')).rejects.toThrow();
    await expect(validateFragment(null, 'text/plain')).rejects.toThrow();
  });

  
});