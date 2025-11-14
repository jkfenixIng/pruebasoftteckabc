// productManager.js
class ProductManager {
    constructor() {
        this.currentProducts = [];
        this.isProcessing = false; // Nueva variable de estado
        this.initEventListeners();
        this.checkAuth();
    }

    initEventListeners() {
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        document.getElementById('saveProductBtn').addEventListener('click', () => this.handleAddProduct());
        document.getElementById('updateProductBtn').addEventListener('click', () => this.handleUpdateProduct());
        document.getElementById('saveStockBtn').addEventListener('click', () => this.handleUpdateStock());
        document.getElementById('savePricesBtn').addEventListener('click', () => this.handleUpdatePrices());
    }

    checkAuth() {
        if (AuthManager.isAuthenticated()) {
            this.showApp();
            this.loadProducts();
        } else {
            this.showLogin();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        if (this.isProcessing) return;
        
        this.setProcessingState(true, 'loginForm', 'Ingresando...');
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const result = await AuthManager.login(username, password);
        
        if (result.success) {
            this.showApp();
            this.loadProducts();
            UIManager.showAlert('Sesión iniciada correctamente', 'success');
        } else {
            UIManager.showAlert(result.error, 'danger');
        }
        
        this.setProcessingState(false, 'loginForm');
    }

    handleLogout() {
        if (this.isProcessing) return;
        
        AuthManager.logout();
        this.showLogin();
        UIManager.showAlert('Sesión cerrada correctamente', 'info');
    }

    async loadProducts() {
        UIManager.showLoading(true);
        
        try {
            this.currentProducts = await ProductAPI.getAllProducts();
            this.displayProducts();
        } catch (error) {
            if (error.message === 'Unauthorized') {
                this.handleLogout();
                UIManager.showAlert('Sesión expirada. Por favor, inicie sesión nuevamente.', 'warning');
            } else {
                UIManager.showAlert('Error al cargar los productos', 'danger');
            }
        } finally {
            UIManager.showLoading(false);
        }
    }

    async handleAddProduct() {
        if (this.isProcessing) return;
        
        const product = this.getProductFormData('addProductForm');
        
        const validation = this.validateProductData(product);
        if (!validation.isValid) {
            UIManager.showAlert(validation.message, 'warning');
            return;
        }
        
        this.setProcessingState(true, 'saveProductBtn', 'Guardando...');
        
        try {
            await ProductAPI.createProduct(product);
            this.closeModal('addProductModal');
            this.resetForm('addProductForm');
            this.loadProducts();
            UIManager.showAlert('Producto creado exitosamente', 'success');
        } catch (error) {
            UIManager.showAlert('Error al crear el producto', 'danger');
        } finally {
            this.setProcessingState(false, 'saveProductBtn');
        }
    }

    async handleUpdateProduct() {
        if (this.isProcessing) return;
        
        const product = this.getProductFormData('editProductForm');
        product.id = document.getElementById('editProductId').value;
        
        const validation = this.validateProductData(product);
        if (!validation.isValid) {
            UIManager.showAlert(validation.message, 'warning');
            return;
        }
        
        this.setProcessingState(true, 'updateProductBtn', 'Actualizando...');
        
        try {
            await ProductAPI.updateProduct(product.id, product);
            this.closeModal('editProductModal');
            this.loadProducts();
            UIManager.showAlert('Producto actualizado exitosamente', 'success');
        } catch (error) {
            UIManager.showAlert('Error al actualizar el producto', 'danger');
        } finally {
            this.setProcessingState(false, 'updateProductBtn');
        }
    }

    async handleUpdateStock() {
        if (this.isProcessing) return;
        
        const productId = document.getElementById('updateStockProductId').value;
        const stock = parseInt(document.getElementById('newStock').value);
        
        if (stock < 0) {
            UIManager.showAlert('El stock no puede ser negativo', 'warning');
            return;
        }
        
        this.setProcessingState(true, 'saveStockBtn', 'Actualizando...');
        
        try {
            await ProductAPI.updateStock(productId, stock);
            this.closeModal('updateStockModal');
            this.loadProducts();
            UIManager.showAlert('Stock actualizado exitosamente', 'success');
        } catch (error) {
            UIManager.showAlert('Error al actualizar el stock', 'danger');
        } finally {
            this.setProcessingState(false, 'saveStockBtn');
        }
    }

    async handleUpdatePrices() {
        if (this.isProcessing) return;
        
        const productId = document.getElementById('updatePricesProductId').value;
        const retailPrice = parseFloat(document.getElementById('newRetailPrice').value);
        const wholesalePrice = parseFloat(document.getElementById('newWholesalePrice').value);
        
        if (retailPrice < wholesalePrice) {
            UIManager.showAlert('El precio al detal no puede ser menor que el precio al por mayor', 'warning');
            return;
        }
        
        if (retailPrice <= 0 || wholesalePrice <= 0) {
            UIManager.showAlert('Los precios deben ser mayores a 0', 'warning');
            return;
        }
        
        this.setProcessingState(true, 'savePricesBtn', 'Actualizando...');
        
        try {
            await ProductAPI.updatePrices(productId, { retailPrice, wholesalePrice });
            this.closeModal('updatePricesModal');
            this.loadProducts();
            UIManager.showAlert('Precios actualizados exitosamente', 'success');
        } catch (error) {
            UIManager.showAlert('Error al actualizar los precios', 'danger');
        } finally {
            this.setProcessingState(false, 'savePricesBtn');
        }
    }

    async deleteProduct(product) {
        if (this.isProcessing) return;
        
        if (!confirm(`¿Está seguro de que desea eliminar el producto "${product.name}"?`)) {
            return;
        }

        this.setProcessingState(true, null, 'Eliminando...');
        
        try {
            await ProductAPI.deleteProduct(product.id);
            this.loadProducts();
            UIManager.showAlert('Producto eliminado exitosamente', 'success');
        } catch (error) {
            UIManager.showAlert('Error al eliminar el producto', 'danger');
        } finally {
            this.setProcessingState(false);
        }
    }

    // Nuevo método para manejar el estado de procesamiento
    setProcessingState(processing, elementId = null, loadingText = null) {
        this.isProcessing = processing;
        
        const allActionButtons = document.querySelectorAll('button, input[type="submit"]');
        
        if (processing) {
            // Deshabilitar todos los botones principales
            allActionButtons.forEach(button => {
                if (!button.classList.contains('btn-close')) {
                    button.disabled = true;
                }
            });
            
            // Mostrar estado de carga en el botón específico
            if (elementId && loadingText) {
                const element = document.getElementById(elementId);
                if (element) {
                    const tag = element.tagName ? element.tagName.toLowerCase() : '';
                    // Si el elemento es un botón/input, reemplazar su contenido
                    if (tag === 'button' || (tag === 'input' && (element.type === 'submit' || element.type === 'button'))) {
                        element.innerHTML = `
                            <i class="fas fa-spinner fa-spin"></i> ${loadingText}
                        `;
                    } else {
                        // Si se pasó el id de un contenedor (p.ej. el formulario), intentar encontrar un botón submit dentro
                        const btn = element.querySelector && (element.querySelector('button[type="submit"], input[type="submit"]'));
                        if (btn) {
                            btn.innerHTML = `
                                <i class="fas fa-spinner fa-spin"></i> ${loadingText}
                            `;
                        }
                    }
                }
            }
            
            // Mostrar indicador global
            document.body.style.cursor = 'wait';
            UIManager.showGlobalLoading(true);
            
        } else {
            // Rehabilitar todos los botones
            allActionButtons.forEach(button => {
                button.disabled = false;
            });
            
            // Restaurar texto original de los botones
            this.restoreButtonText();
            
            // Ocultar indicador global
            document.body.style.cursor = 'default';
            UIManager.showGlobalLoading(false);
        }
    }

    restoreButtonText() {
        const buttons = {
            'saveProductBtn': '<i class="fas fa-save"></i> Guardar Producto',
            'updateProductBtn': '<i class="fas fa-sync-alt"></i> Actualizar Producto',
            'saveStockBtn': '<i class="fas fa-save"></i> Actualizar Stock',
            'savePricesBtn': '<i class="fas fa-save"></i> Actualizar Precios'
        };
        
        Object.keys(buttons).forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.innerHTML = buttons[buttonId];
            }
        });
    }

    getProductFormData(formId) {
        const form = document.getElementById(formId);
        return {
            name: form.querySelector('#productName')?.value || form.querySelector('#editProductName')?.value,
            description: form.querySelector('#productDescription')?.value || form.querySelector('#editProductDescription')?.value,
            retailPrice: parseFloat(form.querySelector('#retailPrice')?.value || form.querySelector('#editRetailPrice')?.value),
            wholesalePrice: parseFloat(form.querySelector('#wholesalePrice')?.value || form.querySelector('#editWholesalePrice')?.value),
            location: form.querySelector('#productLocation')?.value || form.querySelector('#editProductLocation')?.value,
            stock: parseInt(form.querySelector('#productStock')?.value || form.querySelector('#editProductStock')?.value)
        };
    }

    validateProductData(product) {
        if (product.retailPrice <= 0 || product.wholesalePrice <= 0) {
            return {
                isValid: false,
                message: 'Los precios deben ser mayores a 0'
            };
        }
        
        if (product.retailPrice < product.wholesalePrice) {
            return {
                isValid: false,
                message: 'El precio al detal no puede ser menor que el precio al por mayor'
            };
        }
        
        if (product.stock < 0) {
            return {
                isValid: false,
                message: 'El stock no puede ser negativo'
            };
        }
        
        if (!product.name.trim()) {
            return {
                isValid: false,
                message: 'El nombre del producto es requerido'
            };
        }
        
        if (!product.location.trim()) {
            return {
                isValid: false,
                message: 'La ubicación es requerida'
            };
        }
        
        return { isValid: true, message: '' };
    }

    closeModal(modalId) {
        const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
        modal.hide();
    }

    resetForm(formId) {
        document.getElementById(formId).reset();
    }

    openEditModal(product) {
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductDescription').value = product.description;
        document.getElementById('editRetailPrice').value = product.retailPrice;
        document.getElementById('editWholesalePrice').value = product.wholesalePrice;
        document.getElementById('editProductLocation').value = product.location;
        document.getElementById('editProductStock').value = product.stock;

        new bootstrap.Modal(document.getElementById('editProductModal')).show();
    }

    openStockModal(product) {
        document.getElementById('updateStockProductId').value = product.id;
        document.getElementById('updateStockProductName').value = product.name;
        document.getElementById('newStock').value = product.stock;

        new bootstrap.Modal(document.getElementById('updateStockModal')).show();
    }

    openPricesModal(product) {
        document.getElementById('updatePricesProductId').value = product.id;
        document.getElementById('updatePricesProductName').value = product.name;
        document.getElementById('newRetailPrice').value = product.retailPrice;
        document.getElementById('newWholesalePrice').value = product.wholesalePrice;

        new bootstrap.Modal(document.getElementById('updatePricesModal')).show();
    }

    displayProducts() {
        const grid = document.getElementById('productsGrid');
        
        if (this.currentProducts.length === 0) {
            grid.innerHTML = UIManager.showEmptyState();
            return;
        }

        grid.innerHTML = '';
        
        this.currentProducts.forEach(product => {
            const cardHtml = UIManager.createProductCard(product, {
                onEdit: (p) => this.openEditModal(p),
                onStockUpdate: (p) => this.openStockModal(p),
                onPricesUpdate: (p) => this.openPricesModal(p),
                onDelete: (p) => this.deleteProduct(p)
            });
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cardHtml.trim();
            const cardElement = tempDiv.firstChild;
            
            UIManager.bindProductCardEvents(cardElement, product, {
                onEdit: (p) => this.openEditModal(p),
                onStockUpdate: (p) => this.openStockModal(p),
                onPricesUpdate: (p) => this.openPricesModal(p),
                onDelete: (p) => this.deleteProduct(p)
            });
            
            grid.appendChild(cardElement);
        });
    }

    showLogin() {
        UIManager.showSection('loginSection');
    }

    showApp() {
        UIManager.showSection('appSection');
    }
}