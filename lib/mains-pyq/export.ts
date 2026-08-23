/**
 * UPSC Mains Model Answer & Evaluation Booklet Exporter
 * Formats handwritten/typed candidate scripts and AI evaluations into printable UPSC standard dossiers.
 */

import { MainsPYQQuestion, MainsAnswerDraft } from "@/lib/core/types";

export function exportMainsAnswerBooklet(
  question: MainsPYQQuestion,
  draft: MainsAnswerDraft,
  candidateName: string = "Cadet Candidate"
) {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to generate the printable UPSC Answer Booklet.");
    return;
  }

  const evalData = draft.aiEvaluation;
  const wordCount = draft.wordCount || draft.draftText.split(/\s+/).filter(Boolean).length;
  const timeTakenMin = Math.round((draft.timeSpentSeconds || 0) / 60);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UPSC Mains Answer Booklet - ${question.paper} - ${question.id}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      color: #111;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background: #fff;
    }
    .booklet-container {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid #000;
      padding: 24px;
      position: relative;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2px solid #000;
      margin-bottom: 20px;
    }
    .header-table td {
      padding: 6px 10px;
      font-size: 13px;
    }
    .title-center {
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .question-box {
      border: 1.5px solid #222;
      background-color: #fcfcfc;
      padding: 12px 16px;
      margin-bottom: 20px;
      font-size: 14px;
      position: relative;
    }
    .question-meta {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 12px;
      color: #444;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .margins-wrapper {
      position: relative;
      min-height: 480px;
      padding: 0 45px;
      border-left: 1px dashed #999;
      border-right: 1px dashed #999;
      margin: 0 10px;
    }
    .margin-notice-left {
      position: absolute;
      left: -40px;
      top: 180px;
      transform: rotate(-90deg);
      font-size: 10px;
      color: #777;
      letter-spacing: 1px;
      white-space: nowrap;
      text-transform: uppercase;
    }
    .margin-notice-right {
      position: absolute;
      right: -40px;
      top: 180px;
      transform: rotate(90deg);
      font-size: 10px;
      color: #777;
      letter-spacing: 1px;
      white-space: nowrap;
      text-transform: uppercase;
    }
    .answer-body {
      font-size: 14px;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: Georgia, serif;
    }
    .evaluation-section {
      margin-top: 30px;
      border-top: 2px solid #000;
      padding-top: 16px;
      page-break-before: auto;
    }
    .score-badge {
      display: inline-block;
      border: 2px solid #000;
      padding: 4px 12px;
      font-size: 16px;
      font-weight: bold;
      background: #f4f4f4;
    }
    .eval-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
      font-size: 12px;
    }
    .eval-card {
      border: 1px solid #ccc;
      padding: 8px 12px;
      background: #fafafa;
    }
    .tips-list {
      margin: 6px 0;
      padding-left: 18px;
    }
    .footer-watermark {
      text-align: center;
      font-size: 10px;
      color: #888;
      margin-top: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background:#111; color:#fff; padding:12px 24px; text-align:center; font-family:sans-serif;">
    <button onclick="window.print()" style="background:#D8A63A; color:#000; font-weight:bold; border:none; padding:8px 20px; border-radius:6px; cursor:pointer; font-size:14px;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="booklet-container">
    <table class="header-table">
      <tr>
        <td class="title-center" colspan="3">
          UNION PUBLIC SERVICE COMMISSION<br>
          <span style="font-size:13px; font-weight:normal;">CIVIL SERVICES (MAIN) EXAMINATION // ANSWER SCRIPT</span>
        </td>
      </tr>
      <tr>
        <td><strong>Candidate:</strong> ${candidateName}</td>
        <td><strong>Paper:</strong> ${question.paper} (${question.subject})</td>
        <td><strong>Target Year:</strong> 2026</td>
      </tr>
      <tr>
        <td><strong>Words Written:</strong> ${wordCount} / ${question.wordLimit}</td>
        <td><strong>Time Taken:</strong> ${timeTakenMin} mins</td>
        <td><strong>Date:</strong> ${new Date().toLocaleDateString("en-IN")}</td>
      </tr>
    </table>

    <div class="question-box">
      <div class="question-meta">
        <span>Question ${question.id} // ${question.directive || "Examine"}</span>
        <span>Marks: ${question.marks} // Word Limit: ${question.wordLimit}</span>
      </div>
      <div><strong>Q:</strong> ${question.question}</div>
    </div>

    <div class="margins-wrapper">
      <div class="margin-notice-left">Candidates must not write on this margin</div>
      <div class="margin-notice-right">Candidates must not write on this margin</div>

      <div class="answer-body">
${draft.draftText || "(No typed answer provided for this script.)"}
      </div>
    </div>

    ${
      evalData
        ? `
    <div class="evaluation-section">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0; text-transform:uppercase; font-size:14px;">AI Evaluator & Examiner Marks Assessment</h3>
        <div class="score-badge">
          Score: ${evalData.score} / ${evalData.maxMarks || question.marks}
        </div>
      </div>

      <div class="eval-grid">
        <div class="eval-card">
          <strong>Introduction Analysis:</strong>
          <p style="margin:4px 0 0 0;">${evalData.introFeedback || "Structured and clear opening."}</p>
        </div>
        <div class="eval-card">
          <strong>Conclusion & Way Forward:</strong>
          <p style="margin:4px 0 0 0;">${evalData.conclusionFeedback || "Forward-looking synthesis."}</p>
        </div>
      </div>

      <div class="eval-card" style="margin-top:10px;">
        <strong>Examiner Value-Addition Guidelines:</strong>
        <ul class="tips-list">
          ${(evalData.valueAdditionTips || [])
            .map((tip: string) => `<li>${tip}</li>`)
            .join("")}
        </ul>
      </div>
    </div>
    `
        : ""
    }

    <div class="footer-watermark">
      Generated by WHYNOTUPSC Civil Services Operating System // Strategic Aspirant Intelligence
    </div>
  </div>

  <script>
    window.onload = function() {
      // Auto-trigger print dialog for instant PDF generation
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
