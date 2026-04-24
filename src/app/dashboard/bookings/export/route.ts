import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = typeof value === 'string' ? value : String(value);
  if (/[",\n\r]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function formatDate(value: unknown): string {
  if (!value) return '';
  const d = new Date(value as string);
  return isNaN(d.getTime()) ? String(value) : d.toISOString();
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('owner_id', user.id)
    .single();

  if (!business) {
    return NextResponse.json({ error: 'No business found' }, { status: 404 });
  }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, services(name)')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const headers = [
    'Booking ID',
    'Client Name',
    'Client Email',
    'Client Phone',
    'Service',
    'Booking Date',
    'Status',
    'Notes',
    'Created At',
  ];

  const rows = (bookings ?? []).map((b: Record<string, unknown>) => [
    b.id,
    b.client_name,
    b.client_email,
    b.client_phone,
    (b.services as { name?: string } | null)?.name ?? '',
    formatDate(b.booking_date),
    b.status,
    b.notes,
    formatDate(b.created_at),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(','))
    .join('\r\n');

  const ts = new Date().toISOString().slice(0, 10);
  const safeName = (business.name || 'business')
    .toString()
    .replace(/[^a-z0-9-_]+/gi, '-')
    .toLowerCase();
  const filename = `bookings-${safeName}-${ts}.csv`;

  return new NextResponse('\uFEFF' + csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
