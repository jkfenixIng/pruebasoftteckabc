namespace ABC.DTOs
{
    public class ProductCreateDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal RetailPrice { get; set; }
        public decimal WholesalePrice { get; set; }
        public string Location { get; set; } = string.Empty;
        public int Stock { get; set; }
    }
}
