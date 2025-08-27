import { Temporal } from "temporal-polyfill";

export const mapPlainDateToLocaleString = (date: Temporal.PlainDate) => {
  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
  });
};

export const mapPlainDateToDayName = (date: Temporal.PlainDate) => {
  return date.toLocaleString("fr-FR", {
    weekday: "long",
  });
};

export const formatLastTimeDone = (date?: Temporal.PlainDate) => {
  if (!date) return "Jamais faite";

  const now = Temporal.Now.plainDateISO();
  const diff = now.since(date);

  if (diff.days === 0) return "Aujourd'hui";
  if (diff.days === 1) return "Hier";
  if (diff.days < 7) return `il y a ${diff.days} jours`;
  if (diff.days < 30) return `il y a ${Math.floor(diff.days / 7)} semaines`;
  return `il y a ${Math.floor(diff.days / 30)} mois`;
};

export const formatDuration = (duration?: number) => {
  if (!duration) return "-";
  if (duration === 0) return "0 min";
  if (duration < 60) return `${duration} min`;
  return `${Math.floor(duration / 60)} h ${duration % 60} min`;
};
