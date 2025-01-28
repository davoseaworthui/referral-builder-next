import { NextResponse } from 'next/server';

// Store your referrals (this could be a database in a real app)
const referrals: { id: string; givenName: string; surname: string; email: string; phone: string; address: unknown }[] = [];

export async function GET() {
  return NextResponse.json(referrals);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newReferral = { ...data, id: Date.now().toString() };  // Assigning a simple unique ID
  referrals.push(newReferral);
  return NextResponse.json(newReferral, { status: 201 });
}
