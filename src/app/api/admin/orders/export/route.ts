import { NextResponse } from "next/server";
import { OrderStatus } from "@/lib/domain/enums";
import type { OrderStatus as OrderStatusType } from "@/lib/domain/enums";
import { getAdminSession } from "@/lib/auth/get-admin-session";
import {
  listOrdersForExport,
  ordersToCsv,
} from "@/server/services/admin-order.service";

const VALID_STATUSES = new Set<string>(Object.values(OrderStatus));

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status =
    statusParam && VALID_STATUSES.has(statusParam)
      ? (statusParam as OrderStatusType)
      : undefined;

  const rows = await listOrdersForExport(status);
  const csv = ordersToCsv(rows);
  const filename = `riyont-orders-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
