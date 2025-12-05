"use client";

import { useMemo, useState } from "react";
import EventCard from "../../../components/event-card";
import eventsInit from "../../../data/events";
import ConfirmationModal from "../../../components/confirmation-modal";
import Toast from "../../../components/toast";

export default function DashboardClient() {
  const [query, setQuery] = useState("");
  // local editable copy of events (no backend persistence)
  const [events, setEvents] = useState(() =>
    eventsInit.map((e) => ({ ...e, status: e.status || "scheduled" }))
  );

  const [editing, setEditing] = useState(null); // {event} or null
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null, action: null });
  const [toast, setToast] = useState({ open: false, message: "", variant: "success" });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;
  const [undoCandidate, setUndoCandidate] = useState(null); // {event, timeoutId}

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (categoryFilter !== "All" && e.category !== categoryFilter) return false;
      if (statusFilter !== "All" && e.status !== statusFilter) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        (e.category || "").toLowerCase().includes(q) ||
        (e.location || "").toLowerCase().includes(q)
      );
    });
  }, [query, events, categoryFilter, statusFilter]);

  const totals = useMemo(() => {
    const totalEvents = events.length;
    const totalAttendees = events.reduce((s, e) => s + (e.attendees || 0), 0);
    const byCategory = events.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {});
    return { totalEvents, totalAttendees, byCategory };
  }, [events]);

  function openAdd() {
    setEditing({
      title: "",
      category: "",
      date: "",
      time: "",
      location: "",
      image: "",
      attendees: 0,
      status: "scheduled",
    });
    setShowForm(true);
  }

  function openEdit(ev) {
    setEditing({ ...ev });
    setShowForm(true);
  }

  function saveEditing() {
    if (!editing) return;
    if (editing.id) {
      // update
      setEvents((prev) => prev.map((p) => (p.id === editing.id ? editing : p)));
    } else {
      // add new
      const nextId = Math.max(0, ...events.map((e) => e.id)) + 1;
      setEvents((prev) => [...prev, { ...editing, id: nextId }]);
    }
    setShowForm(false);
    setEditing(null);
  }

  function confirmEvent(id) {
    // ask for confirmation before marking confirmed
    setConfirm({ open: true, id, action: "confirm" });
  }

  function cancelEvent(id) {
    setConfirm({ open: true, id, action: "cancel" });
  }

  function deleteEvent(id) {
    setConfirm({ open: true, id, action: "delete" });
  }

  function runConfirmedAction() {
    const { id, action } = confirm;
    if (!id || !action) return;
    if (action === "confirm") {
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: "confirmed" } : e)));
      setToast({ open: true, message: "Event confirmed", variant: "success" });
    }
    if (action === "cancel") {
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: "cancelled" } : e)));
      setToast({ open: true, message: "Event cancelled", variant: "success" });
    }
    if (action === "delete") {
      // soft-delete with undo option: remove from list but keep candidate
      const ev = events.find((x) => x.id === id);
      if (ev) {
        setEvents((prev) => prev.filter((x) => x.id !== id));
        if (undoCandidate && undoCandidate.timeoutId) clearTimeout(undoCandidate.timeoutId);
        const timeoutId = setTimeout(() => {
          setUndoCandidate(null);
        }, 5000);
        setUndoCandidate({ event: ev, timeoutId });
        setToast({ open: true, message: "Event deleted", variant: "success" });
      }
    }
    setConfirm({ open: false, id: null, action: null });
  }

  function handleUndoDelete() {
    if (!undoCandidate) return;
    const { event, timeoutId } = undoCandidate;
    if (timeoutId) clearTimeout(timeoutId);
    setEvents((prev) => [...prev, event].sort((a, b) => a.id - b.id));
    setToast({ open: true, message: "Delete undone", variant: "success" });
    setUndoCandidate(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-foreground/70">Overview and quick actions</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events..."
            className="px-3 py-2 border rounded-lg"
          />
          <button onClick={openAdd} className="px-4 py-2 bg-primary text-white rounded-lg">
            + Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-foreground/70">Total Events</div>
          <div className="text-2xl font-bold">{totals.totalEvents}</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-foreground/70">Total Attendees</div>
          <div className="text-2xl font-bold">{totals.totalAttendees}</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-foreground/70">Categories</div>
          <div className="mt-2 space-y-1">
            {Object.entries(totals.byCategory).map(([k, v]) => (
              <div key={k} className="text-sm flex justify-between">
                <span>{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Events</h2>

        <div className="flex gap-3 mb-3 items-center">
          <div>
            <label className="text-sm mr-2">Category</label>
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="px-2 py-1 border rounded">
              <option>All</option>
              {[...new Set(events.map((e) => e.category))].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm mr-2">Status</label>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-2 py-1 border rounded">
              <option>All</option>
              {[...new Set(events.map((e) => e.status))].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-3 text-sm font-medium text-foreground/70 border-b">
            <div className="col-span-2">Event</div>
            <div>Date</div>
            <div>Location</div>
            <div>Attendees</div>
            <div className="text-right">Actions</div>
          </div>

          <div className="divide-y">
            {filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE).map((ev) => (
              <div key={ev.id} className="px-4 py-3 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                <div className="col-span-2">
                  <div className="font-semibold">{ev.title}</div>
                  <div className="text-sm text-foreground/60">{ev.category}</div>
                </div>
                <div className="text-sm">{ev.date} {ev.time ? `· ${ev.time}` : ""}</div>
                <div className="text-sm">{ev.location}</div>
                <div className="text-sm">{ev.attendees || 0}</div>
                <div className="text-right flex items-center justify-end gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${ev.status === 'confirmed' ? 'bg-primary/10 text-primary' : ev.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                    {ev.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(ev)} title="Edit" className="px-2 py-1 border rounded text-sm bg-muted">✏️</button>
                    <button onClick={() => confirmEvent(ev.id)} title="Confirm" className="px-2 py-1 bg-primary text-white rounded text-sm">✔</button>
                    <button onClick={() => deleteEvent(ev.id)} title="Delete" className="px-2 py-1 border rounded text-sm text-red-600">🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-foreground/70">Showing {(page-1)*PAGE_SIZE+1} - {Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p-1))} className="px-3 py-1 border rounded" disabled={page===1}>Prev</button>
            <div className="text-sm">{page}</div>
            <button onClick={() => setPage((p) => (p*PAGE_SIZE < filtered.length ? p+1 : p))} className="px-3 py-1 border rounded" disabled={page*PAGE_SIZE >= filtered.length}>Next</button>
          </div>
        </div>
      </div>

      {/* Slide-over Add/Edit panel */}
      <div aria-hidden={!showForm} className={`fixed inset-y-0 right-0 z-50 transform ${showForm ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 w-full max-w-md` }>
        <div className="h-full bg-white shadow-xl p-6 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">{editing && editing.id ? 'Edit Event' : 'Add Event'}</h3>
              <p className="text-sm text-foreground/70">Manage event details</p>
            </div>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-foreground/60">✖</button>
          </div>

          <div className="mt-4 flex-1 overflow-auto">
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm text-foreground/70">Title</label>
              <input value={editing?.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Title" className="px-3 py-2 border rounded w-full" />

              <label className="text-sm text-foreground/70">Category</label>
              <input value={editing?.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Category" className="px-3 py-2 border rounded w-full" />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-foreground/70">Date</label>
                  <input value={editing?.date || ''} onChange={(e) => setEditing({ ...editing, date: e.target.value })} placeholder="Date" className="px-3 py-2 border rounded w-full" />
                </div>
                <div>
                  <label className="text-sm text-foreground/70">Time</label>
                  <input value={editing?.time || ''} onChange={(e) => setEditing({ ...editing, time: e.target.value })} placeholder="Time" className="px-3 py-2 border rounded w-full" />
                </div>
              </div>

              <label className="text-sm text-foreground/70">Location</label>
              <input value={editing?.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} placeholder="Location" className="px-3 py-2 border rounded w-full" />

              <label className="text-sm text-foreground/70">Image path</label>
              <input value={editing?.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="/images/.." className="px-3 py-2 border rounded w-full" />

              <label className="text-sm text-foreground/70">Attendees</label>
              <input type="number" value={editing?.attendees || 0} onChange={(e) => setEditing({ ...editing, attendees: Number(e.target.value) })} className="px-3 py-2 border rounded w-full" />

              <label className="text-sm text-foreground/70">Status</label>
              <select value={editing?.status || 'scheduled'} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="px-3 py-2 border rounded w-full">
                <option value="scheduled">scheduled</option>
                <option value="confirmed">confirmed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={saveEditing} className="px-4 py-2 bg-primary text-white rounded">Save</button>
          </div>
        </div>
      </div>
      {/* Confirmation modal */}
      <ConfirmationModal
        open={confirm.open}
        title={confirm.action === "delete" ? "Delete Event" : "Confirm Event"}
        message={
          confirm.action === "delete"
            ? "Are you sure you want to permanently delete this event?"
            : "Are you sure you want to confirm this event?"
        }
        confirmLabel={confirm.action === "delete" ? "Delete" : "Confirm"}
        onConfirm={runConfirmedAction}
        onClose={() => setConfirm({ open: false, id: null, action: null })}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, open: false })}
        actionLabel={undoCandidate ? "Undo" : undefined}
        onAction={undoCandidate ? handleUndoDelete : undefined}
      />
    </div>
  );
}
