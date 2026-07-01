import React from "react";

const ProductCard = ({ product, onEdit, onDelete }) => {
  // Use provided image URL, fallback to placeholder
  const imageUrl =
    product.image && product.image.trim() !== ""
      ? product.image
      : "/images/placeholder.jpg"; // make sure you add placeholder.jpg in /public/images

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition duration-200">
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="text-lg font-bold mt-2">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-blue-600 font-semibold mt-1">${product.price}</p>
      <p className="text-gray-500">Stock: {product.stock}</p>
      {onEdit && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="bg-yellow-500 text-white px-2 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
