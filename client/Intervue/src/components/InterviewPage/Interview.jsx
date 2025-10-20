import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Mic, MicOff, CameraOff, Phone } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useNavigate, useParams } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import { 
  startInterview, 
  saveUserCode, 
  generateContextualResponse,
  saveConversationMessage,
  getNextMainQuestion,
  finalizeCurrentQuestion
} from '../../apiCalls/interviewCall';
import Lottie from 'lottie-react';
import assistantAnim from '../../assets/assistant.json';
import assistantSpeaking from '../../assets/assistantSpeaking.json';
import { FaClock } from 'react-icons/fa';

// --- Reusable Child Components ---
function TimeWrapingToast({ show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 10000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 bg-yellow-400 text-yellow-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 z-50 animate-pulse">
      <FaClock className="w-6 h-6" />
      <p className="font-bold">Only 1 minute left!</p>
    </div>
  );
}

function FullscreenWarningModal({ show, onOk, warningCount }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-red-500">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Fullscreen Exit Violation!</h2>
          <p className="text-gray-300 mb-4">
            You have exited fullscreen mode which is not allowed during the interview.
          </p>
          <p className="text-yellow-400 font-semibold mb-6">
            Warning {warningCount}/3 - Interview will end after 3 violations
          </p>
          <button
            onClick={onOk}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Return to Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
}

function EndInterviewModal({ show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-red-500">
        <div className="text-center">
          <div className="text-4xl mb-4">🔚</div>
          <h2 className="text-2xl font-bold mb-4">End Interview?</h2>
          <p className="text-gray-300 mb-6">
            Are you sure you want to end the AI interview? Your progress will be saved, 
            but you won't be able to resume this session.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Yes, End Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EvaluatingIndicator({ show, message = "Analyzing your response..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg flex items-center space-x-4 shadow-2xl">
        <BeatLoader color="#3b82f6" size={12} />
        <span className="font-semibold text-lg">{message}</span>
      </div>
    </div>
  );
}

