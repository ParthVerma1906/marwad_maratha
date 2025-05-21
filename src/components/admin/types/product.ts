
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  ingredients?: string[];
  description?: string;
  isPopular?: boolean;
}

export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  isPopular?: boolean;
}
