
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RandomStuffBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const metadata: any = {
      title: $('meta[property="og:title"]').attr('content') || $('title').text() || '',
      description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '',
      image: $('meta[property="og:image"]').attr('content') || '',
      url: url,
    };

    // GitHub specific logic
    if (url.includes('github.com')) {
      metadata.isGitHub = true;

      // Try to parse star count from the page if possible, though API is better.
      // For now, let's try to scrape it from the social preview or sidebar if possible.
      // GitHub usually puts star count in a specific element.
      // Example: <span id="repo-stars-counter-star" ...>
      const stars = $('#repo-stars-counter-star').text().trim() ||
        $('.js-social-count').first().text().trim();

      if (stars) {
        metadata.stars = stars;
      }

      // License
      const license = $('a[href$="/LICENSE"]').first().text().trim() ||
        $('svg.octicon-law').parent().text().trim();
      if (license) {
        metadata.license = license;
      }

      // Website URL (usually in the sidebar 'About' section)
      // Looking for the link in the sidebar that is not a topic tag or license
      const website = $('.Layout-sidebar .BorderGrid-cell a[href^="http"]').first().attr('href');
      if (website) {
        metadata.website = website;
      }
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
