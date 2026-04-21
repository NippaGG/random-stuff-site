import { lookup } from "dns/promises";
import { isIP } from "net";

import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const REQUEST_TIMEOUT_MS = 5000;
const MAX_CONTENT_LENGTH_BYTES = 2_000_000;

function isPrivateIpAddress(value: string) {
  if (value.startsWith("::ffff:")) {
    return isPrivateIpAddress(value.slice(7));
  }

  const version = isIP(value);
  if (version === 4) {
    const [first, second] = value.split(".").map(Number);
    return (
      first === 0 ||
      first === 10 ||
      first === 127 ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168)
    );
  }

  if (version === 6) {
    const normalized = value.toLowerCase();
    return (
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe8") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb")
    );
  }

  return false;
}

async function validateMetadataUrl(rawUrl: string) {
  const parsedUrl = new URL(rawUrl);
  const protocol = parsedUrl.protocol.toLowerCase();

  if (protocol !== "http:" && protocol !== "https:") {
    throw new Error("Only HTTP(S) URLs are allowed.");
  }

  if (parsedUrl.username || parsedUrl.password) {
    throw new Error("Authenticated URLs are not allowed.");
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("Local URLs are not allowed.");
  }

  if (isIP(hostname) && isPrivateIpAddress(hostname)) {
    throw new Error("Private network URLs are not allowed.");
  }

  if (!isIP(hostname)) {
    const records = await lookup(hostname, { all: true, verbatim: true });
    if (records.some((record) => isPrivateIpAddress(record.address))) {
      throw new Error("Private network URLs are not allowed.");
    }
  }

  return parsedUrl;
}

function toAbsoluteUrl(value: string | undefined, baseUrl: URL) {
  if (!value) return "";

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = await validateMetadataUrl(rawUrl);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid URL";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(parsedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RandomStuffBot/1.0)",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (
      contentType &&
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new Error("Only HTML pages can be previewed.");
    }

    const contentLength = Number(response.headers.get("content-length") ?? "0");
    if (contentLength && contentLength > MAX_CONTENT_LENGTH_BYTES) {
      throw new Error("The requested page is too large to preview.");
    }

    const html = await response.text();
    const $ = cheerio.load(html.slice(0, MAX_CONTENT_LENGTH_BYTES));

    const metadata: Record<string, string | boolean> = {
      title:
        $('meta[property="og:title"]').attr("content") ||
        $("title").text() ||
        "",
      description:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "",
      image: toAbsoluteUrl(
        $('meta[property="og:image"]').attr("content"),
        parsedUrl
      ),
      url: parsedUrl.toString(),
    };

    // GitHub specific logic
    if (parsedUrl.hostname.includes("github.com")) {
      metadata.isGitHub = true;

      const stars =
        $("#repo-stars-counter-star").text().trim() ||
        $(".js-social-count").first().text().trim();

      if (stars) {
        metadata.stars = stars;
      }

      const license =
        $('a[href$="/LICENSE"]').first().text().trim() ||
        $("svg.octicon-law").parent().text().trim();
      if (license) {
        metadata.license = license;
      }

      const website = $(".Layout-sidebar .BorderGrid-cell a[href^='http']")
        .first()
        .attr("href");
      if (website) {
        metadata.website = toAbsoluteUrl(website, parsedUrl);
      }
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error fetching metadata:", error);
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Metadata request timed out."
        : "Failed to fetch metadata";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    clearTimeout(timeoutId);
  }
}
