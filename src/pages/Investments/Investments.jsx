import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Link as LinkIcon, CheckCircle, Loader2, Sparkles, BarChart3, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Investments.css';

const MOCK_HOLDINGS = [
    { id: 1, symbol: 'AAPL', name: 'Apple Inc.', shares: 5, price: 182.50, change: 2.4, type: 'stock', icon: '🍎' },
    { id: 2, symbol: 'BTC', name: 'Bitcoin', shares: 0.015, price: 42150, change: -1.2, type: 'crypto', icon: '₿' },
    { id: 3, symbol: 'ETH', name: 'Ethereum', shares: 0.5, price: 2280, change: 3.1, type: 'crypto', icon: 'Ξ' },
    { id: 4, symbol: 'VOO', name: 'S&P 500 ETF', shares: 3, price: 425.20, change: 0.8, type: 'stock', icon: '📈' },
    { id: 5, symbol: 'EUR/USD', name: 'Euro/Dollar', shares: 500, price: 1.085, change: 0.12, type: 'forex', icon: '💱' },
];

const PORTFOLIO_HISTORY = [
    { month: 'Aug', value: 2200 },
    { month: 'Sep', value: 2450 },
    { month: 'Oct', value: 2100 },
    { month: 'Nov', value: 2680 },
    { month: 'Dec', value: 2950 },
    { month: 'Jan', value: 3245 },
];

export default function Investments() {
    const { currentPersona: persona } = useApp();
    const [robinhoodConnected, setRobinhoodConnected] = useState(false);
    const [coinbaseConnected, setCoinbaseConnected] = useState(false);
    const [connecting, setConnecting] = useState(null);

    const handleConnect = (broker) => {
        setConnecting(broker);
        setTimeout(() => {
            if (broker === 'robinhood') setRobinhoodConnected(true);
            if (broker === 'coinbase') setCoinbaseConnected(true);
            setConnecting(null);
        }, 1500);
    };

    const totalValue = MOCK_HOLDINGS.reduce((acc, h) => acc + (h.shares * h.price), 0);
    const totalChange = 3.2; // Example 24h change

    if (!persona) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="investments-page">
            {/* Header */}
            <div className="invest-header">
                <div>
                    <div className="invest-title">
                        <TrendingUp size={32} className="text-success-600" />
                        <h1>Investment Portfolio</h1>
                    </div>
                    <p className="invest-subtitle">Track stocks, crypto, and forex in one place.</p>
                </div>
                <div className="connect-section">
                    <button
                        className={`broker-btn ${robinhoodConnected ? 'connected' : ''}`}
                        onClick={() => handleConnect('robinhood')}
                        disabled={robinhoodConnected || connecting === 'robinhood'}
                    >
                        {connecting === 'robinhood' ? <Loader2 size={16} className="animate-spin" /> : robinhoodConnected ? <CheckCircle size={16} /> : <LinkIcon size={16} />}
                        {robinhoodConnected ? 'Robinhood ✓' : 'Link Robinhood'}
                    </button>
                    <button
                        className={`broker-btn ${coinbaseConnected ? 'connected' : ''}`}
                        onClick={() => handleConnect('coinbase')}
                        disabled={coinbaseConnected || connecting === 'coinbase'}
                    >
                        {connecting === 'coinbase' ? <Loader2 size={16} className="animate-spin" /> : coinbaseConnected ? <CheckCircle size={16} /> : <LinkIcon size={16} />}
                        {coinbaseConnected ? 'Coinbase ✓' : 'Link Coinbase'}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="invest-stats">
                <div className="invest-stat-card">
                    <span className="label">Total Portfolio</span>
                    <div className="value">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    <div className={`change ${totalChange >= 0 ? 'positive' : 'negative'}`}>
                        {totalChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {totalChange >= 0 ? '+' : ''}{totalChange}% (24h)
                    </div>
                </div>
                <div className="invest-stat-card">
                    <span className="label">Stocks</span>
                    <div className="value">$2,188</div>
                    <div className="change positive">+1.8%</div>
                </div>
                <div className="invest-stat-card">
                    <span className="label">Crypto</span>
                    <div className="value">$1,772</div>
                    <div className="change negative">-0.5%</div>
                </div>
                <div className="invest-stat-card">
                    <span className="label">Forex</span>
                    <div className="value">$542</div>
                    <div className="change positive">+0.1%</div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="invest-grid">
                {/* Holdings */}
                <div className="holdings-card">
                    <h2>Your Holdings</h2>
                    {MOCK_HOLDINGS.map(holding => (
                        <div key={holding.id} className="holding-item">
                            <div className={`holding-icon ${holding.type}`}>
                                {holding.icon}
                            </div>
                            <div className="holding-info">
                                <span className="holding-name">{holding.name}</span>
                                <span className="holding-shares">{holding.shares} {holding.symbol}</span>
                            </div>
                            <div className="holding-value">
                                <span className="holding-price">${(holding.shares * holding.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                <span className={`holding-change ${holding.change >= 0 ? 'positive' : 'negative'}`}>
                                    {holding.change >= 0 ? '+' : ''}{holding.change}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Advisor */}
                <div className="hub-column">
                    <div className="ai-advisor-card">
                        <div className="ai-advisor-header">
                            <div className="ai-avatar">🤖</div>
                            <div>
                                <h3>Investment Agent</h3>
                                <p>Powered by Gemini</p>
                            </div>
                        </div>
                        <div className="ai-message">
                            Based on your student status and risk profile, I recommend focusing on <strong>low-cost index funds (VOO)</strong> over individual stocks.
                            Your current allocation is 60% stocks, 30% crypto, 10% forex – crypto is slightly overweight for a student portfolio.
                        </div>
                        <div className="ai-actions">
                            <button className="btn btn-primary btn-sm">
                                <Sparkles size={14} /> Optimize
                            </button>
                            <button className="btn btn-ghost btn-sm">
                                <RefreshCw size={14} /> Refresh
                            </button>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="holdings-card" style={{ marginTop: 'var(--space-6)' }}>
                        <h2>Portfolio Growth</h2>
                        <div style={{ height: '180px', marginTop: 'var(--space-4)' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={PORTFOLIO_HISTORY}>
                                    <defs>
                                        <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#portfolioGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
