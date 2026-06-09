"use client";
import { useState, useEffect } from "react";
import { createQuestion, updateQuestion, type DbQuestion } from "../lib/quizApi";

type OptionDraft = { text_uz: string; text_ru: string; text_en: string };

type Props = {
  sectionId: string;
  question: DbQuestion | null;
  defaultSortOrder?: number;
  onClose: () => void;
  onSaved: () => void;
};

export default function QuestionFormModal({ sectionId, question, defaultSortOrder = 0, onClose, onSaved }: Props) {
  const [textUz, setTextUz] = useState("");
  const [textRu, setTextRu] = useState("");
  const [textEn, setTextEn] = useState("");
  const [opts, setOpts] = useState<OptionDraft[]>([
    { text_uz: "", text_ru: "", text_en: "" },
    { text_uz: "", text_ru: "", text_en: "" },
  ]);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (question) {
      setTextUz(question.text_uz);
      setTextRu(question.text_ru);
      setTextEn(question.text_en);
      setCorrectIdx(question.correct_index);
      setOpts(
        (question.options || []).map(o => ({
          text_uz: o.text_uz, text_ru: o.text_ru, text_en: o.text_en,
        }))
      );
    }
  }, [question]);

  const addOption = () => {
    if (opts.length >= 6) return;
    setOpts([...opts, { text_uz: "", text_ru: "", text_en: "" }]);
  };
  const removeOption = (i: number) => {
    if (opts.length <= 2) return;
    const next = opts.filter((_, idx) => idx !== i);
    setOpts(next);
    if (correctIdx >= next.length) setCorrectIdx(0);
  };
  const updateOpt = (i: number, field: keyof OptionDraft, val: string) => {
    setOpts(opts.map((o, idx) => idx === i ? { ...o, [field]: val } : o));
  };

  const save = async () => {
    setErr("");
    if (!textUz.trim() || !textRu.trim() || !textEn.trim()) {
      setErr("Question text is required in all 3 languages.");
      return;
    }
    for (let i = 0; i < opts.length; i++) {
      const o = opts[i];
      if (!o.text_uz.trim() || !o.text_ru.trim() || !o.text_en.trim()) {
        setErr(`Option ${i + 1}: all 3 language fields are required.`);
        return;
      }
    }
    if (correctIdx < 0 || correctIdx >= opts.length) {
      setErr("Pick a correct answer.");
      return;
    }
    setSaving(true);
    try {
      if (question) {
        await updateQuestion(question.id, {
          text_uz: textUz, text_ru: textRu, text_en: textEn,
          correct_index: correctIdx,
          options: opts,
        });
      } else {
        await createQuestion({
          section_id: sectionId,
          text_uz: textUz, text_ru: textRu, text_en: textEn,
          correct_index: correctIdx,
          sort_order: defaultSortOrder,
          options: opts,
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
      <div className="card" style={{maxWidth:720,width:"100%",maxHeight:"90vh",overflowY:"auto",padding:24}}>
        <h3 style={{fontSize:18,fontWeight:800,color:"#111827",marginBottom:16}}>
          {question ? "Edit Question" : "New Question"}
        </h3>

        <Label text="Question (Uzbek)" />
        <textarea className="inp" rows={2} value={textUz} onChange={e => setTextUz(e.target.value)} placeholder="Savol matni" />

        <Label text="Question (Russian)" />
        <textarea className="inp" rows={2} value={textRu} onChange={e => setTextRu(e.target.value)} placeholder="Текст вопроса" />

        <Label text="Question (English)" />
        <textarea className="inp" rows={2} value={textEn} onChange={e => setTextEn(e.target.value)} placeholder="Question text" />

        <div style={{marginTop:20,padding:12,background:"#f9fafb",borderRadius:10,border:"1px solid #e5e7eb"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:14,fontWeight:700,color:"#111827"}}>Options ({opts.length}/6)</div>
            <button className="btn btn-s" style={{padding:"6px 12px",fontSize:12.5}} onClick={addOption} disabled={opts.length >= 6}>+ Add</button>
          </div>

          {opts.map((o, i) => (
            <div key={i} style={{padding:10,background:"#fff",borderRadius:8,border:"1px solid #e5e7eb",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:600,color:correctIdx === i ? "#16a34a" : "#374151"}}>
                  <input type="radio" name="correct" checked={correctIdx === i} onChange={() => setCorrectIdx(i)} />
                  Option {i + 1} {correctIdx === i && "✓ correct"}
                </label>
                <div style={{flex:1}}/>
                <button className="btn btn-s" style={{padding:"4px 10px",fontSize:12,color:"#991b1b",borderColor:"#fee2e2"}} onClick={() => removeOption(i)} disabled={opts.length <= 2}>Remove</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr",gap:6}}>
                <input className="inp" style={{padding:"8px 12px",fontSize:13}} placeholder="Uzbek" value={o.text_uz} onChange={e => updateOpt(i, "text_uz", e.target.value)} />
                <input className="inp" style={{padding:"8px 12px",fontSize:13}} placeholder="Russian" value={o.text_ru} onChange={e => updateOpt(i, "text_ru", e.target.value)} />
                <input className="inp" style={{padding:"8px 12px",fontSize:13}} placeholder="English" value={o.text_en} onChange={e => updateOpt(i, "text_en", e.target.value)} />
              </div>
            </div>
          ))}
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
