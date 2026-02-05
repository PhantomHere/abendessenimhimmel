// app/api/send/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Alle Felder sind erforderlich' }, { status: 400 });
    }

    const formData = new FormData();
    formData.append('access_key', process.env.WEB3FORMS_ACCESS_KEY!);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('subject', `Neue Anfrage von ${name}`);
    formData.append('from_name', name);
    formData.append('replyto', email);

    // Optional: add hidden honeypot field forextra spam protection
    // formData.append('botcheck', ''); // leave empty in real form

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({ sent: true }, { status: 200 });
    } else {
      console.error('Web3Forms error:', result);
      return NextResponse.json({ error: 'Fehler beim Senden (Service)' }, { status: 500 });
    }
  } catch (error) {
    console.error('Send error:', error);
    return NextResponse.json({ error: 'Netzwerkfehler' }, { status: 500 });
  }
}
