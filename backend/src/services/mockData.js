// Mock personas with raw data for multi-agent analysis

export const mockPersonas = {
    'responsible-student': {
        id: 'responsible-student',
        name: 'Responsible Student',
        description: 'Strong rent history, small but stable savings, part-time income',
        avatar: '🎓',
        rawData: {
            paymentReliability: {
                onTime: 11,
                total: 12,
            },
            savingsStability: {
                trend: '+5.2',
                avgBalance: 780,
            },
            incomeConsistency: {
                months: 6,
                source: 'Part-time + Aid',
            },
            spendingStability: {
                volatility: 15,
                pattern: 'consistent',
            },
        },
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

    'volatile-freelancer': {
        id: 'volatile-freelancer',
        name: 'Volatile Freelancer',
        description: 'Irregular income, spending spikes, moderate payment reliability',
        avatar: '💼',
        rawData: {
            paymentReliability: {
                onTime: 8,
                total: 12,
            },
            savingsStability: {
                trend: '-2.1',
                avgBalance: 900,
            },
            incomeConsistency: {
                months: 4,
                source: 'Variable Freelance',
            },
            spendingStability: {
                volatility: 48,
                pattern: 'erratic',
            },
        },
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

    'perfect-payer': {
        id: 'perfect-payer',
        name: 'Perfect Payer, Low Savings',
        description: 'All bills on time, very low savings buffer, stable but low income',
        avatar: '⭐',
        rawData: {
            paymentReliability: {
                onTime: 12,
                total: 12,
            },
            savingsStability: {
                trend: '+0.5',
                avgBalance: 320,
            },
            incomeConsistency: {
                months: 6,
                source: 'Salary',
            },
            spendingStability: {
                volatility: 10,
                pattern: 'predictable',
            },
        },
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

export const mockUsers = [
    {
        id: 'demo-user',
        email: 'demo@credence.app',
        password: 'password123', // In real app, this would be hashed
        name: 'Demo User',
        persona: 'responsible-student',
    },
];

export default { mockPersonas, mockUsers };
