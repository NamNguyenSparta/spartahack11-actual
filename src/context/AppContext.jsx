import { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext();

// ============================================
// SIMULATED MOCK DATA - Proper Student Timeline
// ============================================
const MOCK_PERSONAS = {
    'responsible-student': {
        id: 'responsible-student',
        name: 'Scholarship Student',
        avatar: '🎓',
        role: 'Student',
        year: 'Freshman',
        university: 'Michigan State University',
        history: {
            score: [{ month: 'Aug', score: 72 }, { month: 'Sep', score: 76 }, { month: 'Oct', score: 79 }, { month: 'Nov', score: 81 }, { month: 'Dec', score: 83 }, { month: 'Jan', score: 84 }],
            payments: [{ month: 'Jan', onTime: 5, late: 0 }],
            savings: [{ month: 'Jan', amount: 780 }],
        },
        signals: { spendingStability: { volatility: 15 } },
        timeline: [
            { id: 1, year: 1, semester: 'Fall', term: 'Fall 2024', type: 'study', title: 'Freshman - Fall Semester', description: 'First semester of college journey', tuition: 12500, fees: 1800, housing: 5500, mealPlan: 2400, scholarships: 8000, loans: 5500, workStudy: 1200, status: 'completed' },
            { id: 2, year: 1, semester: 'Spring', term: 'Spring 2025', type: 'study', title: 'Freshman - Spring Semester', description: 'Second semester, declared major', tuition: 12500, fees: 1800, housing: 5500, mealPlan: 2400, scholarships: 8000, loans: 5500, workStudy: 1500, status: 'active' },
            { id: 3, year: 'Summer', semester: 'Summer', term: 'Summer 2025', type: 'work', title: 'Summer Internship', description: 'Software Engineering Intern at Tech Corp', tuition: 0, fees: 0, housing: 0, mealPlan: 0, scholarships: 0, loans: 0, workStudy: 0, income: 8000, status: 'future' },
            { id: 4, year: 2, semester: 'Fall', term: 'Fall 2025', type: 'study', title: 'Sophomore - Fall Semester', description: 'Core major courses begin', tuition: 13200, fees: 1900, housing: 5800, mealPlan: 2600, scholarships: 9000, loans: 6000, workStudy: 2000, status: 'future' },
        ],
        wealth: {
            accountBalance: 2450,
            savingsGoal: 5000,
            roi: 450,
            projected: 142000,
            chart: [
                { month: 'Aug', amount: 1200 }, { month: 'Sep', amount: 1350 }, { month: 'Oct', amount: 1550 },
                { month: 'Nov', amount: 1800 }, { month: 'Dec', amount: 2100 }, { month: 'Jan', amount: 2450 }
            ]
        }
    },
    'volatile-freelancer': {
        id: 'volatile-freelancer',
        name: 'Student w/ Loans',
        avatar: '💸',
        role: 'Student',
        year: 'Sophomore',
        university: 'Michigan State University',
        history: {
            score: [{ month: 'Aug', score: 62 }, { month: 'Sep', score: 65 }, { month: 'Oct', score: 68 }, { month: 'Nov', score: 70 }, { month: 'Dec', score: 71 }, { month: 'Jan', score: 68 }],
            payments: [{ month: 'Jan', onTime: 3, late: 0 }],
            savings: [{ month: 'Jan', amount: 450 }],
        },
        signals: { spendingStability: { volatility: 30 } },
        timeline: [
            { id: 1, year: 1, semester: 'Fall', term: 'Fall 2023', type: 'study', title: 'Freshman - Fall Semester', description: 'Started with full loan burden', tuition: 15000, fees: 2000, housing: 6000, mealPlan: 2800, scholarships: 2000, loans: 15000, workStudy: 0, status: 'completed' },
            { id: 2, year: 1, semester: 'Spring', term: 'Spring 2024', type: 'study', title: 'Freshman - Spring Semester', description: 'Started work-study program', tuition: 15000, fees: 2000, housing: 6000, mealPlan: 2800, scholarships: 2000, loans: 14000, workStudy: 3000, status: 'completed' },
            { id: 3, year: 2, semester: 'Fall', term: 'Fall 2024', type: 'study', title: 'Sophomore - Fall Semester', description: 'Applied for FAFSA increase', tuition: 16000, fees: 2100, housing: 6200, mealPlan: 3000, scholarships: 3000, loans: 16000, workStudy: 3500, status: 'completed' },
            { id: 4, year: 2, semester: 'Spring', term: 'Spring 2025', type: 'study', title: 'Sophomore - Spring Semester', description: 'Received Pell Grant approval', tuition: 16000, fees: 2100, housing: 6200, mealPlan: 3000, scholarships: 3000, loans: 12000, pellGrant: 3500, workStudy: 4000, status: 'active' },
        ],
        wealth: {
            accountBalance: 850,
            savingsGoal: 2000,
            totalDebt: 45000,
            roi: 250,
            projected: 45000,
            chart: [
                { month: 'Aug', amount: -15000 }, { month: 'Sep', amount: -14500 }, { month: 'Oct', amount: -14000 },
                { month: 'Nov', amount: -13500 }, { month: 'Dec', amount: -10000 }, { month: 'Jan', amount: -9500 }
            ]
        }
    },
    'perfect-payer': {
        id: 'perfect-payer',
        name: 'Graduated Alumni',
        avatar: '⭐',
        role: 'Alumni',
        year: 'Class of 2024',
        university: 'Michigan State University',
        history: {
            score: [{ month: 'Aug', score: 78 }, { month: 'Sep', score: 80 }, { month: 'Oct', score: 82 }, { month: 'Nov', score: 82 }, { month: 'Dec', score: 84 }, { month: 'Jan', score: 85 }],
            payments: [{ month: 'Jan', onTime: 6, late: 0 }],
            savings: [{ month: 'Jan', amount: 15000 }],
        },
        signals: { spendingStability: { volatility: 5 } },
        timeline: [
            { id: 1, year: 4, semester: 'Spring', term: 'May 2024', type: 'grad', title: 'Graduation Day 🎓', description: 'B.S. Computer Science, Magna Cum Laude', tuition: 0, fees: 0, housing: 0, mealPlan: 0, scholarships: 0, loans: 0, workStudy: 0, status: 'completed' },
            { id: 2, year: 'Post-Grad', semester: 'Summer', term: 'June 2024', type: 'work', title: 'First Job Started', description: 'Software Engineer at Google', tuition: 0, fees: 0, housing: 0, mealPlan: 0, scholarships: 0, loans: 0, workStudy: 0, income: 125000, status: 'completed' },
            { id: 3, year: 'Post-Grad', semester: 'Fall', term: 'Oct 2024', type: 'debt', title: 'Loan Repayment Started', description: 'Aggressive payoff strategy', tuition: 0, fees: 0, housing: 0, mealPlan: 0, scholarships: 0, loans: 0, workStudy: 0, loanPayment: 1500, status: 'active' },
            { id: 4, year: 'Post-Grad', semester: 'Spring', term: 'Mar 2025', type: 'milestone', title: 'Student Loans Paid Off!', description: 'Debt-free ahead of schedule', tuition: 0, fees: 0, housing: 0, mealPlan: 0, scholarships: 0, loans: 0, workStudy: 0, status: 'future' },
        ],
        wealth: {
            accountBalance: 41000,
            savingsGoal: 50000,
            roi: 850,
            projected: 450000,
            chart: [
                { month: 'Aug', amount: 5000 }, { month: 'Sep', amount: 12000 }, { month: 'Oct', amount: 18000 },
                { month: 'Nov', amount: 25000 }, { month: 'Dec', amount: 32000 }, { month: 'Jan', amount: 41000 }
            ]
        }
    }
};

const AI_AGENTS = {
    payment: { id: 'payment', name: 'Payment Reliability Agent', role: 'Conservative Risk Evaluator', icon: '💳', weight: 0.25, color: '#3b82f6' },
    savings: { id: 'savings', name: 'Savings Stability Agent', role: 'Long-term Planner', icon: '🏦', weight: 0.20, color: '#10b981' },
    income: { id: 'income', name: 'Income Consistency Agent', role: 'Income Risk Assessor', icon: '💼', weight: 0.15, color: '#8b5cf6' },
    spending: { id: 'spending', name: 'Spending Behavior Agent', role: 'Behavioral Economist', icon: '📊', weight: 0.15, color: '#f59e0b' },
    investment: { id: 'investment', name: 'Investment Strategist Agent', role: 'Wealth Builder', icon: '📈', weight: 0.15, color: '#06b6d4' },
    risk: { id: 'risk', name: 'Risk Personality Agent', role: 'Overall Risk Sentiment', icon: '🎯', weight: 0.10, color: '#ef4444' },
};

function calculateScore(category, value) {
    if (category === 'payment') return Math.round(value);
    if (category === 'savings') return Math.min(100, Math.round((value / 5000) * 100));
    if (category === 'income') return Math.min(100, Math.round((value / 6000) * 100));
    if (category === 'spending') return value;
    if (category === 'investment') return Math.min(100, Math.round((value / 25000) * 100));
    return 50;
}

export function AppProvider({ children }) {
    const [currentPersonaId, setCurrentPersonaId] = useState('responsible-student');
    const [viewMode, setViewMode] = useState('user');

    // User state (set after login)
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Login handler
    const handleSetUser = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Logout handler
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    // Simulator State
    const [simulatorData, setSimulatorData] = useState({
        paymentReliability: 92,
        savingsBalance: 5000,
        monthlyIncome: 3500,
        spendingScore: 85,
        investmentValue: 2000,
    });

    const [simulationActive, setSimulationActive] = useState(false);
    const [liveChat, setLiveChat] = useState([]);

    // Calculate generic analysis based on either Persona or Simulator Data
    const analysis = useMemo(() => {
        let scores = {};

        if (simulationActive) {
            scores = {
                payment: calculateScore('payment', simulatorData.paymentReliability),
                savings: calculateScore('savings', simulatorData.savingsBalance),
                income: calculateScore('income', simulatorData.monthlyIncome),
                spending: calculateScore('spending', simulatorData.spendingScore),
                investment: calculateScore('investment', simulatorData.investmentValue),
            };
        } else {
            // Static persona mapping
            const base = currentPersonaId === 'responsible-student' || currentPersonaId === 'responsibleStudent' ? 85 :
                currentPersonaId === 'volatile-freelancer' ? 55 : 78;
            scores = {
                payment: base + 5, savings: base - 5, income: base, spending: base + 2, investment: base - 10
            };
        }

        // Run weighted calc
        let totalScore = 0;
        const agentResults = {};

        Object.keys(AI_AGENTS).forEach(key => {
            const agent = AI_AGENTS[key];
            let score = scores[key] || 50;

            if (key === 'risk') {
                score = (scores.payment + scores.savings + scores.income + scores.spending + scores.investment) / 5;
            }

            totalScore += score * agent.weight;
            agentResults[key] = {
                ...agent,
                score: Math.round(score),
                contribution: Math.round(score * agent.weight),
                status: score > 75 ? 'positive' : score > 50 ? 'neutral' : 'negative',
                reasoning: simulationActive ? "Processing live input..." : "Based on historical analysis.",
                confidence: 90,
                focus: agent.role
            };
        });

        const discussion = Object.values(agentResults).map(a => ({
            agent: a.name,
            icon: a.icon,
            statement: `${a.reasoning} My score is ${a.score}.`,
            sentiment: a.status
        }));

        return {
            trustScore: Math.round(totalScore),
            consensus: 85,
            confidenceLevel: 'High',
            riskTier: totalScore > 75 ? 'Low Risk' : 'Medium Risk',
            agents: agentResults,
            discussionData: discussion
        };

    }, [currentPersonaId, simulationActive, simulatorData]);

    // Handle Simulator Updates
    const updateSimulation = (key, value) => {
        const prev = simulatorData[key];
        setSimulatorData(prev => ({ ...prev, [key]: value }));

        if (Math.abs(prev - value) > (key.includes('payment') ? 1 : 100)) {
            const diff = value - prev;

            const keyMap = {
                'paymentReliability': 'payment',
                'savingsBalance': 'savings',
                'monthlyIncome': 'income',
                'investmentValue': 'investment',
                'spendingScore': 'spending'
            };

            const agentKey = keyMap[key] || 'risk';
            const agent = AI_AGENTS[agentKey];

            const msg = diff > 0
                ? `Increasing metric detected! ${agent.name} approves.`
                : `Warning: Dropping metric detected by ${agent.name}.`;

            const reaction = {
                id: Date.now(),
                agent: agent.name,
                icon: agent.icon,
                msg: msg,
                color: agent.color
            };
            setLiveChat(prev => [reaction, ...prev].slice(0, 5));
        }
    };

    // Safe persona retrieval with fallback
    const normalizedId = MOCK_PERSONAS[currentPersonaId] ? currentPersonaId : 'responsible-student';
    const currentPersona = {
        ...MOCK_PERSONAS[normalizedId],
        id: normalizedId
    };

    const value = useMemo(() => ({
        // User & Auth
        user,
        setUser: handleSetUser,
        isAuthenticated,
        logout,

        // Persona
        currentPersona,
        currentPersonaId: normalizedId,
        switchPersona: setCurrentPersonaId,
        viewMode,
        setViewMode,

        // Analysis
        analysis,
        agentDiscussion: analysis.discussionData,
        agents: AI_AGENTS,

        // Simulator
        simulationActive,
        setSimulationActive,
        simulatorData,
        updateSimulation,
        liveChat,

        // Helpers
        getStatusColor: (s) => s > 75 ? '#10b981' : s > 50 ? '#f59e0b' : '#ef4444',
        getStatusLabel: (s) => s > 75 ? 'Excellent' : 'Average',
    }), [user, isAuthenticated, currentPersona, normalizedId, viewMode, analysis, simulationActive, simulatorData, liveChat]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}

export default AppContext;
