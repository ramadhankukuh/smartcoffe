export type MenuItem = {
  id: number;
  name: string;
  desc: string;
  price: number;
  category: string;
  img: string; // tambahkan properti gambar
};

export const SAMPLE_MENU: MenuItem[] = [
  { 
    id: 1, 
    name: "Nasi Goreng", 
    desc: "Pedas gurih", 
    price: 20000, 
    category: "MAKANAN",
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&h=200&w=200"
  },
  { 
    id: 2, 
    name: "Es Teh", 
    desc: "Dingin menyegarkan", 
    price: 5000, 
    category: "MINUMAN",
    img: "https://images.unsplash.com/photo-1586201375761-83865001f1be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&h=200&w=200"
  },
  { 
    id: 3, 
    name: "Keripik", 
    desc: "Gurih renyah", 
    price: 10000, 
    category: "SNACK",
    img: "https://images.unsplash.com/photo-1601924638867-3ec2e3b2a4f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&h=200&w=200"
  },
  { 
    id: 4, 
    name: "Kopi", 
    desc: "Hitam pekat", 
    price: 12000, 
    category: "MINUMAN",
    img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&h=200&w=200"
  },
];

