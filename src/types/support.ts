export type SupportTicketStatus =
  | "open"
  | "waiting_customer"
  | "waiting_admin"
  | "resolved"
  | "closed";

export type SupportTicketType = "general" | "fulfillment" | "order_issue";

export type SupportTicketListItem = {
  id: string;
  ticketNumber: string;
  subject: string;
  status: SupportTicketStatus;
  ticketType: SupportTicketType;
  orderNumber: string | null;
  updatedAt: string;
  lastMessagePreview: string | null;
};

export type SupportMessageAttachment = {
  id: string;
  fileName: string;
  url: string;
  mimeType: string | null;
};

export type SupportMessage = {
  id: string;
  senderType: "customer" | "admin" | "system";
  body: string;
  createdAt: string;
  senderLabel: string;
  attachments: SupportMessageAttachment[];
};

export type SupportTicketDetail = {
  id: string;
  ticketNumber: string;
  subject: string;
  status: SupportTicketStatus;
  ticketType: SupportTicketType;
  orderId: string | null;
  orderNumber: string | null;
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
};
