"use client";
import { useState, useEffect } from "react";
import { createSection, updateSection, type DbSection } from "../lib/quizApi";

type Props = {
  section: DbSection | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function SectionFormModal({ section, onClose, onSaved }: Props) {
  const [titleUz, setTitleUz] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [pass, setPass] = useState(9);
  const [retry, setRetry] = useState(6);
  const [timeLimit, setTimeLimit] = useState(15);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (section) {
      setTitleUz(section.title_uz);
      setTitleRu(section.title_ru);
      setTitleEn(section.title_en);
      setPass(section.pass_threshold);
      setRetry(section.retry_threshold);
      setTimeLimit(section.time_limit_minutes);
    }
  }, [section]);

  const save = async () => {
    setErr("");
    if (!titleUz.trim() || !titleRu.trim() || !titleEn.trim()) {
      setErr("All three titles are required.");
      return;
    }
    if (retry >= pass) {
      setErr("Retry threshold must be lower than pass threshold.");
      return;
    }
    if (pass < 1 || retry < 0 || timeLimit < 1) {
      setErr("Thresholds and time limit must be positive numbers.");
      return;
    }
    setSaving(true);
    try {
      if (section) {
        await updateSection(section.id, {
          title_uz: titleUz, title_ru: titleRu, title_en: titleEn,
          pass_threshold: pass, retry_threshold: retry, time_limit_minutes: timeLimit,
        });
      } else {
        await createSection({
          title_uz: titleUz, title_ru: titleRu, title_en: titleEn,
          pass_threshold: pass, retry_threshold: retry, time_limit_minutes: timeLimit,
        });
      }
      onSaved();
    } catch (e: any) {
      setErr(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div className="card" style={{maxWidth:560,width:"100%",maxHeight:"90vh",overflowY:"auto",padding:24}}>
        <h3 style={{fontSize:18,fontWeight:800,color:"#111827",marginBottom:16}}>
          {section ? "Edit Section" : "New Section"}
        </h3>

        <Label text="Title (Uzbek)" />
        <input className="inp" value={titleUz} onChange={e => setTitleUz(e.target.value)} placeholder="Bo'lim nomi" />

        <Label text="Title (Russian)" />
        <input className="inp" value={titleRu} onChange={e => setTitleRu(e.target.value)} placeholder="Название раздела" />

        <Label text="Title (English)" />
        <input className="inp" value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="Section name" />

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:12}}>
          <div>
            <Label text="Pass ≥" />
            <input className="inp" type="number" min={1} value={pass} onChange={e => setPass(parseInt(e.target.value || "0"))} />
          </div>
          <div>
            <Label text="Retry ≥" />
            <input className="inp" type="number" min={0} value={retry} onChange={e => setRetry(parseInt(e.target.value || "0"))} />
          </div>
          <div>
            <Label text="Time (min)" />
            <input className="inp" type="number" min={1} value={timeLimit} onChange={e => setTimeLimit(parseInt(e.target.value || "0"))} />
          </div>
        </div>

        {err && <div style={{color:"#991b1b",fontSize:13,marginTop:12,padding:10,background:"#fee2e2",borderRadius:8}}>{err}</div>}

        <div style={{display:"flex",gap:8,marginTop:20,justifyContent:"flex-end"}}>
          <button className="btn btn-s" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-p" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return <div style={{fontSize:13,fontWeight:700,color:"#374151",marginTop:12,marginBottom:6}}>{text}</div>;
}
