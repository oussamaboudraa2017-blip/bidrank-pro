import { notFound } from "next/navigation";

export const metadata = {
  title: "Shared RFP Analysis | BidRank",
  robots: { index: false, follow: false },
};

export default async function SharedReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let data: {
    shareInfo: {
      sharedBy: string;
      company: string | null;
      sharedAt: string;
      expiresAt: string;
      viewCount: number;
    };
    analysis: {
      id: string;
      fileName: string | null;
      executiveSummary: string;
      readinessScore: number;
      contractValue: string | null;
      submissionDeadline: string | null;
      agency: string | null;
      naicsCode: string | null;
      setAsideType: string | null;
      complianceChecklist: Array<{
        item: string;
        status: string;
      }>;
      risks: Array<{
        level: string;
        title: string;
        description: string;
      }>;
      recommendations: string[];
      createdAt: string;
    };
  };

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bidrank.pro";
    const res = await fetch(`${baseUrl}/api/shared-report/view/${token}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      notFound();
    }

    data = await res.json();
  } catch {
    notFound();
  }

  const { shareInfo, analysis } = data;
  const score = analysis.readinessScore;
  const scoreColor =
    score >= 80
      ? "text-green-600"
      : score >= 60
        ? "text-yellow-600"
        : "text-red-600";

  const expiresDate = new Date(shareInfo.expiresAt);
  const isExpired = new Date() > expiresDate;

  if (isExpired) {
    return (
      <div className="min-h-screen bg-br-light flex items-center justify-center px-4">
        <div className="bg-br-surface border-br-border rounded-xl shadow-br-sm p-8 max-w-md text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-br-error/10 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-br-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="font-heading text-xl font-bold text-br-dark mb-2">
            Link Expired
          </h1>
          <p className="text-sm text-br-text-secondary">
            This shared report link expired on{" "}
            {expiresDate.toLocaleDateString()}. Shared links are valid for 30
            days.
          </p>
          <a
            href="https://www.bidrank.pro"
            className="inline-block mt-6 text-sm text-br-primary font-semibold hover:underline"
          >
            Try BidRank Free →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-br-light">
      {/* Header */}
      <header className="bg-br-primary text-white">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold">Shared RFP Analysis</h1>
              <p className="mt-1 text-br-light/80 text-sm">
                Shared by {shareInfo.sharedBy}
                {shareInfo.company && ` at ${shareInfo.company}`}
              </p>
            </div>
            <div className="text-right text-xs text-br-light/60">
              <p>
                View {shareInfo.viewCount} of unlimited
              </p>
              <p>Expires {expiresDate.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* View-only banner */}
        <div className="bg-br-surface border-br-border rounded-lg p-3 flex items-center gap-2 text-sm text-br-text-secondary">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span>
            This is a read-only shared report. No download or edit access.
          </span>
        </div>

        {/* File info bar */}
        <div className="bg-br-surface border-br-border rounded-xl p-4 flex flex-wrap gap-4 text-sm">
          {analysis.fileName && (
            <div>
              <span className="text-br-text-secondary">File: </span>
              <span className="font-medium">{analysis.fileName}</span>
            </div>
          )}
          {analysis.agency && (
            <div>
              <span className="text-br-text-secondary">Agency: </span>
              <span className="font-medium">{analysis.agency}</span>
            </div>
          )}
          {analysis.contractValue && (
            <div>
              <span className="text-br-text-secondary">Value: </span>
              <span className="font-medium">{analysis.contractValue}</span>
            </div>
          )}
          {analysis.submissionDeadline && (
            <div>
              <span className="text-br-text-secondary">Deadline: </span>
              <span className="font-medium">
                {analysis.submissionDeadline}
              </span>
            </div>
          )}
        </div>

        {/* Score card */}
        <div className="bg-br-surface border-br-border rounded-xl p-6">
          <h2 className="font-heading text-lg font-bold text-br-dark mb-4">
            Bid Readiness Score
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={
                    score >= 70
                      ? "#38A169"
                      : score >= 40
                        ? "#D69E2E"
                        : "#E53E3E"
                  }
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 327} 327`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${scoreColor}`}>
                  {score}
                </span>
                <span className="text-xs text-br-text-secondary">/ 100</span>
              </div>
            </div>
            <div>
              <p
                className={`text-lg font-semibold ${scoreColor}`}
              >
                {score >= 70
                  ? "Ready to Pursue"
                  : score >= 40
                    ? "Needs Work"
                    : "Not Ready"}
              </p>
              <p className="text-xs text-br-text-secondary mt-1">
                Analyzed on{" "}
                {new Date(analysis.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-br-surface border-br-border rounded-xl p-6">
          <h2 className="font-heading text-lg font-bold text-br-dark mb-3">
            Executive Summary
          </h2>
          <p className="text-sm text-br-dark leading-relaxed">
            {analysis.executiveSummary}
          </p>
        </div>

        {/* Compliance Checklist */}
        {analysis.complianceChecklist?.length > 0 && (
          <div className="bg-br-surface border-br-border rounded-xl p-6">
            <h2 className="font-heading text-lg font-bold text-br-dark mb-4">
              Compliance Checklist
            </h2>
            <div className="space-y-2">
              {analysis.complianceChecklist.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm py-1.5 border-b last:border-0"
                >
                  <span
                    className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      item.status === "pass"
                        ? "bg-green-500"
                        : item.status === "warn"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  >
                    {item.status === "pass"
                      ? "✓"
                      : item.status === "warn"
                        ? "!"
                        : "✗"}
                  </span>
                  <span className="text-br-dark">{item.item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risks */}
        {analysis.risks?.length > 0 && (
          <div className="bg-br-surface border-br-border rounded-xl p-6">
            <h2 className="font-heading text-lg font-bold text-br-dark mb-4">
              Key Risks
            </h2>
            <div className="space-y-3">
              {analysis.risks.map((risk, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm border-l-4 pl-3 py-1"
                  style={{
                    borderColor:
                      risk.level === "High"
                        ? "#dc2626"
                        : risk.level === "Medium"
                          ? "#d97706"
                          : "#16a34a",
                  }}
                >
                  <div>
                    <span className="font-semibold text-br-dark">
                      [{risk.level}] {risk.title}
                    </span>
                    <p className="text-br-text-secondary mt-0.5">
                      {risk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations?.length > 0 && (
          <div className="bg-br-surface border-br-border rounded-xl p-6">
            <h2 className="font-heading text-lg font-bold text-br-dark mb-3">
              Recommendations
            </h2>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="shrink-0 w-5 h-5 rounded bg-br-primary/10 text-br-primary flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-br-dark">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA footer */}
        <div className="bg-br-primary text-white rounded-xl shadow-br-sm p-6 text-center">
          <h3 className="font-heading text-lg font-bold mb-2">
            Analyze Your Next RFP in Minutes
          </h3>
          <p className="text-br-light/80 text-sm mb-4">
            Get AI-powered compliance checks, risk analysis, and bid
            recommendations instantly.
          </p>
          <a
            href="https://www.bidrank.pro/free-tool"
            className="inline-block bg-br-accent text-br-dark font-semibold px-6 py-2.5 rounded-lg hover:bg-br-accent/90 transition-colors text-sm"
          >
            Try BidRank Free
          </a>
        </div>
      </div>
    </div>
  );
}