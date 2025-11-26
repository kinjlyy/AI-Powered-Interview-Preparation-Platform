import React, { useState, useCallback, useMemo, useEffect, createContext, useContext, useRef } from 'react';

// --- API Configuration ---
// CRITICAL: Prefer a server-side proxy for the API key. For local dev only: set VITE_GEMINI_API_KEY in `.env`.
const apiKey: string = import.meta.env.VITE_GEMINI_API_KEY ;
const MODEL_NAME = 'gemini-2.5-flash'; // Standard, fast model
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

// --- Context for Select Component (Mimicking Radix/shadcn state passing) ---
type SelectContextType = {
    value?: any;
    open?: boolean;
    toggleOpen?: () => void;
    handleSelect?: (v: any) => void;
};
const SelectContext = createContext<SelectContextType>({});

// --- Icons (Lucide-react substitutes) ---
const ChevronDown = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="20 6 9 17 4 12"/></svg>
);
const ClockIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

// --- Custom Components (Select, SelectTrigger, etc.) ---

const Select = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => { setOpen(prev => !prev); }, []);
  const handleSelect = useCallback((newValue) => {
    onValueChange(newValue);
    setOpen(false); 
  }, [onValueChange]);

  const contextValue = useMemo(() => ({ value, open, toggleOpen, handleSelect }), [value, open, toggleOpen, handleSelect]);

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = ({ children, className = '', placeholder }) => {
  const { toggleOpen, value } = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={toggleOpen}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-inner transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
    >
      {value ? children : <span className="text-gray-500">{placeholder}</span>}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

const SelectValue = ({ children }) => {
  const { value } = useContext(SelectContext);
  return <span className="truncate">{value || children}</span>;
};

const SelectContent = ({ children, className = '' }) => {
  const { open } = useContext(SelectContext);
  if (!open) return null;

  return (
    <div className={`absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-2xl overflow-hidden animate-in fade-in-0 duration-150 ${className}`}>
      <div className="p-1 max-h-60 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const SelectItem = ({ value, children }) => {
  const { handleSelect, value: currentValue } = useContext(SelectContext);
  const isSelected = currentValue === value;

  return (
    <div
      onClick={() => handleSelect(value)}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-gray-100 ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : ''}`}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <CheckIcon />
        </span>
      )}
      {children}
    </div>
  );
};

// --- Interview Configuration Data ---
const InterviewOptions = {
    types: ["General", "Role-Specific", "Company-Specific"],
    roles: ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer"],
    levels: ["Entry-Level", "Mid-Level", "Senior"],
    topics: {
        "Company-Specific": ["Google", "Meta", "Amazon", "Netflix", "Microsoft"]
    },
};

// Fixed round durations: 30 min (Tech) + 45 min (Code) + 15 min (HR) = 90 min total
const initialRounds = [
    { id: 1, name: "Technical Concepts & Architecture (30 min)", type: 'Technical', duration: 30 * 60 },
    { id: 2, name: "Coding Challenge (45 min)", type: 'Coding', duration: 45 * 60 },
    { id: 3, name: "Behavioral & Culture Fit (15 min)", type: 'Behavioral', duration: 15 * 60 }
];

const codingQuestions = [
    {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        link: "https://leetcode.com/problems/two-sum/",
        difficulty: "Easy"
    },
    {
        title: "Merge Intervals",
        description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        link: "https://leetcode.com/problems/merge-intervals/",
        difficulty: "Medium"
    },
];

// Custom Hook for API calls with Exponential Backoff
const useGeminiApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const callApi = useCallback(async (prompt, systemInstruction = null) => {
        // --- CRITICAL FIX 1: Check for API Key ---
        if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
             const keyError = "API Key is missing or invalid. Please replace 'YOUR_GEMINI_API_KEY_HERE' in the code's API Configuration section.";
             setError(keyError);
             setIsLoading(false);
             return `Error: ${keyError}`;
        }
        
        setIsLoading(true);
        setError(null);
        let result = null;

        const promptWithSystem = systemInstruction ? `System: ${systemInstruction}\n\n${prompt}` : prompt;
        const payload = {
            contents: [{ parts: [{ text: promptWithSystem }] }],
            // use the correct field name for Gemini generation options
            generationConfig: {
                temperature: 0.7,
                candidateCount: 1
            }
        };

        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorDetails = await response.json();
                    const errorMessage = `HTTP error! status: ${response.status}. Details: ${errorDetails.error?.message || response.statusText}`;
                    throw new Error(errorMessage);
                }

                const jsonResult = await response.json();
                result = jsonResult.candidates?.[0]?.content?.parts?.[0]?.text || "No response received. The model may have blocked the response.";
                
                break; 
            } catch (e) {
                console.error(`Attempt ${attempt + 1} failed:`, e);
                setError(`Attempt ${attempt + 1} failed: ${e.message}`);
                
                if (attempt === 4) {
                    setIsLoading(false); 
                    // Re-throw if it was the last attempt
                    throw e; 
                }

                const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        setIsLoading(false);
        return result;
    }, []);

    return { callApi, isLoading, error };
};

// Time Formatting Helper
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// --- UI Sub-Components (Defined here to be accessible by MockInterview) ---

const RoundProgressBar = ({ rounds, currentIndex }) => {
    return (
        <div className="flex justify-between items-center mb-6">
            {rounds.map((round, index) => {
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;
                
                return (
                    <React.Fragment key={round.id}>
                        {index > 0 && (
                            <div className={`flex-1 h-1 transition-all duration-500 ${isCompleted ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        )}
                        <div className={`flex flex-col items-center z-10 transition-all duration-500`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 transition-all duration-500 ${
                                isCompleted ? 'bg-blue-500 border-blue-700 text-white' : 
                                isActive ? 'bg-cyan-600 border-cyan-800 text-white scale-110 ring-4 ring-cyan-300' :
                                'bg-gray-200 border-gray-400 text-gray-700'
                            }`}>
                                {index + 1}
                            </div>
                            <span className={`text-xs mt-1 text-center font-medium w-24 transition-colors duration-500 ${isActive ? 'text-cyan-700' : 'text-gray-500'}`}>{round.name.split('(')[0].trim()}</span>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const CodingRoundUI = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Problem Set (45 Minute Duration)</h3>
        
        {codingQuestions.map((q, index) => (
            <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-md transition-all hover:shadow-lg">
                <div className="flex justify-between items-start">
                    <h4 className="text-lg font-semibold text-gray-900">{index + 1}. {q.title}</h4>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ml-4 ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {q.difficulty}
                    </span>
                </div>
                <p className="mt-2 text-gray-600">{q.description}</p>
                <a href={q.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    View Full Problem Details
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m-6-6L10 10"/></svg>
                </a>
            </div>
        ))}
        
        <div className="mt-8">
            <p className="text-md font-semibold text-gray-700 mb-2">Code/Notes Area:</p>
            <textarea
                className="w-full p-4 border border-gray-300 rounded-xl shadow-inner resize-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 bg-gray-50 text-gray-900 font-mono"
                rows={10}
                placeholder="Write your code, pseudo-code, or solution notes here..."
            ></textarea>
        </div>
    </div>
);

const InterviewControls = ({ onSend, loading, onAdvanceRound, isLastRound, roundType, currentRound }) => {
    const [answer, setAnswer] = useState('');
    const inputRef = useRef(null); 

    const handleSubmit = () => {
        onSend(answer);
        setAnswer('');
    };
    
    // This is true for Technical and Behavioral rounds
    const isAIInteractionRound = roundType !== 'Coding';
    
    // Define specific placeholder text based on loading state
    const placeholderText = loading 
        ? 'Interviewer is currently formulating the next question or response. Please wait...' 
        : "Type your answer to the interviewer's question or prompt here...";
        
    const isAnimatingRound = currentRound.isAnimatingRound; // Added isAnimatingRound prop to disable button during transition

    return (
        <div className="mt-6 border-t pt-6">
            {isAIInteractionRound ? (
                <div className="space-y-3">
                    {/* Status Message for Disabled Input */}
                    {loading && (
                        <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-red-800 text-sm font-semibold flex items-center justify-between">
                            <span>
                                <svg className="animate-spin inline mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356-2A8.001 8.001 0 004.582 18m15.356-2A8.001 8.001 0 018.582 6m-3.956 2l-2-2m2 2l2 2"/></svg>
                                Input disabled: Interviewer is thinking/typing.
                            </span>
                        </div>
                    )}
                    <textarea
                        ref={inputRef} 
                        className="w-full p-4 border border-gray-300 rounded-xl shadow-inner resize-none focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-150 bg-white text-gray-900"
                        rows={4}
                        placeholder={placeholderText}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        // Input is disabled ONLY if loading is true
                        disabled={loading}
                    ></textarea>
                    <div className="flex justify-end">
                         <button
                            onClick={handleSubmit}
                            disabled={loading || !answer.trim()}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 shadow-lg ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                            }`}
                        >
                            {loading ? 'Interviewer is Typing...' : 'Go to Next Question (Send Response)'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 font-medium text-center">
                    This is the **Coding Challenge** round. AI interaction is paused. Use the code area above for your solution and click the button below when you are ready to advance.
                </div>
            )}
            
            <div className="flex justify-center items-center mt-6">
                <button
                    onClick={onAdvanceRound}
                    // Button is enabled only if not loading AND not animating/transitioning
                    disabled={loading || isAnimatingRound} 
                    className={`px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 shadow-xl ${
                        loading || isAnimatingRound
                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                            : isLastRound 
                                ? 'bg-red-500 hover:bg-red-600 text-white' 
                                : 'bg-indigo-500 hover:bg-indigo-600 text-white transform hover:scale-105'
                    }`}
                >
                    {isAnimatingRound ? 'Transitioning...' : isLastRound ? 'End Interview' : `Advance to Next Round: ${currentRound.rounds[currentRound.currentRoundIndex + 1]?.name || '...' }`}
                </button>
            </div>
        </div>
    );
};

