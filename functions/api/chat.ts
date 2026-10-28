// Cloudflare Pages Function: /api/chat

export async function onRequestPost(context: { request: Request }) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body: any = await context.request.json();
    const userMsg = body.userMessage || (body.messages && body.messages[body.messages.length - 1]?.content) || '';
    const norm = (userMsg || '').toLowerCase();

    let reply = "Hello! Ken'nyzhae Nathaniel (\"Passport Nanny\") is 24/7 on-call for premier childcare, travel accompaniment, and hair styling. How can I assist your family today?";

    if (norm.includes('price') || norm.includes('rate') || norm.includes('cost') || norm.includes('how much')) {
      reply = "Our rates: Nanny Services start at $30/hr (+ $5/hr per additional child, 4 hr minimum). On-call babysitting is $25/hr. Passport Travel Nanny is $35/hr. Loc wash, retwist & style starts at $50, and freestyle braids start at $100. Call or text 305-409-6788 anytime!";
    } else if (norm.includes('travel') || norm.includes('flight') || norm.includes('passport') || norm.includes('hotel') || norm.includes('cruise')) {
      reply = "Passport Nanny provides door-to-door domestic and international travel accompaniment! Ken'nyzhae assists through airport security, in-flight activities, hotel care, and resort supervision. Book early for upcoming holiday and travel dates.";
    } else if (norm.includes('loc') || norm.includes('braid') || norm.includes('hair') || norm.includes('retwist')) {
      reply = "Ken'nyzhae is a skilled loctician and braider! Loc wash, retwist & style starts at $50 (includes clarifying wash, deep conditioning, palm rolling, and scalp oil). Freestyle braids are $100.";
    } else if (norm.includes('meet') || norm.includes('greet') || norm.includes('interview')) {
      reply = "Meet-N-Greets are 100% Free ($0.00 / 30 mins) in person or via video call so your family can get acquainted with Ken'nyzhae before booking care!";
    }

    return new Response(
      JSON.stringify({
        text: reply,
        suggestions: [
          'Book a free Meet-N-Greet',
          'Calculate nanny pricing',
          'Tell me about Passport Nanny',
          'Loc wash & retwist details',
        ],
      }),
      { headers }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Server error' }), {
      status: 500,
      headers,
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
