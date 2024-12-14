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
});
