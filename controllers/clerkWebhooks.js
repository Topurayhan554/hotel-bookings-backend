import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // ✅ RAW BODY
    const payload = req.body.toString();

    // ✅ VERIFIED EVENT
    const event = wh.verify(payload, headers);

    const { data, type } = event;

    console.log("Webhook event:", type); // 🔍 DEBUG

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      image: data.image_url,
    };

    if (type === "user.created") {
      await User.create(userData);
      console.log("User saved to DB");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(400).json({ success: false });
  }
};

export default clerkWebhooks;
