class ProductAPI {
    static async getAllProducts() {
        return this._fetch('/products');
    }

    static async getProductById(id) {
        return this._fetch(`/products/${id}`);
    }

    static async createProduct(product) {
        return this._fetch('/products', 'POST', product);
    }

    static async updateProduct(id, product) {
        return this._fetch(`/products/${id}`, 'PUT', product);
    }

    static async updateStock(id, stock) {
        // Para .NET [FromBody] int - enviar solo el número como string
        const config = {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${AuthManager.getToken()}`,
                'Content-Type': 'application/json'
            },
            body: stock.toString() // Solo el número como string
        };

        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}/stock`, config);
            
            if (response.status === 401) {
                AuthManager.logout();
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error(`API call error for /products/${id}/stock:`, error);
            throw error;
        }
    }

    static async updatePrices(id, prices) {
        return this._fetch(`/products/${id}/prices`, 'PATCH', prices);
    }

    static async deleteProduct(id) {
        return this._fetch(`/products/${id}`, 'DELETE');
    }

    static async _fetch(endpoint, method = 'GET', body = null) {
        const config = {
            method,
            headers: {
                'Authorization': `Bearer ${AuthManager.getToken()}`
            }
        };

        if (body !== null) {
            config.headers['Content-Type'] = 'application/json';
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            
            if (response.status === 401) {
                AuthManager.logout();
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error(`API call error for ${endpoint}:`, error);
            throw error;
        }
    }
}