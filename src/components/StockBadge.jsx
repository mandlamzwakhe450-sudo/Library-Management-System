// Small reusable component that shows the stock status
function StockBadge({ quantity }) {
  if (quantity === 0) return <span className="badge out">Out of stock</span>;
  if (quantity < 2) return <span className="badge low">Low stock</span>;
  return <span className="badge ok">In stock</span>;
}

export default StockBadge;
