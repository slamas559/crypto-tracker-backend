import cron from "node-cron";
import axios from "axios";
import Alert from "../models/Alert.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import webpush from "web-push";

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // App Password
  },
});

// Web push setup
webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  console.log("🔁 Checking price alerts...");

  const alerts = await Alert.find({ triggered: false }).populate("user");
  const uniqueCoinIds = [...new Set(alerts.map(a => a.coinId))];

  // Get live prices
  const { data: coins } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/markets`,
    {
      params: {
        vs_currency: "usd",
        ids: uniqueCoinIds.join(","),
      },
    }
  );

  const priceMap = {};
  coins.forEach(c => priceMap[c.id] = c.current_price);

  for (const alert of alerts) {
    const currentPrice = priceMap[alert.coinId];
    const hitAbove = alert.direction === "above" && currentPrice >= alert.targetPrice;
    const hitBelow = alert.direction === "below" && currentPrice <= alert.targetPrice;

    if (hitAbove || hitBelow) {
      // Mark alert as triggered
      alert.triggered = true;
      await alert.save();

      const message = `📈 ${alert.coinId.toUpperCase()} has ${
        alert.direction === "above" ? "risen above" : "dropped below"
      } $${alert.targetPrice} (Current: $${currentPrice})`;

      // Email
      await transporter.sendMail({
        from: `"Crypto Tracker" <${process.env.EMAIL_USER}>`,
        to: alert.user.email,
        subject: `🔔 Price Alert: ${alert.coinId.toUpperCase()}`,
        text: message,
      });

      // Push notification (if subscribed)
      if (alert.user.pushSubscription) {
        try {
          await webpush.sendNotification(
            alert.user.pushSubscription,
            JSON.stringify({ title: "Crypto Alert", body: message })
          );
        } catch (err) {
          console.error("Push error:", err.message);
        }
      }
      console.log(`✅ Alert triggered for ${alert.user.email}: ${message}`);
    }
  }
});
