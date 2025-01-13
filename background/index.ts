import "@plasmohq/messaging/background"

import { startHub } from "@plasmohq/messaging/pub-sub"

// Import the monitoring state
import { isMonitoring, resolvePromise } from "./messages/monitor-network"

console.log(`BGSW - Starting Hub`)
startHub()

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.method === "POST" && isMonitoring) {
      resolvePromise({
        url: details.url,
        requestBody: details.requestBody,
        method: details.method,
        timeStamp: details.timeStamp,
        type: details.type
      })
    }
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
)

export {}
