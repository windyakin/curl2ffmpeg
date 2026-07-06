import { describe, it, expect } from 'vitest';
import FFmpegCommand from '../../src/lib/FFmpegCommand';

describe('FFmpegCommand', () => {
  it('should build a command without headers', () => {
    const command = new FFmpegCommand('https://example.com/a.m3u8', [], 'movie.mp4');
    expect(command.toString()).toBe(`ffmpeg -i 'https://example.com/a.m3u8' -c copy 'movie.mp4'`);
  });

  it('should build a command with a single header', () => {
    const command = new FFmpegCommand('https://example.com/a.m3u8', ['Referer: https://example.com/'], 'movie.mp4');
    expect(command.toString()).toBe(
      `ffmpeg -headers 'Referer: https://example.com/' -i 'https://example.com/a.m3u8' -c copy 'movie.mp4'`
    );
  });

  it('should join multiple headers with CRLF', () => {
    const command = new FFmpegCommand(
      'https://example.com/a.m3u8',
      ['User-Agent: Mozilla/5.0', 'Referer: https://example.com/'],
      'movie.mp4'
    );
    expect(command.toString()).toBe(
      `ffmpeg -headers 'User-Agent: Mozilla/5.0'$'\\r\\n''Referer: https://example.com/' -i 'https://example.com/a.m3u8' -c copy 'movie.mp4'`
    );
  });

  it('should escape single quotes in values', () => {
    const command = new FFmpegCommand('https://example.com/a.m3u8', [`Cookie: name='value'`], `it's.mp4`);
    expect(command.toString()).toBe(
      `ffmpeg -headers 'Cookie: name='\\''value'\\''' -i 'https://example.com/a.m3u8' -c copy 'it'\\''s.mp4'`
    );
  });
});
