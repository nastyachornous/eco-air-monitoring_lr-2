
import React from "react";
import {
  LayoutDashboard,
  Wind,
  MapPin,
  Settings,
  Leaf,
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { name: "Огляд", icon: LayoutDashboard },
    { name: "Вимірювання", icon: Wind },
    { name: "Станції", icon: MapPin },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Leaf size={24} />
        </div>
        <div>
          <h2>EcoAir</h2>
          <span>MONITORING SYSTEM</span>
        </div>
      </div>

      <div className="sidebar-label">МЕНЮ</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item">
          <Settings size={19} />
          <span>Налаштування</span>
        </button>

        <div className="sidebar-status">
          <span className="status-dot"></span>
          Система моніторингу
          <strong>Активна</strong>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
