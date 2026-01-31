// API Service for Credence Backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('credence_token');
    }

    // Set auth token
    setToken(token) {
        this.token = token;
        localStorage.setItem('credence_token', token);
    }

    // Clear auth
    clearToken() {
        this.token = null;
        localStorage.removeItem('credence_token');
    }

    // Make API request
    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // ==================
    // AUTH
    // ==================

    async login(email, password) {
        const data = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async demoLogin() {
        const data = await this.request('/api/auth/demo', {
            method: 'POST',
        });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async verifyToken() {
        return this.request('/api/auth/verify');
    }

    // ==================
    // REPUTATION
    // ==================

    async getScore(personaId) {
        const query = personaId ? `?personaId=${personaId}` : '';
        return this.request(`/api/reputation/score${query}`);
    }

    async getPillars(personaId) {
        const query = personaId ? `?personaId=${personaId}` : '';
        return this.request(`/api/reputation/pillars${query}`);
    }

    async getHistory(personaId) {
        const query = personaId ? `?personaId=${personaId}` : '';
        return this.request(`/api/reputation/history${query}`);
    }

    async getPersonas() {
        return this.request('/api/reputation/personas');
    }

    // ==================
    // PASSPORT
    // ==================

    async generatePassport(personaId) {
        return this.request('/api/passport/generate', {
            method: 'POST',
            body: JSON.stringify({ personaId }),
        });
    }

    async getPassport(passportId) {
        return this.request(`/api/passport/${passportId}`);
    }

    async revokePassport(passportId) {
        return this.request(`/api/passport/${passportId}`, {
            method: 'DELETE',
        });
    }

    // ==================
    // BUSINESS VIEW
    // ==================

    async getApplicant(personaId) {
        return this.request(`/api/business/applicant/${personaId}`);
    }

    async getApplicants() {
        return this.request('/api/business/applicants');
    }

    // ==================
    // INSIGHTS
    // ==================

    async getFactors(personaId) {
        const query = personaId ? `?personaId=${personaId}` : '';
        return this.request(`/api/insights/factors${query}`);
    }

    async getCharts(personaId) {
        const query = personaId ? `?personaId=${personaId}` : '';
        return this.request(`/api/insights/charts${query}`);
    }

    async getVolatility(personaId) {
        const query = personaId ? `?personaId=${personaId}` : '';
        return this.request(`/api/insights/volatility${query}`);
    }

    // ==================
    // HEALTH
    // ==================

    async healthCheck() {
        return this.request('/health');
    }
}

// Export singleton instance
export const api = new ApiService();
export default api;
