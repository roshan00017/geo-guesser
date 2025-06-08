import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CountryGame } from "./components/CountryGame";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-blue-800 text-white shadow-lg">
          <div className="container mx-auto flex justify-center space-x-6 p-4">
            <Link
              to="/country"
              className="px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Country Quiz
            </Link>
            <Link
              to="/city"
              className="px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              City Quiz
            </Link>
          </div>
        </nav>

        <main className="container mx-auto">
          <Routes>
            <Route path="/country" element={<CountryGame />} />

            <Route path="/" element={<CountryGame />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
