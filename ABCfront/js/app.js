const API_BASE_URL = 'https://localhost:44350/api';

class App {
    constructor() {
        this.init();
    }

    async init() {
        // Cargar componentes primero
        const success = await ComponentLoader.initializeApp();
        
        if (success) {
            // Inicializar la aplicación después de cargar los componentes
            UIManager.initFormValidations();
            this.productManager = new ProductManager();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});