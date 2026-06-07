import { useState } from "react";
import React from "react";

// Font injection
const FontStyle = () => (
  <style>{`
    * { font-family: 'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif !important; }
  `}</style>
);

const COLORS = {
  bg: "#0a0a0a",
  card: "#141414",
  accent: "#c8a96e",
  text: "#f0ece4",
  muted: "#6b6560",
  border: "#2a2520",
  success: "#4caf7d",
  danger: "#e05c5c",
};

// PIN config — change these to your preferred PINs
const DEFAULT_PINS = {
  "2194": "manager",
  "2222": "alain",
  "3333": "max",
  "4444": "viewer",
};

const ROLE_LABELS = {
  manager: { label: "Manager", color: "#c8a96e", icon: "👔" },
  alain: { label: "Alain", color: "#6e9bc8", icon: "👤" },
  max: { label: "Max", color: "#6ec8a0", icon: "👤" },
  viewer: { label: "Viewer", color: "#6b6560", icon: "👁️" },
};

const initialClients = [
  { id: 1, name: "Amina Uwase", phone: "+250 788 111 222", sessions: 3, status: "active" },
  { id: 2, name: "Jean Pierre Habimana", phone: "+250 788 333 444", sessions: 1, status: "active" },
  { id: 3, name: "Grace Mukamana", phone: "+250 788 555 666", sessions: 2, status: "inactive" },
];

const initialBookings = [
  { id: 1, client: "Amina Uwase", type: "Wedding", date: "2026-06-20", time: "09:00", location: "Kigali Convention Centre", status: "confirmed", amount: 350000, paid: 175000, delivered: false, editedDelivered: false, refund: 0, refundNote: "", closed: false },
  { id: 2, client: "Jean Pierre Habimana", type: "Portrait", date: "2026-06-15", time: "14:00", location: "Studio", status: "pending", amount: 80000, paid: 0, delivered: false, editedDelivered: false, refund: 0, refundNote: "", closed: false },
  { id: 3, client: "Grace Mukamana", type: "Family", date: "2026-07-01", time: "10:00", location: "Nyandungu Park", status: "confirmed", amount: 120000, paid: 120000, delivered: false, editedDelivered: false, refund: 0, refundNote: "", closed: false },
];


const initialExpenses = [
  { id: 1, description: "Camera lens rental", category: "Equipment", amount: 25000, date: "2026-06-01", addedBy: "staff", staffName: "John Doe", status: "pending" },
  { id: 2, description: "Transport to Nyandungu", category: "Transport", amount: 5000, date: "2026-06-03", addedBy: "staff", staffName: "John Doe", status: "approved" },
];


const initialRentals = [
  { id: 1, client: "Amina Uwase", items: "Camera body + 50mm lens", from: "2026-06-10", to: "2026-06-11", days: 1, pricePerDay: 45000, amount: 45000, paid: 45000, returned: true },
  { id: 2, client: "Jean Pierre Habimana", items: "Strobe x2 + triggers", from: "2026-06-14", to: "2026-06-15", days: 1, pricePerDay: 30000, amount: 30000, paid: 15000, returned: false },
];


const initialFrames = [
  { id: 1, client: "Amina Uwase", size: "A3", description: "Black wood frame", quantity: 2, costPrice: 10000, unitPrice: 15000, paid: 30000, date: "2026-06-01" },
  { id: 2, client: "Grace Mukamana", size: "60x90cm", description: "Silver aluminium frame", quantity: 1, costPrice: 22000, unitPrice: 35000, paid: 0, date: "2026-06-05" },
];


const initialStaffPayments = [
  { id: 1, name: "John Doe", role: "Photographer", amount: 150000, date: "2026-06-01", note: "June salary" },
];


const initialManagerExpenses = [
  { id: 1, description: "Equipment purchase", category: "Equipment", amount: 200000, date: "2026-06-01" },
];

const formatRWF = (n) => `RWF ${Number(n || 0).toLocaleString()}`;

const Badge = ({ status }) => {
  const map = {
    confirmed: { bg: "#1a3a2a", color: "#4caf7d", label: "Confirmed" },
    pending: { bg: "#3a2a10", color: "#c8a96e", label: "Pending" },
    active: { bg: "#1a3a2a", color: "#4caf7d", label: "Active" },
    inactive: { bg: "#2a2520", color: "#6b6560", label: "Inactive" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>
      {s.label}
    </span>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 16, marginBottom: 12, ...style }}>
    {children}
  </div>
);

const InputField = ({ placeholder, value, onChange, type = "text" }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange}
    style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
);


