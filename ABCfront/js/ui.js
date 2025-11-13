class UIManager {
    static showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        const alertId = 'alert-' + Date.now();
        
        const alert = document.createElement('div');
        alert.id = alertId;
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        alertContainer.appendChild(alert);
        
        setTimeout(() => {
            const alertElement = document.getElementById(alertId);
            if (alertElement) {
                alertElement.remove();
            }
        }, 5000);
    }

    static showLoading(show) {
        const loadingElement = document.getElementById('loadingSpinner');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
    }

    static showSection(sectionId) {
        const sections = ['loginSection', 'appSection'];
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }

    static createProductCard(product, eventHandlers) {
        const stockClass = product.stock === 0 ? 'stock-low' : '';
        const stockText = product.stock === 0 ? 'Sin Stock' : `Stock: ${product.stock}`;
        const stockBadgeClass = product.stock === 0 ? 'bg-danger' : (product.stock < 10 ? 'bg-warning' : 'bg-success');
        
        const stockWarning = product.stock === 0 ? 
            '<div class="alert alert-warning stock-warning py-2 mb-3"><small><i class="fas fa-exclamation-triangle"></i> Producto agotado</small></div>' : 
            '';

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card product-card h-100 ${stockClass}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title">${product.name}</h5>
                            <span class="badge ${stockBadgeClass}">${stockText}</span>
                        </div>
                        
                        ${stockWarning}
                        
                        <p class="card-text text-muted small">${product.description || 'Sin descripción'}</p>
                        
                        <div class="mb-3">
                            <div class="d-flex justify-content-between">
                                <span class="badge bg-primary price-badge">
                                    <i class="fas fa-store"></i> Detal: $${product.retailPrice.toFixed(2)}
                                </span>
                                <span class="badge bg-success price-badge">
                                    <i class="fas fa-truck-loading"></i> Mayor: $${product.wholesalePrice.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="fas fa-map-marker-alt"></i> ${product.location}
                            </small>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent action-buttons">
                        <div class="btn-group w-100" role="group">
                            <button class="btn btn-sm btn-outline-warning edit-btn" title="Editar Producto">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-info stock-btn" title="Actualizar Stock">
                                <i class="fas fa-boxes"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success prices-btn" title="Actualizar Precios">
                                <i class="fas fa-dollar-sign"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" title="Eliminar Producto">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static bindProductCardEvents(cardElement, product, eventHandlers) {
        cardElement.querySelector('.edit-btn').addEventListener('click', () => eventHandlers.onEdit(product));
        cardElement.querySelector('.stock-btn').addEventListener('click', () => eventHandlers.onStockUpdate(product));
        cardElement.querySelector('.prices-btn').addEventListener('click', () => eventHandlers.onPricesUpdate(product));
        cardElement.querySelector('.delete-btn').addEventListener('click', () => eventHandlers.onDelete(product));
    }

    static showEmptyState() {
        return `
            <div class="col-12 text-center py-5">
                <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No hay productos registrados</h4>
                <p class="text-muted">Utilice el botón "Nuevo Producto" para agregar el primero.</p>
            </div>
        `;
    }

    static initFormValidations() {
        const addForm = document.getElementById('addProductForm');
        if (addForm) {
            addForm.addEventListener('input', (e) => {
                this.validatePriceComparison('retailPrice', 'wholesalePrice', 'addProductForm');
            });
        }

        const editForm = document.getElementById('editProductForm');
        if (editForm) {
            editForm.addEventListener('input', (e) => {
                this.validatePriceComparison('editRetailPrice', 'editWholesalePrice', 'editProductForm');
            });
        }

        const pricesForm = document.getElementById('updatePricesForm');
        if (pricesForm) {
            pricesForm.addEventListener('input', (e) => {
                this.validatePriceComparison('newRetailPrice', 'newWholesalePrice', 'updatePricesForm');
            });
        }
    }

    static validatePriceComparison(retailPriceId, wholesalePriceId, formId) {
        const retailPriceInput = document.getElementById(retailPriceId);
        const wholesalePriceInput = document.getElementById(wholesalePriceId);
        const form = document.getElementById(formId);

        if (!retailPriceInput || !wholesalePriceInput) return;

        const retailPrice = parseFloat(retailPriceInput.value) || 0;
        const wholesalePrice = parseFloat(wholesalePriceInput.value) || 0;

        retailPriceInput.classList.remove('is-invalid', 'is-valid');
        wholesalePriceInput.classList.remove('is-invalid', 'is-valid');

        if (retailPrice > 0 && wholesalePrice > 0 && retailPrice < wholesalePrice) {
            retailPriceInput.classList.add('is-invalid');
            wholesalePriceInput.classList.add('is-invalid');
            this.showInlineError(form, 'El precio al detal no puede ser menor que el precio al por mayor');
        } else {
            retailPriceInput.classList.add('is-valid');
            wholesalePriceInput.classList.add('is-valid');
            this.hideInlineError(form);
        }

        if (retailPrice < 0) {
            retailPriceInput.classList.add('is-invalid');
            this.showInlineError(form, 'El precio al detal no puede ser negativo');
        }

        if (wholesalePrice < 0) {
            wholesalePriceInput.classList.add('is-invalid');
            this.showInlineError(form, 'El precio al por mayor no puede ser negativo');
        }
    }

    static showInlineError(form, message) {
        this.hideInlineError(form);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback d-block';
        errorDiv.id = 'priceValidationError';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        form.appendChild(errorDiv);
    }

    static hideInlineError(form) {
        const existingError = form.querySelector('#priceValidationError');
        if (existingError) {
            existingError.remove();
        }
    }
}