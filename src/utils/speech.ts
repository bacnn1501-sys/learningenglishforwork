/**
 * Web Speech API wrappers:
 * - Text-To-Speech (SpeechSynthesis): en-US / en-GB with normal (1.0x) and slow (0.75x) rates
 * - Speech-To-Text (webkitSpeechRecognition): voice input for speaking practice
 */

let selectedVoice: SpeechSynthesisVoice | null = null;

// Initialize & pick best English voice
export function initSpeechSynthesis(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const updateVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural sounding en-US or en-GB voices
    selectedVoice =
      voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))) ||
      voices.find(v => v.lang === 'en-US') ||
      voices.find(v => v.lang.startsWith('en')) ||
      null;
  };

  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

// Play English pronunciation
export function speakText(text: string, rate: number = 0.9, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    onEnd?.();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate; // 0.75 for slow, 0.95 for normal
  utterance.pitch = 1.0;

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.onend = () => onEnd?.();
  utterance.onerror = (err) => {
    console.warn('Speech synthesis error:', err);
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}

// Check if Speech Recognition is supported
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
}

// Create recognition session
export function createSpeechRecognizer(
  onResult: (result: SpeechRecognitionResultState) => void,
  onError: (error: string) => void,
  onEnd: () => void
): { start: () => void; stop: () => void; abort: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    onError('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói. Bạn có thể gõ câu trả lời.');
    return null;
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const isFinal = event.results[current].isFinal;
    onResult({ transcript, isFinal });
  };

  recognition.onerror = (event: any) => {
    let msg = 'Lỗi nhận diện âm thanh.';
    if (event.error === 'not-allowed') {
      msg = 'Vui lòng cấp quyền micro để luyện phát âm.';
    } else if (event.error === 'no-speech') {
      msg = 'Không nhận được âm thanh. Vui lòng nói lại.';
    } else if (event.error === 'network') {
      msg = 'Lỗi kết nối mạng khi nhận diện giọng nói.';
    }
    onError(msg);
  };

  recognition.onend = () => {
    onEnd();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (e) {
        // Recognition already started
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {}
    },
    abort: () => {
      try {
        recognition.abort();
      } catch (e) {}
    }
  };
}

