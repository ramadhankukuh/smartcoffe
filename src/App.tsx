// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OrderPage from "./pages/OrderPage";
import SearchPage from "./pages/SearchPage"; // <- import search page
import PaymentPage from "./pages/PaymentPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/search" element={<SearchPage />} /> {/* <- tambahkan route search */}
      <Route path="/payment" element={<PaymentPage />} />
    </Routes>
  );
}
