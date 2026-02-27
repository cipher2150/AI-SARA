//require("dotenv").config();
import { configDotenv } from "dotenv";
import express from "express";
import crypto from "crypto";
import fs from "fs";
import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Verify GitHub webhook signature
function verifySignature(req) {
  const signature = req.headers["x-hub-signature-256"];
  const hmac = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(req.rawBody).digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

async function getInstallationOctokit(installationId) {
  const privateKey = fs.readFileSync("./private-key.pem", "utf8");

  const auth = createAppAuth({
    appId: process.env.APP_ID,
    privateKey,
    installationId,
  });

  const installationAuthentication = await auth({ type: "installation" });

  const octokit = new Octokit({
    auth: installationAuthentication.token,
  });

  return octokit;
}

app.post("/webhook", async (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).send("Invalid signature");
  }

  const event = req.headers["x-github-event"];
  console.log("Received Event:", event);

  // Handle installation event
  if (event === "installation") {
    console.log("App installed successfully.");
  }

  // Handle dependabot alert
  if (event === "dependabot_alert") {
    const installationId = req.body.installation.id;

    console.log("Dependabot alert received.");
    console.log("Installation ID:", installationId);

    const octokit = await getInstallationOctokit(installationId);

    console.log("Authenticated as GitHub App installation.");

    // Test API call
    const { data } = await octokit.apps.listReposAccessibleToInstallation();

    console.log("Accessible Repositories:", data.repositories.map(r => r.full_name));
  }

  res.status(200).send("Event processed");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});