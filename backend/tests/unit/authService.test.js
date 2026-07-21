const authService = require('../../src/services/authService');

describe('Auth Service', () => {
  describe('Password Hashing', () => {
    it('should produce a different string than the input', async () => {
      const plaintext = 'password123';
      const hash = await authService.hashPassword(plaintext);
      expect(hash).not.toBe(plaintext);
      expect(hash).toBeDefined();
    });

    it('should return true for a correct password comparison', async () => {
      const plaintext = 'password123';
      const hash = await authService.hashPassword(plaintext);
      const isMatch = await authService.comparePassword(plaintext, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false for a wrong password comparison', async () => {
      const plaintext = 'password123';
      const hash = await authService.hashPassword(plaintext);
      const isMatch = await authService.comparePassword('wrongpassword', hash);
      expect(isMatch).toBe(false);
    });
  });
});
