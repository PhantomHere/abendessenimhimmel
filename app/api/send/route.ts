import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Alle Felder sind erforderlich' }, { status: 400 });
    }

    console.log('Form received:', { name, email, message });

    // TODO: add real email sending here

    return NextResponse.json({ sent: true }, { status: 200 });
  } catch (error) {
    console.error('Send error:', error);
    return NextResponse.json({ error: 'Fehler beim Senden' }, { status: 500 });
  }
}
