// tests/unit/converter.test.js

const { convert, convertMarkdownToHtml } = require('../../src/converter');

describe('Converter module', () => {
  describe('convert()', () => {
    test('returns the same data if source and target types are the same', async () => {
      const data = Buffer.from('Hello, World!');
      const result = await convert(data, 'text/plain', 'text/plain');
      expect(result).toEqual(data);
    });
    
    test('converts markdown to HTML', async () => {
      const markdown = Buffer.from('# Heading\n\nParagraph text.');
      const result = await convert(markdown, 'text/markdown', 'text/html');
      expect(result.toString()).toContain('<h1>Heading</h1>');
      expect(result.toString()).toContain('<p>Paragraph text.</p>');
    });
    
    test('converts plain text to HTML', async () => {
      const text = Buffer.from('Plain text content');
      const result = await convert(text, 'text/plain', 'text/html');
      expect(result.toString()).toContain('<pre>Plain text content</pre>');
    });
    
    test('converts text/* to plain text', async () => {
      const html = Buffer.from('<p>HTML content</p>');
      const result = await convert(html, 'text/html', 'text/plain');
      expect(result.toString()).toBe('<p>HTML content</p>');
    });
    
    test('converts JSON to plain text', async () => {
      const json = Buffer.from('{"key": "value"}');
      const result = await convert(json, 'application/json', 'text/plain');
      expect(result.toString()).toBe('{"key": "value"}');
    });
    
    test('throws error for unsupported conversion', async () => {
      const data = Buffer.from('test data');
      await expect(async () => {
        await convert(data, 'image/png', 'application/pdf');
      }).rejects.toThrow('Unsupported conversion');
    });

    test('throws error for missing parameters', async () => {
      await expect(async () => {
        await convert();
      }).rejects.toThrow('Missing required parameters');
    });
  });
  
  describe('convertMarkdownToHtml()', () => {
    test('converts headings properly', () => {
      const md = Buffer.from('# Heading 1\n## Heading 2\n### Heading 3');
      const result = convertMarkdownToHtml(md);
      expect(result.toString()).toContain('<h1>Heading 1</h1>');
      expect(result.toString()).toContain('<h2>Heading 2</h2>');
      expect(result.toString()).toContain('<h3>Heading 3</h3>');
    });
    
    test('converts paragraphs properly', () => {
      const md = Buffer.from('First paragraph.\n\nSecond paragraph.');
      const result = convertMarkdownToHtml(md);
      expect(result.toString()).toContain('<p>First paragraph.</p>');
      expect(result.toString()).toContain('<p>Second paragraph.</p>');
    });
    
    test('handles empty lines between paragraphs', () => {
      const md = Buffer.from('Para 1.\n\n\nPara 2.');
      const result = convertMarkdownToHtml(md);
      expect(result.toString()).toMatch(/<p>Para 1\.<\/p>\s+<p>Para 2\.<\/p>/);
    });
  });
});