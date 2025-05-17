import React, { useState } from "react";
import "../styles/ApplyModal.css";


export default function ApplyModal({ program, onClose, onSuccess }) {
  const [msg, setMsg]     = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone]   = useState(false);

  /* محاكاة طلب API */
  const submit = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1200)); // استبدله بـ fetch API
    setSending(false);
    setDone(true);
    onSuccess();          // يعطّل زر Apply بالخارج
  };

  return (
    <div className="apply-back">
      <div className="apply-card">
        <button className="close" onClick={onClose}>×</button>

        {done ? (
          <div className="done">
            <i className="fas fa-check-circle"></i>
            <h3>Application Sent!</h3>
            <p>You will receive a response via email.</p>
            <button onClick={onClose}>OK</button>
          </div>
        ) : (
          <>
            <h3>Apply to {program.title}</h3>
            <p className="co">{program.company}</p>

            <textarea
              placeholder="Optional message…"
              value={msg}
              onChange={e=>setMsg(e.target.value)}
            />

            <button className="send" disabled={sending} onClick={submit}>
              {sending ? "Sending…" : "Send Application"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
