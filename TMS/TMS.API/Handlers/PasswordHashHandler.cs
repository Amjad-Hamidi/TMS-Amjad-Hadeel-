/*
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;

namespace TMS.API.Handlers
{
    public class PasswordHashHandler
    {
        public static int _iterationCount = 100000;
        private static RandomNumberGenerator _randomNumberGenerator = RandomNumberGenerator.Create();

        public static string HashPassword(string password)
        {
            int saltSize = 128 / 8;
            var salt = new byte[saltSize];
            _randomNumberGenerator.GetBytes(salt);
            var subKey = KeyDerivation.Pbkdf2(password, salt, KeyDerivationPrf.HMACSHA512, _iterationCount, 256 / 8);

            var outputBytes = new byte[13 + saltSize + subKey.Length];
            outputBytes[0] = 0x01;
            WriteNetworkByteOrder(outputBytes, 1, (uint)KeyDerivationPrf.HMACSHA512);
            WriteNetworkByteOrder(outputBytes, 5, (uint)_iterationCount);
            WriteNetworkByteOrder(outputBytes, 9, (uint)saltSize);
            Buffer.BlockCopy(salt, 0, outputBytes, 13, salt.Length);
            Buffer.BlockCopy(subKey, 0, outputBytes, 13 + saltSize, subKey.Length);

            return Convert.ToBase64String(outputBytes);
        }

        public static bool VerifyPassword(string password, string hash)
        {
            try
            {
                var hashedPassword = Convert.FromBase64String(hash);
                var keyDerivatePrf = (KeyDerivationPrf)ReadNetworkByteOrder(hashedPassword, 1);
                var iterationCount = (int)ReadNetworkByteOrder(hashedPassword, 5);
                var saltLength = (int)ReadNetworkByteOrder(hashedPassword, 9);

                if (saltLength < 128 / 8) return false;

                var salt = new byte[saltLength];
                Buffer.BlockCopy(hashedPassword, 13, salt, 0, salt.Length);
                var storedSubKey = new byte[hashedPassword.Length - 13 - saltLength];
                Buffer.BlockCopy(hashedPassword, 13 + saltLength, storedSubKey, 0, storedSubKey.Length);

                var generatedSubKey = KeyDerivation.Pbkdf2(password, salt, keyDerivatePrf, iterationCount, storedSubKey.Length);

                return storedSubKey.SequenceEqual(generatedSubKey);
            }
            catch
            {
                return false;
            }
        }

        private static void WriteNetworkByteOrder(byte[] buffer, int offset, uint value)
        {
            buffer[offset] = (byte)(value >> 24);
            buffer[offset + 1] = (byte)(value >> 16);
            buffer[offset + 2] = (byte)(value >> 8);
            buffer[offset + 3] = (byte)value;
        }

        private static uint ReadNetworkByteOrder(byte[] buffer, int offset)
        {
            return ((uint)buffer[offset] << 24)
                | ((uint)buffer[offset + 1] << 16)
                | ((uint)buffer[offset + 2] << 8)
                | buffer[offset + 3];
        }
    }
}

*/