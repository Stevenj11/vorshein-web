"use client";

import { FormEvent, useState } from "react";
import type { Generation } from "@/lib/generation-defaults";
import { GENERATION_STATUS_LABEL } from "@/lib/commandCenterLabels";

const field =
  "border border-white/20 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-white/40";

export function GenerationForm({ generation }: { generation: Generation }) {
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    await fetch("/api/command-center/generation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={label}>Nombre</span>
          <input name="name" defaultValue={generation.name} className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>Ubicación</span>
          <input name="location" defaultValue={generation.location} className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>Estado</span>
          <select name="status" defaultValue={generation.status} className={field}>
            {[
              "COMING_SOON",
              "APPLICATIONS_OPEN",
              "APPLICATIONS_CLOSED",
              "ENTRY_ASSESSMENT",
              "CLASSIFICATION",
              "TRAINING_ACTIVE",
              "CLEARANCE",
              "GEN_COMPLETE",
            ].map((s) => (
              <option key={s} value={s}>{GENERATION_STATUS_LABEL[s] ?? s}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>Número de WhatsApp</span>
          <input name="whatsappNumber" defaultValue={generation.whatsappNumber} className={field} />
        </label>
      </div>

      <div>
        <p className={`${label} mb-2`}>Precio (Bs)</p>
        <div className="grid grid-cols-3 gap-3">
          <input name="price" type="number" defaultValue={generation.price} placeholder="Total" className={field} />
          <input name="assessmentFee" type="number" defaultValue={generation.assessmentFee} placeholder="Evaluación" className={field} />
          <input name="trainingFee" type="number" defaultValue={generation.trainingFee} placeholder="Entrenamiento" className={field} />
        </div>
      </div>

      <div>
        <p className={`${label} mb-2`}>Fechas</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className={label}>Apertura de Postulaciones</span>
            <input name="applicationsOpenISO" type="date" defaultValue={generation.dates.applicationsOpenISO} className={field} />
          </label>
          <label className="flex flex-col gap-1">
            <span className={label}>Cierre de Postulaciones</span>
            <input name="applicationsCloseISO" type="date" defaultValue={generation.dates.applicationsCloseISO} className={field} />
          </label>
          <label className="flex flex-col gap-1">
            <span className={label}>Fecha de Evaluación 1</span>
            <input name="entryDate1" type="date" defaultValue={generation.dates.entryDatesISO[0]} className={field} />
          </label>
          <label className="flex flex-col gap-1">
            <span className={label}>Fecha de Evaluación 2</span>
            <input name="entryDate2" type="date" defaultValue={generation.dates.entryDatesISO[1]} className={field} />
          </label>
          <label className="flex flex-col gap-1">
            <span className={label}>Inicio de Entrenamiento</span>
            <input name="trainingBeginsISO" type="date" defaultValue={generation.dates.trainingBeginsISO} className={field} />
          </label>
          <label className="flex flex-col gap-1">
            <span className={label}>Fin de Semana de Clearance</span>
            <div className="flex gap-2">
              <input name="clearanceDate1" type="date" defaultValue={generation.dates.clearanceWeekendISO[0]} className={field} />
              <input name="clearanceDate2" type="date" defaultValue={generation.dates.clearanceWeekendISO[1]} className={field} />
            </div>
          </label>
        </div>
      </div>

      {(["foundation", "performance", "tactical"] as const).map((level) => (
        <div key={level}>
          <p className={`${label} mb-2`}>Capacidad {level}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <input name={`${level}Min`} type="number" defaultValue={generation.capacities[level].min} placeholder="Mín" className={field} />
            <input name={`${level}Max`} type="number" defaultValue={generation.capacities[level].max} placeholder="Máx" className={field} />
            <input name={`${level}Schedule`} defaultValue={generation.capacities[level].scheduleTime} placeholder="13:00–15:00" className={field} />
            <input name={`${level}EntryCapacity`} type="number" defaultValue={generation.capacities[level].entryTurnCapacity} placeholder="Cupo evaluación" className={field} />
          </div>
        </div>
      ))}

      <button type="submit" className="bg-white px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-black">
        {saved ? "Guardado ✓" : "Guardar Generación"}
      </button>
    </form>
  );
}
