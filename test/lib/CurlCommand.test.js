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
    const command = new CurlCommand(`curl -X GET -x 'http://proxy.example.com:8080/' 'https://example.com/a.m3u8'`);
    expect(command.url).toBe('https://example.com/a.m3u8');
    expect(command.headers).toEqual([]);
  });

  it('should convert -b to a Cookie header', () => {
    const command = new CurlCommand(`curl 'https://example.com/a.m3u8' -b 'session=abc123; user=windyakin'`);
    expect(command.url).toBe('https://example.com/a.m3u8');
    expect(command.headers).toEqual(['Cookie: session=abc123; user=windyakin']);
  });

  it('should merge multiple cookie options into one Cookie header', () => {
    const command = new CurlCommand(`curl 'https://example.com/a.m3u8' --cookie 'a=1' --cookie=b=2`);
    expect(command.url).toBe('https://example.com/a.m3u8');
    expect(command.headers).toEqual(['Cookie: a=1; b=2']);
  });

  it('should ignore -b with a cookie jar filename', () => {
    const command = new CurlCommand(`curl 'https://example.com/a.m3u8' -b cookies.txt`);
    expect(command.url).toBe('https://example.com/a.m3u8');
    expect(command.headers).toEqual([]);
  });

  it('should convert -e to a Referer header', () => {
    const command = new CurlCommand(`curl 'https://example.com/a.m3u8' -e 'https://referrer.example.com/'`);
    expect(command.url).toBe('https://example.com/a.m3u8');
    expect(command.headers).toEqual(['Referer: https://referrer.example.com/']);
  });

  it('should strip the ;auto suffix from -e values', () => {
    const command = new CurlCommand(`curl 'https://example.com/a.m3u8' -e 'https://referrer.example.com/;auto'`);
    expect(command.headers).toEqual(['Referer: https://referrer.example.com/']);
    const autoOnly = new CurlCommand(`curl 'https://example.com/a.m3u8' -e ';auto'`);
    expect(autoOnly.headers).toEqual([]);
  });

  it('should convert -A to a User-Agent header, last option winning', () => {
    const command = new CurlCommand(`curl 'https://example.com/a.m3u8' -A 'Mozilla/5.0' --user-agent 'Mozilla/5.0 (Macintosh)'`);
    expect(command.url).toBe('https://example.com/a.m3u8');
    expect(command.headers).toEqual(['User-Agent: Mozilla/5.0 (Macintosh)']);
  });

  it('should prefer -H headers over option-derived headers', () => {
    const command = new CurlCommand(`curl 'https://example.com/a.m3u8' -H 'Cookie: from_h=1' -b 'from_b=2'`);
    expect(command.headers).toEqual(['Cookie: from_h=1']);
    const caseInsensitive = new CurlCommand(`curl 'https://example.com/a.m3u8' -H 'user-agent: CustomUA' -A 'Mozilla/5.0'`);
    expect(caseInsensitive.headers).toEqual(['user-agent: CustomUA']);
  });

  it('should parse a Chrome-style command with -b and -H together', () => {
    const command = new CurlCommand(`curl 'https://example.com/a.m3u8' \\
  -H 'Referer: https://example.com/' \\
  -b 'session=abc123' \\
  -H 'User-Agent: Mozilla/5.0'`);
    expect(command.url).toBe('https://example.com/a.m3u8');
    expect(command.headers).toEqual([
      'Referer: https://example.com/',
      'User-Agent: Mozilla/5.0',
      'Cookie: session=abc123',
    ]);
  });

  it('should unquote shell quote concatenation inside header values', () => {
    const command = new CurlCommand(`curl -H 'X-Test: it'"'"'s ok' https://example.com`);
    expect(command.url).toBe('https://example.com');
    expect(command.headers).toEqual([`X-Test: it's ok`]);
  });
});