const InterviewSetup = ({ state, setters, onStart, loading }) => {
    const { selectedType, selectedRole, selectedCompany, selectedLevel } = state;
    const { setSelectedType, setSelectedRole, setSelectedCompany, setSelectedLevel } = setters;
    
    const roles = InterviewOptions.roles;
    const companies = InterviewOptions.topics["Company-Specific"];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Set Your Target (90 Minute Session)</h2>
            
            {/* 1. Interview Type Selection */}
            <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-cyan-600 mr-2"></span> Interview Focus Type
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger placeholder="Select Interview Type">
                        <SelectValue>{selectedType}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {InterviewOptions.types.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* 2. Dynamic Selections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target Role Selection */}
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Target Role</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger placeholder="Select Target Role">
                            <SelectValue>{selectedRole}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map(r => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                {/* Target Company/Level Selection */}
                {selectedType === "Company-Specific" ? (
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-gray-700">Target Company</label>
                        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                            <SelectTrigger placeholder="Select Target Company">
                                <SelectValue>{selectedCompany}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-gray-700">Interview Level</label>
                        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                            <SelectTrigger placeholder="Select Level">
                                <SelectValue>{selectedLevel}</SelectValue>
                            </SelectTrigger>
                        <SelectContent>
                                {InterviewOptions.levels.map(l => (
                                    <SelectItem key={l} value={l}>{l}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
            
            {/* Fixed Duration Info */}
            <div className="p-4 bg-blue-50 border-l-4 border-blue-300 text-blue-800 rounded-lg text-sm font-medium">
                This simulation is a fixed 90-minute session: 30 min (Technical) + 45 min (Coding) + 15 min (HR/Behavioral).
            </div>

            <button
                onClick={onStart}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-extrabold text-lg shadow-2xl transition-all duration-300 transform ${
                    loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.01]'
                } hover:ring-4 ring-blue-300`}
            >
                {loading ? 'Preparing Interviewer...' : `Start 90-Minute Mock Interview`}
            </button>
        </div>
    );
};

// --- Main Component: MockInterview ---
const MockInterview = () => {
    // Configuration State
    const [selectedType, setSelectedType] = useState(InterviewOptions.types[0]);
    const [selectedCompany, setSelectedCompany] = useState(InterviewOptions.topics["Company-Specific"][0]);
    const [selectedRole, setSelectedRole] = useState(InterviewOptions.roles[0]);
    const [selectedLevel, setSelectedLevel] = useState(InterviewOptions.levels[0]);
    
    // Interview Execution State
    const [interviewOutput, setInterviewOutput] = useState('');
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0); 
    const [currentRound, setCurrentRound] = useState({ 
        name: 'Preparation', 
        type: 'Setup', 
        currentRoundIndex: -1, 
        rounds: [],
        isAnimatingRound: false // Added state for button disabling during transition
    });
    
    const { callApi, isLoading, error } = useGeminiApi();
    const outputRef = useRef(null); // Ref for scrolling output

    // Auto-scroll chat window when output changes
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [interviewOutput]);


    // Timer Logic: Tracks time remaining in the CURRENT ROUND
    useEffect(() => {
        if (!isInterviewStarted || timeLeft <= 0 || currentRound.currentRoundIndex === -1) return;

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timerId);
                    
                    if (currentRound.currentRoundIndex < currentRound.rounds.length - 1) {
                        setInterviewOutput(prev => prev + "\n\n--- TIME'S UP FOR THIS ROUND! --- \n\nInterviewer: That's our time for this section. Please press 'Advance to Next Round' to continue.");
                    } else {
                        endInterview("Round time expired for the final round.");
                    }
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [isInterviewStarted, timeLeft, currentRound.currentRoundIndex, currentRound.rounds.length]);


    // Derived Context for Interview Prompts
    const interviewContext = useMemo(() => {
        let focus = selectedRole;
        if (selectedType === "Company-Specific") {
            focus = `${selectedRole} at ${selectedCompany}`;
        } else if (selectedType === "General") {
            focus = `General ${selectedRole || 'Professional'}`;
        }
        return {
            focus,
            setupInfo: `Interview Type: ${selectedType}, Role: ${selectedRole}, Level: ${selectedLevel}, Context: ${focus}`,
        };
    }, [selectedType, selectedRole, selectedCompany, selectedLevel]);
    
    // --- Interview Control Functions ---

    const endInterview = (reason = "User ended session manually.") => {
        setIsInterviewStarted(false);
        setInterviewOutput(prev => prev + `\n\n--- INTERVIEW ENDED --- \nReason: ${reason}`);
        setCurrentRound({ name: 'Preparation', type: 'Setup', currentRoundIndex: -1, rounds: [], isAnimatingRound: false });
        setTimeLeft(0); // Reset timer
    };

    const advanceRound = async () => {
        const nextIndex = currentRound.currentRoundIndex + 1;
        const rounds = currentRound.rounds;

        if (nextIndex < rounds.length) {
            setCurrentRound(prev => ({ ...prev, isAnimatingRound: true }));
            
            const nextRound = rounds[nextIndex];
            let newQuestion = null;

            // 1. Prepare initial output and set next round's duration
            setInterviewOutput(`--- STARTING ROUND ${nextIndex + 1}: ${nextRound.name} --- \n\n`);
            setTimeLeft(nextRound.duration);

            // 2. Only call AI if it's not the coding round
            if (nextRound.type !== 'Coding') {
                setInterviewOutput(prev => prev + "Interviewer: Setting up the next question...");

                const systemPrompt = `You are a professional interviewer for a ${selectedLevel} ${interviewContext.focus}. This is the ${nextRound.name} round. Your task is to ask the first, specific, scenario-based question for this round, matching the round type (${nextRound.type}). Only ask one question.`;
                const userPrompt = `Start the new round with the first question for the ${nextRound.name}. Setup: ${interviewContext.setupInfo}`;
                
                try {
                    newQuestion = await callApi(userPrompt, systemPrompt);
                } catch (e) {
                    newQuestion = `Error: Could not start the new round. Please proceed manually. (API Error: ${e.message})`;
                }

                // 3. Update output after API call is done
                setInterviewOutput(prev => prev.replace("Interviewer: Setting up the next question...", `Interviewer: ${newQuestion || "The question will appear here shortly..."}`));

            } else {
                 setInterviewOutput(prev => prev + `Interviewer: Welcome to the Coding Challenge round. You have ${nextRound.duration / 60} minutes to complete the tasks. Please press 'Advance to Next Round' when done, or if time expires, you will be prompted to move on. The problems are displayed in the section below.`);
            }

            // 4. Update round state and end animation
            setCurrentRound(prev => ({ 
                ...prev, 
                name: nextRound.name, 
                type: nextRound.type, 
                currentRoundIndex: nextIndex,
                isAnimatingRound: false
            }));

        } else {
            // All rounds complete
            endInterview("All planned rounds successfully completed.");
        }
    }

    const startInterview = async () => {
        const rounds = initialRounds;
        const firstRound = rounds[0];

        // 1. Set full initial state and start the timer
        setCurrentRound({ 
            name: firstRound.name, 
            type: firstRound.type, 
            currentRoundIndex: 0, 
            rounds: rounds,
            isAnimatingRound: false
        });
        setIsInterviewStarted(true);
        setTimeLeft(firstRound.duration);
        
        // 2. Prepare initial output
        setInterviewOutput(`--- STARTING ROUND 1: ${firstRound.name} --- \n\n`);

        if (firstRound.type === 'Coding') {
             // This branch should not run for Round 1 in this structure, but kept for robustness
            setInterviewOutput(prev => prev + `Interviewer: Welcome to the Coding Challenge round. You have ${firstRound.duration / 60} minutes to complete the tasks. Please press 'Advance to Next Round' when done, or if time expires, you will be prompted to move on.`);
        } else {
            setInterviewOutput(prev => prev + "Interviewer: Setting up the first question for this round...");
            
            const systemPrompt = `You are a professional interviewer for a ${selectedLevel} ${interviewContext.focus}. This is the ${firstRound.name} round. Your task is to ask the first, specific, scenario-based question for this round, matching the round type (${firstRound.type}). Only ask one question.`;
            const userPrompt = `Start the new round with the first question for the ${firstRound.name}. Setup: ${interviewContext.setupInfo}`;

            try {
                // --- CRITICAL FIX 2: Await the API call here ---
                const newQuestion = await callApi(userPrompt, systemPrompt);
                
                // Update the output with the actual response or error
                setInterviewOutput(prev => prev.replace("Interviewer: Setting up the first question for this round...", `Interviewer: ${newQuestion}`));
            } catch (e) {
                // Catch potential error thrown by callApi (e.g., key missing, network)
                setInterviewOutput(prev => prev.replace("Interviewer: Setting up the first question for this round...", `Error: Could not start the new round. Please check the API key and connection. (API Error: ${e.message})`));
            }
        }
    };
    
    const continueInterview = async (answer) => {
        // Input remains enabled as long as isLoading is false
        if (!answer.trim() || isLoading) return;
        
        // Start showing the "Analyzing..." message while API call is pending
        setInterviewOutput(prev => prev + `\n\n[Your Answer]: ${answer}\n\nInterviewer: Analyzing...`);

        const interviewHistory = `
            Context: ${selectedLevel} ${interviewContext.focus}, Round: ${currentRound.name}. Time Remaining: ${formatTime(timeLeft)}.
            --- HISTORY (Last turn and your answer) ---
            ${interviewOutput.split('\n\n').slice(-3).join('\n\n')} 
            [Your Answer]: ${answer}
            ---
        `;

        const systemPrompt = `You are a professional interviewer for the ${currentRound.name}. Given the history, provide a concise follow-up, critique, or the next logical question. Your response should maintain the professional tone. Keep your response short and focused.`;

        try {
            const followUp = await callApi(interviewHistory, systemPrompt);
            // Replace the 'Analyzing...' placeholder with the actual response
            setInterviewOutput(prev => prev.replace("Interviewer: Analyzing...", `Interviewer: ${followUp}`));
        } catch (e) {
            setInterviewOutput(prev => prev.replace("Interviewer: Analyzing...", `Error in follow-up. Please try again. (API Error: ${e.message})`));
        }
    };
    
    // --- Main Component Render ---
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4 sm:p-8 font-sans">
            <style>{`
                /* Round transition animation for smooth flow */
                .round-transition {
                    animation: fade-out-in 1s ease-in-out;
                }
                @keyframes fade-out-in {
                    0% { opacity: 1; transform: scale(1); }
                    40% { opacity: 0; transform: scale(0.98); }
                    60% { opacity: 0; transform: scale(0.98); }
                    100% { opacity: 1; transform: scale(1); }
                }
                /* CRITICAL FIX: Explicitly set caret color for visibility */
                textarea {
                    caret-color: #000000 !important;
                    outline: 1px solid transparent; 
                }
                textarea:focus {
                     border-color: var(--color-cyan-500, #06b6d4) !important;
                     box-shadow: 0 0 0 1px var(--color-cyan-500, #06b6d4) !important;
                }
            `}</style>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
                    Mock Interview Simulator Pro
                </h1>
                
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl transition-all duration-500">
                    {/* Display API Error at the top */}
                    {error && (
                        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-medium">
                            <h3 className="font-bold">🚨 API Configuration/Network Error</h3>
                            <p>{error}</p>
                            {apiKey === "YOUR_GEMINI_API_KEY_HERE" && (
                                <p className="mt-2 text-sm">**Action Required:** Please replace the placeholder API key with your actual Gemini API key in the code's API Configuration section.</p>
                            )}
                        </div>
                    )}

                    {isInterviewStarted ? (
                        <div className={currentRound.isAnimatingRound ? 'round-transition' : ''}>
                            {/* Interview Header & Progress */}
                            <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
                                <div className="text-lg font-semibold text-gray-700">
                                    🎯 Target: <span className="text-cyan-700">{interviewContext.focus}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xl font-extrabold text-red-600 p-2 bg-red-50 rounded-lg shadow-inner">
                                    <ClockIcon className="h-6 w-6"/>
                                    <span>{formatTime(timeLeft)}</span>
                                </div>
                            </div>
                            
                            {/* Round Progress Bar */}
                            <RoundProgressBar 
                                rounds={currentRound.rounds} 
                                currentIndex={currentRound.currentRoundIndex} 
                            />
                            
                            {/* Round Content Area */}
                            <div className="relative">
                                {currentRound.type === 'Coding' ? (
                                    <CodingRoundUI />
                                ) : (
                                    /* Chat Output */
                                    <div 
                                        ref={outputRef} 
                                        className="h-80 overflow-y-auto p-4 border border-gray-300 rounded-xl bg-gray-50 whitespace-pre-wrap text-sm shadow-inner transition-all duration-300"
                                    >
                                        {interviewOutput}
                                    </div>
                                )}
                            </div>
                            
                            {/* Controls */}
                            <InterviewControls 
                                onSend={continueInterview} 
                                loading={isLoading}
                                onAdvanceRound={advanceRound}
                                isLastRound={currentRound.currentRoundIndex === currentRound.rounds.length - 1}
                                roundType={currentRound.type}
                                currentRound={currentRound} // Pass currentRound state
                            />
                            
                            {/* End Interview Button (Always visible during interview) */}
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => endInterview("Manual user termination.")}
                                    disabled={currentRound.isAnimatingRound}
                                    className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    Prematurely End Session
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Interview Setup Screen */
                        <InterviewSetup 
                            state={{ selectedType, selectedRole, selectedCompany, selectedLevel }}
                            setters={{ setSelectedType, setSelectedRole, setSelectedCompany, setSelectedLevel }}
                            onStart={startInterview}
                            loading={isLoading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MockInterview;