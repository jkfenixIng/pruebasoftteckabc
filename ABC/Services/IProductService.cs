using ABC.DTOs;

namespace ABC.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDTO>> GetAllProductsAsync();
        Task<ProductDTO?> GetProductByIdAsync(Guid id);
        Task<ProductDTO> CreateProductAsync(ProductCreateDTO productDto);
        Task UpdateProductAsync(ProductUpdateDTO productDto);
        Task UpdateStockAsync(Guid id, int stock);
        Task UpdatePricesAsync(Guid id, decimal retailPrice, decimal wholesalePrice);
        Task DeleteProductAsync(Guid id);
    }
}
