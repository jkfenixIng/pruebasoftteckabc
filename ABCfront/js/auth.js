class AuthManager {
    static getToken() {
        return localStorage.getItem('authToken');
    }

    static setToken(token) {
        localStorage.setItem('authToken', token);
    }

    static removeToken() {
        localStorage.removeItem('authToken');
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static async login(username, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                this.setToken(data.token);
                return { success: true, data };
            } else {
                return { success: false, error: 'Error de autenticación' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Error de conexión' };
        }
    }

    static logout() {
        this.removeToken();
    }
}