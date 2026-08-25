import { listPayments } from "@/lib/payments/store";
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/commandCenterLabels";
import { RefundButton } from "./RefundButton";

export default async function PaymentsPage() {
  const payments = (await listPayments()).slice().reverse();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/40">
          {payments.length} pagos
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page navigation */}
        <a
          href="/api/command-center/export/payments"
          className="border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 hover:border-white hover:text-white"
        >
          Exportar CSV
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40">
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Postulación</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Monto</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Método</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Estado</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Fecha</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Acción</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="py-3 pr-4 font-mono text-xs text-cyan-400">{p.applicationId}</td>
                <td className="py-3 pr-4">Bs {p.amount}</td>
                <td className="py-3 pr-4 font-mono text-xs uppercase">
                  {PAYMENT_METHOD_LABEL[p.method] ?? p.method}
                </td>
                <td className="py-3 pr-4 font-mono text-xs uppercase">
                  {PAYMENT_STATUS_LABEL[p.status] ?? p.status}
                </td>
                <td className="py-3 pr-4 text-xs text-white/50">
                  {new Date(p.date).toLocaleDateString("es-BO")}
                </td>
                <td className="py-3 pr-4">
                  {p.status === "refund_due" && <RefundButton id={p.id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
