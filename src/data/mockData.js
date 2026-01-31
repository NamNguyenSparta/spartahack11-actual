// Mock Personas for Demo Mode
export const personas = {
  reliableStudent: {
    id: 'reliable-student',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    avatar: 'AC',
    type: 'Student',
    description: 'New student, reliable rent payer',
    trustScore: 87,
    scoreHistory: [
      { month: 'Aug', score: 72 },
      { month: 'Sep', score: 76 },
      { month: 'Oct', score: 80 },
      { month: 'Nov', score: 83 },
      { month: 'Dec', score: 85 },
      { month: 'Jan', score: 87 },
    ],
    behaviors: {
      rentReliability: { score: 95, onTime: 11, total: 12, label: 'Excellent' },
      utilitiesConsistency: { score: 88, onTime: 10, total: 12, label: 'Good' },
      savingsStability: { score: 82, trend: '+5.2%', label: 'Growing' },
      spendingVolatility: { score: 78, level: 'Low', label: 'Stable' },
      incomeStability: { score: 75, type: 'Part-time + Aid', label: 'Consistent' },
    },
    savingsHistory: [
      { month: 'Aug', amount: 450 },
      { month: 'Sep', amount: 520 },
      { month: 'Oct', amount: 580 },
      { month: 'Nov', amount: 640 },
      { month: 'Dec', amount: 710 },
      { month: 'Jan', amount: 780 },
    ],
    paymentHistory: [
      { month: 'Aug', onTime: 4, late: 0 },
      { month: 'Sep', onTime: 5, late: 1 },
      { month: 'Oct', onTime: 6, late: 0 },
      { month: 'Nov', onTime: 5, late: 0 },
      { month: 'Dec', onTime: 6, late: 0 },
      { month: 'Jan', onTime: 5, late: 0 },
    ],
    spendingCategories: [
      { name: 'Rent', amount: 850, percentage: 42 },
      { name: 'Groceries', amount: 320, percentage: 16 },
      { name: 'Utilities', amount: 120, percentage: 6 },
      { name: 'Transport', amount: 200, percentage: 10 },
      { name: 'Education', amount: 280, percentage: 14 },
      { name: 'Other', amount: 230, percentage: 12 },
    ],
    transactions: [
      { id: 1, type: 'debit', description: 'Rent Payment - January', amount: 850, date: '2026-01-01', category: 'Rent', status: 'completed' },
      { id: 2, type: 'credit', description: 'Part-time Income', amount: 1200, date: '2026-01-05', category: 'Income', status: 'completed' },
      { id: 3, type: 'debit', description: 'Electric Bill', amount: 65, date: '2026-01-08', category: 'Utilities', status: 'completed' },
      { id: 4, type: 'debit', description: 'Whole Foods Market', amount: 87, date: '2026-01-12', category: 'Groceries', status: 'completed' },
      { id: 5, type: 'debit', description: 'Metro Transit Pass', amount: 75, date: '2026-01-15', category: 'Transport', status: 'completed' },
      { id: 6, type: 'credit', description: 'Financial Aid Deposit', amount: 2500, date: '2026-01-18', category: 'Income', status: 'completed' },
      { id: 7, type: 'debit', description: 'Internet Bill', amount: 55, date: '2026-01-20', category: 'Utilities', status: 'completed' },
      { id: 8, type: 'debit', description: 'Textbooks', amount: 180, date: '2026-01-22', category: 'Education', status: 'completed' },
    ],
    scoreFactors: [
      { label: 'Consistent rent payments', points: '+8', type: 'positive' },
      { label: 'Stable savings growth', points: '+4', type: 'positive' },
      { label: 'On-time utility payments', points: '+3', type: 'positive' },
      { label: '1 late payment in Sept', points: '-2', type: 'negative' },
      { label: 'Account age bonus', points: '+2', type: 'positive' },
    ],
    passportStatus: 'verified',
    passportId: 'CRD-2026-AC78934',
    verificationDate: '2026-01-28',
  },
  freelancer: {
    id: 'freelancer',
    name: 'Jordan Rivera',
    email: 'jordan@freelance.io',
    avatar: 'JR',
    type: 'Freelancer',
    description: 'Freelancer with volatile income',
    trustScore: 68,
    scoreHistory: [
      { month: 'Aug', score: 62 },
      { month: 'Sep', score: 58 },
      { month: 'Oct', score: 65 },
      { month: 'Nov', score: 61 },
      { month: 'Dec', score: 70 },
      { month: 'Jan', score: 68 },
    ],
    behaviors: {
      rentReliability: { score: 75, onTime: 8, total: 12, label: 'Fair' },
      utilitiesConsistency: { score: 70, onTime: 8, total: 12, label: 'Fair' },
      savingsStability: { score: 55, trend: '-2.1%', label: 'Fluctuating' },
      spendingVolatility: { score: 45, level: 'High', label: 'Variable' },
      incomeStability: { score: 40, type: 'Variable', label: 'Inconsistent' },
    },
    savingsHistory: [
      { month: 'Aug', amount: 1200 },
      { month: 'Sep', amount: 800 },
      { month: 'Oct', amount: 1100 },
      { month: 'Nov', amount: 650 },
      { month: 'Dec', amount: 1400 },
      { month: 'Jan', amount: 950 },
    ],
    paymentHistory: [
      { month: 'Aug', onTime: 3, late: 2 },
      { month: 'Sep', onTime: 2, late: 3 },
      { month: 'Oct', onTime: 4, late: 1 },
      { month: 'Nov', onTime: 3, late: 2 },
      { month: 'Dec', onTime: 5, late: 0 },
      { month: 'Jan', onTime: 4, late: 1 },
    ],
    spendingCategories: [
      { name: 'Rent', amount: 1200, percentage: 35 },
      { name: 'Equipment', amount: 450, percentage: 13 },
      { name: 'Utilities', amount: 180, percentage: 5 },
      { name: 'Coworking', amount: 300, percentage: 9 },
      { name: 'Software', amount: 250, percentage: 7 },
      { name: 'Other', amount: 1020, percentage: 31 },
    ],
    transactions: [
      { id: 1, type: 'debit', description: 'Rent Payment - January', amount: 1200, date: '2026-01-03', category: 'Rent', status: 'completed' },
      { id: 2, type: 'credit', description: 'Client Payment - Design Work', amount: 3500, date: '2026-01-07', category: 'Income', status: 'completed' },
      { id: 3, type: 'debit', description: 'Adobe Creative Cloud', amount: 55, date: '2026-01-10', category: 'Software', status: 'completed' },
      { id: 4, type: 'debit', description: 'WeWork Membership', amount: 300, date: '2026-01-12', category: 'Coworking', status: 'completed' },
      { id: 5, type: 'debit', description: 'Electric Bill', amount: 95, date: '2026-01-15', category: 'Utilities', status: 'pending' },
      { id: 6, type: 'credit', description: 'Client Payment - Web Dev', amount: 2200, date: '2026-01-20', category: 'Income', status: 'completed' },
    ],
    scoreFactors: [
      { label: 'Recent on-time payments', points: '+5', type: 'positive' },
      { label: 'Higher Dec income', points: '+3', type: 'positive' },
      { label: 'Volatile income pattern', points: '-8', type: 'negative' },
      { label: '4 late payments (6 mo)', points: '-6', type: 'negative' },
      { label: 'Savings fluctuation', points: '-4', type: 'negative' },
    ],
    passportStatus: 'not_verified',
    passportId: null,
    verificationDate: null,
  },
  perfectPayer: {
    id: 'perfect-payer',
    name: 'Sam Patel',
    email: 'sam.patel@company.com',
    avatar: 'SP',
    type: 'Professional',
    description: 'Perfect payer but low savings',
    trustScore: 79,
    scoreHistory: [
      { month: 'Aug', score: 75 },
      { month: 'Sep', score: 76 },
      { month: 'Oct', score: 77 },
      { month: 'Nov', score: 78 },
      { month: 'Dec', score: 78 },
      { month: 'Jan', score: 79 },
    ],
    behaviors: {
      rentReliability: { score: 100, onTime: 12, total: 12, label: 'Perfect' },
      utilitiesConsistency: { score: 98, onTime: 12, total: 12, label: 'Excellent' },
      savingsStability: { score: 35, trend: '+0.5%', label: 'Low' },
      spendingVolatility: { score: 70, level: 'Medium', label: 'Moderate' },
      incomeStability: { score: 95, type: 'Salary', label: 'Stable' },
    },
    savingsHistory: [
      { month: 'Aug', amount: 180 },
      { month: 'Sep', amount: 195 },
      { month: 'Oct', amount: 210 },
      { month: 'Nov', amount: 185 },
      { month: 'Dec', amount: 220 },
      { month: 'Jan', amount: 240 },
    ],
    paymentHistory: [
      { month: 'Aug', onTime: 6, late: 0 },
      { month: 'Sep', onTime: 5, late: 0 },
      { month: 'Oct', onTime: 6, late: 0 },
      { month: 'Nov', onTime: 5, late: 0 },
      { month: 'Dec', onTime: 6, late: 0 },
      { month: 'Jan', onTime: 5, late: 0 },
    ],
    spendingCategories: [
      { name: 'Rent', amount: 1500, percentage: 38 },
      { name: 'Groceries', amount: 500, percentage: 13 },
      { name: 'Utilities', amount: 200, percentage: 5 },
      { name: 'Dining Out', amount: 600, percentage: 15 },
      { name: 'Entertainment', amount: 450, percentage: 11 },
      { name: 'Other', amount: 700, percentage: 18 },
    ],
    transactions: [
      { id: 1, type: 'credit', description: 'Salary Deposit', amount: 4200, date: '2026-01-01', category: 'Income', status: 'completed' },
      { id: 2, type: 'debit', description: 'Rent Payment - January', amount: 1500, date: '2026-01-01', category: 'Rent', status: 'completed' },
      { id: 3, type: 'debit', description: 'Electric & Gas', amount: 130, date: '2026-01-05', category: 'Utilities', status: 'completed' },
      { id: 4, type: 'debit', description: 'Restaurant - Dinner', amount: 85, date: '2026-01-08', category: 'Dining Out', status: 'completed' },
      { id: 5, type: 'debit', description: 'Grocery Store', amount: 145, date: '2026-01-10', category: 'Groceries', status: 'completed' },
      { id: 6, type: 'debit', description: 'Netflix + Spotify', amount: 28, date: '2026-01-12', category: 'Entertainment', status: 'completed' },
      { id: 7, type: 'debit', description: 'Internet Bill', amount: 70, date: '2026-01-15', category: 'Utilities', status: 'completed' },
    ],
    scoreFactors: [
      { label: 'Perfect payment history', points: '+15', type: 'positive' },
      { label: 'Stable salary income', points: '+8', type: 'positive' },
      { label: 'Low savings balance', points: '-12', type: 'negative' },
      { label: 'High dining/entertainment', points: '-3', type: 'negative' },
      { label: 'Long account history', points: '+4', type: 'positive' },
    ],
    passportStatus: 'verified',
    passportId: 'CRD-2026-SP45621',
    verificationDate: '2026-01-25',
  },
  internationalStudent: {
    id: 'international-student',
    name: 'Priya Sharma',
    email: 'priya.sharma@grad.edu',
    avatar: 'PS',
    type: 'International Student',
    description: 'International grad student, thin credit file',
    trustScore: 74,
    scoreHistory: [
      { month: 'Aug', score: 45 },
      { month: 'Sep', score: 52 },
      { month: 'Oct', score: 60 },
      { month: 'Nov', score: 66 },
      { month: 'Dec', score: 71 },
      { month: 'Jan', score: 74 },
    ],
    behaviors: {
      rentReliability: { score: 83, onTime: 5, total: 6, label: 'Good' },
      utilitiesConsistency: { score: 80, onTime: 5, total: 6, label: 'Good' },
      savingsStability: { score: 70, trend: '+12.5%', label: 'Building' },
      spendingVolatility: { score: 75, level: 'Low', label: 'Careful' },
      incomeStability: { score: 65, type: 'Stipend + RA', label: 'Regular' },
    },
    savingsHistory: [
      { month: 'Aug', amount: 200 },
      { month: 'Sep', amount: 350 },
      { month: 'Oct', amount: 520 },
      { month: 'Nov', amount: 680 },
      { month: 'Dec', amount: 820 },
      { month: 'Jan', amount: 950 },
    ],
    paymentHistory: [
      { month: 'Aug', onTime: 2, late: 1 },
      { month: 'Sep', onTime: 3, late: 0 },
      { month: 'Oct', onTime: 4, late: 0 },
      { month: 'Nov', onTime: 4, late: 0 },
      { month: 'Dec', onTime: 5, late: 0 },
      { month: 'Jan', onTime: 4, late: 0 },
    ],
    spendingCategories: [
      { name: 'Rent', amount: 700, percentage: 40 },
      { name: 'Groceries', amount: 250, percentage: 14 },
      { name: 'Utilities', amount: 80, percentage: 5 },
      { name: 'Transport', amount: 150, percentage: 9 },
      { name: 'Books/Research', amount: 200, percentage: 11 },
      { name: 'Other', amount: 370, percentage: 21 },
    ],
    transactions: [
      { id: 1, type: 'credit', description: 'RA Stipend', amount: 1800, date: '2026-01-01', category: 'Income', status: 'completed' },
      { id: 2, type: 'debit', description: 'Rent Payment', amount: 700, date: '2026-01-02', category: 'Rent', status: 'completed' },
      { id: 3, type: 'debit', description: 'Health Insurance', amount: 120, date: '2026-01-05', category: 'Insurance', status: 'completed' },
      { id: 4, type: 'debit', description: 'Grocery Run', amount: 68, date: '2026-01-08', category: 'Groceries', status: 'completed' },
      { id: 5, type: 'debit', description: 'Bus Pass', amount: 50, date: '2026-01-10', category: 'Transport', status: 'completed' },
      { id: 6, type: 'debit', description: 'Research Materials', amount: 85, date: '2026-01-15', category: 'Books/Research', status: 'completed' },
    ],
    scoreFactors: [
      { label: 'Rapid score improvement', points: '+10', type: 'positive' },
      { label: 'Strong savings growth', points: '+6', type: 'positive' },
      { label: 'Consistent payments (5 mo)', points: '+5', type: 'positive' },
      { label: 'Short credit history', points: '-8', type: 'negative' },
      { label: 'Late payment in Aug', points: '-2', type: 'negative' },
    ],
    passportStatus: 'not_verified',
    passportId: null,
    verificationDate: null,
  },
};

