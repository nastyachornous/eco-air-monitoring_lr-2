
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyForm = {
  city: "",
  station: "",
  pm25: "",
  pm10: "",
  no2: "",
  temperature: "",
  humidity: "",
  measuredAt: "",
  source: "EcoAir Monitoring",
};

function MeasurementModal({ isOpen, onClose, onSave, measurement }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (measurement) {
      setForm({
        city: measurement.city || "",
        station: measurement.station || "",
        pm25: measurement.pm25 ?? "",
        pm10: measurement.pm10 ?? "",
        no2: measurement.no2 ?? "",
        temperature: measurement.temperature ?? "",
        humidity: measurement.humidity ?? "",
        measuredAt: measurement.measuredAt
          ? new Date(measurement.measuredAt).toISOString().slice(0, 16)
          : "",
        source: measurement.source || "EcoAir Monitoring",
      });
    } else {
      setForm(emptyForm);
    }
  }, [measurement, isOpen]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      ...form,
      pm25: Number(form.pm25),
      pm10: Number(form.pm10),
      no2: form.no2 === "" ? undefined : Number(form.no2),
      temperature:
        form.temperature === "" ? undefined : Number(form.temperature),
      humidity:
        form.humidity === "" ? undefined : Number(form.humidity),
      measuredAt: new Date(form.measuredAt).toISOString(),
    });
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>
              {measurement ? "Редагувати вимірювання" : "Нове вимірювання"}
            </h2>
            <p>Заповни інформацію про якість повітря</p>
          </div>

          <button className="icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Місто *
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="Наприклад, Київ"
              />
            </label>

            <label>
              Станція *
              <input
                name="station"
                value={form.station}
                onChange={handleChange}
                required
                placeholder="Назва станції"
              />
            </label>

            <label>
              PM2.5 *
              <input
                type="number"
                name="pm25"
                min="0"
                step="any"
                value={form.pm25}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              PM10 *
              <input
                type="number"
                name="pm10"
                min="0"
                step="any"
                value={form.pm10}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              NO₂
              <input
                type="number"
                name="no2"
                min="0"
                step="any"
                value={form.no2}
                onChange={handleChange}
              />
            </label>

            <label>
              Температура (°C)
              <input
                type="number"
                name="temperature"
                step="any"
                value={form.temperature}
                onChange={handleChange}
              />
            </label>

            <label>
              Вологість (%)
              <input
                type="number"
                name="humidity"
                min="0"
                max="100"
                step="any"
                value={form.humidity}
                onChange={handleChange}
              />
            </label>

            <label>
              Дата та час *
              <input
                type="datetime-local"
                name="measuredAt"
                value={form.measuredAt}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="button-secondary" onClick={onClose}>
              Скасувати
            </button>

            <button type="submit" className="button-primary">
              {measurement ? "Зберегти зміни" : "Додати вимірювання"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MeasurementModal;
