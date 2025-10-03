export type MenuItem = {
  id: number;
  name: string;
  desc: string;
  price: number;
  category: string;
};

export const SAMPLE_MENU: MenuItem[] = [
  { id: 1, name: "Nasi Goreng", desc: "Pedas gurih", price: 20000, category: "MAKANAN" },
  { id: 2, name: "Es Teh", desc: "Dingin menyegarkan", price: 5000, category: "MINUMAN" },
  { id: 3, name: "Keripik", desc: "Gurih renyah", price: 10000, category: "SNACK" },
  { id: 4, name: "Kopi", desc: "Hitam pekat", price: 12000, category: "MINUMAN" },
];
