import { useState, useEffect } from "react";
import api from "../../utils/api";
import { formatTime } from "../../utils/time";
import DoctorAvailabilitySkelton from "../../components/DoctorAvailabilitySkelton";
import "../../styles/availability.css";

const DoctorAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [workStart, setWorkStart] = useState("");
  const [workEnd, setWorkEnd] = useState("");
  const [duration, setDuration] = useState("");

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    api
      .get("/api/doctor/availability")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        // Sort so the latest day appears at the top
        const sorted = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setAvailability(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- TIME HELPERS ---------------- */
  const timeToMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (m) =>
    `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

  /* ---------------- SLOT GENERATOR ---------------- */
  const generateSlots = () => {
    const start = timeToMinutes(workStart);
    const end = timeToMinutes(workEnd);
    const dur = Number(duration);

    if (!start || !end || start >= end) return [];

    const slots = [];
    let current = start;

    while (current + dur <= end) {
      slots.push({
        start: minutesToTime(current),
        end: minutesToTime(current + dur),
        isAvailable: true
      });
      current += dur;
    }

    return slots;
  };

  // Date formater 
 const formatDateWithDay = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

  /* ---------------- ADD DATE ---------------- */
  const addDateAvailability = () => {
    if (!selectedDate || !workStart || !workEnd || !duration) {
      alert("Select date & working hours");
      return;
    }

    const normalize = (d)=>{
      const x = new Date(d);
      x.setHours(0,0,0,0);
      return x.getTime();
    }
    const exists = availability.find(
      a => normalize(a.date) === normalize(selectedDate)
    );

    if (exists) return alert("Availability already exists for this date");

    setAvailability(prev => {
      const next = [
        ...prev,
        {
          date: selectedDate,
          slots: generateSlots()
        }
      ];

      // keep newest dates at the top
      return next.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  };

  /* ---------------- TOGGLE SLOT ---------------- */
  const toggleSlot = (date, index) => {
    setAvailability(prev =>
      prev.map(a =>
        a.date === date
          ? {
              ...a,
              slots: a.slots.map((s, i) =>
                i === index ? { ...s, isAvailable: !s.isAvailable } : s
              )
            }
          : a
      )
    );
  };

  /* ---------------- SAVE ---------------- */
  const saveAvailability = async () => {
    await api.put("/api/doctor/availability", { availability });
    alert("Availability saved");
  };

  if (loading) return <DoctorAvailabilitySkelton />;

  return (
    <div className="availability-page">
      <h2>Manage Availability</h2>

      {/* CONFIG */}
      <div className="work-config">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />

        <input type="time" value={workStart} onChange={e => setWorkStart(e.target.value)} />
        <input type="time" value={workEnd} onChange={e => setWorkEnd(e.target.value)} />

        <select value={duration} onChange={e => setDuration(e.target.value)}>
          <option value="">Duration</option>
          <option value="15">15 min</option>
          <option value="30">30 min</option>
        </select>

        <button onClick={addDateAvailability}>Add</button>
      </div>

      {/* AVAILABILITY */}
      {availability.map((a,idx) => (
        <div key={idx} className="day-card">
          <h4 className="date-title">
            {formatDateWithDay(a.date)}
          </h4>

          {a.slots.map((slot, i) => (
            <div
              key={i}
              className={`slot-row ${!slot.isAvailable ? "disabled" : ""}`}
            >
              <span>{formatTime(slot.start)} - {formatTime(slot.end)}</span>

              <button onClick={() => toggleSlot(a.date, i)}>
                {slot.isAvailable ? "Available" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>
      ))}

      {availability.length > 0 && (
        <button className="save-btn" onClick={saveAvailability}>
          Save Availability
        </button>
      )}
    </div>
  );
};

export default DoctorAvailability;
