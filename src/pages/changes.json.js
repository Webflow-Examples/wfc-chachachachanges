import getFeeds from './getfeed.js';

export async function GET({ request }) {

    let items = await getFeeds();

    return new Response(JSON.stringify(items), {
        status: 200,
        headers: {
        "Content-Type": "application/json",
        },
    });
}

