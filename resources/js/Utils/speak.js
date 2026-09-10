export default function speak(message, lang = 'en-US') {
  if (!message || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(message));
    utterance.lang = lang;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    /* speech unavailable — silently skip */
  }
}
