"use client";
import { useEffect, useState, useCallback } from "react";
import { listQuestionsForSection, archiveQuestion, restoreQuestion, type DbQuestion } from "../lib/quizApi";

type Props = {
  sectionId: string;
  lang: "uz" | "uz-cyrl" | "ru" | "en";
  onEditQuestion: (q: DbQuestion) => void;
  onAddQuestion: () => void;
  onBack: () => void;
  refreshKey: number;
};

export default function QuestionsList({ sectionId, lang, onEditQuestion, onAddQuestion, onBack, refreshKey }: Props) {
  const [items, setItems] = useState<DbQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await listQuestionsForSection(sectionId, true);
      setItems(rows);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => { load(); }, [load, refreshKey]);

  const text = (q: DbQuestion) =>
    lang === "ru" ? q.text_ru : lang === "en" ? q.text_en : q.text_uz;

  const active = items.filter(q => !q.is_archived);
  const archived = items.filter(q => q.is_archived);

  const handleArchive = async (q: DbQuestion) => {
    if (!confirm("Archive this question?")) return;
    await archiveQuestion(q.id);
    await load();
  };
  const handleRestore = async (q: DbQuestion) => {
    await restoreQuestion(q.id);
    await load();
  };

  if (loading) return <div style={{padding:32,textAlign:"center",color:"#6b7280"}}>Loading…</div>;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <button className="btn btn-s" style={{padding:"6px 12px",fontSize:13}} onClick={onBack}>← Back to sections</button>
        <button className="btn btn-p" style={{padding:"10px 18px",fontSize:14}} onClick={onAddQuestion}>+ New Question</button>
      </div>

      {active.length === 0 && (
        <div style={{padding:24,textAlign:"center",color:"#9ca3af",border:"1.5px dashed #e5e7eb",borderRadius:12,marginBottom:16}}>
          No questions yet. Click &quot;+ New Question&quot; to add one.
        </div>
      )}

      {active.map((q, i) => (
        <div key={q.id} className="card card-p" style={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{flex:"1 1 240px",minWidth:0}}>
            <div style={{fontSize:12,color:"#9ca3af",fontWeight:700}}>#{i + 1}</div>
            <div style={{fontWeight:600,color:"#111827",fontSize:14,marginTop:2}}>{text(q)}</div>
            <div style={{fontSize:12.5,color:"#6b7280",marginTop:4}}>
              {(q.options || []).length} options · correct: #{q.correct_index + 1}
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button className="btn btn-s" style={{padding:"6px 12px",fontSize:12.5}} onClick={() => onEditQuestion(q)}>Edit</button>
            <button className="btn btn-s" style={{padding:"6px 12px",fontSize:12.5,color:"#991b1b",borderColor:"#fee2e2"}} onClick={() => handleArchive(q)}>Archive</button>
          </div>
        </div>
      ))}

      {archived.length > 0 && (
        <div style={{marginTop:20}}>
          <button className="btn btn-s" style={{padding:"6px 12px",fontSize:12.5}} onClick={() => setShowArchived(v => !v)}>
            {showArchived ? "Hide" : "Show"} archived ({archived.length})
          </button>
          {showArchived && archived.map(q => (
            <div key={q.id} className="card card-p" style={{marginTop:10,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:.6,gap:12,flexWrap:"wrap"}}>
              <div>{text(q)}</div>
              <button className="btn btn-s" style={{padding:"6px 12px",fontSize:12.5}} onClick={() => handleRestore(q)}>Restore</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