const ClientSelect = ({ value, onChange, clients }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const select = (name) => {
    onChange(name);
    setSearch(name);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", marginBottom: 8 }}>
      <input
        type="text"
        placeholder="Search or type client name..."
        value={search || value}
        onChange={e => { setSearch(e.target.value); onChange(""); setOpen(true); }}
        onFocus={() => setOpen(true)}
        style={{ width: "100%", background: COLORS.bg, border: `1px solid ${open ? COLORS.accent : COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 14, boxSizing: "border-box" }}
      />
      {open && filtered.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: COLORS.card, border: `1px solid ${COLORS.accent}`, borderRadius: 8, zIndex: 100, maxHeight: 180, overflowY: "auto", marginTop: 4 }}>
          {filtered.map(c => (
            <div key={c.id} onClick={() => select(c.name)}
              style={{ padding: "10px 14px", color: COLORS.text, fontSize: 14, cursor: "pointer", borderBottom: `1px solid ${COLORS.border}` }}
              onMouseEnter={e => e.target.style.background = COLORS.border}
              onMouseLeave={e => e.target.style.background = "transparent"}>
              {c.name}
            </div>
          ))}
        </div>
      )}
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />}
    </div>
  );
};

const NavIcon = ({ icon, label, active, onClick, badge = 0 }) => (
  <button onClick={onClick} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "10px 0", position: "relative" }}>
    <span style={{ fontSize: 22, position: "relative" }}>
      {icon}
      {badge > 0 && <span style={{ position: "absolute", top: -4, right: -6, background: COLORS.danger, color: "#fff", borderRadius: "50%", width: 14, height: 14, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{badge}</span>}
    </span>
    <span style={{ fontSize: 10, color: active ? COLORS.accent : COLORS.muted, fontWeight: active ? 700 : 400, letterSpacing: 0.5 }}>{label}</span>
    {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.accent }} />}
  </button>
);

// ── LOGIN ──────────────────────────────────────────────────
const Login = ({ onLogin, pins }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    const newPin = pin + d;
    setPin(newPin);
    setError(false);
    if (newPin.length === 4) {
      setTimeout(() => {
        const role = pins[newPin];
        if (role) {
          onLogin(role);
        } else {
          setError(true);
          setPin("");
        }
      }, 200);
    }
  };

  const handleDelete = () => { setPin(p => p.slice(0, -1)); setError(false); };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ color: COLORS.accent, fontSize: 80, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", fontWeight: 700, letterSpacing: 10, lineHeight: 1 }}>IMANI</div>
        <div style={{ color: COLORS.text, fontSize: 56, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", fontWeight: 700, letterSpacing: 14, lineHeight: 1.2 }}>STUDIO</div>
        <div style={{ width: 60, height: 2, background: COLORS.accent, margin: "8px auto 0" }} />
      </div>
      <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 32 }}>Kigali, Rwanda</div>

      <div style={{ color: COLORS.text, fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Enter your PIN</div>
      <div style={{ color: COLORS.muted, fontSize: 13, marginBottom: 28 }}>Access is role-based</div>

      {/* PIN dots */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: i < pin.length ? COLORS.accent : COLORS.border, transition: "background 0.15s" }} />
        ))}
      </div>

      {error && <div style={{ color: COLORS.danger, fontSize: 13, marginBottom: 12 }}>Incorrect PIN. Try again.</div>}
      {!error && <div style={{ height: 28 }} />}

      {/* Keypad */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 72px)", gap: 12 }}>
        {[1,2,3,4,5,6,7,8,9].map(d => (
          <button key={d} onClick={() => handleDigit(String(d))}
            style={{ height: 72, borderRadius: 16, background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.text, fontSize: 22, fontWeight: 600, cursor: "pointer" }}>
            {d}
          </button>
        ))}
        <div />
        <button onClick={() => handleDigit("0")}
          style={{ height: 72, borderRadius: 16, background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.text, fontSize: 22, fontWeight: 600, cursor: "pointer" }}>
          0
        </button>
        <button onClick={handleDelete}
          style={{ height: 72, borderRadius: 16, background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: 20, cursor: "pointer" }}>
          ⌫
        </button>
      </div>

      <div style={{ marginTop: 32, color: COLORS.muted, fontSize: 11, textAlign: "center", lineHeight: 1.8 }}>
        Manager · Alain · Max · Viewer<br/>Each person has a personal PIN
      </div>
    </div>
  );
};


// ── EXPENSES ───────────────────────────────────────────────
// Reusable expense list/form for both staff and manager
const ExpenseList = ({ expenses, setExpenses, role, label, color = COLORS.danger }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ description: "", category: "Equipment", amount: "", date: "", staffName: "" });
  const categories = ["Equipment", "Transport", "Food", "Marketing", "Studio", "Personal", "Other"];

  const addExpense = () => {
    if (!form.description || !form.amount) return;
    const status = role === "manager" ? "approved" : "pending";
    setExpenses(prev => [...prev, { id: Date.now(), ...form, amount: Number(form.amount), date: form.date || new Date().toISOString().split("T")[0], addedBy: role, staffName: form.staffName || "", status }]);
    setForm({ description: "", category: "Equipment", amount: "", date: "" });
    setShowForm(false);
  };

  const deleteExpense = (id) => {
    if (window.confirm("Delete this expense?")) setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
        <button onClick={() => setShowForm(!showForm)} style={{ background: COLORS.accent, color: "#000", border: "none", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      <Card style={{ background: "#1a0f0f", borderColor: color, marginBottom: 12 }}>
        <div style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1 }}>TOTAL</div>
        <div style={{ color, fontSize: 22, fontWeight: 700, marginTop: 4 }}>{formatRWF(total)}</div>
      </Card>

      {showForm && (
        <Card style={{ borderColor: COLORS.accent }}>
          {role === "alain" || role === "max" && (
            <InputField placeholder="Your Name" value={form.staffName} onChange={e => setForm(p => ({ ...p, staffName: e.target.value }))} />
          )}
          <InputField placeholder="Reason (what was bought/paid for)" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 14, marginBottom: 8 }}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <InputField placeholder="Amount (RWF)" type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
          <InputField placeholder="Date" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          <button onClick={addExpense} style={{ width: "100%", background: COLORS.accent, color: "#000", border: "none", borderRadius: 8, padding: 12, fontWeight: 700, cursor: "pointer" }}>
            Save Expense
          </button>
        </Card>
      )}

      {expenses.length === 0 && <Card><div style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", padding: 8 }}>No expenses yet</div></Card>}

      {expenses.map(e => {
        const isPending = e.status === "pending";
        const isRejected = e.status === "rejected";
        return (
          <Card key={e.id} style={{ borderLeft: `3px solid ${isPending ? COLORS.accent : isRejected ? COLORS.danger : COLORS.success}`, opacity: isRejected ? 0.6 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isPending && role === "manager" ? 10 : 0 }}>
              <div>
                <div style={{ color: COLORS.text, fontWeight: 600 }}>{e.description}</div>
                <div style={{ color: COLORS.accent, fontSize: 12, marginTop: 3 }}>🏷️ {e.category}</div>
                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>📅 {e.date} {e.staffName ? `· ${e.staffName}` : e.addedBy === "staff" ? "· Staff" : "· Manager"}</div>
                <div style={{ marginTop: 4 }}>
                  {isPending && <span style={{ background: "#3a2a10", color: COLORS.accent, borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>⏳ Pending Approval</span>}
                  {e.status === "approved" && <span style={{ background: "#1a3a2a", color: COLORS.success, borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>✅ Approved</span>}
                  {isRejected && <span style={{ background: "#3a1a1a", color: COLORS.danger, borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>❌ Rejected</span>}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: isPending ? COLORS.muted : isRejected ? COLORS.danger : color, fontWeight: 700, fontSize: 15 }}>{formatRWF(e.amount)}</div>
                <button onClick={() => deleteExpense(e.id)} style={{ background: "none", border: "none", color: COLORS.danger, fontSize: 11, cursor: "pointer", marginTop: 6, padding: 0 }}>🗑️ Delete</button>
              </div>
            </div>
            {isPending && role === "manager" && (
              <div>
                <div style={{ background: "#1a1a2e", borderRadius: 8, padding: "8px 12px", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>👤</span>
                  <div>
                    <div style={{ color: COLORS.muted, fontSize: 10, letterSpacing: 1 }}>REQUESTED BY</div>
                    <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 14 }}>{e.staffName || "Staff"}</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ color: COLORS.muted, fontSize: 10, letterSpacing: 1 }}>AMOUNT</div>
                    <div style={{ color: COLORS.danger, fontWeight: 700, fontSize: 15 }}>{formatRWF(e.amount)}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setExpenses(prev => prev.map(x => x.id === e.id ? { ...x, status: "approved" } : x))}
                    style={{ flex: 1, background: COLORS.success, color: "#fff", border: "none", borderRadius: 8, padding: "7px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    ✅ Approve
                  </button>
                  <button onClick={() => setExpenses(prev => prev.map(x => x.id === e.id ? { ...x, status: "rejected" } : x))}
                    style={{ flex: 1, background: "transparent", border: `1px solid ${COLORS.danger}`, borderRadius: 8, padding: "7px 0", color: COLORS.danger, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

const Expenses = ({ expenses, setExpenses, managerExpenses, setManagerExpenses, staffPayments, setStaffPayments, role }) => {
  const [activeTab, setActiveTab] = useState("studio");

  return (
    <div>
      <h3 style={{ color: COLORS.text, margin: "0 0 16px", fontSize: 18, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", letterSpacing: 2 }}>Expenses</h3>

      {/* Inner tabs — manager sees Studio + Staff Expenses + Private, staff sees Studio only */}
      {role === "manager" && (
        <div style={{ display: "flex", background: COLORS.card, borderRadius: 12, padding: 4, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
          {[
            { id: "studio", label: "💸 Studio", color: COLORS.accent, textColor: "#000" },
            { id: "staff_pay", label: "👔 Salaries", color: "#c89b6e", textColor: "#000" },
            { id: "staff_exp", label: "👤 Staff", color: "#6e9bc8", textColor: "#fff" },
            { id: "personal", label: "🔒 Private", color: "#9b6ec8", textColor: "#fff" },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 11,
                background: activeTab === t.id ? t.color : "transparent",
                color: activeTab === t.id ? t.textColor : COLORS.muted }}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Studio expenses — visible to all */}
      {(activeTab === "studio" || role !== "manager") && (
        <ExpenseList expenses={expenses} setExpenses={setExpenses} role={role} label="Studio Expenses" color={COLORS.danger} />
      )}

      {/* Staff Salaries / Payments — manager only */}
      {activeTab === "staff_pay" && role === "manager" && (
        <StaffPayments staffPayments={staffPayments} setStaffPayments={setStaffPayments} />
      )}

      {/* Staff personal expenses — manager only */}
      {activeTab === "staff_exp" && role === "manager" && (
        <div>
          {["alain", "max"].map(staffRole => {
            const staffExp = managerExpenses.filter(e => e.addedBy === staffRole);
            const total = staffExp.reduce((s,e) => s + e.amount, 0);
            return (
              <div key={staffRole}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0 8px" }}>
                  <span style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase" }}>👤 {staffRole.charAt(0).toUpperCase() + staffRole.slice(1)}</span>
                  <span style={{ color: "#6e9bc8", fontSize: 12, fontWeight: 700 }}>{formatRWF(total)}</span>
                </div>
                {staffExp.length === 0 && <Card><div style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", padding: 8 }}>No expenses recorded</div></Card>}
                {staffExp.map(e => (
                  <Card key={e.id} style={{ borderLeft: `3px solid #6e9bc8` }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ color: COLORS.text, fontWeight: 600 }}>{e.description}</div>
                        <div style={{ color: COLORS.accent, fontSize: 12, marginTop: 2 }}>🏷️ {e.category}</div>
                        <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>📅 {e.date}</div>
                      </div>
                      <div style={{ color: "#6e9bc8", fontWeight: 700, fontSize: 15 }}>{formatRWF(e.amount)}</div>
                    </div>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Manager private expenses */}
      {activeTab === "personal" && role === "manager" && (
        <ExpenseList expenses={managerExpenses.filter(e => e.addedBy === "manager")} setExpenses={(updater) => setManagerExpenses(prev => {
          const mine = prev.filter(e => e.addedBy === "manager");
          const others = prev.filter(e => e.addedBy !== "manager");
          const updated = typeof updater === "function" ? updater(mine) : updater;
          return [...others, ...updated];
        })} role={role} label="Private Expenses" color="#9b6ec8" />
      )}

      {/* Staff personal expense recorder — only visible to staff, saved privately for manager to see */}
      {(role === "alain" || role === "max") && (
        <div style={{ marginTop: 16, borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
          <div style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>👤 My Personal Expenses</div>
          <ExpenseList
            expenses={[]}
            setExpenses={(updater) => {
              if (typeof updater === "function") return;
              const newExp = updater[updater.length - 1];
              if (newExp) setManagerExpenses(prev => [...prev, { ...newExp, addedBy: role }]);
            }}
            role={role}
            label=""
            color="#6e9bc8"
          />
          <Card style={{ background: "#0d1a2b", borderColor: "#6e9bc8" }}>
            <div style={{ color: "#6e9bc8", fontSize: 12, textAlign: "center" }}>ℹ️ Your personal expenses are private — only the Manager can view them</div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ── DASHBOARD (Manager only) ───────────────────────────────
const Dashboard = ({ bookings, clients, expenses, rentals, frames, staffPayments, managerExpenses, role }) => {
  const totalRevenue = bookings.reduce((s, b) => s + b.paid, 0);
  const totalRefunds = bookings.reduce((s, b) => s + (b.refund || 0), 0);
  const outstanding = bookings.reduce((s, b) => s + (b.amount - b.paid), 0);
  const upcoming = bookings.filter(b => b.status === "confirmed").length;
  const totalExpenses = expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0);
  const rentalIncome = rentals.reduce((s, r) => s + r.paid, 0);
  const frameIncome = frames.reduce((s, f) => s + f.paid, 0);
  const frameNetGain = frames.reduce((s, f) => s + ((f.unitPrice - (f.costPrice||0)) * f.quantity), 0);
  const totalStaffPaid = staffPayments.reduce((s, p) => s + p.amount, 0);
  const totalManagerExp = staffPayments.length >= 0 ? (typeof managerExpenses !== "undefined" ? managerExpenses.reduce((s,e)=>s+e.amount,0) : 0) : 0;
  const netProfit = totalRevenue + rentalIncome + frameIncome - totalExpenses - totalStaffPaid;
  const nextBooking = bookings.filter(b => b.status === "confirmed")[0];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>Welcome back</p>
        <h2 style={{ color: COLORS.text, margin: "4px 0 0", fontSize: 16, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", letterSpacing: 1 }}>Richard & Sandra</h2>
        <p style={{ color: COLORS.accent, fontSize: 12, margin: "2px 0 0", letterSpacing: 1 }}>IMANI STUDIO · KIGALI</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Revenue Collected", value: formatRWF(totalRevenue), icon: "💰", color: COLORS.success },
          { label: "Outstanding", value: formatRWF(outstanding), icon: "⏳", color: COLORS.danger },
          { label: "Total Expenses", value: formatRWF(expenses.filter(e=>e.status==="approved").reduce((s,e)=>s+e.amount,0)), icon: "💸", color: COLORS.danger },
          { label: "Rental Income", value: formatRWF(rentals.reduce((s,r)=>s+r.paid,0)), icon: "🎥", color: COLORS.success },
          { label: "Frame Sales", value: formatRWF(frames.reduce((s,f)=>s+f.paid,0)), icon: "🖼️", color: COLORS.success },
          { label: "Frame Net Gain", value: formatRWF(frameNetGain), icon: "📈", color: COLORS.success },
          { label: "Staff Paid", value: formatRWF(staffPayments.reduce((s,p)=>s+p.amount,0)), icon: "👔", color: "#c89b6e" },
          { label: "Confirmed Jobs", value: upcoming, icon: "📅", color: COLORS.accent },
          { label: "Total Refunds", value: formatRWF(totalRefunds), icon: "💸", color: COLORS.danger },
          { label: "Total Clients", value: clients.length, icon: "👥", color: "#6e9bc8" },
        ].map(s => (
          <Card key={s.label} style={{ padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ color: s.color, fontSize: 20, fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* All bookings summary */}
      {/* Net Profit Banner */}
      <Card style={{ background: netProfit >= 0 ? "#0d2b1a" : "#2b0d0d", borderColor: netProfit >= 0 ? COLORS.success : COLORS.danger, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase" }}>Net Balance</div>
            <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>Revenue collected − Expenses</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: netProfit >= 0 ? COLORS.success : COLORS.danger, fontSize: 24, fontWeight: 700 }}>{formatRWF(netProfit)}</div>
            <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>{netProfit >= 0 ? "✅ In profit" : "⚠️ In deficit"}</div>
          </div>
        </div>
      </Card>

      {/* Monthly Earnings */}
      <h3 style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1.5, margin: "0 0 10px", textTransform: "uppercase" }}>Monthly Earnings</h3>
      {(() => {
        const months = {};
        const addToMonth = (dateStr, amount, type) => {
          if (!dateStr) return;
          const d = new Date(dateStr);
          const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
          const label = d.toLocaleString("default", { month: "long", year: "numeric" });
          if (!months[key]) months[key] = { label, bookings: 0, rentals: 0, frames: 0, expenses: 0, staff: 0 };
          months[key][type] += amount;
        };
        bookings.forEach(b => addToMonth(b.date, b.paid, "bookings"));
        rentals.forEach(r => addToMonth(r.from, r.paid, "rentals"));
        frames.forEach(f => addToMonth(f.date, f.paid, "frames"));
        expenses.forEach(e => addToMonth(e.date, e.amount, "expenses"));
        staffPayments.forEach(p => addToMonth(p.date, p.amount, "staff"));
        if (managerExpenses) managerExpenses.forEach(e => addToMonth(e.date, e.amount, "expenses"));

        const sorted = Object.entries(months).sort((a,b) => b[0].localeCompare(a[0]));
        if (sorted.length === 0) return <Card><div style={{ color: COLORS.muted, fontSize: 13, textAlign: "center" }}>No data yet</div></Card>;

        const [selectedIdx, setSelectedIdx] = React.useState(0);
        const [key, m] = sorted[selectedIdx] || sorted[0];
        const income = m.bookings + m.rentals + m.frames;
        const net = income - m.expenses - m.staff;

        return (
          <div>
            {/* Month scroller */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <button onClick={() => setSelectedIdx(i => Math.min(i+1, sorted.length-1))}
                disabled={selectedIdx >= sorted.length-1}
                style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "6px 14px", color: selectedIdx >= sorted.length-1 ? COLORS.border : COLORS.text, cursor: "pointer", fontSize: 18 }}>‹</button>
              <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 15 }}>{m.label}</div>
              <button onClick={() => setSelectedIdx(i => Math.max(i-1, 0))}
                disabled={selectedIdx === 0}
                style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "6px 14px", color: selectedIdx === 0 ? COLORS.border : COLORS.text, cursor: "pointer", fontSize: 18 }}>›</button>
            </div>

            {/* Month data */}
            <Card>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                {m.bookings > 0 && <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10 }}><div style={{ color: COLORS.muted, fontSize: 10 }}>📅 Bookings</div><div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{formatRWF(m.bookings)}</div></div>}
                {m.rentals > 0 && <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10 }}><div style={{ color: COLORS.muted, fontSize: 10 }}>🎥 Rentals</div><div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{formatRWF(m.rentals)}</div></div>}
                {m.frames > 0 && <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10 }}><div style={{ color: COLORS.muted, fontSize: 10 }}>🖼️ Frames</div><div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{formatRWF(m.frames)}</div></div>}
                {m.expenses > 0 && <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10 }}><div style={{ color: COLORS.muted, fontSize: 10 }}>💸 Expenses</div><div style={{ color: COLORS.danger, fontWeight: 600, fontSize: 14 }}>{formatRWF(m.expenses)}</div></div>}
                {m.staff > 0 && <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10 }}><div style={{ color: COLORS.muted, fontSize: 10 }}>👔 Staff</div><div style={{ color: "#c89b6e", fontWeight: 600, fontSize: 14 }}>{formatRWF(m.staff)}</div></div>}
                <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10 }}><div style={{ color: COLORS.muted, fontSize: 10 }}>📊 Income</div><div style={{ color: COLORS.success, fontWeight: 600, fontSize: 14 }}>{formatRWF(income)}</div></div>
              </div>
              <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: COLORS.muted, fontSize: 13 }}>Net Balance</span>
                <span style={{ color: net >= 0 ? COLORS.success : COLORS.danger, fontWeight: 700, fontSize: 20 }}>{formatRWF(net)}</span>
              </div>
            </Card>

            {/* Month dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
              {sorted.map((_,i) => (
                <div key={i} onClick={() => setSelectedIdx(i)}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: i === selectedIdx ? COLORS.accent : COLORS.border, cursor: "pointer" }} />
              ))}
            </div>
          </div>
        );
      })()}

      <h3 style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1.5, margin: "16px 0 10px", textTransform: "uppercase" }}>Pending Payments & Upcoming</h3>
      {bookings.filter(b => b.paid < b.amount || b.status === "confirmed").length === 0 && (
        <Card><div style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", padding: 10 }}>All bookings are settled 🎉</div></Card>
      )}
      {(role === "alain" || role === "max"
        ? bookings.filter(b => b.paid < b.amount || (b.paid >= b.amount && !b.delivered))
        : bookings
      ).map(b => {
        const rest = b.amount - b.paid;
        const pct = b.amount > 0 ? (b.paid / b.amount) * 100 : 0;
        return (
          <Card key={b.id} style={{ borderLeft: `3px solid ${rest === 0 ? COLORS.success : COLORS.accent}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ color: COLORS.text, fontWeight: 600 }}>{b.client}</div>
              <Badge status={b.status} />
            </div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 6 }}>📷 {b.type} · 📅 {b.date}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: COLORS.success }}>Paid: {formatRWF(b.paid)}</span>
              <span style={{ color: rest > 0 ? COLORS.danger : COLORS.success }}>Balance: {formatRWF(rest)}</span>
            </div>
            <div style={{ background: COLORS.border, borderRadius: 4, height: 4 }}>
              <div style={{ background: pct >= 100 ? COLORS.success : COLORS.accent, borderRadius: 4, height: 4, width: `${Math.min(pct, 100)}%` }} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// ── CLIENTS ────────────────────────────────────────────────
const Clients = ({ clients, setClients, role }) => {
  const canEdit = role === "manager" || role === "alain" || role === "max";
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  const addClient = () => {
    if (!form.name) return;
    setClients(prev => [...prev, { id: Date.now(), ...form, sessions: 0, status: "active" }]);
    setForm({ name: "", phone: "" });
    setShowForm(false);
  };

  const deleteClient = (id) => {
    if (window.confirm("Delete this client? This cannot be undone.")) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ color: COLORS.text, margin: 0, fontSize: 18, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", letterSpacing: 2 }}>Clients</h3>
        {canEdit && (
          <button onClick={() => setShowForm(!showForm)} style={{ background: COLORS.accent, color: "#000", border: "none", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {showForm ? "Cancel" : "+ Add"}
          </button>
        )}
      </div>

      {canEdit && showForm && (
        <Card style={{ borderColor: COLORS.accent }}>
          <InputField placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <InputField placeholder="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <button onClick={addClient} style={{ width: "100%", background: COLORS.accent, color: "#000", border: "none", borderRadius: 8, padding: 12, fontWeight: 700, cursor: "pointer" }}>
            Save Client
          </button>
        </Card>
      )}

      {clients.map(c => (
        <Card key={c.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {c.name.charAt(0)}
              </div>
              <div>
                <div style={{ color: COLORS.text, fontWeight: 600 }}>{c.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>{c.phone}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Badge status={c.status} />
              <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 6 }}>{c.sessions} sessions</div>
              {role === "manager" && (
                <button onClick={() => deleteClient(c.id)} style={{ background: "none", border: "none", color: COLORS.danger, fontSize: 11, cursor: "pointer", marginTop: 6, padding: 0 }}>
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// ── BOOKINGS ───────────────────────────────────────────────
const Bookings = ({ bookings, setBookings, clients, role }) => {
  const canEdit = role === "manager" || role === "alain" || role === "max";
  const [showForm, setShowForm] = useState(false);
  const [addPaymentId, setAddPaymentId] = useState(null);
  const [extraPayment, setExtraPayment] = useState("");
  const [refundId, setRefundId] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundNote, setRefundNote] = useState("");
  const [form, setForm] = useState({ client: "", type: "Wedding", date: "", time: "", location: "", amount: "", paid: "", editedDeliveryDate: "", numPictures: "", unitPicPrice: "" });

  const types = ["Wedding", "Portrait", "Family", "Birthday", "Family Function", "Events", "Corporate", "Studio Session"];

  const addBooking = () => {
    if (!form.client || !form.date) return;
    const amount = Number(form.amount) || 0;
    const paid = Number(form.paid) || 0;
    const status = paid >= amount && amount > 0 ? "confirmed" : "pending";
    setBookings(prev => [...prev, { id: Date.now(), ...form, amount, paid, status, delivered: false, editedDelivered: false, editedDeliveryDate: form.editedDeliveryDate || "" }]);
    setForm({ client: "", type: "Wedding", date: "", time: "", location: "", amount: "", paid: "" });
    setShowForm(false);
  };

  const applyRefund = (id) => {
    const amount = Number(refundAmount) || 0;
    if (!amount) return;
    setBookings(prev => prev.map(b => {
      if (b.id !== id) return b;
      const newRefund = (b.refund || 0) + amount;
      const newPaid = Math.max(0, b.paid - amount);
      return { ...b, refund: newRefund, paid: newPaid, refundNote };
    }));
    setRefundAmount("");
    setRefundNote("");
    setRefundId(null);
  };

  const markDelivered = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, delivered: true } : b));
  };

  const markEditedDelivered = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, editedDelivered: true } : b));
  };

  const applyExtraPayment = (id) => {
    const extra = Number(extraPayment) || 0;
    if (!extra) return;
    setBookings(prev => prev.map(b => {
      if (b.id !== id) return b;
      const newPaid = Math.min(b.paid + extra, b.amount);
      return { ...b, paid: newPaid, status: newPaid >= b.amount ? "confirmed" : "pending" };
    }));
    setExtraPayment("");
    setAddPaymentId(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ color: COLORS.text, margin: 0, fontSize: 18, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", letterSpacing: 2 }}>Bookings</h3>
        {canEdit && (
          <button onClick={() => setShowForm(!showForm)} style={{ background: COLORS.accent, color: "#000", border: "none", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {showForm ? "Cancel" : "+ Book"}
          </button>
        )}
      </div>

      {canEdit && showForm && (
        <Card style={{ borderColor: COLORS.accent }}>
          <ClientSelect value={form.client} onChange={val => setForm(p => ({ ...p, client: val }))} clients={clients} />
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
            style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 14, marginBottom: 8 }}>
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
          <InputField placeholder="Date" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          <InputField placeholder="Time" type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
          {form.type === "Studio Session" && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1, marginBottom: 6 }}>EDITED PICTURES DELIVERY DATE</div>
              <InputField placeholder="Delivery Date" type="date" value={form.editedDeliveryDate} onChange={e => setForm(p => ({ ...p, editedDeliveryDate: e.target.value }))} />
            </div>
          )}
          {form.type === "Studio Session" ? (
            <select value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: form.location ? COLORS.text : COLORS.muted, fontSize: 14, marginBottom: 8 }}>
              <option value="">Select Session Type</option>
              <option value="Indoor Session">Indoor Session</option>
              <option value="Outdoor Session">Outdoor Session</option>
            </select>
          ) : (
            <InputField placeholder="Location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
          )}
          <div style={{ background: COLORS.bg, borderRadius: 8, padding: 12, marginBottom: 8, border: `1px solid ${COLORS.border}` }}>
            <div style={{ color: COLORS.accent, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>PAYMENT</div>
            {form.type === "Studio Session" ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <input type="number" placeholder="No. of Pictures" value={form.numPictures}
                    onChange={e => setForm(p => ({ ...p, numPictures: e.target.value }))}
                    style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 14 }} />
                  <input type="number" placeholder="Price / Picture" value={form.unitPicPrice}
                    onChange={e => setForm(p => ({ ...p, unitPicPrice: e.target.value }))}
                    style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 14 }} />
                </div>
                {form.numPictures && form.unitPicPrice && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: COLORS.muted, fontSize: 12 }}>Total</span>
                    <span style={{ color: COLORS.text, fontWeight: 700 }}>{formatRWF(Number(form.numPictures) * Number(form.unitPicPrice))}</span>
                  </div>
                )}
              </>
            ) : (
              <InputField placeholder="Total Amount (RWF)" type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
            )}
            <InputField placeholder="Amount Paid (RWF)" type="number" value={form.paid} onChange={e => setForm(p => ({ ...p, paid: e.target.value }))} />
            {(form.type === "Studio Session" ? (form.numPictures && form.unitPicPrice) : form.amount) && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>Balance</span>
                <span style={{ color: COLORS.danger, fontSize: 13, fontWeight: 700 }}>
                  {formatRWF(Math.max(0,
                    (form.type === "Studio Session"
                      ? Number(form.numPictures) * Number(form.unitPicPrice)
                      : Number(form.amount)
                    ) - Number(form.paid || 0)
                  ))}
                </span>
              </div>
            )}
          </div>
          <button onClick={addBooking} style={{ width: "100%", background: COLORS.accent, color: "#000", border: "none", borderRadius: 8, padding: 12, fontWeight: 700, cursor: "pointer" }}>
            Save Booking
          </button>
        </Card>
      )}

      {bookings.map(b => {
        const rest = b.amount - b.paid;
        const pct = b.amount > 0 ? (b.paid / b.amount) * 100 : 0;
        return (
          <Card key={b.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 15 }}>{b.client}</div>
              <Badge status={b.status} />
            </div>
            <div style={{ color: COLORS.accent, fontSize: 12, marginBottom: 3 }}>📷 {b.type}{b.type === "Studio Session" && b.numPictures ? ` · ${b.numPictures} pics × ${formatRWF(Number(b.unitPicPrice))}` : ""}</div>
            <div style={{ color: COLORS.muted, fontSize: 12 }}>📅 {b.date} · {b.time}</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: b.type === "Studio Session" && b.editedDeliveryDate ? 4 : 10 }}>📍 {b.location}</div>
            {b.type === "Studio Session" && b.editedDeliveryDate && (
              <div style={{ color: "#6e9bc8", fontSize: 12, marginBottom: 10 }}>🖼️ Edited delivery: {b.editedDeliveryDate}</div>
            )}

            <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>💵 Total</span>
                <span style={{ color: COLORS.text, fontSize: 12, fontWeight: 700 }}>{formatRWF(b.amount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>✅ Paid</span>
                <span style={{ color: COLORS.success, fontSize: 12, fontWeight: 700 }}>{formatRWF(b.paid)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>⏳ Balance</span>
                <span style={{ color: rest > 0 ? COLORS.danger : COLORS.success, fontSize: 12, fontWeight: 700 }}>{formatRWF(rest)}</span>
              </div>
              <div style={{ background: COLORS.border, borderRadius: 4, height: 5 }}>
                <div style={{ background: pct >= 100 ? COLORS.success : COLORS.accent, borderRadius: 4, height: 5, width: `${Math.min(pct, 100)}%`, transition: "width 0.3s" }} />
              </div>
              <div style={{ color: COLORS.muted, fontSize: 10, marginTop: 4, textAlign: "right" }}>{Math.round(pct)}% paid</div>
            </div>

            {canEdit && rest > 0 && (
              addPaymentId === b.id ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="number" placeholder={`Max ${formatRWF(rest)}`} value={extraPayment}
                    onChange={e => setExtraPayment(e.target.value)}
                    style={{ flex: 1, background: COLORS.bg, border: `1px solid ${COLORS.accent}`, borderRadius: 8, padding: "8px 10px", color: COLORS.text, fontSize: 13 }} />
                  <button onClick={() => applyExtraPayment(b.id)} style={{ background: COLORS.success, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Add</button>
                  <button onClick={() => setAddPaymentId(null)} style={{ background: COLORS.border, color: COLORS.muted, border: "none", borderRadius: 8, padding: "8px 10px", cursor: "pointer", fontSize: 13 }}>✕</button>
                </div>
              ) : (
                <button onClick={() => setAddPaymentId(b.id)} style={{ width: "100%", background: "transparent", border: `1px solid ${COLORS.success}`, borderRadius: 8, padding: 8, color: COLORS.success, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  + Add Balance Payment
                </button>
              )
            )}
            {rest === 0 && b.amount > 0 && !b.delivered && canEdit && (
              <button onClick={() => markDelivered(b.id)} style={{ width: "100%", background: "transparent", border: `1px solid ${COLORS.accent}`, borderRadius: 8, padding: 8, color: COLORS.accent, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>
                📦 Mark as Delivered
              </button>
            )}
            {rest === 0 && b.amount > 0 && b.delivered && (
              <div style={{ textAlign: "center", color: COLORS.success, fontSize: 12, fontWeight: 600, padding: "6px 0" }}>✅ Fully Paid & Delivered</div>
            )}


            {rest === 0 && b.amount > 0 && !b.delivered && !canEdit && (
              <div style={{ textAlign: "center", color: COLORS.accent, fontSize: 12, fontWeight: 600, padding: "6px 0" }}>💰 Paid · Awaiting Delivery</div>
            )}


          </Card>
        );
      })}
    </div>
  );
};




// ── FRAMES ─────────────────────────────────────────────────
const Frames = ({ frames, setFrames, clients, role, hideTitle = false }) => {
  const canEdit = role === "manager" || role === "alain" || role === "max";
  const [showForm, setShowForm] = useState(false);
  const [addPaymentId, setAddPaymentId] = useState(null);
  const [extraPayment, setExtraPayment] = useState("");
  const [refundId, setRefundId] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundNote, setRefundNote] = useState("");
  const [form, setForm] = useState({ client: "", size: "A4", description: "", quantity: "1", costPrice: "", unitPrice: "", paid: "" });

  const sizes = ["A6", "A5", "A4", "A3", "A2", "A1", "20x30cm", "30x40cm", "40x60cm", "60x90cm", "Custom"];

  const addFrame = () => {
    if (!form.client || !form.unitPrice) return;
    const quantity = Number(form.quantity) || 1;
    const unitPrice = Number(form.unitPrice) || 0;
    const costPrice = Number(form.costPrice) || 0;
    const total = quantity * unitPrice;
    const paid = Math.min(Number(form.paid) || 0, total);
    setFrames(prev => [...prev, { id: Date.now(), ...form, quantity, unitPrice, costPrice, total, paid, date: new Date().toISOString().split("T")[0] }]);
    setForm({ client: "", size: "A4", description: "", quantity: "1", unitPrice: "", paid: "" });
    setShowForm(false);
  };

  const applyPayment = (id) => {
    const extra = Number(extraPayment) || 0;
    if (!extra) return;
    setFrames(prev => prev.map(f => {
      if (f.id !== id) return f;
      const total = f.quantity * f.unitPrice;
      return { ...f, paid: Math.min(f.paid + extra, total) };
    }));
    setExtraPayment("");
    setAddPaymentId(null);
  };

  const deleteFrame = (id) => {
    if (window.confirm("Delete this frame sale?")) {
      setFrames(prev => prev.filter(f => f.id !== id));
    }
  };

  const totalRevenue = frames.reduce((s, f) => s + f.paid, 0);
  const totalOutstanding = frames.reduce((s, f) => s + ((f.quantity * f.unitPrice) - f.paid), 0);

  return (
    <div>
      {!hideTitle && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ color: COLORS.text, margin: 0, fontSize: 18, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", letterSpacing: 2 }}>Frame Sales</h3>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        {canEdit && (
          <button onClick={() => setShowForm(!showForm)} style={{ background: COLORS.accent, color: "#000", border: "none", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {showForm ? "Cancel" : "+ Sell"}
          </button>
        )}
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <Card style={{ padding: 14 }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>🖼️</div>
          <div style={{ color: COLORS.success, fontSize: 18, fontWeight: 700 }}>{formatRWF(totalRevenue)}</div>
          <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>Collected</div>
        </Card>
        <Card style={{ padding: 14 }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>⏳</div>
          <div style={{ color: COLORS.danger, fontSize: 18, fontWeight: 700 }}>{formatRWF(totalOutstanding)}</div>
          <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>Outstanding</div>
        </Card>
      </div>

      {canEdit && showForm && (
        <Card style={{ borderColor: COLORS.accent }}>
          <ClientSelect value={form.client} onChange={val => setForm(p => ({ ...p, client: val }))} clients={clients} />
          <select value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))}
            style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 14, marginBottom: 8 }}>
            {sizes.map(s => <option key={s}>{s}</option>)}
          </select>
          <InputField placeholder="Description (e.g. Black wood frame)" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <input type="number" placeholder="Qty" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))}
              style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 14 }} />
            <input type="number" placeholder="Unit Price (RWF)" value={form.unitPrice} onChange={e => setForm(p => ({ ...p, unitPrice: e.target.value }))}
              style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 14 }} />
          </div>
          <div style={{ background: COLORS.bg, borderRadius: 8, padding: 12, marginBottom: 8, border: `1px solid ${COLORS.border}` }}>
            <div style={{ color: COLORS.accent, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>PRICING</div>
            <InputField placeholder="Cost Price / unit (what you paid)" type="number" value={form.costPrice} onChange={e => setForm(p => ({ ...p, costPrice: e.target.value }))} />
            {form.quantity && form.unitPrice && form.costPrice && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, background: "#0d2b1a", borderRadius: 8, padding: "8px 10px" }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>Net Gain</span>
                <span style={{ color: COLORS.success, fontWeight: 700, fontSize: 13 }}>
                  {formatRWF((Number(form.unitPrice) - Number(form.costPrice)) * Number(form.quantity))}
                </span>
              </div>
            )}
            <div style={{ color: COLORS.accent, fontSize: 11, fontWeight: 700, letterSpacing: 1, margin: "8px 0" }}>PAYMENT</div>
            {form.quantity && form.unitPrice && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>Total</span>
                <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 13 }}>{formatRWF(Number(form.quantity) * Number(form.unitPrice))}</span>
              </div>
            )}
            <InputField placeholder="Amount Paid (RWF)" type="number" value={form.paid} onChange={e => setForm(p => ({ ...p, paid: e.target.value }))} />
            {form.unitPrice && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>Balance</span>
                <span style={{ color: COLORS.danger, fontSize: 13, fontWeight: 700 }}>{formatRWF(Math.max(0, (Number(form.quantity||1) * Number(form.unitPrice)) - Number(form.paid||0)))}</span>
              </div>
            )}
          </div>
          <button onClick={addFrame} style={{ width: "100%", background: COLORS.accent, color: "#000", border: "none", borderRadius: 8, padding: 12, fontWeight: 700, cursor: "pointer" }}>
            Save Sale
          </button>
        </Card>
      )}

      {frames.length === 0 && <Card><div style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", padding: 10 }}>No frame sales yet</div></Card>}

      {frames.map(f => {
        const total = f.quantity * f.unitPrice;
        const rest = total - f.paid;
        const pct = total > 0 ? (f.paid / total) * 100 : 0;
        return (
          <Card key={f.id} style={{ borderLeft: `3px solid ${rest === 0 ? COLORS.success : COLORS.accent}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ color: COLORS.text, fontWeight: 600 }}>{f.client}</div>
              <span style={{ background: rest === 0 ? "#1a3a2a" : "#3a2a10", color: rest === 0 ? COLORS.success : COLORS.accent, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>
                {rest === 0 ? "✅ Paid" : "⏳ Pending"}
              </span>
            </div>
            <div style={{ color: COLORS.accent, fontSize: 12, marginBottom: 3 }}>🖼️ {f.size} {f.description ? `· ${f.description}` : ""}</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 6 }}>📅 {f.date} · Qty: {f.quantity} × {formatRWF(f.unitPrice)}</div>
            {f.costPrice > 0 && (
              <div style={{ background: "#0d2b1a", borderRadius: 8, padding: "8px 10px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: COLORS.muted, fontSize: 11 }}>Cost: {formatRWF(f.costPrice * f.quantity)}</div>
                  <div style={{ color: COLORS.muted, fontSize: 11 }}>Selling: {formatRWF(f.unitPrice * f.quantity)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: COLORS.muted, fontSize: 10 }}>NET GAIN</div>
                  <div style={{ color: COLORS.success, fontWeight: 700, fontSize: 15 }}>{formatRWF((f.unitPrice - f.costPrice) * f.quantity)}</div>
                </div>
              </div>
            )}

            <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>💵 Total</span>
                <span style={{ color: COLORS.text, fontSize: 12, fontWeight: 700 }}>{formatRWF(total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>✅ Paid</span>
                <span style={{ color: COLORS.success, fontSize: 12, fontWeight: 700 }}>{formatRWF(f.paid)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>⏳ Balance</span>
                <span style={{ color: rest > 0 ? COLORS.danger : COLORS.success, fontSize: 12, fontWeight: 700 }}>{formatRWF(rest)}</span>
              </div>
              <div style={{ background: COLORS.border, borderRadius: 4, height: 5 }}>
                <div style={{ background: pct >= 100 ? COLORS.success : COLORS.accent, borderRadius: 4, height: 5, width: `${Math.min(pct, 100)}%`, transition: "width 0.3s" }} />
              </div>
            </div>

            {canEdit && rest > 0 && (
              addPaymentId === f.id ? (
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input type="number" placeholder={`Max ${formatRWF(rest)}`} value={extraPayment}
                    onChange={e => setExtraPayment(e.target.value)}
                    style={{ flex: 1, background: COLORS.bg, border: `1px solid ${COLORS.accent}`, borderRadius: 8, padding: "8px 10px", color: COLORS.text, fontSize: 13 }} />
                  <button onClick={() => applyPayment(f.id)} style={{ background: COLORS.success, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>Add</button>
                  <button onClick={() => setAddPaymentId(null)} style={{ background: COLORS.border, color: COLORS.muted, border: "none", borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}>✕</button>
                </div>
              ) : (
                <button onClick={() => setAddPaymentId(f.id)} style={{ width: "100%", background: "transparent", border: `1px solid ${COLORS.success}`, borderRadius: 8, padding: 8, color: COLORS.success, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>
                  + Add Payment
                </button>
              )
            )}
            {role === "manager" && (
              <button onClick={() => deleteFrame(f.id)} style={{ background: "none", border: "none", color: COLORS.danger, fontSize: 11, cursor: "pointer", padding: 0 }}>
                🗑️ Delete
              </button>
            )}
          </Card>
        );
      })}
    </div>
  );
};

// ── RENTALS ────────────────────────────────────────────────
const Rentals = ({ rentals, setRentals, clients, role, hideTitle = false }) => {
  const canEdit = role === "manager" || role === "alain" || role === "max";
  const [showForm, setShowForm] = useState(false);
  const [addPaymentId, setAddPaymentId] = useState(null);
  const [extraPayment, setExtraPayment] = useState("");
  const [refundId, setRefundId] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundNote, setRefundNote] = useState("");
  const [form, setForm] = useState({ client: "", items: "", from: "", to: "", days: "", pricePerDay: "", paid: "" });

  const addRental = () => {
    if (!form.client || !form.items) return;
    const amount = Number(form.amount) || 0;
    const paid = Number(form.paid) || 0;
    setRentals(prev => [...prev, { id: Date.now(), ...form, amount, paid, returned: false }]);
    setForm({ client: "", items: "", from: "", to: "", amount: "", paid: "" });
    setShowForm(false);
  };

  const applyPayment = (id) => {
    const extra = Number(extraPayment) || 0;
    if (!extra) return;
    setRentals(prev => prev.map(r => {
      if (r.id !== id) return r;
      return { ...r, paid: Math.min(r.paid + extra, r.amount) };
    }));
    setExtraPayment("");
    setAddPaymentId(null);
  };

  const markReturned = (id) => {
    setRentals(prev => prev.map(r => r.id === id ? { ...r, returned: true } : r));
  };

  const active = rentals.filter(r => !r.returned || r.paid < r.amount);
  const returned = rentals.filter(r => r.returned && r.paid >= r.amount);
  const totalIncome = rentals.reduce((s, r) => s + r.paid, 0);
  const totalOutstanding = rentals.reduce((s, r) => s + (r.amount - r.paid), 0);

  return (
    <div>
      {!hideTitle && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ color: COLORS.text, margin: 0, fontSize: 18, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", letterSpacing: 2 }}>Rentals</h3>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        {canEdit && (
          <button onClick={() => setShowForm(!showForm)} style={{ background: COLORS.accent, color: "#000", border: "none", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {showForm ? "Cancel" : "+ Rent Out"}
          </button>
        )}
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <Card style={{ padding: 14 }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>💰</div>
          <div style={{ color: COLORS.success, fontSize: 18, fontWeight: 700 }}>{formatRWF(totalIncome)}</div>
          <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>Collected</div>
        </Card>
        <Card style={{ padding: 14 }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>⏳</div>
          <div style={{ color: COLORS.danger, fontSize: 18, fontWeight: 700 }}>{formatRWF(totalOutstanding)}</div>
          <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>Outstanding</div>
        </Card>
      </div>

      {canEdit && showForm && (
        <Card style={{ borderColor: COLORS.accent }}>
          <ClientSelect value={form.client} onChange={val => setForm(p => ({ ...p, client: val }))} clients={clients} />
          <InputField placeholder="Items (e.g. Camera + 50mm lens)" value={form.items} onChange={e => setForm(p => ({ ...p, items: e.target.value }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <input type="date" value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))}
              style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 13 }} />
            <input type="date" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
              style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 13 }} />
          </div>
          <div style={{ background: COLORS.bg, borderRadius: 8, padding: 12, marginBottom: 8, border: `1px solid ${COLORS.border}` }}>
            <div style={{ color: COLORS.accent, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>PRICING</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input type="number" placeholder="No. of Days" value={form.days}
                onChange={e => setForm(p => ({ ...p, days: e.target.value }))}
                style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 14 }} />
              <input type="number" placeholder="Price / Day (RWF)" value={form.pricePerDay}
                onChange={e => setForm(p => ({ ...p, pricePerDay: e.target.value }))}
                style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 14 }} />
            </div>
            {form.days && form.pricePerDay && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>Total</span>
                <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 13 }}>{formatRWF(Number(form.days) * Number(form.pricePerDay))}</span>
              </div>
            )}
            <div style={{ color: COLORS.accent, fontSize: 11, fontWeight: 700, letterSpacing: 1, margin: "8px 0" }}>PAYMENT</div>
            <InputField placeholder="Amount Paid (RWF)" type="number" value={form.paid} onChange={e => setForm(p => ({ ...p, paid: e.target.value }))} />
            {form.days && form.pricePerDay && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>Balance</span>
                <span style={{ color: COLORS.danger, fontSize: 13, fontWeight: 700 }}>{formatRWF(Math.max(0, Number(form.days) * Number(form.pricePerDay) - Number(form.paid || 0)))}</span>
              </div>
            )}
          </div>
          <button onClick={addRental} style={{ width: "100%", background: COLORS.accent, color: "#000", border: "none", borderRadius: 8, padding: 12, fontWeight: 700, cursor: "pointer" }}>
            Save Rental
          </button>
        </Card>
      )}

      {/* Active rentals */}
      {active.length === 0 && <Card><div style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", padding: 10 }}>No active rentals</div></Card>}
      {active.map(r => {
        const rest = r.amount - r.paid;
        const pct = r.amount > 0 ? (r.paid / r.amount) * 100 : 0;
        return (
          <Card key={r.id} style={{ borderLeft: `3px solid ${COLORS.accent}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ color: COLORS.text, fontWeight: 600 }}>{r.client}</div>
              <span style={{ background: r.returned ? "#1a3a2a" : "#3a2a10", color: r.returned ? COLORS.success : COLORS.accent, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>
                {r.returned ? "Returned" : "Out"}
              </span>
            </div>
            <div style={{ color: COLORS.accent, fontSize: 12, marginBottom: 3 }}>📷 {r.items}</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 3 }}>📅 {r.from} → {r.to}</div>
            <div style={{ color: COLORS.accent, fontSize: 12, marginBottom: 10 }}>⏱️ {r.days || 1} day{(r.days || 1) > 1 ? "s" : ""} × {formatRWF(r.pricePerDay || r.amount)}</div>

            <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>💵 Fee</span>
                <span style={{ color: COLORS.text, fontSize: 12, fontWeight: 700 }}>{formatRWF(r.amount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>✅ Paid</span>
                <span style={{ color: COLORS.success, fontSize: 12, fontWeight: 700 }}>{formatRWF(r.paid)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>⏳ Balance</span>
                <span style={{ color: rest > 0 ? COLORS.danger : COLORS.success, fontSize: 12, fontWeight: 700 }}>{formatRWF(rest)}</span>
              </div>
              <div style={{ background: COLORS.border, borderRadius: 4, height: 5 }}>
                <div style={{ background: pct >= 100 ? COLORS.success : COLORS.accent, borderRadius: 4, height: 5, width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>

            {canEdit && rest > 0 && (
              addPaymentId === r.id ? (
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input type="number" placeholder={`Max ${formatRWF(rest)}`} value={extraPayment}
                    onChange={e => setExtraPayment(e.target.value)}
                    style={{ flex: 1, background: COLORS.bg, border: `1px solid ${COLORS.accent}`, borderRadius: 8, padding: "8px 10px", color: COLORS.text, fontSize: 13 }} />
                  <button onClick={() => applyPayment(r.id)} style={{ background: COLORS.success, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>Add</button>
                  <button onClick={() => setAddPaymentId(null)} style={{ background: COLORS.border, color: COLORS.muted, border: "none", borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}>✕</button>
                </div>
              ) : (
                <button onClick={() => setAddPaymentId(r.id)} style={{ width: "100%", background: "transparent", border: `1px solid ${COLORS.success}`, borderRadius: 8, padding: 8, color: COLORS.success, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>
                  + Add Payment
                </button>
              )
            )}
            {canEdit && !r.returned && (
              <button onClick={() => markReturned(r.id)} style={{ width: "100%", background: "transparent", border: `1px solid ${COLORS.accent}`, borderRadius: 8, padding: 8, color: COLORS.accent, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                📦 Mark as Returned
              </button>
            )}
          </Card>
        );
      })}

      {/* Returned & settled */}
      {returned.length > 0 && (
        <>
          <h3 style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1.5, margin: "16px 0 10px", textTransform: "uppercase" }}>Returned & Settled</h3>
          {returned.map(r => (
            <Card key={r.id} style={{ borderLeft: `3px solid ${COLORS.success}`, opacity: 0.7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: COLORS.text, fontWeight: 600 }}>{r.client}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>📷 {r.items}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>📅 {r.from} → {r.to}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>⏱️ {r.days || 1} day{(r.days||1)>1?"s":""} × {formatRWF(r.pricePerDay||r.amount)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: COLORS.success, fontWeight: 700 }}>{formatRWF(r.amount)}</div>
                  <div style={{ color: COLORS.success, fontSize: 11, marginTop: 4 }}>✅ Done</div>
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

// ── COMPLETED ──────────────────────────────────────────────
const CompletedCard = ({ b, setBookings, role }) => {
  const [showRefund, setShowRefund] = useState(false);
  const [refAmt, setRefAmt] = useState("");
  const [refNote, setRefNote] = useState("");
  const hasRefund = (b.refund || 0) > 0;
  const canAct = role === "manager" || role === "alain" || role === "max";

  const applyRefund = () => {
    const amount = Number(refAmt) || 0;
    if (!amount || amount > b.paid) return;
    setBookings(prev => prev.map(x => x.id === b.id
      ? { ...x, refund: (x.refund || 0) + amount, paid: Math.max(0, x.paid - amount), refundNote: refNote }
      : x
    ));
    setRefAmt(""); setRefNote(""); setShowRefund(false);
  };

  return (
    <Card style={{ borderLeft: `3px solid ${hasRefund ? COLORS.danger : COLORS.success}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 15 }}>{b.client}</div>
        <span style={{ background: hasRefund ? "#3a1a1a" : "#1a3a2a", color: hasRefund ? COLORS.danger : COLORS.success, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>
          {hasRefund ? "💸 Refunded" : "✅ Paid"}
        </span>
      </div>
      <div style={{ color: COLORS.accent, fontSize: 12, marginBottom: 3 }}>📷 {b.type}</div>
      <div style={{ color: COLORS.muted, fontSize: 12 }}>📅 {b.date} · {b.time}</div>
      <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 10 }}>📍 {b.location}</div>
      <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10, marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: hasRefund ? 4 : 0 }}>
          <span style={{ color: COLORS.muted, fontSize: 12 }}>Total Paid</span>
          <span style={{ color: COLORS.success, fontWeight: 700, fontSize: 15 }}>{formatRWF(b.paid)}</span>
        </div>
        {hasRefund && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: COLORS.muted, fontSize: 12 }}>💸 Refunded</span>
              <span style={{ color: COLORS.danger, fontWeight: 700, fontSize: 13 }}>{formatRWF(b.refund)}</span>
            </div>
            {b.refundNote && <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 4 }}>"{b.refundNote}"</div>}
          </>
        )}
      </div>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 600, padding: "4px 0", color: b.delivered ? COLORS.success : COLORS.accent }}>
        {b.delivered ? "📦 Delivered" : "⏳ Awaiting Delivery"}
      </div>
      {b.type === "Studio Session" && b.editedDeliveryDate && (
        <div style={{ textAlign: "center", color: "#6e9bc8", fontSize: 12, padding: "4px 0" }}>🖼️ Edited delivery: {b.editedDeliveryDate}</div>
      )}

      {/* Refund button */}
      {canAct && b.paid > 0 && (
        <div style={{ marginTop: 10 }}>
          {showRefund ? (
            <div>
              <div style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1, marginBottom: 6 }}>REFUND — max {formatRWF(b.paid)}</div>
              <input type="number" placeholder="Amount to refund" value={refAmt}
                onChange={e => setRefAmt(e.target.value)}
                style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.danger}`, borderRadius: 8, padding: "8px 10px", color: COLORS.text, fontSize: 13, marginBottom: 6, boxSizing: "border-box" }} />
              <input type="text" placeholder="Reason for refund" value={refNote}
                onChange={e => setRefNote(e.target.value)}
                style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 10px", color: COLORS.text, fontSize: 13, marginBottom: 8, boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={applyRefund}
                  style={{ flex: 1, background: COLORS.danger, color: "#fff", border: "none", borderRadius: 8, padding: "8px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  💸 Confirm Refund
                </button>
                <button onClick={() => { setShowRefund(false); setRefAmt(""); setRefNote(""); }}
                  style={{ background: COLORS.border, color: COLORS.muted, border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}>✕</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowRefund(true)}
                style={{ flex: 1, background: "transparent", border: `1px solid ${COLORS.danger}`, borderRadius: 8, padding: 8, color: COLORS.danger, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                💸 Issue Refund
              </button>
              <button onClick={() => { if(window.confirm("Mark this complaint as settled with no refund?")) setBookings(prev => prev.map(x => x.id === b.id ? { ...x, refundNote: "Settled — no refund issued", refund: 0 } : x)); }}
                style={{ flex: 1, background: "transparent", border: `1px solid ${COLORS.success}`, borderRadius: 8, padding: 8, color: COLORS.success, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                ✅ No Refund
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

const Completed = ({ bookings, setBookings, role }) => {
  const completed = bookings.filter(b => b.amount > 0 && (b.paid >= b.amount || (b.refund||0) > 0));

  return (
    <div>
      <h3 style={{ color: COLORS.text, margin: "0 0 6px", fontSize: 18, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", letterSpacing: 2 }}>Completed</h3>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16 }}>Fully paid bookings</p>
      {completed.length === 0 && (
        <Card><div style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", padding: 10 }}>No completed bookings yet</div></Card>
      )}
      {completed.map(b => <CompletedCard key={b.id} b={b} setBookings={setBookings} role={role} />)}
    </div>
  );
};



// ── STAFF PAYMENTS (Manager only) ──────────────────────────
const StaffPayments = ({ staffPayments, setStaffPayments }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", amount: "", date: "", note: "" });

  const roles = ["Photographer", "Editor", "Assistant", "Driver", "Other"];

  const addPayment = () => {
    if (!form.name || !form.amount) return;
    setStaffPayments(prev => [...prev, { id: Date.now(), ...form, amount: Number(form.amount) }]);
    setForm({ name: "", role: "", amount: "", date: "", note: "" });
    setShowForm(false);
  };

  const deletePayment = (id) => {
    if (window.confirm("Delete this payment record?")) {
      setStaffPayments(prev => prev.filter(p => p.id !== id));
    }
  };

  const totalPaid = staffPayments.reduce((s, p) => s + p.amount, 0);

  // Group by month
  const byMonth = {};
  staffPayments.forEach(p => {
    const d = new Date(p.date || Date.now());
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const label = d.toLocaleString("default", { month: "long", year: "numeric" });
    if (!byMonth[key]) byMonth[key] = { label, payments: [] };
    byMonth[key].payments.push(p);
  });
  const sortedMonths = Object.entries(byMonth).sort((a,b) => b[0].localeCompare(a[0]));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ color: COLORS.text, margin: 0, fontSize: 18, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", letterSpacing: 2 }}>Staff Payments</h3>
        <button onClick={() => setShowForm(!showForm)} style={{ background: COLORS.accent, color: "#000", border: "none", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {/* Total */}
      <Card style={{ background: "#1a0f1a", borderColor: "#9b6ec8", marginBottom: 16 }}>
        <div style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1 }}>TOTAL STAFF PAID</div>
        <div style={{ color: "#c89b6e", fontSize: 24, fontWeight: 700, marginTop: 4 }}>{formatRWF(totalPaid)}</div>
      </Card>

      {showForm && (
        <Card style={{ borderColor: COLORS.accent }}>
          <InputField placeholder="Staff Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
            style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: form.role ? COLORS.text : COLORS.muted, fontSize: 14, marginBottom: 8 }}>
            <option value="">Select Role</option>
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
          <InputField placeholder="Amount (RWF)" type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
          <InputField placeholder="Date" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          <InputField placeholder="Note (e.g. June salary, bonus)" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
          <button onClick={addPayment} style={{ width: "100%", background: COLORS.accent, color: "#000", border: "none", borderRadius: 8, padding: 12, fontWeight: 700, cursor: "pointer" }}>
            Save Payment
          </button>
        </Card>
      )}

      {staffPayments.length === 0 && <Card><div style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", padding: 10 }}>No staff payments recorded</div></Card>}

      {sortedMonths.map(([key, m]) => (
        <div key={key}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0 8px" }}>
            <span style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase" }}>{m.label}</span>
            <span style={{ color: "#c89b6e", fontSize: 12, fontWeight: 700 }}>{formatRWF(m.payments.reduce((s,p) => s+p.amount, 0))}</span>
          </div>
          {m.payments.map(p => (
            <Card key={p.id} style={{ borderLeft: `3px solid #9b6ec8` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ color: COLORS.text, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: "#9b6ec8", fontSize: 12, marginTop: 2 }}>👤 {p.role}</div>
                  {p.note && <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>📝 {p.note}</div>}
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>📅 {p.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#c89b6e", fontWeight: 700, fontSize: 16 }}>{formatRWF(p.amount)}</div>
                  <button onClick={() => deletePayment(p.id)} style={{ background: "none", border: "none", color: COLORS.danger, fontSize: 11, cursor: "pointer", marginTop: 6, padding: 0 }}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};

// ── SHOP ───────────────────────────────────────────────────
const Shop = ({ rentals, setRentals, frames, setFrames, clients, role }) => {
  const [activeShopTab, setActiveShopTab] = useState("rentals");

  return (
    <div>
      <h3 style={{ color: COLORS.text, margin: "0 0 16px", fontSize: 18, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", letterSpacing: 2 }}>Shop</h3>
      {/* Inner tab switcher */}
      <div style={{ display: "flex", background: COLORS.card, borderRadius: 12, padding: 4, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
        {[{ id: "rentals", label: "🎥 Rentals" }, { id: "frames", label: "🖼️ Frames" }].map(t => (
          <button key={t.id} onClick={() => setActiveShopTab(t.id)}
            style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
              background: activeShopTab === t.id ? COLORS.accent : "transparent",
              color: activeShopTab === t.id ? "#000" : COLORS.muted }}>
            {t.label}
          </button>
        ))}
      </div>
      {activeShopTab === "rentals" && <Rentals rentals={rentals} setRentals={setRentals} clients={clients} role={role} hideTitle />}
      {activeShopTab === "frames" && <Frames frames={frames} setFrames={setFrames} clients={clients} role={role} hideTitle />}
    </div>
  );
};


// ── SETTINGS (Manager only) ────────────────────────────────
const Settings = ({ pins, setPins }) => {
  const [form, setForm] = useState({
    manager: "", alain: "", max: "", viewer: ""
  });
  const [saved, setSaved] = useState(false);
  const [showPins, setShowPins] = useState(false);

  const roleLabels = {
    manager: { label: "Richard (Manager)", icon: "👔", color: "#c8a96e" },
    alain: { label: "Alain (Staff)", icon: "👤", color: "#6e9bc8" },
    max: { label: "Max (Staff)", icon: "👤", color: "#6ec8a0" },
    viewer: { label: "Viewer", icon: "👁️", color: "#6b6560" },
  };

  const currentPins = {};
  Object.entries(pins).forEach(([pin, role]) => { currentPins[role] = pin; });

  const savePin = (role) => {
    const newPin = form[role];
    if (newPin.length !== 4 || isNaN(newPin)) return;
    const oldPin = currentPins[role];
    const updated = { ...pins };
    delete updated[oldPin];
    updated[newPin] = role;
    setPins(updated);
    setForm(p => ({ ...p, [role]: "" }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h3 style={{ color: COLORS.text, margin: "0 0 6px", fontSize: 18, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", letterSpacing: 2 }}>Settings</h3>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16 }}>Manage access PINs for your team</p>

      {saved && (
        <Card style={{ background: "#0d2b1a", borderColor: COLORS.success, marginBottom: 16 }}>
          <div style={{ color: COLORS.success, fontWeight: 700, textAlign: "center" }}>✅ PIN updated successfully!</div>
        </Card>
      )}

      {/* Show current PINs toggle */}
      <button onClick={() => setShowPins(!showPins)}
        style={{ width: "100%", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 10, color: COLORS.muted, fontSize: 13, cursor: "pointer", marginBottom: 16 }}>
        {showPins ? "🙈 Hide Current PINs" : "👁️ Show Current PINs"}
      </button>

      {showPins && (
        <Card style={{ marginBottom: 16 }}>
          {Object.entries(roleLabels).map(([role, info]) => (
            <div key={role} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{info.icon}</span>
                <span style={{ color: COLORS.text, fontSize: 13 }}>{info.label}</span>
              </div>
              <span style={{ color: info.color, fontWeight: 700, fontSize: 16, letterSpacing: 4 }}>{currentPins[role] || "----"}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Change PINs */}
      <h4 style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 12px" }}>Change PINs</h4>
      {Object.entries(roleLabels).map(([role, info]) => (
        <Card key={role} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>{info.icon}</span>
            <span style={{ color: info.color, fontWeight: 700, fontSize: 14 }}>{info.label}</span>
            <span style={{ color: COLORS.muted, fontSize: 12, marginLeft: "auto" }}>Current: {currentPins[role]}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="number"
              placeholder="New 4-digit PIN"
              value={form[role]}
              onChange={e => setForm(p => ({ ...p, [role]: e.target.value.slice(0, 4) }))}
              style={{ flex: 1, background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 14 }}
            />
            <button onClick={() => savePin(role)}
              disabled={form[role].length !== 4}
              style={{ background: form[role].length === 4 ? COLORS.accent : COLORS.border, color: form[role].length === 4 ? "#000" : COLORS.muted, border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 700, fontSize: 13, cursor: form[role].length === 4 ? "pointer" : "default" }}>
              Save
            </button>
          </div>
          {form[role].length > 0 && form[role].length < 4 && (
            <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 4 }}>{4 - form[role].length} more digit{4 - form[role].length !== 1 ? "s" : ""} needed</div>
          )}
        </Card>
      ))}
    </div>
  );
};

// ── MAIN APP ───────────────────────────────────────────────
export default function App() {
  const [pins, setPins] = useState(DEFAULT_PINS);
  const [role, setRole] = useState(null);
  const [tab, setTab] = useState("bookings");
  const [clients, setClients] = useState(initialClients);
  const [bookings, setBookings] = useState(initialBookings);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [rentals, setRentals] = useState(initialRentals);
  const [frames, setFrames] = useState(initialFrames);
  const [staffPayments, setStaffPayments] = useState(initialStaffPayments);
  const [managerExpenses, setManagerExpenses] = useState(initialManagerExpenses);

  if (!role) return <Login pins={pins} onLogin={(r) => { setRole(r); setTab(r === "manager" ? "home" : "bookings"); }} />;

  const roleInfo = ROLE_LABELS[role];

  // Tabs per role
  const allTabs = [
    { id: "home", icon: "🏠", label: "Home", roles: ["manager"] },
    { id: "clients", icon: "👥", label: "Clients", roles: ["manager", "alain", "max", "viewer"] },
    { id: "bookings", icon: "📅", label: "Bookings", roles: ["manager", "alain", "max", "viewer"] },
    { id: "shop", icon: "🛍️", label: "Shop", roles: ["manager", "alain", "max"] },
    { id: "completed", icon: "✅", label: "Completed", roles: ["manager", "alain", "max"] },
    { id: "expenses", icon: "💸", label: "Expenses", roles: ["manager", "alain", "max"], pending: expenses.filter(e=>e.status==="pending").length },
    { id: "settings", icon: "⚙️", label: "Settings", roles: ["manager"] },
  ];
  const tabs = allTabs.filter(t => t.roles.includes(role));

  return (
    <><FontStyle /><div style={{ background: COLORS.bg, minHeight: "100vh", maxWidth: 430, margin: "0 auto", fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: COLORS.accent, fontSize: 32, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", fontWeight: 700, letterSpacing: 4, lineHeight: 1 }}>IMANI</span>
          <span style={{ color: COLORS.text, fontSize: 22, fontFamily: "'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif", fontWeight: 700, letterSpacing: 4, lineHeight: 1 }}>STUDIO</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: roleInfo.color, fontSize: 12, fontWeight: 600 }}>{roleInfo.icon} {roleInfo.label}</span>
          <button onClick={() => setRole(null)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "3px 8px", color: COLORS.muted, fontSize: 11, cursor: "pointer" }}>
            Exit
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 16px 90px" }}>
        {tab === "home" && role === "manager" && <Dashboard bookings={bookings} clients={clients} expenses={expenses} rentals={rentals} frames={frames} staffPayments={staffPayments} managerExpenses={managerExpenses} role={role} />}
        {tab === "clients" && <Clients clients={clients} setClients={setClients} role={role} />}
        {tab === "bookings" && <Bookings bookings={bookings} setBookings={setBookings} clients={clients} role={role} />}
        {tab === "expenses" && <Expenses expenses={expenses} setExpenses={setExpenses} managerExpenses={managerExpenses} setManagerExpenses={setManagerExpenses} staffPayments={staffPayments} setStaffPayments={setStaffPayments} role={role} />}
        {tab === "shop" && <Shop rentals={rentals} setRentals={setRentals} frames={frames} setFrames={setFrames} clients={clients} role={role} />}
        {tab === "settings" && <Settings pins={pins} setPins={setPins} />}
        {tab === "completed" && <Completed bookings={bookings} setBookings={setBookings} role={role} />}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: COLORS.card, borderTop: `1px solid ${COLORS.border}`, display: "flex", padding: "0 8px" }}>
        {tabs.map(t => <NavIcon key={t.id} icon={t.icon} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} badge={role === "manager" && t.id === "expenses" ? expenses.filter(e=>e.status==="pending").length : 0} />)}
      </div>
    </div></>
  );
}
