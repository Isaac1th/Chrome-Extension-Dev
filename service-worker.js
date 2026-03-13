const ENDPOINT = "http://127.0.0.1:3001/next-command";
const POLL_INTERVAL = 5_000;

async function checkServer() {
  try {
    const response = await fetch(ENDPOINT, { cache: "no-store" });

    if (!response.ok) {
      console.error("Polling failed:", response.status, response.statusText);
      return;
    }

    const command = await response.json();

    if (!command || !command.action) {
      return;
    }

    if (command.action === "open_lead") {
      const url = `https://crm.zoho.com/crm/org639047842/tab/Accounts/${command.leadId}`;

      await chrome.notifications.create({
        type: "basic",
        iconUrl: "icon128.png",
        title: "Incoming call trigger received",
        message: `Opening lead ${command.leadId}...`,
      });

      await chrome.tabs.create({ url });
    }
  } catch (error) {
    console.error("Error while polling trigger server:", error);
  }
}

setInterval(checkServer, POLL_INTERVAL);
checkServer();
