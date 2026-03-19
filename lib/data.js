export const GRADE_POINTS = { "A+": 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0, S: 0 };
export const GRADE_OPTIONS = ["A+", "A", "B", "C", "D", "E", "F", "S"];

export function computeGPA(subjects) {
  const counted = subjects.filter((s) => s.credits && s.grade !== "S");
  const totalPts = counted.reduce((a, s) => a + (GRADE_POINTS[s.grade] ?? 0) * Number(s.credits), 0);
  const totalCr = counted.reduce((a, s) => a + Number(s.credits), 0);
  return totalCr ? +(totalPts / totalCr).toFixed(2) : null;
}

export function computeCGPA(semesters) {
  return computeGPA(semesters.flatMap((s) => s.subjects));
}

export function semCredits(subjects) {
  const total = subjects.reduce((a, s) => a + (Number(s.credits) || 0), 0);
  const graded = subjects.filter((s) => s.credits && s.grade !== "S" && s.grade !== "F")
    .reduce((a, s) => a + Number(s.credits), 0);
  const earned = subjects.filter((s) => s.credits && s.grade !== "F")
    .reduce((a, s) => a + Number(s.credits), 0);
  return { total, graded, earned };
}

export function overallCredits(semesters) {
  const all = semesters.flatMap((s) => s.subjects);
  return semCredits(all);
}

export function gradeColor(grade) {
  if (grade === "A+" || grade === "A") return "grade-high";
  if (grade === "B" || grade === "C") return "grade-mid";
  if (grade === "D" || grade === "E") return "grade-low";
  if (grade === "F") return "grade-fail";
  return "grade-s";
}

export function gpaColor(gpa) {
  if (!gpa) return "";
  if (gpa >= 7) return "kpi-high";
  if (gpa >= 6) return "kpi-mid";
  return "kpi-low";
}

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function ms(label, roman, subs) {
  return { id: uid(), label, roman, subjects: subs.map((s) => ({ ...s, id: uid() })) };
}

