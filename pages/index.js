import { useState, useEffect } from "react";
import Head from "next/head";
import {
  DEFAULT_DATA, GRADE_OPTIONS, GRADE_POINTS,
  computeGPA, computeCGPA, semCredits, overallCredits,
  gradeColor, gpaColor, uid,
} from "../lib/data";

const STORAGE_KEY = "academic_record_v3";

function loadData() {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_DATA;
  } catch { return DEFAULT_DATA; }
}

function CreditStrip({ subjects }) {
  const { total, graded, earned } = semCredits(subjects);
  const pct = total ? Math.round((earned / total) * 100) : 0;
  return (
    <div className="credit-strip">
      <div className="credit-chip">
        <span className="credit-chip-label">Total</span>
        <span className="credit-chip-val total">{total}</span>
      </div>
      <div className="credit-chip">
        <span className="credit-chip-label">Graded</span>
        <span className="credit-chip-val graded">{graded}</span>
      </div>
      <div className="credit-chip">
        <span className="credit-chip-label">Earned</span>
        <span className="credit-chip-val earned">{earned}</span>
      </div>
      <div className="credit-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-label">{pct}% earned</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [semesters, setSemesters] = useState(DEFAULT_DATA);
  const [activeSem, setActiveSem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const d = loadData();
    setSemesters(d);
    setActiveSem(d[0]?.id ?? null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(semesters)); } catch {}
    }
  }, [semesters, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg) => setToast(msg);

  const addSemester = () => {
    const n = semesters.length + 1;
    const newSem = {
      id: uid(), label: `Semester ${n}`, roman: `${n}`,
      subjects: [{ id: uid(), code: "", name: "New Subject", grade: "E", credits: 3 }],
    };
    setSemesters((p) => [...p, newSem]);
    setActiveSem(newSem.id);
    showToast("Semester added");
  };

  const deleteSemester = (semId) => {
    setSemesters((p) => {
      const next = p.filter((s) => s.id !== semId);
      if (activeSem === semId) setActiveSem(next[0]?.id ?? null);
      return next;
    });
    showToast("Semester removed");
  };

  const updateSemLabel = (semId, val) =>
    setSemesters((p) => p.map((s) => s.id === semId ? { ...s, label: val } : s));

  const addSubject = (semId) =>
    setSemesters((p) => p.map((s) =>
      s.id === semId
        ? { ...s, subjects: [...s.subjects, { id: uid(), code: "", name: "", grade: "E", credits: 3 }] }
        : s
    ));

  const deleteSubject = (semId, subjId) =>
    setSemesters((p) => p.map((s) =>
      s.id === semId ? { ...s, subjects: s.subjects.filter((sub) => sub.id !== subjId) } : s
    ));

  const updateSubject = (semId, subjId, field, val) =>
    setSemesters((p) => p.map((s) =>
      s.id === semId
        ? { ...s, subjects: s.subjects.map((sub) => sub.id === subjId ? { ...sub, [field]: val } : sub) }
        : s
    ));

  const resetData = () => {
    if (typeof window !== "undefined" && window.confirm("Reset all data to defaults?")) {
      setSemesters(DEFAULT_DATA);
      setActiveSem(DEFAULT_DATA[0]?.id ?? null);
      showToast("Reset to defaults");
    }
  };

  const cgpa = computeCGPA(semesters);
  const overall = overallCredits(semesters);
  const currentSem = semesters.find((s) => s.id === activeSem);

  return (
    <>
      <Head>
        <title>Academic Record</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>" />
      </Head>

      <header className="site-header">
        <div className="shell header-inner">
          <div className="header-left">
            <h1>Academic<span>.</span>Record</h1>
            <p>B.Tech &nbsp;·&nbsp; Grade Tracker</p>
          </div>
          <div className="header-right">
            <div className="overall-stats">
              <div className="stat-block">
                <div className={`stat-num ${gpaColor(cgpa)}`}>{cgpa ? cgpa.toFixed(2) : "—"}</div>
                <div className="stat-label">CGPA</div>
              </div>
              <div className="stat-divider" />
              <div className="stat-block">
                <div className="stat-num" style={{ color: "var(--accent2)" }}>{overall.total}</div>
                <div className="stat-label">Total Cr</div>
              </div>
              <div className="stat-divider" />
              <div className="stat-block">
                <div className="stat-num" style={{ color: "var(--high)" }}>{overall.earned}</div>
                <div className="stat-label">Earned Cr</div>
              </div>
              <div className="stat-divider" />
              <div className="stat-block">
                <div className="stat-num" style={{ color: "var(--mid)" }}>{overall.graded}</div>
                <div className="stat-label">Graded Cr</div>
              </div>
            </div>
            <button
              className={`btn-edit-mode${editMode ? " active" : ""}`}
              onClick={() => { setEditMode((e) => !e); showToast(editMode ? "View mode" : "Edit mode on"); }}
            >
              {editMode ? "✓ Done" : "✎ Edit"}
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="shell">

          {/* GPA bar chart */}
          <div style={{ marginBottom: 36 }}>
            <p className="section-label">GPA — Semester Trend</p>
            <div className="gpa-chart">
              {semesters.map((sem) => {
                const gpa = computeGPA(sem.subjects);
                const pct = gpa ? (gpa / 10) * 100 : 4;
                const cls = gpaColor(gpa);
                const col = cls === "kpi-high" ? "var(--high)" : cls === "kpi-mid" ? "var(--mid)" : cls === "kpi-low" ? "var(--low)" : "var(--scol)";
                return (
                  <div key={sem.id} className="gpa-bar-wrap" onClick={() => setActiveSem(sem.id)}
                    title={`${sem.label}: GPA ${gpa ?? "—"}`}>
                    <div className="gpa-bar-track">
                      <div className="gpa-bar-fill" style={{ height: `${pct}%`, background: col }} />
                    </div>
                    <span className="bar-sem">{sem.roman}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Semester tabs */}
          <div className="tabs-row">
            {semesters.map((sem) => (
              <button key={sem.id}
                className={`tab-btn${activeSem === sem.id ? " active" : ""}`}
                onClick={() => setActiveSem(sem.id)}>
                {sem.roman}
              </button>
            ))}
          </div>

          {/* Active semester panel */}
          {currentSem && (
            <div className="sem-panel">
              {/* Header */}
              <div className="sem-panel-head">
                <input
                  className="sem-title-input"
                  value={currentSem.label}
                  readOnly={!editMode}
                  onChange={(e) => updateSemLabel(currentSem.id, e.target.value)}
                />
                <div className="sem-head-right">
                  {(() => {
                    const g = computeGPA(currentSem.subjects);
                    return g != null
                      ? <span className={`sem-gpa-display ${gpaColor(g)}`}>{g.toFixed(2)} GPA</span>
                      : <span className="sem-gpa-display" style={{ color: "var(--text3)" }}>— GPA</span>;
                  })()}
                  {editMode && (
                    <button className="btn-del-sem" onClick={() => deleteSemester(currentSem.id)}>
                      ✕ Remove semester
                    </button>
                  )}
                </div>
              </div>

              {/* Credit strip */}
              <CreditStrip subjects={currentSem.subjects} />

              {/* Subject table */}
              <table className="subj-table">
                <thead>
                  <tr>
                    <th className="td-code">Code</th>
                    <th>Subject Name</th>
                    <th className="td-cr">Credits</th>
                    <th className="td-grade">Grade</th>
                    <th className="td-pts">Pts</th>
                    {editMode && <th className="td-action"></th>}
                  </tr>
                </thead>
                <tbody>
                  {currentSem.subjects.map((subj) => {
                    const gp = GRADE_POINTS[subj.grade] ?? 0;
                    const pts = subj.credits ? gp * Number(subj.credits) : "—";
                    return (
                      <tr className="subj-row" key={subj.id}>
                        <td className="td-code">
                          <input className="cell-input code-field" value={subj.code ?? ""} readOnly={!editMode}
                            placeholder={editMode ? "ICT 1001" : "—"}
                            onChange={(e) => updateSubject(currentSem.id, subj.id, "code", e.target.value)} />
                        </td>
                        <td>
                          <input className="cell-input" value={subj.name} readOnly={!editMode}
                            placeholder={editMode ? "Subject name" : ""}
                            onChange={(e) => updateSubject(currentSem.id, subj.id, "name", e.target.value)} />
                        </td>
                        <td className="td-cr">
                          <input className="cell-input credit-field" type="number" min="0" max="20"
                            value={subj.credits ?? ""} readOnly={!editMode}
                            onChange={(e) => updateSubject(currentSem.id, subj.id, "credits", Number(e.target.value))} />
                        </td>
                        <td className="td-grade">
                          {editMode ? (
                            <select className={`grade-select ${gradeColor(subj.grade)}`} value={subj.grade}
                              onChange={(e) => updateSubject(currentSem.id, subj.id, "grade", e.target.value)}
                              style={{ background: "var(--bg4)" }}>
                              {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                            </select>
                          ) : (
                            <span className={`grade-pill ${gradeColor(subj.grade)}`}>{subj.grade}</span>
                          )}
                        </td>
                        <td className="td-pts">
                          <span className="pts-cell">{pts}</span>
                        </td>
                        {editMode && (
                          <td className="td-action">
                            <button className="btn-del-row" onClick={() => deleteSubject(currentSem.id, subj.id)}>×</button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
                {/* Totals row */}
                {(() => {
                  const { total, graded, earned } = semCredits(currentSem.subjects);
                  const totalPts = currentSem.subjects.reduce((a, s) =>
                    a + (s.credits && s.grade !== "S" ? (GRADE_POINTS[s.grade] ?? 0) * Number(s.credits) : 0), 0);
                  return (
                    <tfoot>
                      <tr className="totals-row">
                        <td colSpan={2} className="tot-label">Semester Total</td>
                        <td className="tot-val">{total} cr</td>
                        <td className="tot-label" style={{ fontSize: 9 }}>
                          {earned} earned · {graded} graded
                        </td>
                        <td className="tot-val">{totalPts} pts</td>
                        {editMode && <td />}
                      </tr>
                    </tfoot>
                  );
                })()}
              </table>

              {editMode && (
                <div className="add-row-wrap">
                  <button className="btn-add-row" onClick={() => addSubject(currentSem.id)}>+ Add subject</button>
                </div>
              )}
            </div>
          )}

          {/* Grade legend */}
          <div style={{ marginBottom: 16 }}>
            <p className="section-label">Grade Scale</p>
            <div className="legend">
              {Object.entries(GRADE_POINTS).map(([g, p]) => (
                <span key={g} className={`grade-pill ${gradeColor(g)}`}
                  style={{ width: "auto", padding: "4px 10px", fontSize: 11 }}>
                  {g} = {p}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="bottom-bar">
            {editMode && <button className="btn-add-sem" onClick={addSemester}>+ Add semester</button>}
            <button className="btn-reset" onClick={resetData}>↺ Reset to defaults</button>
          </div>

        </div>
      </main>

      <footer className="site-footer">
        <p>Academic Record · All data saved in your browser</p>
      </footer>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
