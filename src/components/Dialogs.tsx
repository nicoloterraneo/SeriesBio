import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { StartupProfileData } from '../types';
import type { Derived } from '../lib/derive';

/** Native <dialog> driven by an `open` prop. Closes on Esc and backdrop click. */
function Modal({ open, onClose, labelledBy, children }: { open: boolean; onClose: () => void; labelledBy: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </dialog>
  );
}

export function MethodDialog({ open, onClose, data, x }: { open: boolean; onClose: () => void; data: StartupProfileData; x: Derived }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="sp-m-title">
      <div className="dlg">
        <h2 id="sp-m-title">How the score works</h2>
        <p className="lead">
          Five pillars, each scored 0–100, combined with weights for the {data.company.stage} stage. Early stages lean on the team; later stages lean on traction.
        </p>
        {data.evaluation.pillars.map((p) => (
          <div className="wt-row" key={p.key}>
            <b>{p.name}</b>
            <span className="w num">{x.weights[p.key]}%</span>
            <span>{p.blurb}</span>
            <div className="wt-bar"><i style={{ width: `${x.weights[p.key] * 2.5}%` }} /></div>
          </div>
        ))}
        <h3 style={{ margin: '18px 0 6px', fontSize: 14 }}>KPI benchmark ranges</h3>
        <p className="section-sub" style={{ lineHeight: 1.55 }}>
          Directional ranges drawn from public SaaS benchmark reports and investor guides; they vary by source, ARR band and year, so treat them as a reading aid rather than a verdict.
        </p>
        <div className="dlg-foot">
          <button className="btn primary" type="button" onClick={onClose}>Got it</button>
        </div>
      </div>
    </Modal>
  );
}

export function IntroDialog({ open, onClose, onSend, company }: { open: boolean; onClose: () => void; onSend: (message: string) => void; company: string }) {
  const [msg, setMsg] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (open) field.current?.focus(); }, [open]);
  return (
    <Modal open={open} onClose={onClose} labelledBy="sp-i-title">
      <form
        className="dlg"
        onSubmit={(e) => {
          e.preventDefault();
          onSend(msg.trim());
          setMsg('');
          onClose();
        }}
      >
        <h2 id="sp-i-title">Request an introduction to {company}</h2>
        <p className="lead">We’ll share your note with the founders. They decide whether to reply.</p>
        <label className="sr-only" htmlFor="sp-intro-msg">Message</label>
        <textarea
          id="sp-intro-msg"
          ref={field}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Why are you interested, and what would you like to discuss?"
          required
        />
        <div className="dlg-foot">
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
          <button className="btn primary" type="submit">Send request</button>
        </div>
      </form>
    </Modal>
  );
}
