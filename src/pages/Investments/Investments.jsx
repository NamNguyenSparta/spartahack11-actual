import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, Bitcoin, DollarSign, Gem, Coins, Filter, Plus, RefreshCw } from 'lucide-react';
import Header from '../../components/Layout/Header';
import './Investments.css';

const portfolioData = {
    stocks: [
        { symbol: 'AAPL', name: 'Apple Inc.', shares: 15, price: 178.50, change: +2.34, changePercent: +1.32, value: 2677.50 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 8, price: 141.80, change: -1.20, changePercent: -0.84, value: 1134.40 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 12, price: 378.90, change: +4.56, changePercent: +1.22, value: 4546.80 },
        { symbol: 'TSLA', name: 'Tesla Inc.', shares: 5, price: 248.20, change: -3.80, changePercent: -1.51, value: 1241.00 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 10, price: 495.60, change: +12.30, changePercent: +2.55, value: 4956.00 },
    ],
    crypto: [
        { symbol: 'BTC', name: 'Bitcoin', amount: 0.15, price: 43250.00, change: +850, changePercent: +2.0, value: 6487.50 },
        { symbol: 'ETH', name: 'Ethereum', amount: 2.5, price: 2280.00, change: +45.20, changePercent: +2.02, value: 5700.00 },
        { symbol: 'SOL', name: 'Solana', amount: 25, price: 98.50, change: +5.80, changePercent: +6.26, value: 2462.50 },
        { symbol: 'MATIC', name: 'Polygon', amount: 500, price: 0.82, change: -0.03, changePercent: -3.53, value: 410.00 },
    ],
    forex: [
        { pair: 'EUR/USD', position: 'Long', units: 10000, entryPrice: 1.0820, currentPrice: 1.0875, pnl: +55.00 },
        { pair: 'GBP/USD', position: 'Short', units: 5000, entryPrice: 1.2650, currentPrice: 1.2590, pnl: +30.00 },
        { pair: 'USD/JPY', position: 'Long', units: 8000, entryPrice: 148.50, currentPrice: 149.20, pnl: +37.58 },
    ],
};

const portfolioHistory = [
    { date: 'Jan', value: 25000 },
    { date: 'Feb', value: 27500 },
    { date: 'Mar', value: 26800 },
    { date: 'Apr', value: 29200 },
    { date: 'May', value: 31500 },
    { date: 'Jun', value: 34800 },
];

const allocation = [
    { name: 'Stocks', value: 45, color: '#ec4899' },
    { name: 'Crypto', value: 35, color: '#8b5cf6' },
    { name: 'Forex', value: 15, color: '#06b6d4' },
    { name: 'Cash', value: 5, color: '#10b981' },
];

