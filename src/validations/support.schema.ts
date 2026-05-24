import { z } from "zod";

export const createTicketSchema = z.object({
  locale: z.string().min(2).max(5),
  subject: z.string().min(3).max(200),
  body: z.string().min(1).max(5000),
  ticketType: z.enum(["general", "order_issue"]).default("general"),
  orderId: z.string().uuid().optional(),
});

export const replyTicketSchema = z.object({
  ticketId: z.string().uuid(),
  body: z.string().min(1).max(5000),
});

export const replyTicketByNumberSchema = z.object({
  ticketNumber: z.string().min(5).max(40),
  body: z.string().min(1).max(5000),
});

export const updateTicketStatusSchema = z.object({
  ticketId: z.string().uuid(),
  status: z.enum([
    "open",
    "waiting_customer",
    "waiting_admin",
    "resolved",
    "closed",
  ]),
});
