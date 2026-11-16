
import React from "react";
import { Bell, Search } from "lucide-react";

function Header({ title, search, setSearch }) {
  return (
    <header className="topbar">
      <div>
        <div className="breadcrumb">EcoAir / {title}</div>
        <h1>{title}</h1>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Пошук вимірювань..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <button className="icon-button" aria-label="Сповіщення">
          <Bell size={20} />
        </button>

        <div className="user-avatar">EA</div>
      </div>
    </header>
  );
}

export default Header;
