import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AppContext = createContext(null);

// Demo Personas
export const personas = {
    responsibleStudent: {
        id: 'responsible-student',
        name: 'Responsible Student',
        description: 'Strong rent history, small but stable savings, part-time income',
        avatar: '🎓',
        signals: {
            paymentReliability: { score: 92, label: 'Excellent', onTime: 11, total: 12 },
            savingsStability: { score: 78, label: 'Good', trend: '+5.2%' },
            incomeConsistency: { score: 72, label: 'Moderate', type: 'Part-time + Aid' },
            spendingStability: { score: 85, label: 'Strong', volatility: 'Low' },
        },
        trustScore: 84,
        riskTier: 'Low Risk',
        confidenceLevel: 'High',
        factors: [
            { text: '11/12 rent payments on time', type: 'positive' },
            { text: 'Stable savings growth (+5.2%)', type: 'positive' },
            { text: 'Regular income deposits', type: 'positive' },
            { text: '1 late utility payment', type: 'negative' },
            { text: 'Consistent spending patterns', type: 'positive' },
        ],
        history: {
            score: [
                { month: 'Aug', score: 72 },
                { month: 'Sep', score: 76 },
                { month: 'Oct', score: 79 },
                { month: 'Nov', score: 81 },
                { month: 'Dec', score: 83 },
                { month: 'Jan', score: 84 },
            ],
            payments: [
                { month: 'Aug', onTime: 4, late: 0 },
                { month: 'Sep', onTime: 5, late: 1 },
                { month: 'Oct', onTime: 5, late: 0 },
                { month: 'Nov', onTime: 5, late: 0 },
                { month: 'Dec', onTime: 6, late: 0 },
                { month: 'Jan', onTime: 5, late: 0 },
            ],
            savings: [
                { month: 'Aug', amount: 450 },
                { month: 'Sep', amount: 520 },
                { month: 'Oct', amount: 580 },
                { month: 'Nov', amount: 640 },
                { month: 'Dec', amount: 710 },
                { month: 'Jan', amount: 780 },
            ],
        },
    },
    volatileFreelancer: {
        id: 'volatile-freelancer',
        name: 'Volatile Freelancer',
        description: 'Irregular income, spending spikes, moderate payment reliability',
        avatar: '💼',
        signals: {
            paymentReliability: { score: 68, label: 'Moderate', onTime: 8, total: 12 },
            savingsStability: { score: 45, label: 'Needs Work', trend: '-2.1%' },
            incomeConsistency: { score: 42, label: 'Weak', type: 'Variable' },
            spendingStability: { score: 52, label: 'Moderate', volatility: 'High' },
        },
        trustScore: 58,
        riskTier: 'Medium Risk',
        confidenceLevel: 'Medium',
        factors: [
            { text: '4 late payments in past year', type: 'negative' },
            { text: 'High spending spikes in March', type: 'negative' },
            { text: 'Some consistent utility payments', type: 'positive' },
            { text: 'Irregular savings pattern', type: 'negative' },
            { text: 'Income varies by 40% monthly', type: 'negative' },
        ],
        history: {
            score: [
                { month: 'Aug', score: 62 },
                { month: 'Sep', score: 58 },
                { month: 'Oct', score: 55 },
                { month: 'Nov', score: 52 },
                { month: 'Dec', score: 56 },
                { month: 'Jan', score: 58 },
            ],
            payments: [
                { month: 'Aug', onTime: 3, late: 2 },
                { month: 'Sep', onTime: 4, late: 1 },
                { month: 'Oct', onTime: 5, late: 0 },
                { month: 'Nov', onTime: 3, late: 1 },
                { month: 'Dec', onTime: 4, late: 0 },
                { month: 'Jan', onTime: 5, late: 0 },
            ],
            savings: [
                { month: 'Aug', amount: 1200 },
                { month: 'Sep', amount: 800 },
                { month: 'Oct', amount: 1100 },
                { month: 'Nov', amount: 500 },
                { month: 'Dec', amount: 1400 },
                { month: 'Jan', amount: 900 },
            ],
        },
    },
    perfectPayer: {
        id: 'perfect-payer',
        name: 'Perfect Payer, Low Savings',
        description: 'All bills on time, very low savings buffer, stable but low income',
        avatar: '⭐',
        signals: {
            paymentReliability: { score: 100, label: 'Excellent', onTime: 12, total: 12 },
            savingsStability: { score: 35, label: 'Needs Work', trend: '+0.5%' },
            incomeConsistency: { score: 88, label: 'Strong', type: 'Salary' },
            spendingStability: { score: 90, label: 'Strong', volatility: 'Very Low' },
        },
        trustScore: 76,
        riskTier: 'Low-Medium Risk',
        confidenceLevel: 'High',
        factors: [
            { text: 'Perfect payment record (12/12)', type: 'positive' },
            { text: 'Extremely consistent spending', type: 'positive' },
            { text: 'Low savings buffer ($320)', type: 'negative' },
            { text: 'Stable salary deposits', type: 'positive' },
            { text: 'No emergency fund', type: 'negative' },
        ],
        history: {
            score: [
                { month: 'Aug', score: 74 },
                { month: 'Sep', score: 75 },
                { month: 'Oct', score: 75 },
                { month: 'Nov', score: 76 },
                { month: 'Dec', score: 76 },
                { month: 'Jan', score: 76 },
            ],
            payments: [
                { month: 'Aug', onTime: 5, late: 0 },
                { month: 'Sep', onTime: 5, late: 0 },
                { month: 'Oct', onTime: 6, late: 0 },
                { month: 'Nov', onTime: 5, late: 0 },
                { month: 'Dec', onTime: 6, late: 0 },
                { month: 'Jan', onTime: 5, late: 0 },
            ],
            savings: [
                { month: 'Aug', amount: 280 },
                { month: 'Sep', amount: 290 },
                { month: 'Oct', amount: 300 },
                { month: 'Nov', amount: 310 },
                { month: 'Dec', amount: 315 },
                { month: 'Jan', amount: 320 },
            ],
        },
    },
};

