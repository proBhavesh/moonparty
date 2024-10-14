import { updateDailyPnL } from "../../lib/updateDailyPnL";

export default async function handler(req, res) {
  // Check for a secret token to ensure this route can only be called by the Vercel cron job
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET_TOKEN}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await updateDailyPnL();
    res
      .status(200)
      .json({ message: "Daily P&L update completed successfully" });
  } catch (error) {
    console.error("Error in cron job:", error);
    res
      .status(500)
      .json({ message: "Error updating daily P&L", error: error.message });
  }
}
