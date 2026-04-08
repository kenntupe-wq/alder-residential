export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { name, phone, address, plan } = await request.json();

    // We use the standard Fetch API because Cloudflare doesn't support 'require'
    const stripeResponse = await fetch('https://api.stripe.com/v1/setup_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'usage': 'off_session',
        'metadata[customer_name]': name,
        'metadata[customer_phone]': phone,
        'metadata[customer_address]': address,
        'metadata[selected_plan]': plan
      })
    });

    const data = await stripeResponse.json();

    if (!stripeResponse.ok) {
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ client_secret: data.client_secret }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
