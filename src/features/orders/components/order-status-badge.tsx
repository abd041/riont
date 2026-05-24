import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/domain/enums";
import { cn } from "@/lib/utils/cn";

const variantMap: Partial<
  Record<OrderStatus, "default" | "accent" | "success" | "warning">
> = {
  pending_review: "warning",
  awaiting_payment: "accent",
  payment_received: "accent",
  processing: "accent",
  delivered: "success",
  completed: "success",
  cancelled: "default",
  needs_customer_response: "warning",
  on_hold: "warning",
};

export function OrderStatusBadge({
  status,
  label,
  className,
}: {
  status: OrderStatus;
  label: string;
  className?: string;
}) {
  const variant = variantMap[status] ?? "default";

  return (
    <Badge
      variant={variant}
      className={cn(className)}
    >
      {label}
    </Badge>
  );
}
