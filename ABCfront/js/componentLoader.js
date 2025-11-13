// componentLoader.js
class ComponentLoader {
    static async loadComponent(componentPath) {
        try {
            const response = await fetch(`components/${componentPath}`);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error loading component:', error);
            return `<div class="alert alert-danger">Error loading component: ${componentPath}</div>`;
        }
    }

    static async loadMultipleComponents(components) {
        const loadPromises = components.map(component => 
            this.loadComponent(component)
        );
        return await Promise.all(loadPromises);
    }

    static renderToElement(elementId, html) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        } else {
            console.error(`Element with id '${elementId}' not found`);
        }
    }

    static async initializeApp() {
        try {
            // Cargar todos los componentes principales
            const [navbar, login, appLayout, addProductModal, editProductModal, updateStockModal, updatePricesModal] = 
                await this.loadMultipleComponents([
                    'navbar.html',
                    'login.html',
                    'app-layout.html',
                    'modals/add-product.html',
                    'modals/edit-product.html',
                    'modals/update-stock.html',
                    'modals/update-prices.html'
                ]);

            // Construir la estructura principal
            document.body.innerHTML = `
                ${navbar}
                <div class="container mt-4">
                    ${login}
                    ${appLayout}
                </div>
                ${addProductModal}
                ${editProductModal}
                ${updateStockModal}
                ${updatePricesModal}
            `;

            return true;
        } catch (error) {
            console.error('Error initializing app:', error);
            document.body.innerHTML = `
                <div class="container mt-5">
                    <div class="alert alert-danger">
                        <h4>Error loading application</h4>
                        <p>Please check your internet connection and try again.</p>
                    </div>
                </div>
            `;
            return false;
        }
    }
}