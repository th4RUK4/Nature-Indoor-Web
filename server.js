const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "contact-submissions.jsonl");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function sanitizeValue(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 2000);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function handleContact(req, res) {
  try {
    const rawBody = await readBody(req);
    const contentType = req.headers["content-type"] || "";
    let payload = {};

    if (contentType.includes("application/json")) {
      payload = JSON.parse(rawBody || "{}");
    } else {
      payload = Object.fromEntries(new URLSearchParams(rawBody));
    }

    const submission = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: sanitizeValue(payload.name || payload.fullName || payload["full-name"]),
      email: sanitizeValue(payload.email),
      phone: sanitizeValue(payload.phone || payload.mobile),
      service: sanitizeValue(payload.service || payload.subject),
      message: sanitizeValue(payload.message || payload.notes || payload.details),
      source: "website"
    };

    if (!submission.name || !submission.email || !submission.message) {
      return sendJson(res, 400, {
        ok: false,
        message: "Please include your name, email, and message."
      });
    }

    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(SUBMISSIONS_FILE, `${JSON.stringify(submission)}\n`);

    return sendJson(res, 201, {
      ok: true,
      message: "Thanks. Your message has been received."
    });
  } catch (error) {
    console.error("Contact submission failed:", error);
    return sendJson(res, 500, {
      ok: false,
      message: "Sorry, something went wrong. Please try again."
    });
  }
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));

  if (!filePath.startsWith(PUBLIC_DIR) || filePath.includes(`${path.sep}data${path.sep}`)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Forbidden");
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return fs.createReadStream(path.join(PUBLIC_DIR, "index.html")).pipe(res);
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400"
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/health") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "POST" && req.url === "/api/contact") {
    return handleContact(req, res);
  }

  if (req.method === "GET" || req.method === "HEAD") {
    return serveStatic(req, res);
  }

  res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
  return res.end("Method Not Allowed");
});

server.listen(PORT, () => {
  console.log(`Nature Indoor site running on http://localhost:${PORT}`);
});