// Default persona
export const defaultPersonaId = 'reliableStudent';

// Blockchain mock data
export const generateBlockchainProof = (persona) => {
  const timestamp = new Date().toISOString();
  const behaviorSummary = JSON.stringify({
    trustScore: persona.trustScore,
    rentReliability: persona.behaviors.rentReliability.score,
    utilitiesConsistency: persona.behaviors.utilitiesConsistency.score,
    savingsStability: persona.behaviors.savingsStability.score,
    spendingVolatility: persona.behaviors.spendingVolatility.score,
    incomeStability: persona.behaviors.incomeStability.score,
    verificationDate: timestamp,
  });

  // Simulated SHA-256 hash
  const hash = '0x' + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  // Simulated Solana transaction ID
  const txId = Array.from({ length: 88 }, () =>
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'[
    Math.floor(Math.random() * 58)
    ]
  ).join('');

  return {
    proofHash: hash,
    timestamp,
    transactionId: txId,
    passportId: 'CRD-2026-' + persona.avatar + Math.floor(Math.random() * 90000 + 10000),
    network: 'Solana Devnet',
    blockNumber: Math.floor(Math.random() * 1000000 + 200000000),
    status: 'confirmed',
    behaviorSummary,
  };
};

// Score calculation logic
export const calculateTrustScore = (behaviors) => {
  const weights = {
    paymentReliability: 0.40,
    savingsStability: 0.30,
    spendingConsistency: 0.20,
    incomeStability: 0.10,
  };

  const avgPayments = (behaviors.rentReliability.score + behaviors.utilitiesConsistency.score) / 2;

  const score = Math.round(
    avgPayments * weights.paymentReliability +
    behaviors.savingsStability.score * weights.savingsStability +
    behaviors.spendingVolatility.score * weights.spendingConsistency +
    behaviors.incomeStability.score * weights.incomeStability
  );

  return Math.min(100, Math.max(0, score));
};

