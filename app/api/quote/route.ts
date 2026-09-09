import {NextResponse} from 'next/server';

type QuotePayload = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  product?: string;
  website?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: QuotePayload;
  try {
    payload = await request.json() as QuotePayload;
  } catch {
    return NextResponse.json({error: 'Invalid request.'}, {status: 400});
  }

  if (payload.website) return NextResponse.json({ok: true});
  if (!payload.name?.trim() || !payload.email || !emailPattern.test(payload.email) || !payload.message?.trim()) {
    return NextResponse.json({error: 'Name, email and message are required.'}, {status: 400});
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !recipient || !sender) {
    return NextResponse.json({error: 'Contact service is not configured yet.'}, {status: 503});
  }

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}`},
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: payload.email,
      subject: `LOGX quotation request${payload.product ? `: ${payload.product}` : ''}`,
      text: [`Name: ${payload.name}`, `Email: ${payload.email}`, `Company: ${payload.company || 'Not provided'}`, `Product: ${payload.product || 'General enquiry'}`, '', payload.message].join('\n')
    })
  });

  if (!emailResponse.ok) return NextResponse.json({error: 'Unable to send your request right now.'}, {status: 502});
  return NextResponse.json({ok: true});
}