// Stripe webhooks removed. This platform uses manual payments via GCash, PayMaya, and Bank Transfer.
// Business owners configure their payment details in the dashboard under Settings > Payment Settings.
// After a booking is submitted, clients see the payment instructions automatically.

import { NextResponse } from 'next/server';

export async function POST() {
  return new NextResponse('Stripe webhooks are disabled. Manual payments are used instead.', { status: 410 });
}
