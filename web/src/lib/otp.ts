import crypto from 'crypto';
import { prisma } from '@/lib/prisma'; // adjust to your actual prisma client path

const SEMAPHORE_API_KEY = process.env.SEMAPHORE_API_KEY!;
const SEMAPHORE_SENDER_NAME = process.env.SEMAPHORE_SENDER_NAME || 'SEMAPHORE';
const OTP_TTL_MS = 5 * 60 * 1000; // 5 min
const MAX_ATTEMPTS = 5;

function hashCode(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

function normalizePhone(phone: string) {
  // Semaphore expects local PH format e.g. 09171234567
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('63') ? '0' + digits.slice(2) : digits;
}

export async function sendOtp(rawPhone: string) {
  const phone = normalizePhone(rawPhone);
  const code = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV OTP] Code for ${phone}: ${code}`);

    await prisma.otpVerification.create({
      data: {
        phone,
        codeHash: hashCode(code),
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
      },
    });

    return { messageId: 'dev-mode', devCode: code };
  }

  // --- real Semaphore send below, unchanged ---
  const res = await fetch('https://api.semaphore.co/api/v4/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      apikey: SEMAPHORE_API_KEY,
      number: phone,
      message: 'Your STELLA Vault verification code is {otp}. Valid for 5 minutes.',
      sender_name: SEMAPHORE_SENDER_NAME,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error('Semaphore error response:', errBody);
    throw new Error(`Semaphore request failed: ${res.status} - ${errBody}`);
  }

  const data = await res.json();
  const entry = Array.isArray(data) ? data[0] : data;
  const code2 = entry?.code;
  if (!code2) throw new Error('Semaphore did not return an OTP code');

  await prisma.otpVerification.create({
    data: {
      phone,
      codeHash: hashCode(String(code2)),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  return { messageId: entry?.message_id };
}

export async function verifyOtp(rawPhone: string, submittedCode: string) {
  const phone = normalizePhone(rawPhone);

  const record = await prisma.otpVerification.findFirst({
    where: { phone },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) return { ok: false, reason: 'no_code_sent' as const };
  if (record.expiresAt < new Date()) return { ok: false, reason: 'expired' as const };
  if (record.attempts >= MAX_ATTEMPTS) return { ok: false, reason: 'too_many_attempts' as const };

  const match = record.codeHash === hashCode(submittedCode);

  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { attempts: { increment: 1 } },
  });

  if (!match) return { ok: false, reason: 'incorrect' as const };

  // consume it so it can't be reused
  await prisma.otpVerification.delete({ where: { id: record.id } });

  return { ok: true as const };
}