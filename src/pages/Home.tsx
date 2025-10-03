import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  function onChoose(mode: "dinein" | "pickup" | "delivery") {
    navigate(`/order?mode=${mode}`);
  }

  const cards = [
    {
      id: "dinein",
      title: "Dine In",
      subtitle: "Makan di tempat",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M10 17h4" />
        </svg>
      ),
    },
    {
      id: "pickup",
      title: "Pick Up",
      subtitle: "Ambil sendiri",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        </svg>
      ),
    },
    {
      id: "delivery",
      title: "Delivery",
      subtitle: "Diantarkan ke alamat",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M3 12h13l3 4h-2v3h-2v-3H8v-4H3z" />
        </svg>
      ),
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 md:p-12">
      <header className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            E-Cul Fibbonaci
          </h1>
        </div>
        <p className="mt-4 text-slate-600">Pilih, mau pesan lewat apa?</p>
      </header>

      <main className="max-w-4xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onChoose(card.id)}
            className="group bg-white shadow-md rounded-2xl p-6 flex flex-col items-start gap-4 hover:shadow-xl transition"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-700">
              {card.icon}
            </div>
            <div className="text-lg font-semibold text-slate-800">{card.title}</div>
            <div className="text-sm text-slate-500">{card.subtitle}</div>
            <div className="mt-2 text-xs text-slate-400 group-hover:text-slate-600">
              Klik untuk mulai
            </div>
          </button>
        ))}
      </main>

      <footer className="max-w-4xl mx-auto mt-12 text-center text-xs text-slate-400">
        Built with Kuh, Tio, Cul
      </footer>
    </div>
  );
}
