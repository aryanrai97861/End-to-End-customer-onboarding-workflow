import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { insertBrokerSchema, loginBrokerSchema, insertCustomerSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.brokerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.brokerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const broker = await storage.getBroker(req.session.brokerId);
  if (!broker?.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertBrokerSchema.parse(req.body);
      
      const existingBroker = await storage.getBrokerByEmail(data.email);
      if (existingBroker) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const broker = await storage.createBroker({
        ...data,
        password: hashedPassword,
      });
      
      req.session.brokerId = broker.id;
      
      const { password: _, ...brokerWithoutPassword } = broker;
      res.status(201).json({ broker: brokerWithoutPassword });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginBrokerSchema.parse(req.body);
      
      const broker = await storage.getBrokerByEmail(data.email);
      if (!broker) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      const validPassword = await bcrypt.compare(data.password, broker.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      req.session.brokerId = broker.id;
      
      const { password: _, ...brokerWithoutPassword } = broker;
      res.json({ broker: brokerWithoutPassword });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const broker = await storage.getBroker(req.session.brokerId!);
      if (!broker) {
        return res.status(401).json({ message: "Broker not found" });
      }
      const { password: _, ...brokerWithoutPassword } = broker;
      res.json({ broker: brokerWithoutPassword });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ message: "Auth check failed" });
    }
  });

  app.get("/api/customers", requireAuth, async (req, res) => {
    try {
      const customers = await storage.getCustomersByBrokerId(req.session.brokerId!);
      res.json(customers);
    } catch (error) {
      console.error("Get customers error:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", requireAuth, async (req, res) => {
    try {
      const data = insertCustomerSchema.parse(req.body);
      
      const customer = await storage.createCustomer({
        ...data,
        brokerId: req.session.brokerId!,
      });
      
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Create customer error:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  app.patch("/api/customers/:id/status", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!["active", "pending", "inactive"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const customer = await storage.getCustomer(id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      if (customer.brokerId !== req.session.brokerId) {
        const broker = await storage.getBroker(req.session.brokerId!);
        if (!broker?.isAdmin) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }
      
      const updatedCustomer = await storage.updateCustomerStatus(id, status);
      res.json(updatedCustomer);
    } catch (error) {
      console.error("Update customer status error:", error);
      res.status(500).json({ message: "Failed to update customer status" });
    }
  });

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/brokers", requireAdmin, async (req, res) => {
    try {
      const brokers = await storage.getBrokersWithCustomerCount();
      const brokersWithoutPasswords = brokers.map(({ password: _, ...broker }) => broker);
      res.json(brokersWithoutPasswords);
    } catch (error) {
      console.error("Get brokers error:", error);
      res.status(500).json({ message: "Failed to fetch brokers" });
    }
  });

  app.get("/api/admin/customers", requireAdmin, async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Get all customers error:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  return httpServer;
}
