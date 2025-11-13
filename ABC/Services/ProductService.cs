using ABC.Data;
using ABC.DTOs;
using ABC.Models;
using Microsoft.EntityFrameworkCore;

namespace ABC.Services
{

    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductDTO>> GetAllProductsAsync()
        {
            var products = await _context.Products.ToListAsync();
            return products.Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                RetailPrice = p.RetailPrice,
                WholesalePrice = p.WholesalePrice,
                Location = p.Location,
                Stock = p.Stock
            });
        }

        public async Task<ProductDTO> GetProductByIdAsync(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;

            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                RetailPrice = product.RetailPrice,
                WholesalePrice = product.WholesalePrice,
                Location = product.Location,
                Stock = product.Stock
            };
        }

        public async Task<ProductDTO> CreateProductAsync(ProductCreateDTO productDto)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = productDto.Name,
                Description = productDto.Description,
                RetailPrice = productDto.RetailPrice,
                WholesalePrice = productDto.WholesalePrice,
                Location = productDto.Location,
                Stock = productDto.Stock,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                RetailPrice = product.RetailPrice,
                WholesalePrice = product.WholesalePrice,
                Location = product.Location,
                Stock = product.Stock
            };
        }

        public async Task UpdateProductAsync(ProductUpdateDTO productDto)
        {
            var product = await _context.Products.FindAsync(productDto.Id);
            if (product == null) throw new ArgumentException("Product not found");

            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.RetailPrice = productDto.RetailPrice;
            product.WholesalePrice = productDto.WholesalePrice;
            product.Location = productDto.Location;
            product.Stock = productDto.Stock;
            product.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task UpdateStockAsync(Guid id, int stock)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) throw new ArgumentException("Product not found");

            product.Stock = stock;
            product.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task UpdatePricesAsync(Guid id, decimal retailPrice, decimal wholesalePrice)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) throw new ArgumentException("Product not found");

            product.RetailPrice = retailPrice;
            product.WholesalePrice = wholesalePrice;
            product.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteProductAsync(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) throw new ArgumentException("Product not found");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
    }
}