// --- Main Interview Component ---
function Interview() {
  // --- State Management ---
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn] = useState(true);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [question, setQuestion] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [questionPhase, setQuestionPhase] = useState('main');
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [evaluatingMessage, setEvaluatingMessage] = useState("AI is analyzing your response...");
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [fullscreenWarnings, setFullscreenWarnings] = useState(0);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [showEndInterviewModal, setShowEndInterviewModal] = useState(false);
  const [clarificationCount, setClarificationCount] = useState(0);

  // --- Refs ---
  const videoRef = useRef(null);
  const isEndingInterview = useRef(false);
  const hasWelcomed = useRef(false);
  const recognitionRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const micToggleTimeoutRef = useRef(null);
  const pendingMicOffRef = useRef(false);

  // --- Router Hooks ---
  const navigate = useNavigate();
  const { topic } = useParams();

  // --- Language and Code State ---
  const getFirstlang = useCallback((currentTopic) => {
    if (!currentTopic) return "java";
    const lowerTopic = currentTopic.toLowerCase();
    
    // Java for: java, dsa, os, computer networks
    if (lowerTopic.includes("java") || 
        lowerTopic.includes("dsa") || 
        lowerTopic.includes("data-structures") ||
        lowerTopic.includes("algorithm") ||
        lowerTopic.includes("os") || 
        lowerTopic.includes("operating") ||
        lowerTopic.includes("computer") ||
        lowerTopic.includes("network")) {
      return "java";
    }
    
    if (lowerTopic.includes("python")) return "python";
    if (lowerTopic.includes("javascript") || lowerTopic.includes("js")) return "javascript";
    if (lowerTopic.includes("cpp") || lowerTopic.includes("c++")) return "cpp";
    if (lowerTopic.includes("dbms") || lowerTopic.includes("sql")) return "sql";
    
    return "java";
  }, []);

  const getDefaultCode = useCallback((lang) => {
    const defaults = {
      javascript: `// Write your JavaScript code here\nfunction solution() {\n    // Your code here\n}`,
      python: `# Write your Python code here\ndef solution():\n    # Your code here\n    pass`,
      java: `public class Solution {\n    public static void main(String[] args) {\n        // Write your Java code here\n    }\n}`,
      cpp: `// Write your C++ code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
      sql: `-- Write your SQL query here`
    };
    return defaults[lang] || "// Write your code here";
  }, []);

  const [language, setLanguage] = useState(() => getFirstlang(topic));
  const [code, setCode] = useState(() => getDefaultCode(getFirstlang(topic)));

  // --- Core Functions ---
  // ✅ ONLY NAVIGATION CHANGE - EVERYTHING ELSE SAME
  const handleLeaving = useCallback(() => {
    isEndingInterview.current = true;
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Recognition already stopped");
      }
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
    
    // ✅ ONLY CHANGE - NAVIGATE TO FEEDBACK INSTEAD OF DASHBOARD
    if (interviewId) {
      navigate(`/feedback/${interviewId}`);
    } else {
      navigate('/dashboard');
    }
  }, [navigate, stream, interviewId]);

  const handleStartInterview = useCallback(() => {
    document.documentElement.requestFullscreen().catch(err => console.error(err));
    setInterviewStarted(true);
  }, []);

  const handleEndInterviewClick = useCallback(() => {
    setShowEndInterviewModal(true);
  }, []);

  const handleEndInterviewConfirm = useCallback(() => {
    setShowEndInterviewModal(false);
    handleLeaving();
  }, [handleLeaving]);

  const handleEndInterviewCancel = useCallback(() => {
    setShowEndInterviewModal(false);
  }, []);

  const handleFullscreenWarningOk = useCallback(() => {
    setShowFullscreenWarning(false);
    if (!isEndingInterview.current) {
      document.documentElement.requestFullscreen()
        .then(() => {
          console.log("Successfully returned to fullscreen");
        })
        .catch(err => {
          console.error("Failed to enter fullscreen:", err);
          alert("Please manually enable fullscreen mode to continue the interview.");
        });
    }
  }, []);

  const speak = useCallback((text, isMainQuestion = false, questionNumber = null) => {
    if ('speechSynthesis' in window && text && text.trim()) {
      window.speechSynthesis.cancel();
      
      let textToSpeak = text;
      
      if (isMainQuestion && questionNumber) {
        const introText = questionNumber === 1 
          ? `Welcome to your interview. Here is your ${getOrdinalNumber(questionNumber)} question on the screen.`
          : `Here is your ${getOrdinalNumber(questionNumber)} question on the screen.`;
        textToSpeak = introText;
      }
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => {
        console.log("AI started speaking:", textToSpeak);
        setIsAiSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log("AI finished speaking");
        setIsAiSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsAiSpeaking(false);
      };
      
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  }, []);

  const getOrdinalNumber = useCallback((num) => {
    const ordinals = {
      1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th",
      6: "6th", 7: "7th", 8: "8th", 9: "9th", 10: "10th"
    };
    return ordinals[num] || `${num}th`;
  }, []);

  const processTranscriptWithAI = useCallback(async (transcript) => {
    if (!transcript.trim() || !question || isSubmittingRef.current) {
      return;
    }

    console.log("🤖 === SENDING TO AI FOR PURE ANALYSIS ===");
    console.log("User said:", transcript);
    console.log("User code:", code);
    
    isSubmittingRef.current = true;
    setIsEvaluating(true);
    setEvaluatingMessage("AI is analyzing your response and code...");

    try {
      setFinalTranscript('');
      
      let contextualResponse;
      
      try {
        await saveConversationMessage(interviewId, question.qNo, transcript, 'candidate', question.question);
        
        console.log("🤖 Sending transcript AND code to AI for intelligent analysis...");
        
        const response = await generateContextualResponse(
          transcript,
          question,
          questionPhase,
          interviewId,
          conversationHistory,
          question.qNo,
          topic,
          code,
          language
        );
        
        console.log("🤖 AI analyzed and decided:", response);
        
        if (response && typeof response === 'object') {
          if (response.data && typeof response.data === 'object') {
            contextualResponse = response.data;
          } else if (response.action && response.response) {
            contextualResponse = response;
          } else {
            throw new Error("Invalid AI response structure");
          }
        } else {
          throw new Error("Invalid AI response");
        }
        
        console.log("🤖 AI's final decision:", contextualResponse.action);
        console.log("🤖 AI will respond:", contextualResponse.response);
        
      } catch (apiError) {
        console.error('❌ AI API error:', apiError);
        
        contextualResponse = {
          action: 'MOVE_NEXT',
          response: 'Thank you for your response. Let\'s move to the next question.',
          shouldMoveToNext: true,
          reasoning: 'API error - emergency fallback'
        };
      }

      if (!contextualResponse || typeof contextualResponse !== 'object') {
        contextualResponse = {
          action: 'MOVE_NEXT',
          response: 'Let\'s continue to the next question.',
          shouldMoveToNext: true,
          reasoning: 'Invalid response - emergency fallback'
        };
      }

      if (!contextualResponse.response) {
        contextualResponse.response = 'Let\'s continue with the interview.';
      }
      if (typeof contextualResponse.shouldMoveToNext !== 'boolean') {
        contextualResponse.shouldMoveToNext = contextualResponse.action === 'MOVE_NEXT';
      }

      console.log("🤖 Executing AI's decision:", contextualResponse.action);

      const newConversationHistory = [...conversationHistory, {
        role: 'candidate',
        message: transcript,
        timestamp: new Date().toISOString()
      }];
      setConversationHistory(newConversationHistory);

      if (contextualResponse.shouldMoveToNext) {
        console.log("🤖 AI decided: MOVE TO NEXT QUESTION");
        await finalizeCurrentQuestion(interviewId, question.qNo);
        
        setEvaluatingMessage("Moving to next question...");
        
        try {
          const nextQuestionResponse = await getNextMainQuestion(interviewId, question.qNo, topic);
          
          let responseData;
          if (nextQuestionResponse && typeof nextQuestionResponse === 'object') {
            if (nextQuestionResponse.data) {
              responseData = nextQuestionResponse.data;
            } else if (nextQuestionResponse.nextQuestion || nextQuestionResponse.interviewCompleted !== undefined) {
              responseData = nextQuestionResponse;
            } else {
              throw new Error("Invalid next question response structure");
            }
          } else {
            throw new Error("No response from getNextMainQuestion");
          }
          
          if (responseData.interviewCompleted) {
            alert("Congratulations! You have completed the interview.");
            handleLeaving();
            return;
          }
          
          if (!responseData.nextQuestion) {
            throw new Error("No next question provided");
          }
          
          setQuestion(responseData.nextQuestion);
          setCode(getDefaultCode(language));
          setQuestionPhase('main');
          setConversationHistory([]);
          hasWelcomed.current = false;
          setClarificationCount(0);
          
          speak(contextualResponse.response);
          setTimeout(() => {
            speak("", true, responseData.nextQuestion.qNo);
          }, 2000);
          
        } catch (error) {
          console.error("Error getting next question:", error);
          alert("Error getting next question: " + error.message);
        }
      } else {
        console.log("🤖 AI decided: CONTINUE CONVERSATION -", contextualResponse.action);
        setQuestionPhase('followup');
        
        await saveConversationMessage(interviewId, question.qNo, contextualResponse.response, 'interviewer', question.question);
        
        setConversationHistory(prev => [...prev, {
          role: 'interviewer',
          message: contextualResponse.response,
          timestamp: new Date().toISOString()
        }]);
        
        console.log("🤖 AI speaking follow-up:", contextualResponse.response);
        speak(contextualResponse.response);
      }

    } catch (error) {
      console.error("Error in AI processing:", error);
      alert("There was an error processing your response: " + error.message);
    } finally {
      setIsEvaluating(false);
      isSubmittingRef.current = false;
      console.log("🤖 === AI PROCESSING COMPLETE ===");
    }
  }, [question, questionPhase, interviewId, conversationHistory, topic, handleLeaving, speak, language, getDefaultCode, code]);

  const handleMicToggle = useCallback(() => {
    if (isEvaluating || isSubmittingRef.current) {
      return;
    }
    
    const newMicState = !isMicOn;
    setIsMicOn(newMicState);
    
    if (!newMicState) {
      console.log("🎤 Mic turned OFF - marking as pending for processing");
      pendingMicOffRef.current = true;
    } else {
      console.log("🎤 Mic turned ON - clearing previous transcript");
      setFinalTranscript('');
      pendingMicOffRef.current = false;
    }
  }, [isMicOn, isEvaluating]);

  const handleCameraToggle = useCallback(() => {
    console.log("Camera toggle blocked - camera must stay on during interview");
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && interviewStarted && !isEndingInterview.current) {
        setTabSwitchWarnings(prev => {
          const newWarnings = prev + 1;
          if (newWarnings >= 3) {
            alert("You have switched tabs 3 times. The interview will now end.");
            handleLeaving();
          } else {
            alert(`Warning: Tab switching is not allowed. This is warning ${newWarnings}/3.`);
          }
          return newWarnings;
        });
      }
    };

    if (interviewStarted) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [interviewStarted, handleLeaving]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && interviewStarted && !isEndingInterview.current) {
        setFullscreenWarnings(prev => {
          const newWarnings = prev + 1;
          setShowFullscreenWarning(true);
          
          if (newWarnings >= 3) {
            setTimeout(() => {
              alert("You have exited fullscreen 3 times. The interview will now end.");
              handleLeaving();
            }, 100);
          }
          
          return newWarnings;
        });
      }
    };

    if (interviewStarted) {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [interviewStarted, handleLeaving]);

  useEffect(() => {
    if (interviewStarted && !question && !loading) {
      const fetchFirstQuestion = async () => {
        setLoading(true);
        try {
          console.log("Fetching first AI-generated question for topic:", topic);
          const res = await startInterview(topic);
           console.log("🔍 Full API response:", res);
    console.log("🔍 Response data:", res.data);
    console.log("🔍 Response structure:", JSON.stringify(res.data, null, 2));
          const data = res.data || res;
          if (data && data.currentQuestion) {
            setQuestion(data.currentQuestion);
            setInterviewId(data.interviewId);
            console.log("AI interview started successfully");
            console.log("📋 Extracted interviewId:", data.interviewId);
      setInterviewId(data.interviewId);
          } else {
            throw new Error("Invalid interview start response");
          }
        } catch (err) {
          console.error("Error starting AI interview:", err);
          alert("Could not start the interview: " + err.message);
          handleLeaving();
        } finally {
          setLoading(false);
        }
      };
      fetchFirstQuestion();
    }
  }, [interviewStarted, question, loading, topic, handleLeaving]);

  useEffect(() => {
    if (question && !isAiSpeaking && interviewStarted && !hasWelcomed.current && questionPhase === 'main') {
      console.log("Question loaded - speaking intro for question", question.qNo);
      setTimeout(() => {
        speak("", true, question.qNo);
        hasWelcomed.current = true;
      }, 500);
    }
  }, [question?.qNo, isAiSpeaking, interviewStarted, questionPhase, speak]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("🎤 Recognition started");
      setIsRecognitionActive(true);
    };

    recognition.onend = () => {
      console.log("🎤 Recognition ended");
      setIsRecognitionActive(false);
    };

    recognition.onresult = (event) => {
      let sessionTranscript = '';
      
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          sessionTranscript += transcript + ' ';
        }
      }
      
      if (sessionTranscript.trim()) {
        const cleanTranscript = sessionTranscript.trim();
        console.log("🎤 Final transcript captured:", cleanTranscript);
        setFinalTranscript(cleanTranscript);
        
        if (pendingMicOffRef.current && !isSubmittingRef.current && !isAiSpeaking && interviewId && question) {
          console.log("🎤 ✅ PROCESSING TRANSCRIPT AFTER MIC OFF:", cleanTranscript);
          pendingMicOffRef.current = false;
          processTranscriptWithAI(cleanTranscript);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecognitionActive(false);
      
      if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please allow microphone access and refresh the page.");
      }
    };
    
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.stop();
        } catch (e) {
          console.log("Recognition cleanup error:", e);
        }
      }
    };
  }, [processTranscriptWithAI, interviewId, question, isAiSpeaking]);

  useEffect(() => {
    if (isEndingInterview.current || !recognitionRef.current) return;
    
    const recognition = recognitionRef.current;
    
    if (isMicOn && !isAiSpeaking && !isEvaluating) {
      if (!isRecognitionActive) {
        try {
          console.log("🎤 Starting recognition...");
          recognition.start();
        } catch (e) {
          if (e.name !== 'InvalidStateError') {
            console.error("Unexpected recognition error:", e);
          }
        }
      }
    } else {
      if (isRecognitionActive) {
        try {
          console.log("🎤 Stopping recognition...");
          recognition.stop();
        } catch (e) {
          console.log("Recognition already stopped or stopping");
        }
      }
    }
  }, [isMicOn, isAiSpeaking, isRecognitionActive, isEvaluating]);

  useEffect(() => {
    if (!interviewStarted || !interviewId || !question?.qNo) return;
    
    const debounceTimer = setTimeout(() => {
      if (code !== getDefaultCode(language)) {
        saveUserCode(interviewId, question.qNo, code).catch(err => 
          console.error("Failed to save code:", err)
        );
      }
    }, 2500);

    return () => clearTimeout(debounceTimer);
  }, [code, question?.qNo, interviewId, language, getDefaultCode, interviewStarted]);

  useEffect(() => {
    let mediaStream;
    
    async function setupCamera() {
      if (interviewStarted && question) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: false
          });
          setStream(mediaStream);
        } catch (err) { 
          console.error("Error accessing camera:", err); 
        }
      }
    }

    setupCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [interviewStarted, question?.qNo]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (interviewStarted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleLeaving();
            return 0;
          }
          if (prev === 61) setShowTimeWarning(true);
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [interviewStarted, handleLeaving]);

  useEffect(() => {
    return () => {
      if (micToggleTimeoutRef.current) {
        clearTimeout(micToggleTimeoutRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEditorChange = useCallback((value) => {
    setCode(value || '');
  }, []);

  const handleLanguageChange = useCallback((newLanguage) => {
    if (code === getDefaultCode(language)) {
      setCode(getDefaultCode(newLanguage));
    }
    setLanguage(newLanguage);
  }, [code, language, getDefaultCode]);

  if (!interviewStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-6">AI-Powered Interview</h1>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-left space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-center mb-4 text-white">Please read the rules carefully:</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-300">
              <li>The interview must be conducted in fullscreen mode and cannot be exited.</li>
              <li>Switching tabs or exiting fullscreen is prohibited and will terminate the interview after 3 warnings.</li>
              <li>Your camera must stay ON throughout the interview for security purposes.</li>
              <li>Your microphone will be disabled when the AI assistant is speaking.</li>
              <li>To submit your answer, turn your microphone ON, speak, and then turn it OFF.</li>
              <li><strong>NEW:</strong> The AI analyzes both your spoken responses AND your written code!</li>
              <li>You can ask to repeat questions or request clarifications naturally.</li>
              <li>Say "next question" or "move on" to proceed to the next question.</li>
            </ul>
          </div>
          <button 
            onClick={handleStartInterview} 
            className="px-8 py-4 bg-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  if (loading || !question) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <BeatLoader color="#3b82f6" size={15} />
          <p className="text-white mt-4">AI is preparing your interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white/90">
      <header className="bg-gray-900/70 p-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">AI-Powered Interview - {topic}</h1>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white/5 px-5 py-2 rounded-xl ring-1 ring-white/10">
              <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="text-sm text-white/60">
              Q{question.qNo} - {questionPhase === 'followup' ? 'AI Follow-up' : 'Main Question'}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <div className="w-1/4 bg-gray-900/40 p-5 overflow-y-auto border-r border-white/10">
          <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4">
            <h2 className="font-semibold text-blue-400">Question {question.qNo}</h2>
            <p className="mt-2 text-white/80">{question.question}</p>
          </div>
          
          <div className="mt-4 p-3 bg-gray-800/30 rounded-xl">
            <h3 className="font-semibold text-green-400 mb-2">AI Status</h3>
            <div className="text-sm text-gray-300">
              {isEvaluating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>AI is analyzing your response and code...</span>
                </div>
              ) : isAiSpeaking ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>AI is responding...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Ready for your response</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-900/20 rounded-xl text-xs">
            <p className="font-semibold text-purple-300 mb-2">How it works:</p>
            <ul className="space-y-1 text-purple-200">
              <li>• Turn ON mic, speak your answer</li>
              <li>• Turn OFF mic to submit</li>
              <li>• AI analyzes speech + code together</li>
              <li>• Ask for clarification anytime</li>
              <li>• Say "next question" to proceed</li>
            </ul>
          </div>

          {finalTranscript && (
            <div className="mt-4 p-3 bg-blue-900/20 rounded-xl text-xs">
              <p className="font-semibold text-blue-300 mb-2">Current Speech:</p>
              <p className="text-blue-200 italic">"{finalTranscript}"</p>
            </div>
          )}
        </div>
        
        <div className="w-3/5 flex flex-col">
          <div className="p-3 border-b border-white/10 bg-gray-900/40">
            <select 
              value={language} 
              onChange={(e) => handleLanguageChange(e.target.value)} 
              className="bg-black p-1.5 rounded-lg border border-white/10 text-white"
            >
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
              <option value="sql">SQL</option>
            </select>
          </div>
          <div className="flex-1 border-r border-white/10">
            <Editor 
              height="100%" 
              language={language} 
              value={code} 
              onChange={handleEditorChange} 
              theme="vs-dark" 
              options={{ 
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false
              }} 
            />
          </div>
        </div>

        <div className="w-1/5 flex flex-col bg-gray-900/40">
          <div className="h-1/2 flex items-center justify-center border-b border-white/10">
            {isAiSpeaking ? (
              <div className="text-center">
                <Lottie animationData={assistantSpeaking} loop autoPlay className="h-16 w-16 mx-auto" />
                <p className="mt-3 font-semibold">AI Assistant</p>
                <p className="text-sm text-white/60">Speaking…</p>
              </div>
            ) : (
              <div className="text-center">
                <Lottie animationData={assistantAnim} loop autoPlay className="h-16 w-16 mx-auto" />
                <p className="mt-3 font-semibold">AI Assistant</p>
                <p className="text-sm text-white/60">
                  {isEvaluating ? 'Analyzing...' : 'Ready'}
                </p>
              </div>
            )}
          </div>

          <div className="h-1/2 flex items-center justify-center">
            {stream ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover rounded" 
              />
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-4">📹</div>
                <p className="font-semibold">Your Camera</p>
                <p className="text-sm text-white/60">Loading...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="p-4 border-t border-white/10">
        <div className="flex justify-center items-center space-x-6">
          <div className="relative group">
            <button
              onClick={handleMicToggle}
              disabled={isAiSpeaking || isEvaluating}
              className={`p-3 rounded-full transition-all duration-200 ${
                isAiSpeaking || isEvaluating
                  ? 'opacity-50 cursor-not-allowed bg-gray-600' 
                  : isMicOn 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse shadow-lg shadow-red-500/20' 
                    : 'bg-white/5 ring-1 ring-white/10 hover:bg-white/20'
              }`}
            >
              {isMicOn ? <Mic className="text-white" /> : <MicOff />}
            </button>
            {(isAiSpeaking || isEvaluating) && (
              <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {isEvaluating ? 'AI is processing your response...' : 'Please wait for AI to finish speaking'}
              </div>
            )}
          </div>
          
          <div className="relative group">
            <button 
              onClick={handleCameraToggle}
              disabled={true}
              className="p-3 rounded-full transition-colors opacity-50 cursor-not-allowed bg-gray-600"
            >
              <Camera className="text-white" />
            </button>
            <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Camera must stay ON for security purposes
            </div>
          </div>
          
          <button 
            onClick={handleEndInterviewClick}
            className="bg-red-600 px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-red-700 transition-colors"
          >
            <Phone />
            <span>End Interview</span>
          </button>
        </div>
      </footer>
      
      <TimeWrapingToast show={showTimeWarning} onClose={() => setShowTimeWarning(false)} />
      
      <FullscreenWarningModal 
        show={showFullscreenWarning} 
        onOk={handleFullscreenWarningOk}
        warningCount={fullscreenWarnings} 
      />
      
      <EndInterviewModal 
        show={showEndInterviewModal}
        onConfirm={handleEndInterviewConfirm}
        onCancel={handleEndInterviewCancel}
      />
      
      <EvaluatingIndicator show={isEvaluating} message={evaluatingMessage} />
    </div>
  );
}

export default Interview;
