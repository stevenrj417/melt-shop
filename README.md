# MELT.

Launch site for MELT squeeze butter and the first merch drop.

## Local development

```bash
npm install
npx vercel@latest dev
```

The waitlist endpoint stores one private JSON record per email in Vercel Blob. Connect a private Blob store to the Vercel project so `BLOB_READ_WRITE_TOKEN` is available. In local development without that token, successful submissions are logged with the email redacted.

## Deploy

Deploy to Vercel from the repository root. The static site lives in `public/` and the server endpoint is in `api/waitlist.js`.
