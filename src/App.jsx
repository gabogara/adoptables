import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import NavBar from "./shared/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import DetailsPage from "./pages/DetailsPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { FavoritesProvider } from "./features/favorites/FavoritesContext.jsx";

export default function App() {
  return (
    <FavoritesProvider>
      <NavBar>
        {/* children prop to meet the "component that takes children" requirement */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Search
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Favorites
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          About
        </NavLink>
      </NavBar>

      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/details/:id" element={<DetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </FavoritesProvider>
  );
}
