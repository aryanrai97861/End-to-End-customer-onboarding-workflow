import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const brokers = pgTable("brokers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  companyName: text("company_name"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  gstin: varchar("gstin", { length: 15 }).notNull(),
  type: text("type").notNull().$type<"exporter" | "importer">(),
  status: text("status").notNull().$type<"active" | "pending" | "inactive">().default("pending"),
  brokerId: varchar("broker_id").notNull().references(() => brokers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const brokersRelations = relations(brokers, ({ many }) => ({
  customers: many(customers),
}));

export const customersRelations = relations(customers, ({ one }) => ({
  broker: one(brokers, {
    fields: [customers.brokerId],
    references: [brokers.id],
  }),
}));

export const insertBrokerSchema = createInsertSchema(brokers).omit({
  id: true,
  createdAt: true,
  isAdmin: true,
}).extend({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const loginBrokerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  brokerId: true,
  status: true,
}).extend({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format"),
  type: z.enum(["exporter", "importer"]),
});

export type InsertBroker = z.infer<typeof insertBrokerSchema>;
export type LoginBroker = z.infer<typeof loginBrokerSchema>;
export type Broker = typeof brokers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
