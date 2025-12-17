"use client";

export default function AdminTabs({ activeTab, setActiveTab, counts }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", count: null },
    { id: "events", label: "Events", count: counts.events },
    { id: "payments", label: "Payments", count: counts.payments },
    { id: "users", label: "Users", count: counts.users },
    { id: "payment-methods", label: "Payment Methods", count: null },
    { id: "reports", label: "Reports", count: null }
  ];

  return (
    <div className="flex gap-2 mb-6 border-b overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === tab.id
              ? "text-purple-600 border-purple-600"
              : "text-gray-600 border-transparent hover:text-gray-900"
          }`}
        >
          {tab.label} {tab.count !== null && `(${tab.count})`}
        </button>
      ))}
    </div>
  );
}
