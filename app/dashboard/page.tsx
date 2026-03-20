// file: app/dashboard/page.tsx
import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
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
import { score } from "@/lib/rules";

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
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </CardBody>
    </Card>
  );
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
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Card>
          <CardBody>
            <p className="text-sm text-slate-700">Nessun cliente disponibile.</p>
          </CardBody>
        </Card>
      </main>
    );
  }

  const company = data.selectedCompany;
  const requiredDocuments = company.documents.filter((item) => item.required);
  const excludedDocuments = company.documents.filter((item) => !item.required);
  const applicableControls = company.controls.filter((item) => item.applicable);
  const excludedControls = company.controls.filter((item) => !item.applicable);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <section className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge>Ambiente protetto</Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Dashboard conformità ISO/IEC 27001:2022
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              Gestione clienti multi-tenant, profilo organizzativo, baseline controlli,
              analisi documentale ed esportazione di output formali.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{company.name}</Badge>
            <Badge>{session.username}</Badge>
            <Badge>{session.role}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {data.companies.map((item) => {
            const active = item.id === company.id;

            return (
              <Link
                key={item.id}
                href={`/dashboard?companyId=${item.id}`}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <LogoutButton />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Controlli applicabili"
          value={String(applicableControls.length)}
          subtitle="Controlli inclusi nella SoA"
        />
        <StatCard
          title="Documenti richiesti"
          value={String(requiredDocuments.length)}
          subtitle="Derivati da baseline e profilo"
        />
        <StatCard
          title="Rischi censiti"
          value={String(company.risks.length)}
          subtitle="Elementi presenti nel registro rischi"
        />
        <StatCard
          title="Documenti caricati"
          value={String((company.uploads ?? []).length)}
          subtitle="File attualmente associati al cliente"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Checklist cliente</CardTitle>
                <CardDescription>
                  Aggiorna il profilo organizzativo e rigenera baseline, SoA,
                  documenti richiesti e registro dei rischi.
                </CardDescription>
              </div>
              <Badge tone="warning">Azione operativa</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <ProfileForm
              companyId={company.id}
              profile={company.profile}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Caricamento e analisi documenti</CardTitle>
                <CardDescription>
                  Carica file del cliente e aggiorna il contesto con segnali
                  estratti dai contenuti disponibili.
                </CardDescription>
              </div>
              <Badge tone="default">
                {(company.uploads ?? []).length} file
              </Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-5">
            <UploadForm companyId={company.id} />

            {(company.uploads ?? []).length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Ultimi documenti caricati
                </h3>
                <ul className="space-y-3">
                  {(company.uploads ?? []).map((upload) => (
                    <li
                      key={upload.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-900">
                            {upload.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {upload.mimeType} · {upload.sizeBytes} byte
                          </p>
                        </div>
                        <Badge tone="success">Caricato</Badge>
                      </div>

                      {upload.analysisNotes ? (
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {upload.analysisNotes}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Nessun documento caricato per questo cliente.
              </div>
            )}
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Documenti da generare</CardTitle>
            <CardDescription>
              Derivati dalla baseline generale e dal profilo del cliente.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-3">
            {requiredDocuments.map((document) => (
              <div
                key={document.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-900">{document.name}</p>
                  <Badge tone="success">{document.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{document.category}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{document.reason}</p>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documenti non richiesti</CardTitle>
            <CardDescription>
              Esclusi in base al profilo attuale del cliente.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-3">
            {excludedDocuments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Nessun documento escluso.
              </div>
            ) : (
              excludedDocuments.map((document) => (
                <div
                  key={document.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900">{document.name}</p>
                    <Badge>{document.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{document.category}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {document.reason}
                  </p>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SoA applicabile</CardTitle>
            <CardDescription>
              Controlli richiesti per questo cliente.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-3">
            {applicableControls.slice(0, 20).map((control) => (
              <div
                key={control.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-900">
                    {control.baselineControl.code} · {control.baselineControl.title}
                  </p>
                  <Badge tone="success">{control.status}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {control.justification}
                </p>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SoA non applicabile</CardTitle>
            <CardDescription>
              Controlli escludibili con relativa motivazione.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-3">
            {excludedControls.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Nessun controllo escluso.
              </div>
            ) : (
              excludedControls.map((control) => (
                <div
                  key={control.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900">
                      {control.baselineControl.code} · {control.baselineControl.title}
                    </p>
                    <Badge>{control.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {control.justification}
                  </p>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Rischi prioritari</CardTitle>
            <CardDescription>
              Vista rapida dei rischi con punteggio inerente e residuo.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-3">
            {company.topRisks.map((risk) => (
              <div
                key={risk.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-900">{risk.title}</p>
                  <Badge tone="warning">{risk.scoreLabel}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{risk.asset}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Score inerente {score(risk.likelihood, risk.impact)} · residuo{" "}
                  {score(risk.residualLikelihood, risk.residualImpact)}
                </p>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Esportazione</CardTitle>
            <CardDescription>
              Genera file DOCX o PDF pronti da condividere.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-3">
            <ExportRow companyId={company.id} kind="soa" label="Dichiarazione di applicabilità" />
            <ExportRow companyId={company.id} kind="risks" label="Registro dei rischi" />
            <ExportRow companyId={company.id} kind="documents" label="Set documentale" />
          </CardBody>
        </Card>
      </section>
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
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{kind.toUpperCase()}</p>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/api/companies/${companyId}/exports/${kind}?format=docx`}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          DOCX
        </Link>
        <Link
          href={`/api/companies/${companyId}/exports/${kind}?format=pdf`}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          PDF
        </Link>
      </div>
    </div>
  );
}
