import ProductCard from "./ProductCard";

export const ProductList = ({ images }) => {
  return (
    <div className="mt-4">
      <div className="max-w-10xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 place-items-center md:place-items-stretch">
          {images.map((product, index) => (
            <div key={product.itemName || index} className="w-full max-w-sm">
              <ProductCard
                itemSrc={product.itemSrc}
                itemName={product.itemName}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
