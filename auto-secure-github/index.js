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
    const repoFullName = req.body.repository.full_name;
    const alertNumber = req.body.alert.number;

    const [owner, repo] = repoFullName.split("/");

    const octokit = await getInstallationOctokit(installationId);
    
    const { data: alert } = 
      await octokit.rest.dependabot.getAlert({
        owner,
        repo,
        alert_number: alertNumber,
      });

    console.log("****** ALERT DETAILS ******");
    console.log("Package:", alert.dependency.package.name);
    console.log("Severity:", alert.security_advisory.severity);
    console.log("Summary:", alert.security_advisory.summary);
    console.log(
      "Patched Version:",
      alert.security_vulnerability.first_patched_version.identifier
    );

  }
  


  res.status(200).send("Event processed");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});