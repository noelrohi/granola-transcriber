import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  await chrome.scripting.executeScript({
    target: { tabId: req.tabId },
    func: () => {
      const textarea = document.querySelector("textarea")
      if (textarea) {
        textarea.value = "hi"
        textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
      }
    }
  })

  res.send({ success: true })
}

export default handler
