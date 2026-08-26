import { listPayments } from "@/lib/payments/store";
import { listApplications } from "@/lib/applications/store";
import { PaymentsList } from "./PaymentsList";

export default async function PaymentsPage() {
  const [payments, applications] = await Promise.all([listPayments(), listApplications()]);
  const byId = new Map(applications.map((a) => [a.id, a]));

  const enriched = payments
    .slice()
    .reverse()
    .map((p) => {
      const app = byId.get(p.applicationId);
      return {
        id: p.id,
        applicationId: p.applicationId,
        applicantName: app ? `${app.firstName} ${app.lastName}` : "—",
        amount: p.amount,
        method: p.method,
        status: p.status,
        date: p.date,
      };
    });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/40">
          {enriched.length} pagos
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page navigation */}
        <a
          href="/api/command-center/export/payments"
          className="border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 hover:border-white hover:text-white"
        >
          Exportar CSV
        </a>
      </div>
      <PaymentsList payments={enriched} />
    </div>
  );
}
