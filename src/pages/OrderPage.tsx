import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HeaderCategory from "../components/HeaderCategory";
import { SAMPLE_MENU } from "../data/menu";
import { formatRp } from "../utils/format";
import FloatingCartButton from "../components/FloatingCartButton";
import CartPreviewModal from "../components/CartPreviewModal";

export default function OrderPage() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [isCartOpen, setCartOpen] = useState(false);
  const [isTableModalOpen, setTableModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("SEMUA");

  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const tableFromURL = searchParams.get("table");

  const items = SAMPLE_MENU;

  // Filter items by category
  const filteredItems = items.filter((it) => selectedCategory === "SEMUA" || it.category === selectedCategory);

  function addToCart(id: number) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }

  function removeFromCart(id: number) {
    setCart((c) => {
      const copy = { ...c };
      if (!copy[id]) return copy;
      copy[id] = copy[id] - 1;
      if (copy[id] <= 0) delete copy[id];
      return copy;
    });
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

  // cek mode dinein & table
  useEffect(() => {
    if (mode === "dinein") {
      if (tableFromURL) {
        setTableNumber(tableFromURL);
      } else {
        // kalau belum ada table → langsung munculkan modal pilih meja
        setTableModalOpen(true);
      }
    }
  }, [mode, tableFromURL]);

  const handleCheckout = () => {
    if (mode === "dinein" && !tableNumber) {
      setTableModalOpen(true);
      return;
    }
    setCartOpen(false);
    alert(`Lanjut ke pembayaran\nMode: ${mode}\nMeja: ${tableNumber || "-"}`);
  };


  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderCategory 
        title="E-Cul Fibbonaci" 
        onCategoryChange={(cat) => setSelectedCategory(cat)} 
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((it) => (
              <article key={it.id} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="flex gap-4 items-start">
                  <div className="w-28 h-28 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">Img</div>
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
        <FloatingCartButton total={total} count={count} onOpen={() => setCartOpen(true)} />
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

      {/* 🪄 Floating modal pilih meja */}
      {isTableModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Pilih Nomor Meja</h2>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
              placeholder="Contoh: 5"
            />
<div className="flex gap-3">
  <button
    className="flex-1 bg-gray-200 rounded-lg py-2"
    onClick={() => {
      window.location.href = "/"; // langsung ke Home
    }}
  >
    Batal
  </button>

  <button
    className="flex-1 bg-orange-600 text-white rounded-lg py-2"
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
