import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["https://notes.granola.ai/*"],
  world: "MAIN"
}

export const getShadowHostId = () => "granola-button"

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document
    .querySelector(".secondPane_commonPane__O8t14")
    ?.querySelector("p")
    ?.querySelector("button")

const PlasmoOverlay = () => {
  const onClick = () => {
    const textarea = document.querySelector("textarea")
    if (textarea) {
      textarea.value = "hi"
      textarea.dispatchEvent(new Event("input", { bubbles: true }))
      textarea.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      )
    }
  }

  return (
    <button
      id="granola-button"
      onClick={onClick}
      type="button"
      className="ml-2 border h-7 w-auto rounded-md px-2 text-black dark:text-white">
      Copy Transcript
    </button>
  )
}

export default PlasmoOverlay
