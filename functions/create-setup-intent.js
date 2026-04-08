const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function onRequestPost(context) {
  try {
    const intent = await stripe.setupIntents.create({
      payment_method_types: ['card'],
      usage: 'off_session', // This allows you to charge them later manually
    });

    return new Response(JSON.stringify({ client_secret: intent.client_secret }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
