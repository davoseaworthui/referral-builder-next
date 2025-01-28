import { NextResponse } from 'next/server';

// Store your referrals here (this could be a database in a real app)
const referrals: { id: string; givenName: string; surname: string; email: string; phone: string; address: unknown }[] = [];

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const index = referrals.findIndex((referral) => referral.id === id);

  if (index !== -1) {
    referrals.splice(index, 1);  // Remove referral from the array
    return NextResponse.json({ message: "Referral deleted successfully" });
  } else {
    return NextResponse.json({ message: "Referral not found" }, { status: 404 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const referral = referrals.find((ref) => ref.id === id);

  if (referral) {
    return NextResponse.json(referral);
  } else {
    return NextResponse.json({ message: "Referral not found" }, { status: 404 });
  }
}
