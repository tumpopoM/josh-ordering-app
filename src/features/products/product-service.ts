import type { Product, ProductCategory } from "@/domain/types";

type ProductFilter = {
  category: ProductCategory | "All";
  searchText: string;
};

export function filterProducts(
  products: Product[],
  { category, searchText }: ProductFilter,
): Product[] {
  const normalizedSearch = searchText.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.name.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
}

export function getProductById(
  products: Product[],
  productId: string,
): Product | undefined {
  return products.find((product) => product.id === productId);
}