// Calculate weighted trust score
export function calculateTrustScore(signals) {
    const weights = {
        paymentReliability: 0.40,
        savingsStability: 0.25,
        incomeConsistency: 0.20,
        spendingStability: 0.15,
    };

    let score = 0;
    for (const [key, weight] of Object.entries(weights)) {
        score += (signals[key]?.score || 0) * weight;
    }
    return Math.round(score);
}

export function AppProvider({ children }) {
    const [currentPersonaId, setCurrentPersonaId] = useState('responsibleStudent');
    const [viewMode, setViewMode] = useState('user'); // 'user' | 'business'
    const [passportGenerated, setPassportGenerated] = useState(false);

    const currentPersona = personas[currentPersonaId];

    // Get status color based on score
    const getStatusColor = useCallback((score) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'danger';
    }, []);

    // Get status label based on score
    const getStatusLabel = useCallback((score) => {
        if (score >= 80) return 'Strong';
        if (score >= 60) return 'Moderate';
        return 'Needs Work';
    }, []);

    // Get risk color
    const getRiskColor = useCallback((tier) => {
        if (tier.includes('Low')) return 'success';
        if (tier.includes('Medium')) return 'warning';
        return 'danger';
    }, []);

    // Generate passport
    const generatePassport = useCallback(() => {
        setPassportGenerated(true);
    }, []);

    // Switch persona
    const switchPersona = useCallback((personaId) => {
        setCurrentPersonaId(personaId);
        setPassportGenerated(false);
    }, []);

    // Toggle view mode
    const toggleViewMode = useCallback(() => {
        setViewMode(prev => prev === 'user' ? 'business' : 'user');
    }, []);

    const value = useMemo(() => ({
        // Persona data
        currentPersona,
        currentPersonaId,
        personas,
        switchPersona,

        // View mode
        viewMode,
        setViewMode,
        toggleViewMode,

        // Passport
        passportGenerated,
        generatePassport,

        // Helpers
        getStatusColor,
        getStatusLabel,
        getRiskColor,
    }), [
        currentPersona, currentPersonaId, viewMode, passportGenerated,
        switchPersona, toggleViewMode, generatePassport,
        getStatusColor, getStatusLabel, getRiskColor
    ]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}
