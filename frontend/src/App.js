
import React, { useEffect, useMemo, useState } from "react";
import {
  Wind,
  Droplets,
  Thermometer,
  Activity,
  Plus,
  RefreshCw,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import DataTable from "./components/DataTable";
import MeasurementModal from "./components/MeasurementModal";

import {
  getMeasurements,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
} from "./services/airQualityApi";

import "./App.css";

function App() {
  const [measurements, setMeasurements] = useState([]);
  const [activePage, setActivePage] = useState("Огляд");
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);

  const loadMeasurements = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMeasurements();
      setMeasurements(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Не вдалося отримати дані. Перевір, чи запущений backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeasurements();
  }, []);

  const cities = useMemo(() => {
    return [...new Set(measurements.map((item) => item.city).filter(Boolean))];
  }, [measurements]);

  const filteredMeasurements = useMemo(() => {
    return measurements.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        item.city?.toLowerCase().includes(searchValue) ||
        item.station?.toLowerCase().includes(searchValue);

      const matchesCity =
        cityFilter === "all" || item.city === cityFilter;

      return matchesSearch && matchesCity;
    });
  }, [measurements, search, cityFilter]);

  const average = (field) => {
    const values = measurements
      .map((item) => Number(item[field]))
      .filter((value) => Number.isFinite(value));

    if (values.length === 0) return "—";

    return (
      values.reduce((sum, value) => sum + value, 0) / values.length
    ).toFixed(1);
  };

  const chartData = useMemo(() => {
    return [...measurements]
      .sort(
        (a, b) =>
          new Date(a.measuredAt) - new Date(b.measuredAt)
      )
      .slice(-10)
      .map((item) => ({
        date: new Date(item.measuredAt).toLocaleDateString("uk-UA", {
          day: "2-digit",
          month: "2-digit",
        }),
        pm25: Number(item.pm25),
        pm10: Number(item.pm10),
        city: item.city,
      }));
  }, [measurements]);

  const cityChartData = useMemo(() => {
    const grouped = {};

    measurements.forEach((item) => {
      if (!grouped[item.city]) {
        grouped[item.city] = { city: item.city, total: 0, count: 0 };
      }

      grouped[item.city].total += Number(item.pm25) || 0;
      grouped[item.city].count += 1;
    });

    return Object.values(grouped).map((item) => ({
      city: item.city,
      pm25: Number((item.total / item.count).toFixed(1)),
    }));
  }, [measurements]);

  const handleSave = async (formData) => {
    try {
      setError("");

      if (selectedMeasurement) {
        await updateMeasurement(selectedMeasurement._id, formData);
      } else {
        await createMeasurement(formData);
      }

      setModalOpen(false);
      setSelectedMeasurement(null);
      await loadMeasurements();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Не вдалося зберегти вимірювання. Перевір введені дані."
      );
    }
  };

  const handleEdit = (measurement) => {
    setSelectedMeasurement(measurement);
    setModalOpen(true);
  };

  const handleDelete = async (measurement) => {
    const confirmed = window.confirm(
      `Видалити вимірювання для станції "${measurement.station}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteMeasurement(measurement._id);
      await loadMeasurements();
    } catch (err) {
      setError(
        err.response?.data?.message || "Не вдалося видалити вимірювання."
      );
    }
  };

  const openCreateModal = () => {
    setSelectedMeasurement(null);
    setModalOpen(true);
  };

  const title =
    activePage === "Огляд" ? "Огляд системи" : activePage;

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        <Header title={title} search={search} setSearch={setSearch} />

        <div className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">ЕКОЛОГІЧНИЙ МОНІТОРИНГ</p>
              <h2>
                {activePage === "Огляд"
                  ? "Стан якості повітря"
                  : activePage}
              </h2>
              <p className="welcome-description">
                Переглядай актуальні показники та керуй вимірюваннями
                якості повітря.
              </p>
            </div>

            <button className="button-primary" onClick={openCreateModal}>
              <Plus size={18} />
              Додати вимірювання
            </button>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={19} />
              {error}
              <button onClick={loadMeasurements}>Повторити</button>
            </div>
          )}

          <section className="stats-grid">
            <StatCard
              title="Усього вимірювань"
              value={measurements.length}
              description="Записів у базі даних"
              icon={Activity}
              color="green"
            />

            <StatCard
              title="Середній PM2.5"
              value={average("pm25")}
              unit="µg/m³"
              description="Дрібнодисперсні частинки"
              icon={Wind}
              color="blue"
            />

            <StatCard
              title="Середня температура"
              value={average("temperature")}
              unit="°C"
              description="За всіма вимірюваннями"
              icon={Thermometer}
              color="orange"
            />

            <StatCard
              title="Середня вологість"
              value={average("humidity")}
              unit="%"
              description="Відносна вологість повітря"
              icon={Droplets}
              color="purple"
            />
          </section>

          {activePage === "Огляд" && (
            <section className="charts-grid">
              <div className="panel chart-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Динаміка забруднення</h3>
                    <p>Останні 10 вимірювань</p>
                  </div>
                  <CalendarDays size={20} />
                </div>

                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={270}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="pm25"
                        name="PM2.5"
                        stroke="#269b70"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="pm10"
                        name="PM10"
                        stroke="#e6a34a"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-empty">
                    Даних для побудови графіка поки немає
                  </div>
                )}
              </div>

              <div className="panel chart-panel">
                <div className="panel-heading">
                  <div>
                    <h3>PM2.5 за містами</h3>
                    <p>Середнє значення</p>
                  </div>
                  <Wind size={20} />
                </div>

                {cityChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={270}>
                    <BarChart data={cityChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="city" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="pm25"
                        name="PM2.5"
                        fill="#269b70"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-empty">
                    Даних для побудови графіка поки немає
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="panel table-panel">
            <div className="panel-heading table-heading">
              <div>
                <h3>
                  {activePage === "Станції"
                    ? "Вимірювання за станціями"
                    : "Останні вимірювання"}
                </h3>
                <p>
                  Дані отримуються безпосередньо з бази даних через API
                </p>
              </div>

              <div className="table-controls">
                <select
                  value={cityFilter}
                  onChange={(event) => setCityFilter(event.target.value)}
                >
                  <option value="all">Усі міста</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <button
                  className="refresh-button"
                  onClick={loadMeasurements}
                  title="Оновити дані"
                >
                  <RefreshCw size={17} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">Завантаження даних...</div>
            ) : (
              <DataTable
                measurements={filteredMeasurements}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            <div className="table-footer">
              Показано записів: {filteredMeasurements.length} із{" "}
              {measurements.length}
            </div>
          </section>

          <footer className="page-footer">
            <span>© 2026 EcoAir Monitoring</span>
            <span>Система моніторингу якості повітря</span>
          </footer>
        </div>
      </main>

      <MeasurementModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedMeasurement(null);
        }}
        onSave={handleSave}
        measurement={selectedMeasurement}
      />
    </div>
  );
}

export default App;
