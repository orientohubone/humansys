import { useEffect, useState } from "react";

interface LogEntry {
  type: "log" | "error";
  timestamp: string;
  message: string;
}

const DebugPanel = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    const capture = (type: "log" | "error", args: any[]) => {
      const message = args.map(arg =>
        typeof arg === "object" ? JSON.stringify(arg) : String(arg)
      ).join(" ");
      const timestamp = new Date().toLocaleTimeString();
      
      // Use queueMicrotask to defer state update and avoid "Cannot update during render" error
      queueMicrotask(() => {
        setLogs(prev => [...prev.slice(-199), { type, message, timestamp }]);
      });
    };

    console.log = (...args) => {
      capture("log", args);
      originalLog(...args);
    };

    console.error = (...args) => {
      capture("error", args);
      originalError(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  if (process.env.NODE_ENV === 'production') return null;

  const filteredLogs = logs.filter(log => log.message.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#111",
      color: "#fff",
      fontSize: "12px",
      padding: "8px",
      zIndex: 9999,
      fontFamily: "monospace",
      borderTop: "2px solid lime",
      resize: "vertical",
      overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#333",
          color: "#0f0",
          padding: "4px 8px",
          fontSize: "12px",
          marginBottom: "6px",
          border: "1px solid #444",
          cursor: "pointer",
          float: "right"
        }}
      >
        {open ? 'Fechar Debug' : 'Abrir Debug'}
      </button>

      {open && (
        <>
          <input
            type="text"
            placeholder="Filtrar logs..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              marginBottom: "6px",
              background: "#222",
              color: "#0f0",
              border: "1px solid #444",
              fontFamily: "monospace"
            }}
          />
          <div style={{ maxHeight: "30vh", overflowY: "auto" }}>
            {filteredLogs.map((log, idx) => (
              <div key={idx} style={{ color: log.type === "error" ? "#f55" : "#0f0" }}>
                [{log.timestamp}] [{log.type.toUpperCase()}] {log.message}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DebugPanel;

