
import React from "react";
import { Pencil, Trash2, Wind } from "lucide-react";

function DataTable({ measurements, onEdit, onDelete }) {
  const getAirQuality = (pm25) => {
    if (pm25 <= 12) {
      return { label: "Добре", className: "good" };
    }

    if (pm25 <= 35.4) {
      return { label: "Помірне", className: "moderate" };
    }

    return { label: "Погане", className: "poor" };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (measurements.length === 0) {
    return (
      <div className="empty-state">
        <Wind size={38} />
        <h3>Вимірювань поки немає</h3>
        <p>Додай перше вимірювання, щоб побачити дані в таблиці.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="measurements-table">
        <thead>
          <tr>
            <th>Місто / станція</th>
            <th>PM2.5</th>
            <th>PM10</th>
            <th>NO₂</th>
            <th>Температура</th>
            <th>Вологість</th>
            <th>Якість повітря</th>
            <th>Дата</th>
            <th>Дії</th>
          </tr>
        </thead>

        <tbody>
          {measurements.map((item) => {
            const quality = getAirQuality(Number(item.pm25));

            return (
              <tr key={item._id}>
                <td>
                  <div className="station-cell">
                    <div className="station-icon">
                      <Wind size={17} />
                    </div>
                    <div>
                      <strong>{item.city}</strong>
                      <span>{item.station}</span>
                    </div>
                  </div>
                </td>

                <td>{item.pm25}</td>
                <td>{item.pm10}</td>
                <td>{item.no2 ?? "—"}</td>
                <td>
                  {item.temperature != null
                    ? `${item.temperature}°C`
                    : "—"}
                </td>
                <td>
                  {item.humidity != null
                    ? `${item.humidity}%`
                    : "—"}
                </td>
                <td>
                  <span className={`quality-badge ${quality.className}`}>
                    {quality.label}
                  </span>
                </td>
                <td>{formatDate(item.measuredAt)}</td>

                <td>
                  <div className="table-actions">
                    <button
                      className="action-button edit"
                      title="Редагувати"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="action-button delete"
                      title="Видалити"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
