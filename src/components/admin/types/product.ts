
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  ingredients?: string[];
}

export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  image: string;
}
