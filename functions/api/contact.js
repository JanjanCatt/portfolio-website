export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const body = await request.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return new Response(JSON.stringify({ error: 'Missing fields' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Insert into D1 Database binding named 'DB'
        const { success } = await env.DB.prepare(
            'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'
        ).bind(name, email, message).run();

        if (success) {
            return new Response(JSON.stringify({ success: true }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            throw new Error('Database insert failed');
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}