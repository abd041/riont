import {
  CheckCircle2,
  Clock,
  Package,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { OrderStatus } from "@/lib/domain/enums";
import type { OrderStatus as OrderStatusType } from "@/lib/domain/enums";
import { OrderStatusBadge } from "./order-status-badge";

type StepState = "pending" | "active" | "done";

type OrderProgress = {
  submitted: StepState;
  payment: StepState;
  delivery: StepState;
};

function resolveProgress(status: OrderStatusType): OrderProgress {
  if (status === OrderStatus.CANCELLED) {
    return { submitted: "done", payment: "pending", delivery: "pending" };
  }

  const submitted: StepState = "done";

  let payment: StepState = "pending";
  if (
    status === OrderStatus.PENDING_REVIEW ||
    status === OrderStatus.AWAITING_PAYMENT ||
    status === OrderStatus.NEEDS_CUSTOMER_RESPONSE ||
    status === OrderStatus.ON_HOLD
  ) {
    payment = "active";
  } else if (
    status === OrderStatus.PAYMENT_RECEIVED ||
    status === OrderStatus.PROCESSING ||
    status === OrderStatus.DELIVERED ||
    status === OrderStatus.COMPLETED
  ) {
    payment = "done";
  }

  let delivery: StepState = "pending";
  if (status === OrderStatus.PAYMENT_RECEIVED || status === OrderStatus.PROCESSING) {
    delivery = "active";
  } else if (status === OrderStatus.DELIVERED || status === OrderStatus.COMPLETED) {
    delivery = "done";
  }

  return { submitted, payment, delivery };
}

function heroTone(
  status: OrderStatusType,
): "success" | "active" | "warning" | "cancelled" {
  if (status === OrderStatus.CANCELLED) return "cancelled";
  if (status === OrderStatus.DELIVERED || status === OrderStatus.COMPLETED) return "success";
  if (
    status === OrderStatus.NEEDS_CUSTOMER_RESPONSE ||
    status === OrderStatus.ON_HOLD
  ) {
    return "warning";
  }
  return "active";
}

const toneIcon = {
  success: CheckCircle2,
  active: Clock,
  warning: ShieldAlert,
  cancelled: XCircle,
} as const;

function stepClass(state: StepState) {
  if (state === "done") return "sf-checkout-step sf-checkout-step--done";
  if (state === "active") return "sf-checkout-step sf-checkout-step--active";
  return "sf-checkout-step";
}

type OrderStatusHeroProps = {
  status: OrderStatusType;
  statusLabel: string;
  headline: string;
  description: string;
  stepsLabel: string;
  steps: { submitted: string; payment: string; delivery: string };
};

export function OrderStatusHero({
  status,
  statusLabel,
  headline,
  description,
  stepsLabel,
  steps,
}: OrderStatusHeroProps) {
  const tone = heroTone(status);
  const Icon = toneIcon[tone];
  const progress = resolveProgress(status);

  if (status === OrderStatus.CANCELLED) {
    return (
      <div className={`sf-order-hero sf-order-hero--${tone}`}>
        <div className="sf-order-hero__icon">
          <Icon strokeWidth={1.5} />
        </div>
        <div className="sf-order-hero__copy">
          <div className="sf-order-hero__top">
            <h2 className="sf-order-hero__title">{headline}</h2>
            <OrderStatusBadge status={status} label={statusLabel} />
          </div>
          <p className="sf-order-hero__desc">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`sf-order-hero sf-order-hero--${tone}`}>
      <div className="sf-order-hero__icon">
        <Icon strokeWidth={1.5} />
      </div>
      <div className="sf-order-hero__copy">
        <div className="sf-order-hero__top">
          <h2 className="sf-order-hero__title">{headline}</h2>
          <OrderStatusBadge status={status} label={statusLabel} />
        </div>
        <p className="sf-order-hero__desc">{description}</p>
        <ol className="sf-checkout-steps sf-order-hero__steps" aria-label={stepsLabel}>
          <li className={stepClass(progress.submitted)}>
            <span className="sf-checkout-step__num">1</span>
            <span className="sf-checkout-step__label">{steps.submitted}</span>
          </li>
          <li className={stepClass(progress.payment)}>
            <span className="sf-checkout-step__num">2</span>
            <span className="sf-checkout-step__label">{steps.payment}</span>
          </li>
          <li className={stepClass(progress.delivery)}>
            <span className="sf-checkout-step__num">3</span>
            <span className="sf-checkout-step__label">{steps.delivery}</span>
          </li>
        </ol>
      </div>
      {tone === "success" && (
        <Package className="sf-order-hero__accent-icon" strokeWidth={1.25} aria-hidden />
      )}
    </div>
  );
}

export function getOrderStatusMessageKey(status: OrderStatusType): string {
  return `statusHero.${status}`;
}
