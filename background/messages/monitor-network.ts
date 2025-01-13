import type { PlasmoMessaging } from "@plasmohq/messaging"

interface RequestDetails {
  requestBody?: chrome.webRequest.WebRequestBody
  url?: string
  method?: string
  timeStamp?: number
  type?: string
}

export let isMonitoring = false
export let resolvePromise: (value: RequestDetails) => void

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (req.name === "monitor-network") {
    isMonitoring = true

    // Create a promise that will be resolved when we get the first POST request
    const firstPostRequest = new Promise<RequestDetails>((resolve) => {
      resolvePromise = resolve
    })

    // Wait for the first POST request
    const requestDetails = await firstPostRequest
    isMonitoring = false

    // Extract transcript from response body if it exists
    let transcript = ""
    try {
      if (requestDetails.requestBody?.raw?.[0]?.bytes) {
        const decoder = new TextDecoder()
        const rawData = decoder.decode(requestDetails.requestBody.raw[0].bytes)
        const jsonData = JSON.parse(rawData)
        transcript = jsonData.input_values?.transcript || ""
      }
    } catch (error) {
      console.error("Error parsing transcript:", error)
    }

    // Send the transcript back
    res.send({ transcript })
  }
}

export default handler
