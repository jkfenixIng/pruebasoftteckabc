namespace ABC.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal RetailPrice { get; set; }
        public decimal WholesalePrice { get; set; }
        public string Location { get; set; } = string.Empty;
        public int Stock { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}