export default function Investments() {
    const [activeTab, setActiveTab] = useState('stocks');

    const totalValue = portfolioData.stocks.reduce((sum, s) => sum + s.value, 0) +
        portfolioData.crypto.reduce((sum, c) => sum + c.value, 0);

    const tabs = [
        { id: 'stocks', label: 'Stocks', icon: TrendingUp },
        { id: 'crypto', label: 'Crypto', icon: Bitcoin },
        { id: 'forex', label: 'Forex', icon: DollarSign },
    ];

    return (
        <>
            <Header title="Investments" subtitle="Manage your investment portfolio" />
            <div className="page-content">
                <div className="investments-layout">
                    {/* Top Stats Row */}
                    <div className="portfolio-stats">
                        <div className="stat-card primary">
                            <div className="stat-icon"><Gem size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-label">Total Portfolio Value</span>
                                <span className="stat-value">${totalValue.toLocaleString()}</span>
                                <span className="stat-change positive">
                                    <TrendingUp size={14} /> +12.5% this month
                                </span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stocks"><TrendingUp size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-label">Stocks</span>
                                <span className="stat-value">${portfolioData.stocks.reduce((s, x) => s + x.value, 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon crypto"><Bitcoin size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-label">Crypto</span>
                                <span className="stat-value">${portfolioData.crypto.reduce((s, x) => s + x.value, 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon forex"><Coins size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-label">Forex P&L</span>
                                <span className="stat-value positive">+${portfolioData.forex.reduce((s, x) => s + x.pnl, 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="investments-main">
                        {/* Left: Holdings List */}
                        <div className="holdings-section">
                            <div className="card">
                                <div className="holdings-header">
                                    <div className="portfolio-tabs">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                className={`portfolio-tab ${activeTab === tab.id ? 'active' : ''}`}
                                                onClick={() => setActiveTab(tab.id)}
                                            >
                                                <tab.icon size={16} />
                                                <span>{tab.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="holdings-actions">
                                        <button className="btn btn-ghost btn-sm"><Filter size={16} /> Filter</button>
                                        <button className="btn btn-primary btn-sm"><Plus size={16} /> Add</button>
                                    </div>
                                </div>

                                {activeTab === 'stocks' && (
                                    <div className="holdings-table">
                                        <div className="table-header">
                                            <span>Asset</span>
                                            <span>Shares</span>
                                            <span>Price</span>
                                            <span>Change</span>
                                            <span>Value</span>
                                        </div>
                                        {portfolioData.stocks.map((stock) => (
                                            <div key={stock.symbol} className="table-row">
                                                <div className="asset-info">
                                                    <div className="asset-icon stock">{stock.symbol.charAt(0)}</div>
                                                    <div>
                                                        <span className="asset-symbol">{stock.symbol}</span>
                                                        <span className="asset-name">{stock.name}</span>
                                                    </div>
                                                </div>
                                                <span className="shares">{stock.shares}</span>
                                                <span className="price">${stock.price.toFixed(2)}</span>
                                                <span className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                                                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                                </span>
                                                <span className="value">${stock.value.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'crypto' && (
                                    <div className="holdings-table">
                                        <div className="table-header">
                                            <span>Asset</span>
                                            <span>Amount</span>
                                            <span>Price</span>
                                            <span>Change</span>
                                            <span>Value</span>
                                        </div>
                                        {portfolioData.crypto.map((coin) => (
                                            <div key={coin.symbol} className="table-row">
                                                <div className="asset-info">
                                                    <div className="asset-icon crypto">{coin.symbol.charAt(0)}</div>
                                                    <div>
                                                        <span className="asset-symbol">{coin.symbol}</span>
                                                        <span className="asset-name">{coin.name}</span>
                                                    </div>
                                                </div>
                                                <span className="shares">{coin.amount}</span>
                                                <span className="price">${coin.price.toLocaleString()}</span>
                                                <span className={`change ${coin.changePercent >= 0 ? 'positive' : 'negative'}`}>
                                                    {coin.changePercent >= 0 ? '+' : ''}{coin.changePercent.toFixed(2)}%
                                                </span>
                                                <span className="value">${coin.value.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'forex' && (
                                    <div className="holdings-table">
                                        <div className="table-header">
                                            <span>Pair</span>
                                            <span>Position</span>
                                            <span>Entry</span>
                                            <span>Current</span>
                                            <span>P&L</span>
                                        </div>
                                        {portfolioData.forex.map((fx) => (
                                            <div key={fx.pair} className="table-row">
                                                <div className="asset-info">
                                                    <div className="asset-icon forex">$</div>
                                                    <div>
                                                        <span className="asset-symbol">{fx.pair}</span>
                                                        <span className="asset-name">{fx.units.toLocaleString()} units</span>
                                                    </div>
                                                </div>
                                                <span className={`position-badge ${fx.position.toLowerCase()}`}>{fx.position}</span>
                                                <span className="price">{fx.entryPrice.toFixed(4)}</span>
                                                <span className="price">{fx.currentPrice.toFixed(4)}</span>
                                                <span className={`change ${fx.pnl >= 0 ? 'positive' : 'negative'}`}>
                                                    {fx.pnl >= 0 ? '+' : ''}${fx.pnl.toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Charts */}
                        <div className="charts-section">
                            {/* Portfolio Chart */}
                            <div className="card">
                                <div className="card-header">
                                    <h3>Portfolio Performance</h3>
                                    <button className="btn-icon"><RefreshCw size={16} /></button>
                                </div>
                                <div className="portfolio-chart">
                                    <ResponsiveContainer width="100%" height={180}>
                                        <AreaChart data={portfolioHistory}>
                                            <defs>
                                                <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.3} />
                                                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                            <YAxis hide />
                                            <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12 }} />
                                            <Area type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} fill="url(#portGrad)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Allocation Chart */}
                            <div className="card">
                                <div className="card-header">
                                    <h3>Asset Allocation</h3>
                                </div>
                                <div className="allocation-content">
                                    <div className="allocation-chart">
                                        <ResponsiveContainer width="100%" height={160}>
                                            <PieChart>
                                                <Pie data={allocation} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                                                    {allocation.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="allocation-legend">
                                        {allocation.map((item) => (
                                            <div key={item.name} className="legend-item">
                                                <span className="legend-dot" style={{ background: item.color }} />
                                                <span className="legend-label">{item.name}</span>
                                                <span className="legend-value">{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
