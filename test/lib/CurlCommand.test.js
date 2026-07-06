import { describe, it, expect } from 'vitest';
import CurlCommand from '../../src/lib/CurlCommand';

// src/lib/CurlCommand.test.js

describe('CurlCommand', () => {
  it('should parse the URL correctly', () => {
    const command = new CurlCommand('curl https://example.com');
    expect(command.url).toBe('https://example.com');
  });

  it('should parse headers correctly', () => {
    const command = new CurlCommand('curl -H "Content-Type: application/json" https://example.com');
    expect(command.url).toBe('https://example.com');
    expect(command.headers).toEqual(['Content-Type: application/json']);
  });

  it('should handle commands without headers', () => {
    const command = new CurlCommand('curl https://example.com');
    expect(command.url).toBe('https://example.com');
    expect(command.headers).toEqual([]);
  });

  it('should parse headers with single quotes correctly', () => {
    const command = new CurlCommand(`curl -H 'Content-Type: application/json' https://example.com`);
    expect(command.url).toBe('https://example.com');
    expect(command.headers).toEqual(['Content-Type: application/json']);
  });

  it('should parse multiple headers correctly', () => {
    const command = new CurlCommand(`curl -H "Content-Type: application/json" -H "Authorization: Bearer token" https://example.com`);
    expect(command.url).toBe('https://example.com');
    expect(command.headers).toEqual(['Content-Type: application/json', 'Authorization: Bearer token']);
  });

  it('should handle headers with spaces correctly', () => {
    const command = new CurlCommand('curl -H "X-Custom-Header: value with spaces" https://example.com');
    expect(command.url).toBe('https://example.com');
    expect(command.headers).toEqual(['X-Custom-Header: value with spaces']);
  });

  it('should parse headers with mixed quotes correctly', () => {
    const command = new CurlCommand(`curl -H "Content-Type: application/json" -H 'Authorization: Bearer token' https://example.com`);
    expect(command.url).toBe('https://example.com');
    expect(command.headers).toEqual(['Content-Type: application/json', 'Authorization: Bearer token']);
  });

  it('should parse quoted headers without spaces in the value', () => {
    const command = new CurlCommand(`curl -H 'DNT:1' -H "Connection:keep-alive" https://example.com`);
    expect(command.url).toBe('https://example.com');
    expect(command.headers).toEqual(['DNT:1', 'Connection:keep-alive']);
  });

  it('should parse unquoted headers', () => {
    const command = new CurlCommand('curl -H Accept:application/json https://example.com');
    expect(command.url).toBe('https://example.com');
    expect(command.headers).toEqual(['Accept:application/json']);
  });

  it('should parse --header long option', () => {
    const command = new CurlCommand(`curl 'https://example.com/a.m3u8' --header 'Referer: https://example.com/'`);
    expect(command.url).toBe('https://example.com/a.m3u8');
    expect(command.headers).toEqual(['Referer: https://example.com/']);
  });

  it('should parse -H with an attached value', () => {
    const command = new CurlCommand(`curl -H'Accept: */*' https://example.com`);
    expect(command.url).toBe('https://example.com');
    expect(command.headers).toEqual(['Accept: */*']);
  });

  it('should not overwrite the URL with a URL inside a header value', () => {
    const command = new CurlCommand(`curl 'https://example.com/a.m3u8' -H 'Referer: https://example.com/' -e 'https://example.com/other'`);
    expect(command.url).toBe('https://example.com/a.m3u8');
    expect(command.headers).toEqual(['Referer: https://example.com/']);
  });

  it('should parse commands with backslash-newline continuations', () => {
    const command = new CurlCommand(`curl 'https://example.com/a.m3u8' \\
  -H 'Accept: */*' \\
  -H 'Referer: https://example.com/' \\
  --compressed`);
    expect(command.url).toBe('https://example.com/a.m3u8');
    expect(command.headers).toEqual(['Accept: */*', 'Referer: https://example.com/']);
  });

  it('should skip values of other value-taking options', () => {
    const command = new CurlCommand(`curl -X GET -b 'key=value' -A 'Mozilla/5.0' 'https://example.com/a.m3u8'`);
    expect(command.url).toBe('https://example.com/a.m3u8');
    expect(command.headers).toEqual([]);
  });

  it('should unquote shell quote concatenation inside header values', () => {
    const command = new CurlCommand(`curl -H 'X-Test: it'"'"'s ok' https://example.com`);
    expect(command.url).toBe('https://example.com');
    expect(command.headers).toEqual([`X-Test: it's ok`]);
  });
});
