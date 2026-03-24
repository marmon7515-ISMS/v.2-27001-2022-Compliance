// app/dashboard/page.tsx

import Link from "next/link";
import { DocumentStatus } from "@prisma/client";
import { requireSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import { EMPTY_PROFILE } from "@/lib/profile-input";
import { score } from "@/lib/rules";
import {
  translateControlStatus,
  translateDocumentCategory,
  translateDocumentName,
  translateDocumentStatus,
  translateGenericLabel,
  translateRiskLevel,
  translateRiskStatus,
} from "@/lib/document-translations";
import {
  Badge,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import LogoutButton from "@/components/logout-button";
import ProfileForm from "@/components/profile-form";
import UploadForm from "@/components/upload-form";
import ControlEditor from "@/components/control-editor";

function statusBadgeClass(status: string) {
  const normalized = status.toUpperCase();

  if (
    normalized.includes("APPROVED") ||
    normalized.includes("IMPLEMENTED") ||
    normalized.includes("CLOSED")
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    normalized.includes("DRAFT") ||
    normalized.includes("PLANNED") ||
    normalized.includes("OPEN") ||
    normalized.includes("IN_PROGRESS")
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (
    normalized.includes("REJECTED") ||
    normalized.includes("NOT_APPLICABLE") ||
    normalized.includes("NOT_REQUIRED")
  ) {
    return "border-slate-200 bg-slate-100 text-slate-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <Card>
      <CardBody className="space-y-2">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </CardBody>
    </Card>
  );
}

function SectionList({
  items,
  emptyText,
}: {
  items: React.ReactNode[];
  emptyText: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
        {emptyText}
      </div>
    );
  }

  return <div className="space-y-3">{items}</div>;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const session = await requireSession();
  const params = await searchParams;
  const data = await getDashboardData(session, params.companyId);

  if (!data.selectedCompany) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card>
            <CardBody className="py-10 text-center text-slate-600">
              Nessun cliente disponibile.
            </CardBody>
          </Card>
        </div>
      </main>
    );
  }

  const company = data.selectedCompany;
  const profile = company.profile ?? EMPTY_PROFILE;

  const suggestedDocuments = company.documents.filter((item) => item.required);
  const excludedDocuments = company.documents.filter((item) => !item.required);

  const applicableControls = company.controls.filter((item) => item.applicable);
  const excludedControls = company.controls.filter((item) => !item.applicable);

  const approvedDocuments = company.documents.filter(
    (item) => item.status === DocumentStatus.APPROVED,
  ).length;

  const openRisks = company.risks.filter((item) => item.status !== "CLOSED").length;
  const criticalRisks = company.risks.filter(
    (item) => score(item.likelihood, item.impact) >= 15,
  ).length;

  const uploadedFiles = company.uploads ?? [];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl bg-slate-950 px-6 py-6 text-white shadow-sm sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Badge className="border-white/10 bg-white/10 text-white">
                Workspace protetto
              </Badge>

              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">Compliance OS</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300">
                  Dashboard ISO/IEC 27001:2022 per profiling cliente, baseline controlli,
                  documenti, rischi, upload ed export operativi.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Utente</p>
                <p className="mt-1 text-sm font-medium text-white">{session.username}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Ruolo</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {translateGenericLabel(session.role)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Cliente attivo
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">{company.name}</p>
                  </div>
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            subtitle={`${company.controlSummary.applicable} applicabili · ${company.controlSummary.implemented} implementati`}
            title="Controlli"
            value={String(company.controlSummary.total)}
          />
          <StatCard
            subtitle={`${suggestedDocuments.length} richiesti · ${approvedDocuments} approvati`}
            title="Documenti"
            value={String(company.documentSummary.total)}
          />
          <StatCard
            subtitle={`${openRisks} aperti · ${criticalRisks} critici`}
            title="Rischi"
            value={String(company.riskSummary.total)}
          />
          <StatCard
            subtitle={`${uploadedFiles.length} file archiviati`}
            title="Upload"
            value={String(uploadedFiles.length)}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Clienti</CardTitle>
              <CardDescription>Seleziona il tenant su cui lavorare.</CardDescription>
            </CardHeader>
            <CardBody className="space-y-2">
              {data.companies.map((item) => {
                const active = item.id === company.id;

                return (
                  <Link
                    key={item.id}
                    className={[
                      "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition",
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                    href={`/dashboard?companyId=${item.id}`}
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs opacity-80">{active ? "Attivo" : "Apri"}</span>
                  </Link>
                );
              })}
            </CardBody>
          </Card>

          <div className="grid gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Checklist cliente</CardTitle>
                  <CardDescription>
                    Aggiorna il profilo e rigenera baseline, SoA, documenti e rischi.
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  <ProfileForm companyId={company.id} initialProfile={profile} />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload e analisi documenti</CardTitle>
                  <CardDescription>
                    Carica file del cliente e aggiorna il profiling con segnali dal contenuto.
                  </CardDescription>
                </CardHeader>
                <CardBody className="space-y-4">
                  <UploadForm companyId={company.id} />

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-900">Ultimi file caricati</h4>
                    <SectionList
                      emptyText="Nessun file caricato per questo cliente."
                      items={uploadedFiles.map((upload) => (
                        <div
                          key={upload.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-slate-900">{upload.name}</p>
                              <p className="text-xs text-slate-500">
                                {upload.mimeType} · {upload.sizeBytes} byte
                              </p>
                            </div>
                            <Badge>Caricato</Badge>
                          </div>

                          {upload.analysisNotes ? (
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                              {upload.analysisNotes}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Documenti da generare</CardTitle>
                  <CardDescription>
                    Derivati dalla baseline generale e dal profilo cliente.
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  <SectionList
                    emptyText="Nessun documento richiesto per il profilo attuale."
                    items={suggestedDocuments.map((document) => (
                      <div
                        key={document.id}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {translateDocumentName(document.name)}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                              {translateDocumentCategory(document.category)}
                            </p>
                          </div>
                          <Badge className={statusBadgeClass(document.status)}>
                            {translateDocumentStatus(document.status)}
                          </Badge>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{document.reason}</p>
                      </div>
                    ))}
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documenti non richiesti</CardTitle>
                  <CardDescription>
                    Esclusi in base al profilo attuale del cliente.
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  <SectionList
                    emptyText="Nessun documento escluso."
                    items={excludedDocuments.map((document) => (
                      <div
                        key={document.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {translateDocumentName(document.name)}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                              {translateDocumentCategory(document.category)}
                            </p>
                          </div>
                          <Badge className={statusBadgeClass(document.status)}>
                            {translateDocumentStatus(document.status)}
                          </Badge>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{document.reason}</p>
                      </div>
                    ))}
                  />
                </CardBody>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>SoA applicabile</CardTitle>
                  <CardDescription>Controlli richiesti per questo cliente.</CardDescription>
                </CardHeader>
                <CardBody>
                  <SectionList
                    emptyText="Nessun controllo applicabile disponibile."
                    items={applicableControls.map((control) => (
                      <div
                        key={control.id}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {control.baselineControl.code} · {control.baselineControl.title}
                            </p>
                          </div>
                          <Badge className={statusBadgeClass(control.status)}>
                            {translateControlStatus(control.status)}
                          </Badge>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {control.justification}
                        </p>
                      </div>
                    ))}
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SoA non applicabile</CardTitle>
                  <CardDescription>
                    Controlli escludibili con motivazione documentata.
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  <SectionList
                    emptyText="Nessun controllo escluso."
                    items={excludedControls.map((control) => (
                      <div
                        key={control.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {control.baselineControl.code} · {control.baselineControl.title}
                            </p>
                          </div>
                          <Badge className={statusBadgeClass(control.status)}>
                            {translateControlStatus(control.status)}
                          </Badge>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {control.justification}
                        </p>
                      </div>
                    ))}
                  />
                </CardBody>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top rischi</CardTitle>
                  <CardDescription>
                    Prioritizzazione rapida per analisi e trattamento.
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  <SectionList
                    emptyText="Nessun rischio presente per questo cliente."
                    items={company.topRisks.map((risk) => {
                      const inherentScore = score(risk.likelihood, risk.impact);
                      const residualScore = score(
                        risk.residualLikelihood,
                        risk.residualImpact,
                      );

                      return (
                        <div
                          key={risk.id}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{risk.title}</p>
                              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                                Asset: {risk.asset}
                              </p>
                            </div>
                            <Badge className={statusBadgeClass(risk.status)}>
                              {translateRiskLevel(inherentScore)}
                            </Badge>
                          </div>

                          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                            <p>
                              Score inerente:{" "}
                              <span className="font-medium text-slate-900">{inherentScore}</span>
                            </p>
                            <p>
                              Score residuo:{" "}
                              <span className="font-medium text-slate-900">{residualScore}</span>
                            </p>
                            <p className="sm:col-span-2">
                              Stato:{" "}
                              <span className="font-medium text-slate-900">
                                {translateRiskStatus(risk.status)}
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Editor controllo SoA</CardTitle>
                  <CardDescription>
                    Override manuale auditor su un controllo selezionato.
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  {company.controls.length > 0 ? (
                    <ControlEditor companyId={company.id} control={company.controls[0]} />
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                      Nessun controllo disponibile.
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Export</CardTitle>
                <CardDescription>
                  Genera file DOCX o PDF pronti da condividere.
                </CardDescription>
              </CardHeader>
              <CardBody className="space-y-3">
                <ExportRow
                  companyId={company.id}
                  kind="soa"
                  label="Dichiarazione di applicabilità"
                />
                <ExportRow
                  companyId={company.id}
                  kind="risks"
                  label="Registro dei rischi"
                />
                <ExportRow
                  companyId={company.id}
                  kind="documents"
                  label="Set documentale"
                />
              </CardBody>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

function ExportRow({
  companyId,
  kind,
  label,
}: {
  companyId: string;
  kind: "soa" | "risks" | "documents";
  label: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">Formati disponibili: DOCX e PDF</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
          href={`/api/companies/${companyId}/exports/${kind}?format=docx`}
        >
          DOCX
        </Link>
        <Link
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          href={`/api/companies/${companyId}/exports/${kind}?format=pdf`}
        >
          PDF
        </Link>
      </div>
    </div>
  );
}
