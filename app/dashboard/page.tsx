// app/dashboard/page.tsx
import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import {
  Badge,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui";
import LogoutButton from "@/components/logout-button";
import ProfileForm from "@/components/profile-form";
import UploadForm from "@/components/upload-form";
import { score } from "@/lib/rules";
import { EMPTY_PROFILE } from "@/lib/profile-defaults";

function StatCard({
  title,
  value,
  subtitle
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <Card>
      <CardBody>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
        <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
      </CardBody>
    </Card>
  );
}

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const session = await requireSession();
  const params = await searchParams;
  const data = await getDashboardData(session, params.companyId);

  if (!data.selectedCompany) {
    return <main className="p-6">Nessun cliente disponibile.</main>;
  }

  const company = data.selectedCompany;
  const suggestedDocuments = company.documents.filter((item) => item.required);
  const excludedDocuments = company.documents.filter((item) => !item.required);
  const applicableControls = company.controls.filter((item) => item.applicable);
  const excludedControls = company.controls.filter((item) => !item.applicable);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <Card>
        <CardBody>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                Workspace protetto
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                Compliance OS
              </h1>

              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                Login protetto, multi-tenant, profiling cliente, motore regole,
                upload documenti e export DOCX/PDF.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-100 p-4 text-center">
                  <div className="text-sm text-slate-500">Controlli</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {applicableControls.length}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-100 p-4 text-center">
                  <div className="text-sm text-slate-500">Documenti</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {suggestedDocuments.length}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-100 p-4 text-center">
                  <div className="text-sm text-slate-500">Rischi</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {company.risks.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:min-w-[320px]">
              <div className="mb-4">
                <div className="text-xs text-slate-500">Utente</div>
                <div className="text-lg font-semibold text-slate-900">
                  {session.username}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-slate-500">Ruolo</div>
                <div className="text-sm font-medium text-slate-700">
                  {session.role}
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-2 text-xs text-slate-500">Clienti</div>
                <div className="flex flex-wrap gap-2">
                  {data.companies.map((item) => (
                    <Link
                      key={item.id}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        item.id === company.id
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                      href={`/dashboard?companyId=${item.id}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-3">
                <LogoutButton />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Clienti"
          value={String(data.companies.length)}
          subtitle="tenant accessibili"
        />
        <StatCard
          title="Controlli applicabili"
          value={String(company.controlSummary.applicable)}
          subtitle={company.name}
        />
        <StatCard
          title="Documenti richiesti"
          value={String(company.documentSummary.required)}
          subtitle="da generare o completare"
        />
        <StatCard
          title="Rischi aperti"
          value={String(company.riskSummary.open)}
          subtitle="risk register"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Checklist cliente</CardTitle>
            <CardDescription>
              Aggiorna il profilo e rigenera baseline, SoA, documenti e rischi.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <ProfileForm
              companyId={company.id}
              profile={company.profile ?? EMPTY_PROFILE}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload e analisi documenti</CardTitle>
            <CardDescription>
              Carica file cliente e aggiorna il profiling con segnali ricavati
              dal contenuto.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <UploadForm companyId={company.id} />
            <div className="mt-4 grid gap-2">
              {(company.uploads ?? []).map((upload) => (
                <div key={upload.id} className="rounded-xl border p-3 text-sm">
                  <div className="font-medium">{upload.name}</div>
                  <div className="text-slate-500">
                    {upload.mimeType} · {upload.sizeBytes} bytes
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {upload.analysisNotes}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Documenti da generare</CardTitle>
            <CardDescription>
              Derivati dalla baseline generale e dal profilo cliente
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="grid gap-3">
              {suggestedDocuments.map((document) => (
                <div key={document.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <strong>{document.name}</strong>
                    <Badge>{document.status}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {document.category}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {document.reason}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documenti non richiesti</CardTitle>
            <CardDescription>
              Esclusi in base al profilo attuale
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="grid gap-3">
              {excludedDocuments.length === 0 ? (
                <div className="rounded-xl border p-3 text-sm">
                  Nessun documento escluso.
                </div>
              ) : (
                excludedDocuments.map((document) => (
                  <div key={document.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <strong>{document.name}</strong>
                      <Badge>{document.status}</Badge>
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {document.category}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {document.reason}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SoA applicabile</CardTitle>
            <CardDescription>
              Controlli richiesti per questo cliente
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="grid gap-3">
              {applicableControls.slice(0, 20).map((control) => (
                <div key={control.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <strong>
                      {control.baselineControl.code} ·{" "}
                      {control.baselineControl.title}
                    </strong>
                    <Badge>{control.status}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {control.justification}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SoA non applicabile</CardTitle>
            <CardDescription>
              Controlli escludibili con motivazione
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="grid gap-3">
              {excludedControls.length === 0 ? (
                <div className="rounded-xl border p-3 text-sm">
                  Nessun controllo escluso.
                </div>
              ) : (
                excludedControls.map((control) => (
                  <div key={control.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <strong>
                        {control.baselineControl.code} ·{" "}
                        {control.baselineControl.title}
                      </strong>
                      <Badge>{control.status}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {control.justification}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top rischi</CardTitle>
            <CardDescription>Prioritizzazione rapida</CardDescription>
          </CardHeader>
          <CardBody>
            <div className="grid gap-3">
              {company.topRisks.map((risk) => (
                <div key={risk.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <strong>{risk.title}</strong>
                    <Badge>{risk.scoreLabel}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {risk.asset}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Score inerente {score(risk.likelihood, risk.impact)} ·
                    residuo{" "}
                    {score(
                      risk.residualLikelihood,
                      risk.residualImpact
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export</CardTitle>
            <CardDescription>
              Genera file DOCX o PDF pronti da condividere
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="grid gap-3 text-sm">
              <ExportRow companyId={company.id} kind="soa" />
              <ExportRow companyId={company.id} kind="risks" />
              <ExportRow companyId={company.id} kind="documents" />
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}

function ExportRow({
  companyId,
  kind
}: {
  companyId: string;
  kind: "soa" | "risks" | "documents";
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <strong className="uppercase">{kind}</strong>
      <div className="flex gap-2">
        <a
          className="rounded-full border px-3 py-1"
          href={`/api/companies/${companyId}/exports/${kind}?format=docx`}
        >
          DOCX
        </a>
        <a
          className="rounded-full border px-3 py-1"
          href={`/api/companies/${companyId}/exports/${kind}?format=pdf`}
        >
          PDF
        </a>
      </div>
    </div>
  );
}
