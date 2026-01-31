// Mock data for demo mode (used when USE_MOCK_DATA=true or Snowflake unavailable)

export const mockPersonas = {
    'responsible-student': {
        id: 'responsible-student',
        name: 'Responsible Student',
        description: 'Strong rent history, small but stable savings, part-time income',
        avatar: '🎓',
        rawData: {
            paymentReliability: { on_time_count: 11, total_count: 12 },
            savingsStability: { growth_percent: 5.2, avg_balance: 780 },
            incomeConsistency: { months_with_income: 6, avg_deposit: 1200, deposit_stddev: 150, source: 'Part-time + Aid' },
            spendingStability: { volatility_percent: 15 },
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
            paymentReliability: { on_time_count: 8, total_count: 12 },
            savingsStability: { growth_percent: -2.1, avg_balance: 900 },
            incomeConsistency: { months_with_income: 4, avg_deposit: 3500, deposit_stddev: 1400, source: 'Variable' },
            spendingStability: { volatility_percent: 48 },
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
            paymentReliability: { on_time_count: 12, total_count: 12 },
            savingsStability: { growth_percent: 0.5, avg_balance: 320 },
            incomeConsistency: { months_with_income: 6, avg_deposit: 2800, deposit_stddev: 100, source: 'Salary' },
            spendingStability: { volatility_percent: 10 },
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

export const mockUsers = {
    'demo-user': {
        id: 'demo-user',
        email: 'demo@credence.app',
        name: 'Demo User',
        personaId: 'responsible-student',
    },
};

export default { mockPersonas, mockUsers };
