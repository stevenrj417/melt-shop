import { createHash } from "node:crypto";
import { put } from "@vercel/blob";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  return res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, message: "Method not allowed." });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const email = String(body.email || "").trim().toLowerCase();
  const firstName = String(body.firstName || "").trim().slice(0, 80);
  const interest = ["butter", "merch", "both"].includes(body.interest) ? body.interest : "both";

  if (body.company) {
    return send(res, 200, { ok: true, message: "You're on the list." });
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return send(res, 400, { ok: false, message: "Enter a valid email address." });
  }

  const id = createHash("sha256").update(email).digest("hex");
  const signup = {
    email,
    firstName,
    interest,
    joinedAt: new Date().toISOString(),
    source: "melt.shop"
  };

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN && process.env.NODE_ENV !== "production") {
      console.info("Local waitlist signup", { ...signup, email: "[redacted]" });
    } else {
      await put(`waitlist/${id}.json`, JSON.stringify(signup), {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json"
      });
    }

    return send(res, 201, {
      ok: true,
      message: "You're in. We'll save you a squeeze."
    });
  } catch (error) {
    console.error("Waitlist signup failed", error);
    return send(res, 500, {
      ok: false,
      message: "The fridge door jammed. Please try again."
    });
  }
}
