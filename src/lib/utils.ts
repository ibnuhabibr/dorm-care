import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { OrderStatus } from "@/data/site-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatTanggalIndonesia(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatNoHp(noHp: string) {
  const digits = noHp.replace(/[^0-9]/g, "");
  if (digits.startsWith("62")) {
    return `+${digits}`;
  }
  if (digits.startsWith("0")) {
    return `+62${digits.slice(1)}`;
  }
  return `+62${digits}`;
}

export function orderStatusLabel(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "Pending";
    case "diterima":
      return "Diterima";
    case "menuju":
      return "Mitra Menuju";
    case "dikerjakan":
      return "Dikerjakan";
    case "selesai":
      return "Selesai";
    case "dibatalkan":
      return "Dibatalkan";
    default:
      return status;
  }
}

export function orderProgress(status: OrderStatus) {
  const map: Record<OrderStatus, number> = {
    pending: 0,
    diterima: 25,
    menuju: 50,
    dikerjakan: 75,
    selesai: 100,
    dibatalkan: 0,
  };

  return map[status];
}

export function getStatusInfo(status: string) {
  const map: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "#F59E0B" },
    pending_confirmation: { label: "Pending", color: "#F59E0B" },
    diterima: { label: "Diterima", color: "#3B82F6" },
    confirmed: { label: "Dikonfirmasi", color: "#3B82F6" },
    menuju: { label: "Mitra Menuju", color: "#8B5CF6" },
    on_the_way: { label: "Mitra Menuju", color: "#8B5CF6" },
    dikerjakan: { label: "Dalam Pengerjaan", color: "#0EA673" },
    in_progress: { label: "Dalam Pengerjaan", color: "#0EA673" },
    selesai: { label: "Selesai", color: "#10B981" },
    completed: { label: "Selesai", color: "#10B981" },
    dibatalkan: { label: "Dibatalkan", color: "#EF4444" },
    cancelled: { label: "Dibatalkan", color: "#EF4444" },
  };
  return map[status] ?? { label: status, color: "#78716C" };
}

export function formatTanggal(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
