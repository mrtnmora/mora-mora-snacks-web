export type Product = {
  id: string;
  name: string;
  category: 'chamoy' | 'chocolate';
  description: string;
  price: number;
  image: string;
  featured: boolean;
};

export const products: Product[] = [
  { id: 'chamoy-clasica', name: 'Chamoy clasica', category: 'chamoy', description: 'La original: picosita, acida y llena de color.', price: 0, image: '/images/apple-01.jpeg', featured: true },
  { id: 'chocolate-gomitas', name: 'Chocolate + gomitas', category: 'chocolate', description: 'Chocolate cremoso con toppings que truenan.', price: 0, image: '/images/apple-04.jpeg', featured: true },
  { id: 'chocolate-tamarindo', name: 'Chocolate + tamarindo', category: 'chocolate', description: 'Dulce, crujiente y con ese punch de tamarindo.', price: 0, image: '/images/apple-07.jpeg', featured: true },
];

export const flavorOptions = {
  chamoy: ['Miguelito', 'Tajin', 'Sandia', 'Mango', 'Fresa', 'Uva', 'Mora Azul', 'Pepino'],
  chocolate: ['Blanco', 'Obscuro'],
};

export const additionalToppingOptions = {
  chamoy: ['Sin topping adicional', 'Gomitas', 'Skwinkles'],
  chocolate: ['Sin topping adicional', 'Chispas de chocolate', 'Coco'],
};