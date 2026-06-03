import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-admin-session";
import {
  customersToCsv,
  listCustomersForExport,
} from "@/server/services/admin-customer.service";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await listCustomersForExport();
  const csv = customersToCsv(rows);
  const filename = `riyont-customers-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
