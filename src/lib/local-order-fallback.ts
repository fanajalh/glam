import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { OrderStatus } from "@prisma/client";
import type { SerializedOrder } from "@/lib/admin-types";

const LOCAL_DIR = join(process.cwd(), ".local-cms");
const LOCAL_ORDERS_FILE = join(LOCAL_DIR, "orders.json");

function readLocalOrdersUnsafe(): SerializedOrder[] {
  try {
    if (!existsSync(LOCAL_ORDERS_FILE)) return [];
    const raw = readFileSync(LOCAL_ORDERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SerializedOrder[]) : [];
  } catch {
    return [];
  }
}

function writeLocalOrdersUnsafe(orders: SerializedOrder[]): boolean {
  try {
    if (!existsSync(LOCAL_DIR)) {
      mkdirSync(LOCAL_DIR, { recursive: true });
    }
    writeFileSync(LOCAL_ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export function getLocalFallbackOrders(): SerializedOrder[] {
  return readLocalOrdersUnsafe();
}

export function findLocalFallbackOrder(
  orderNumber: string
): SerializedOrder | null {
  const clean = orderNumber.trim();
  return (
    readLocalOrdersUnsafe().find((o) => o.orderNumber === clean) ?? null
  );
}

export function saveLocalFallbackOrder(order: SerializedOrder): boolean {
  const current = readLocalOrdersUnsafe().filter(
    (o) => o.orderNumber !== order.orderNumber
  );
  return writeLocalOrdersUnsafe([order, ...current]);
}

export function updateLocalFallbackOrderPayment(
  orderNumber: string,
  paymentMethod: string,
  paymentReference?: string,
  nextStatus: OrderStatus = "CONFIRMED"
): SerializedOrder | null {
  const clean = orderNumber.trim();
  const current = readLocalOrdersUnsafe();
  const idx = current.findIndex((o) => o.orderNumber === clean);
  if (idx === -1) return null;

  const existing = current[idx];
  const segments = (existing.notes || "")
    .split("|")
    .map((s) => s.trim())
    .filter(
      (s) =>
        s &&
        !s.startsWith("Pembayaran:") &&
        !s.startsWith("Ref Pembayaran:")
    );

  const nextNotes = [
    ...segments,
    `Pembayaran: ${paymentMethod}`,
    paymentReference?.trim() ? `Ref Pembayaran: ${paymentReference.trim()}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const updated: SerializedOrder = {
    ...existing,
    notes: nextNotes || existing.notes,
    status: nextStatus,
  };

  current[idx] = updated;
  writeLocalOrdersUnsafe(current);
  return updated;
}

export function updateLocalFallbackOrderStatus(
  orderIdOrNumber: string,
  status: OrderStatus
): boolean {
  const current = readLocalOrdersUnsafe();
  let changed = false;
  const next = current.map((o) => {
    if (o.id === orderIdOrNumber || o.orderNumber === orderIdOrNumber) {
      changed = true;
      return { ...o, status };
    }
    return o;
  });
  if (!changed) return false;
  return writeLocalOrdersUnsafe(next);
}

export function deleteLocalFallbackOrder(orderIdOrNumber: string): boolean {
  const current = readLocalOrdersUnsafe();
  const next = current.filter(
    (o) => o.id !== orderIdOrNumber && o.orderNumber !== orderIdOrNumber
  );
  if (next.length === current.length) return false;
  return writeLocalOrdersUnsafe(next);
}

