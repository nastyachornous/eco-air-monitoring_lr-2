
import React from "react";

function StatCard({ title, value, unit, description, icon: Icon, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={22} />
      </div>

      <p className="stat-title">{title}</p>

      <div className="stat-value">
        {value}
        {unit && <span>{unit}</span>}
      </div>

      <p className="stat-description">{description}</p>
    </div>
  );
}

export default StatCard;
