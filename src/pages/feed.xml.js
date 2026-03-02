import getFeeds from './getfeed.js';
import { Feed } from 'feed';

export async function GET({ request }) {

    let items = await getFeeds();

    const feed = new Feed({
        title:"Combined Webflow Changelog Feed",
    });

    items.forEach(i => {
        feed.addItem({
            title: i.title, 
            id: i.link, 
            link: i.link, 
            content: i.content, 
            date: new Date(i.pubDate)
        })
    });

    return new Response(feed.rss2(), {
        status: 200,
        headers: {
        "Content-Type": "application/rss+xml",
        },
    });
}
