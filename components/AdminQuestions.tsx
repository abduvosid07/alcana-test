"use client";
import { useEffect, useState, useCallback } from "react";
import {
  listSections,
  archiveSection,
  restoreSection,
  type DbSection,
} from "../lib/quizApi";

type Props = {
  lang: "uz" | "uz-cyrl" | "ru" | "en";
  onEditSection: (s: DbSection | null) => void;
  onAddQuestion: (sectionId: string) => void;
  onManageQuestions: (sectionId: string) => void;
  refreshKey: number;
};

export default function AdminQuestions({ lang, onEditSection, onAddQuestion, onManageQuestions, refreshKey }: Props) {
  const [sections, setSections] = useState<DbSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await listSections(true);
      setSections(rows);
    } catch (e) {
      console.error(e);
      alert("Failed to load sections");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const title = (s: DbSection) =>
    lang === "ru" ? s.title_ru : lang === "en" ? s.title_en : s.title_uz;

  const active = sections.filter(s => !s.is_archived);
  const archived = sections.filter(s => s.is_archived);

  const handleArchive = async (s: DbSection) => {
    if (!confirm(`Archive "${title(s)}"? Employees will no longer see it.`)) return;
    await archiveSection(s.id);
    await load();
  };
  const handleRestore = async (s: DbSection) => {
    await restoreSection(s.id);
    await load();
  };

  if (loading) return <div style={{padding:32,textAlign:"center",color:"#6b7280"}}>Loading…</div>;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h3 style={{fontSize:18,fontWeight:800,color:"#111827"}}>Sections</h3>
        <button className="btn btn-p" style={{padding:"10px 18px",fontSize:14}} onClick={() => onEditSection(null)}>
          + New Section
        </button>
      </div>

      {active.length === 0 && (
        <div style={{padding:24,textAlign:"center",color:"#9ca3af",border:"1.5px dashed #e5e7eb",borderRadius:12,marginBottom:16}}>
          No sections yet. Click &quot;+ New Section&quot; to create one.
        </div>
      )}

      {active.map(s => (
        <div key={s.id} className="card card-p" style={{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{flex:"1 1 240px",minWidth:0}}>
            <div style={{fontWeight:800,color:"#111827",fontSize:15}}>{title(s)}</div>
            <div style={{fontSize:12.5,color:"#6b7280",marginTop:4}}>
              Pass ≥ {s.pass_threshold} · Retry ≥ {s.retry_threshold} · {s.time_limit_minutes} min
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <button className="btn btn-s" style={{padding:"6px 12px",fontSize:12.5}} onClick={() => onEditSection(s)}>Edit</button>
            <button className="btn btn-s" style={{padding:"6px 12px",fontSize:12.5}} onClick={() => onManageQuestions(s.id)}>Questions</button>
            <button className="btn btn-s" style={{padding:"6px 12px",fontSize:12.5}} onClick={() => onAddQuestion(s.id)}>+ Question</button>
            <button className="btn btn-s" style={{padding:"6px 12px",fontSize:12.5,color:"#991b1b",borderColor:"#fee2e2"}} onClick={() => handleArchive(s)}>Archive</button>
          </div>
        </div>
      ))}

      {archived.length > 0 && (
        <div style={{marginTop:24}}>
          <button className="btn btn-s" style={{padding:"6px 12px",fontSize:12.5}} onClick={() => setShowArchived(v => !v)}>
            {showArchived ? "Hide" : "Show"} archived ({archived.length})
          </button>
          {showArchived && archived.map(s => (
            <div key={s.id} className="card card-p" style={{marginTop:12,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:.6,gap:12,flexWrap:"wrap"}}>
              <div>
                <div style={{fontWeight:700,color:"#374151",fontSize:14}}>{title(s)}</div>
                <div style={{fontSize:12,color:"#9ca3af"}}>Archived</div>
              </div>
              <button className="btn btn-s" style={{padding:"6px 12px",fontSize:12.5}} onClick={() => handleRestore(s)}>Restore</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