// Get score rating
export const getScoreRating = (score) => {
  if (score >= 90) return { label: 'Excellent', color: '#10b981', description: 'Outstanding financial reliability' };
  if (score >= 80) return { label: 'Very Good', color: '#22c55e', description: 'Strong trust indicators' };
  if (score >= 70) return { label: 'Good', color: '#84cc16', description: 'Solid financial behavior' };
  if (score >= 60) return { label: 'Fair', color: '#eab308', description: 'Moderate reliability signals' };
  if (score >= 50) return { label: 'Developing', color: '#f97316', description: 'Building credit history' };
  return { label: 'Needs Improvement', color: '#ef4444', description: 'Limited trust signals' };
};

// Mock Snowflake-style queries
export const snowflakeQueries = {
  latePaymentCount: (transactions) => {
    return transactions.filter(t => t.status === 'pending' || t.status === 'late').length;
  },

  monthlySavingsDeltas: (savingsHistory) => {
    return savingsHistory.slice(1).map((current, index) => ({
      month: current.month,
      delta: current.amount - savingsHistory[index].amount,
      percentChange: ((current.amount - savingsHistory[index].amount) / savingsHistory[index].amount * 100).toFixed(1),
    }));
  },

  volatilityMeasure: (spendingCategories) => {
    const amounts = spendingCategories.map(c => c.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / amounts.length;
    return Math.sqrt(variance) / mean; // Coefficient of variation
  },

  paymentPunctuality: (paymentHistory) => {
    const total = paymentHistory.reduce((acc, m) => acc + m.onTime + m.late, 0);
    const onTime = paymentHistory.reduce((acc, m) => acc + m.onTime, 0);
    return ((onTime / total) * 100).toFixed(1);
  },
};
