// Lets any part of the page (the hero, the contact chapter) open the chat
// without prop-drilling state into the layout-level widget.
export const OPEN_CHAT_EVENT = "hafzal-ai:open";

export function openChat() {
  window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
}
