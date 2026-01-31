import { createContext, useContext, useState, useCallback } from 'react';
import { personas, defaultPersonaId, generateBlockchainProof } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [currentPersonaId, setCurrentPersonaId] = useState(defaultPersonaId);
    const [demoMode, setDemoMode] = useState(false);
    const [judgeView, setJudgeView] = useState(false);
    const [blockchainProof, setBlockchainProof] = useState(null);
    const [verificationStep, setVerificationStep] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    const [passportGenerated, setPassportGenerated] = useState(false);

    const currentPersona = personas[currentPersonaId];

    const switchPersona = useCallback((personaId) => {
        if (personas[personaId]) {
            setCurrentPersonaId(personaId);
            setBlockchainProof(null);
            setPassportGenerated(personas[personaId].passportStatus === 'verified');
            setVerificationStep(0);
        }
    }, []);

    const toggleDemoMode = useCallback(() => {
        setDemoMode(prev => !prev);
    }, []);

    const toggleJudgeView = useCallback(() => {
        setJudgeView(prev => !prev);
    }, []);

    const generatePassport = useCallback(async () => {
        setIsVerifying(true);

        // Simulate verification steps
        for (let step = 1; step <= 3; step++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setVerificationStep(step);
        }

        // Generate blockchain proof
        const proof = generateBlockchainProof(currentPersona);
        setBlockchainProof(proof);
        setPassportGenerated(true);
        setIsVerifying(false);

        return proof;
    }, [currentPersona]);

    const resetVerification = useCallback(() => {
        setVerificationStep(0);
        setBlockchainProof(null);
        setPassportGenerated(false);
        setIsVerifying(false);
    }, []);

    const value = {
        // State
        currentPersona,
        currentPersonaId,
        personas,
        demoMode,
        judgeView,
        blockchainProof,
        verificationStep,
        isVerifying,
        passportGenerated,

        // Actions
        switchPersona,
        toggleDemoMode,
        toggleJudgeView,
        generatePassport,
        resetVerification,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
