import { describe, it, expect } from 'vitest';
import randomFilename from '../../src/lib/RandomFilename';

describe('randomFilename', () => {
  it('should join three nouns with hyphens and add .mp4 by default', () => {
    expect(randomFilename()).toMatch(/^[a-z]+-[a-z]+-[a-z]+\.mp4$/);
  });

  it('should respect count and extension options', () => {
    expect(randomFilename({ count: 2, extension: 'mkv' })).toMatch(/^[a-z]+-[a-z]+\.mkv$/);
  });

  it('should pick words using the given random function', () => {
    expect(randomFilename({ random: () => 0 })).toBe('apple-apple-apple.mp4');
  });
});
