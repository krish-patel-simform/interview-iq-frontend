import { useState, useEffect, useCallback, useRef } from "react";

// Web Speech API interfaces
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface UseSpeechToTextProps {
  onTranscriptChange: (transcript: string) => void;
}

export const useSpeechToText = ({ onTranscriptChange }: UseSpeechToTextProps) => {
  const [isListening, setIsListening] = useState(false);
  
  // Lazy initialize isSupported to avoid setting state synchronously in effect
  const [isSupported] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }
    return false;
  });
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // We keep track of the text that was in the input before the current speech session started
  const initialTextRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined" || !isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      // Combine the text that existed before this session with the new transcript
      const separator = initialTextRef.current.trim() && currentTranscript.trim() ? " " : "";
      onTranscriptChange(initialTextRef.current + separator + currentTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      // If it ends automatically (e.g. timeout), update state
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptChange, isSupported]);

  const startListening = useCallback((currentInputValue: string) => {
    if (!isSupported || !recognitionRef.current) return;
    
    // Save the current input value so we can append to it
    initialTextRef.current = currentInputValue;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;
    
    recognitionRef.current.stop();
    setIsListening(false);
  }, [isSupported]);

  const toggleListening = useCallback((currentInputValue: string) => {
    if (isListening) {
      stopListening();
    } else {
      startListening(currentInputValue);
    }
  }, [isListening, startListening, stopListening]);

  return { 
    isListening, 
    isSupported, 
    toggleListening,
    stopListening
  };
};
