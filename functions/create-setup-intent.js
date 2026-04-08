export async function onRequestPost(context) {
  // This grabs the key from your Cloudflare Variables automatically
  const stripe = require('stripe')(context.env.STRIPE_SECRET_KEY);

  try {
    const intent = await stripe.setupIntents.create({
      payment_method_types: ['card'],
      usage: 'off_session', 
    });

    return new Response(JSON.stringify({ client_secret: intent.client_secret }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