export const DEFAULT_DATA = [
  ms("Semester I", "I", [
    { code: "BIO 1071", name: "Biology for Engineers", grade: "E", credits: 3 },
    { code: "CHM 1071", name: "Engineering Chemistry", grade: "D", credits: 3 },
    { code: "CHM 1081", name: "Engineering Chemistry Lab", grade: "B", credits: 1 },
    { code: "CIE 1072", name: "Environmental Studies", grade: "E", credits: 2 },
    { code: "CSE 1071", name: "Problem Solving Using Computers", grade: "E", credits: 3 },
    { code: "CSE 1081", name: "Problem Solving Using Computers Lab", grade: "E", credits: 1 },
    { code: "ELE 1071", name: "Basic Electrical Technology", grade: "E", credits: 3 },
    { code: "HUM 1072", name: "Human Rights and Constitution", grade: "S", credits: 1 },
    { code: "MAT 1171", name: "Engineering Mathematics - I", grade: "D", credits: 4 },
    { code: "MIE 1181", name: "Engineering Graphics - I", grade: "B", credits: 1 },
  ]),
  ms("Semester II", "II", [
    { code: "CIE 1071", name: "Mechanics of Solids", grade: "D", credits: 3 },
    { code: "ECE 1071", name: "Basic Electronics", grade: "E", credits: 3 },
    { code: "HUM 1071", name: "Communication Skills in English", grade: "D", credits: 2 },
    { code: "IPE 1071", name: "Universal Human Values & Professional Ethics", grade: "S", credits: 1 },
    { code: "MAT 1271", name: "Engineering Mathematics - II", grade: "D", credits: 4 },
    { code: "MIE 1071", name: "Basic Mechanical Engineering", grade: "E", credits: 3 },
    { code: "MIE 1081", name: "Workshop Practice", grade: "A", credits: 1 },
    { code: "MIE 1281", name: "Engineering Graphics - II", grade: "C", credits: 1 },
    { code: "PHY 1071", name: "Engineering Physics", grade: "C", credits: 3 },
    { code: "PHY 1081", name: "Engineering Physics Lab", grade: "D", credits: 1 },
  ]),
  ms("Semester III", "III", [
    { code: "ICT 2121", name: "Data Structures", grade: "C", credits: 4 },
    { code: "ICT 2122", name: "Object Oriented Programming", grade: "A", credits: 4 },
    { code: "ICT 2123", name: "Digital Systems & Computer Organization", grade: "E", credits: 4 },
    { code: "ICT 2124", name: "Principles of Data Communication", grade: "E", credits: 3 },
    { code: "ICT 2141", name: "Data Structures Lab", grade: "E", credits: 1 },
    { code: "ICT 2142", name: "Object Oriented Programming Lab", grade: "D", credits: 1 },
    { code: "ICT 2143", name: "Digital Systems Lab", grade: "E", credits: 1 },
    { code: "MAT 2126", name: "Engineering Mathematics - III", grade: "E", credits: 3 },
  ]),
  ms("Semester IV", "IV", [
    { code: "ICT 2221", name: "Database Systems", grade: "D", credits: 4 },
    { code: "ICT 2222", name: "Design & Analysis of Algorithms", grade: "E", credits: 4 },
    { code: "ICT 2223", name: "Embedded Systems", grade: "E", credits: 4 },
    { code: "ICT 2224", name: "Computer Networks", grade: "E", credits: 4 },
    { code: "ICT 2241", name: "Database Systems Lab", grade: "D", credits: 1 },
    { code: "ICT 2242", name: "Embedded Systems Lab", grade: "E", credits: 1 },
    { code: "ICT 2243", name: "Network Programming & Simulation Lab", grade: "E", credits: 1 },
    { code: "MAT 2226", name: "Engineering Mathematics - IV", grade: "E", credits: 3 },
  ]),
  ms("Semester V", "V", [
    { code: "HUM 3022", name: "Essentials of Management", grade: "B", credits: 3 },
    { code: "ICT 3121", name: "Information Security", grade: "B", credits: 3 },
    { code: "ICT 3122", name: "Principles of Operating Systems", grade: "A", credits: 4 },
    { code: "ICT 3123", name: "Software Engineering", grade: "D", credits: 3 },
    { code: "ICT 3131", name: "Web Technologies", grade: "C", credits: 3 },
    { code: "ICT 3141", name: "Information Security Lab", grade: "D", credits: 1 },
    { code: "ICT 3142", name: "Principles of Operating Systems Lab", grade: "E", credits: 1 },
    { code: "IPE 4302", name: "Open Elective - Creativity, Problem Solving & Innovation", grade: "S", credits: 3 },
  ]),
  ms("Semester VI", "VI", [
    { code: "HUM 3021", name: "Engineering Economics & Financial Management", grade: "D", credits: 3 },
    { code: "ICT 3230", name: "Full Stack Development", grade: "E", credits: 3 },
    { code: "ICT 3221", name: "Data Mining", grade: "E", credits: 4 },
    { code: "ICT 4401", name: "Artificial Intelligence", grade: "D", credits: 3 },
    { code: "ICT 4414", name: "Machine Learning", grade: "D", credits: 3 },
    { code: "ICT 3241", name: "Advanced Technology Lab", grade: "D", credits: 1 },
    { code: "ICT 3242", name: "Data Mining Lab", grade: "E", credits: 1 },
    { code: "ELE 4311", name: "MATLAB for Engineers", grade: "S", credits: 3 },
  ]),
  ms("Semester VII", "VII", [
    { code: "", name: "PE-3 / Minor Specialization", grade: "D", credits: 3 },
    { code: "", name: "PE-4 / Minor Specialization", grade: "D", credits: 3 },
    { code: "", name: "PE-5", grade: "D", credits: 3 },
    { code: "", name: "PE-6", grade: "E", credits: 3 },
    { code: "", name: "PE-7", grade: "D", credits: 3 },
    { code: "", name: "OE-2", grade: "S", credits: 3 },
    { code: "", name: "Mini Project (Minor Specialization)", grade: "C", credits: 8 },
  ]),
  ms("Semester VIII", "VIII", [
    { code: "ELE 4291", name: "Industrial Training (MLC)", grade: "S", credits: 1 },
    { code: "ELE 4292", name: "Project Work", grade: "F", credits: 10 },
  ]),
];
