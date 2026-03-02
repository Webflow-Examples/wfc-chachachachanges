import Parser from 'rss-parser';
import { feeds } from './feeds.config.js';
let parser;

export default async () => {

    parser = new Parser();
    let items = [];

    let reqs = [];
    for (const feedUrl of feeds) {
        reqs.push(parseURL(feedUrl.url));
    }

    const results = await Promise.allSettled(reqs);
    for (const result of results) {
        if (result.status === 'fulfilled') {
            const feed = result.value;
            console.log(`Fetched feed: ${feed.title} with ${feed.items.length} items.`);
            let newItems = [];
            feed.items.forEach(item => {
                let content = item.contentSnippet || item.summary || item.content || '';
                newItems.push({
                    title: item.title,
                    link: item.link,
                    content: content,
                    pubDate: item.pubDate,
                    feedTitle: feed.title
                });
            });

            items.push(...newItems);

        } else {
            console.error('Error fetching/parsing feed:', result.reason);
        }
    }

    // now sort items by pubDate descending
    items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    return items;
};

async function parseURL(u) {
    let xmlReq = await fetch(u);
    let xml = await xmlReq.text();
    return parser.parseString(xml);
}