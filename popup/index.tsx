import { useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import "~/style.css"

function IndexPopup() {
  const key = "transcript"
  const storage = new Storage({
    area: "local"
  })
  const [transcript, setTranscript] = useStorage<string>({
    key,
    instance: storage
  })
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    try {
      // Start monitoring for POST requests
      const monitorPromise = sendToBackground({
        name: "monitor-network"
      })

      // Get current tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })

      // Execute the script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const textarea = document.querySelector("textarea")
          if (textarea) {
            textarea.value = undefined
            textarea.value = "hi"
            textarea.dispatchEvent(new Event("input", { bubbles: true }))
            textarea.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
            )
          }
        }
      })

      // Wait for the first POST request details
      const response = await monitorPromise
      setTranscript(response.transcript)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const clearTranscript = () => {
    setTranscript(null)
  }

  return (
    <div className="p-4" style={{ width: "300px" }}>
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleClick}
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
          {transcript ? "Refresh Transcript" : "Generate Transcript"}
        </button>
        {transcript && (
          <button
            onClick={clearTranscript}
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
            Clear
          </button>
        )}
      </div>

      {transcript && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Transcript:</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(transcript)
                setCopied(true)
                setTimeout(() => {
                  setCopied(false)
                }, 2000)
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="bg-gray-100 p-2 rounded-md overflow-hidden">
            {transcript.slice(0, 50)}...
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
