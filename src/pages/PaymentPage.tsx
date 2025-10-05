import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// optional: gunakan util formatRp kalau kamu punya, kalau tidak ada helper kecil di bawah dipakai
// import { formatRp } from "../utils/format";
const formatRp = (n: number) => "Rp " + n.toLocaleString("id-ID");

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get("mode");
  const table = searchParams.get("table");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartItem[];
        setCartItems(parsed);
      } catch (e) {
        console.error("Gagal parsing cart dari localStorage", e);
        localStorage.removeItem("cart");
        navigate("/");
      }
    } else {
      // kalau tidak ada data keranjang → balik ke order page
      navigate("/");
    }
  }, [navigate]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !paymentMethod) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Pastikan nama, email, dan metode pembayaran sudah diisi.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    // Simulasi submit order
    const order = {
      name,
      email,
      phone,
      mode,
      table,
      paymentMethod,
      items: cartItems,
      total,
      createdAt: new Date().toISOString(),
    };

    // Simpan order sederhana (opsional)
    localStorage.setItem("lastOrder", JSON.stringify(order));
    // Kosongkan keranjang
    localStorage.removeItem("cart");

if (paymentMethod === "qris") {
  const dynamicQris = generateDynamicQris(BASE_QRIS, total);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(dynamicQris)}&size=250x250`;

  Swal.fire({
    title: "Scan QRIS untuk Pembayaran",
    html: `
      <div class="flex flex-col items-center">
        <img src="${qrUrl}" alt="QRIS" class="mx-auto mb-3 rounded-lg border" />
        <div class="text-lg font-semibold text-orange-600">${formatRp(total)}</div>
      </div>
    `,
    confirmButtonText: "Selesai",
    confirmButtonColor: "#f97316",
    allowOutsideClick: false,
  }).then(() => {
    // Simpan order sederhana
    const order = {
      name,
      email,
      phone,
      mode,
      table,
      paymentMethod,
      items: cartItems,
      total,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("lastOrder", JSON.stringify(order));
    localStorage.removeItem("cart");
    navigate("/");
  });

  return;
}


  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 mt-6">
        <h1 className="text-2xl font-bold text-center mb-6">💳 Pembayaran Pesanan</h1>

        {/* Info mode & meja */}
        <div className="space-y-2 mb-6 text-gray-700 border-b pb-4">
          <div className="flex justify-between">
            <span>Mode Pemesanan:</span>
            <span className="font-semibold capitalize">{mode}</span>
          </div>
          {mode === "dinein" && (
            <div className="flex justify-between">
              <span>Nomor Meja:</span>
              <span className="font-semibold">{table}</span>
            </div>
          )}
        </div>

        {/* Ringkasan pesanan */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Ringkasan Pesanan</h2>
          <div className="divide-y">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between py-2 text-sm">
                <div>
                  {item.name} <span className="text-gray-500">x{item.qty}</span>
                </div>
                <div>{formatRp(item.price * item.qty)}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 font-bold text-orange-600 text-lg">
            <span>Total</span>
            <span>{formatRp(total)}</span>
          </div>
        </div>

        {/* Form Kontak & Pembayaran */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nama*</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email*</label>
            <input
              type="email"
              className="w-full border rounded-lg p-2"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">No. HP (Opsional)</label>
            <input
              type="tel"
              className="w-full border rounded-lg p-2"
              placeholder="08123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

{/* Metode Pembayaran */}
<div>
  <label className="block text-sm mb-2">Metode Pembayaran*</label>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
    {/* QRIS */}
    <label
      className={`flex flex-col items-center justify-center border rounded-xl p-3 cursor-pointer transition 
        ${paymentMethod === "qris" ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-orange-300"}`}
    >
      <input
        type="radio"
        name="payment"
        value="qris"
        checked={paymentMethod === "qris"}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="hidden"
      />
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/QRIS_logo.svg/512px-QRIS_logo.svg.png"
        alt="QRIS"
        className="h-10 object-contain mb-2"
      />
      <span className="text-sm font-medium">QRIS</span>
    </label>

    {/* GoPay */}
    <label
      className={`flex flex-col items-center justify-center border rounded-xl p-3 cursor-pointer transition 
        ${paymentMethod === "gopay" ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-orange-300"}`}
    >
      <input
        type="radio"
        name="payment"
        value="gopay"
        checked={paymentMethod === "gopay"}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="hidden"
      />
      <img
        src="https://1000logos.net/wp-content/uploads/2021/05/GoPay-logo.png"
        alt="GoPay"
        className="h-8 object-contain mb-2"
      />
      <span className="text-sm font-medium">GoPay</span>
    </label>

    {/* Contoh tambahan: Dana */}
    <label
      className={`flex flex-col items-center justify-center border rounded-xl p-3 cursor-pointer transition 
        ${paymentMethod === "dana" ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-orange-300"}`}
    >
      <input
        type="radio"
        name="payment"
        value="dana"
        checked={paymentMethod === "dana"}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="hidden"
      />
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Dana_Logo.svg/512px-Dana_Logo.svg.png"
        alt="Dana"
        className="h-8 object-contain mb-2"
      />
      <span className="text-sm font-medium">Dana</span>
    </label>
  </div>
</div>


          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 rounded-lg py-2"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2"
            >
              Bayar Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// QRIS base statis kamu
const BASE_QRIS = "00020101021126570011ID.DANA.WWW011893600915335326596902093532659690303UMI51440014ID.CO.QRIS.WWW0215ID10222268737870303UMI5204549953033605802ID5913RAMADHANKUKUH6013Kota Semarang6105501496304D46C";

// ✅ Fungsi hitung CRC16 (poly 0x1021)
function crc16(str: string) {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
    crc &= 0xFFFF;
  }
  let hex = crc.toString(16).toUpperCase();
  if (hex.length === 3) hex = "0" + hex;
  return hex;
}

// 🧠 Fungsi convert QRIS statis → dinamis + nominal
function generateDynamicQris(base: string, amount: number): string {
  // 1. Hapus CRC lama (4 char terakhir)
  let qris = base.slice(0, -4);

  // 2. Ganti 010211 → 010212
  qris = qris.replace("010211", "010212");

  // 3. Split di "5802ID"
  const parts = qris.split("5802ID");
  if (parts.length !== 2) {
    console.error("QRIS tidak valid: tidak menemukan 5802ID");
    return base;
  }

  // 4. Format nominal
  const amtStr = amount.toString();
  const uangTag = "54" + amtStr.length.toString().padStart(2, "0") + amtStr;

  // 5. Gabungkan ulang
  const fixed = parts[0] + uangTag + "5802ID" + parts[1];

  // 6. Hitung CRC16 baru dan append
  const final = fixed + crc16(fixed);

  return final;
}