function ProductCard({ product }) {
  return (
    <div className="w-[126px] shrink-0 rounded-2xl border border-line p-2.5">
      <div
        className="flex h-[92px] items-center justify-center rounded-xl text-[11px] text-muted"
        style={{
          backgroundImage:
            "linear-gradient(45deg, var(--color-line) 25%, transparent 25%), linear-gradient(-45deg, var(--color-line) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-line) 75%), linear-gradient(-45deg, transparent 75%, var(--color-line) 75%)",
          backgroundSize: "12px 12px",
          backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0",
        }}
      >
        상품 사진
      </div>

      <p className="mt-2 truncate text-[13px] font-medium text-ink">
        {product.name}
      </p>
      <p className="text-[11px] text-muted">
        W {product.price.toLocaleString()}
      </p>

      <span className="mt-1.5 inline-block rounded-full bg-ink px-2 py-[3px] text-[11px] font-semibold text-white">
        {product.matchRate}% MATCH
      </span>
    </div>
  );
}

export default ProductCard;
