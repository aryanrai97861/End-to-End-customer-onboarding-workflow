import { brokers, customers, type Broker, type InsertBroker, type Customer, type InsertCustomer } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getBroker(id: string): Promise<Broker | undefined>;
  getBrokerByEmail(email: string): Promise<Broker | undefined>;
  createBroker(broker: InsertBroker & { password: string }): Promise<Broker>;
  getAllBrokers(): Promise<Broker[]>;
  getBrokersWithCustomerCount(): Promise<(Broker & { customerCount: number })[]>;
  
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomersByBrokerId(brokerId: string): Promise<Customer[]>;
  getAllCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer & { brokerId: string }): Promise<Customer>;
  updateCustomerStatus(id: string, status: "active" | "pending" | "inactive"): Promise<Customer | undefined>;
  
  getStats(): Promise<{
    totalBrokers: number;
    totalCustomers: number;
    activeCustomers: number;
    pendingCustomers: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getBroker(id: string): Promise<Broker | undefined> {
    const [broker] = await db.select().from(brokers).where(eq(brokers.id, id));
    return broker || undefined;
  }

  async getBrokerByEmail(email: string): Promise<Broker | undefined> {
    const [broker] = await db.select().from(brokers).where(eq(brokers.email, email));
    return broker || undefined;
  }

  async createBroker(insertBroker: InsertBroker & { password: string }): Promise<Broker> {
    const [broker] = await db
      .insert(brokers)
      .values(insertBroker)
      .returning();
    return broker;
  }

  async getAllBrokers(): Promise<Broker[]> {
    return db.select().from(brokers).where(eq(brokers.isAdmin, false));
  }

  async getBrokersWithCustomerCount(): Promise<(Broker & { customerCount: number })[]> {
    const allBrokers = await db.select().from(brokers).where(eq(brokers.isAdmin, false));
    const brokersWithCount = await Promise.all(
      allBrokers.map(async (broker) => {
        const customerList = await db.select().from(customers).where(eq(customers.brokerId, broker.id));
        return { ...broker, customerCount: customerList.length };
      })
    );
    return brokersWithCount;
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async getCustomersByBrokerId(brokerId: string): Promise<Customer[]> {
    return db.select().from(customers).where(eq(customers.brokerId, brokerId));
  }

  async getAllCustomers(): Promise<Customer[]> {
    return db.select().from(customers);
  }

  async createCustomer(insertCustomer: InsertCustomer & { brokerId: string }): Promise<Customer> {
    const [customer] = await db
      .insert(customers)
      .values({ ...insertCustomer, status: "pending" })
      .returning();
    return customer;
  }

  async updateCustomerStatus(id: string, status: "active" | "pending" | "inactive"): Promise<Customer | undefined> {
    const [customer] = await db
      .update(customers)
      .set({ status })
      .where(eq(customers.id, id))
      .returning();
    return customer || undefined;
  }

  async getStats(): Promise<{
    totalBrokers: number;
    totalCustomers: number;
    activeCustomers: number;
    pendingCustomers: number;
  }> {
    const allBrokers = await db.select().from(brokers).where(eq(brokers.isAdmin, false));
    const allCustomers = await db.select().from(customers);
    
    return {
      totalBrokers: allBrokers.length,
      totalCustomers: allCustomers.length,
      activeCustomers: allCustomers.filter(c => c.status === "active").length,
      pendingCustomers: allCustomers.filter(c => c.status === "pending").length,
    };
  }
}

export const storage = new DatabaseStorage();
