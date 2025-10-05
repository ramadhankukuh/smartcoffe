import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HeaderCategory from "../components/HeaderCategory";
import { SAMPLE_MENU } from "../data/menu";
import { formatRp } from "../utils/format";
import FloatingCartButton from "../components/FloatingCartButton";
import CartPreviewModal from "../components/CartPreviewModal";
import Swal from "sweetalert2";

export default function OrderPage() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [isCartOpen, setCartOpen] = useState(false);
  const [isTableModalOpen, setTableModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("SEMUA");
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const tableFromURL = searchParams.get("table");

  const items = SAMPLE_MENU;

  // Filter items by category
  const filteredItems = items.filter(
    (it) => selectedCategory === "SEMUA" || it.category === selectedCategory
  );

function addToCart(id: number) {
  setCart((c) => {
    const newCart = { ...c, [id]: (c[id] || 0) + 1 };
    saveCartToLocalStorage(newCart);
    return newCart;
  });
}

function removeFromCart(id: number) {
  setCart((c) => {
    const newCart = { ...c };
    if (!newCart[id]) return newCart;
    newCart[id] = newCart[id] - 1;
    if (newCart[id] <= 0) delete newCart[id];
    saveCartToLocalStorage(newCart);
    return newCart;
  });
}

// helper simpan ke localStorage
function saveCartToLocalStorage(cart: Record<number, number>) {
  const cartData = Object.entries(cart).map(([k, v]) => {
    const item = SAMPLE_MENU.find(i => i.id === Number(k))!;
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      qty: v,
    };
  });
  localStorage.setItem("cart", JSON.stringify(cartData));
}


  const cartEntries = useMemo(() => {
    return Object.entries(cart).map(([k, v]) => {
      const id = Number(k);
      const item = items.find((i) => i.id === id)!;
      return { item, qty: v };
    });
  }, [cart, items]);

  const total = cartEntries.reduce((s, e) => s + e.item.price * e.qty, 0);
  const count = cartEntries.reduce((s, e) => s + e.qty, 0);

  // ✅ Daftar meja valid
  const validTables = [
    "Indoor 1",
    "Indoor 2",
    "Indoor 3",
    "Outdoor 1",
    "Outdoor 2",
    "Outdoor 3",
  ];

  useEffect(() => {
    if (mode === "dinein") {
      if (tableFromURL && validTables.includes(tableFromURL)) {
        setTableNumber(tableFromURL);
      } else if (tableFromURL && !validTables.includes(tableFromURL)) {
        Swal.fire({
          icon: "error",
          title: "Nomor Meja Tidak Valid",
          text: `Meja "${tableFromURL}" tidak tersedia. Silakan pilih nomor meja yang benar.`,
          confirmButtonColor: "#f97316",
        }).then(() => {
          setSearchParams({ mode: "dinein" });
          setTableModalOpen(true);
        });
      } else {
        setTableModalOpen(true);
      }
    }
  }, [mode, tableFromURL]);

  // Tambahkan useEffect untuk load cart dari localStorage
useEffect(() => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    try {
      const parsed: { id: number; name: string; price: number; qty: number }[] = JSON.parse(storedCart);
      const cartMap: Record<number, number> = {};
      parsed.forEach(item => {
        cartMap[item.id] = item.qty;
      });
      setCart(cartMap);
    } catch (e) {
      console.error("Gagal parsing cart dari localStorage", e);
      localStorage.removeItem("cart");
    }
  }
}, []);


  const handleCheckout = () => {
    if (mode === "dinein" && !tableNumber) {
      setTableModalOpen(true);
      return;
    }

    if (Object.keys(cart).length === 0) return;

    const cartData = cartEntries.map((e) => ({
      id: e.item.id,
      name: e.item.name,
      price: e.item.price,
      qty: e.qty,
    }));
    localStorage.setItem("cart", JSON.stringify(cartData));

    const params = new URLSearchParams();
    if (mode) params.set("mode", mode);
    if (tableNumber) params.set("table", tableNumber);

    navigate(`/payment?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Category */}
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <HeaderCategory
          title="SmartCoffee."
          onCategoryChange={(cat) => setSelectedCategory(cat)}
        />
      </div>

      {/* Info Meja */}
{mode === "dinein" && tableNumber && (
  <div className="max-w-4xl mx-auto px-4 md:px-6 mt-4">
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 rounded-lg shadow-md">
      🍽️ Anda sedang dine-in di <span className="font-bold">Meja {tableNumber}</span>
    </div>
  </div>
)}


      {/* Konten Utama */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        <section>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
  {filteredItems.map((it) => (
    <article key={it.id} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="flex gap-4 items-start">
        <div className="w-28 h-28 rounded-lg overflow-hidden flex items-center justify-center bg-slate-100">
          <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">{it.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{it.desc}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-slate-700 font-medium">{formatRp(it.price)}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => removeFromCart(it.id)} className="px-3 py-1 rounded-lg bg-slate-100">-</button>
              <div className="w-8 text-center">{cart[it.id] || 0}</div>
              <button onClick={() => addToCart(it.id)} className="px-3 py-1 rounded-lg bg-blue-600 text-white">+</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  ))}
</div>

        </section>
      </main>

      {/* Floating Cart Button */}
      {count > 0 && (
        <FloatingCartButton
          total={total}
          count={count}
          onOpen={() => setCartOpen(true)}
        />
      )}

      {/* Cart Preview Modal */}
      <CartPreviewModal
        open={isCartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        items={items}
        onIncrease={addToCart}
        onDecrease={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Modal Pilih Meja */}
      {isTableModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl">
            <h2 className="text-lg font-semibold mb-1 flex items-center justify-center gap-2">
              🍽️ Pilih Nomor Meja
            </h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              Silakan pilih lokasi dan nomor meja Anda
            </p>

            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-5 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="">-- Pilih Nomor Meja --</option>
              <optgroup label="Indoor">
                <option value="Indoor 1">Indoor 1</option>
                <option value="Indoor 2">Indoor 2</option>
                <option value="Indoor 3">Indoor 3</option>
              </optgroup>
              <optgroup label="Outdoor">
                <option value="Outdoor 1">Outdoor 1</option>
                <option value="Outdoor 2">Outdoor 2</option>
                <option value="Outdoor 3">Outdoor 3</option>
              </optgroup>
            </select>

            <div className="flex gap-3">
              <button
                className="flex-1 bg-gray-200 hover:bg-gray-300 rounded-lg py-2 transition"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Batal
              </button>
              <button
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2 transition"
                onClick={() => {
                  if (!tableNumber.trim()) return;
                  setSearchParams({ mode: "dinein", table: tableNumber });
                  setTableModalOpen(false);
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
