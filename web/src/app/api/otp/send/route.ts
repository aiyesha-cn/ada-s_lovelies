import { NextRequest, NextResponse } from 'next/server';
import { sendOtp } from '@/lib/otp';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }
    await sendOtp(phone);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('OTP send error:', err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}