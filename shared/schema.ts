import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  college: text("college").notNull(),
  academicYear: text("academic_year").notNull(),
  governorate: text("governorate").notNull(),
  studentCode: text("student_code").notNull().unique(),
  planType: text("plan_type").default("free"), // "free", "premium", "vip"
  isActive: boolean("is_active").default(false),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const summaries = pgTable("summaries", {
  id: serial("id").primaryKey(),
  week: integer("week").notNull(),
  day: integer("day").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  week: integer("week").notNull(),
  day: integer("day"), // null for weekly quizzes
  title: text("title").notNull(),
  questions: jsonb("questions").notNull(), // Array of questions
  isWeekly: boolean("is_weekly").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").default(false),
  isAdminTask: boolean("is_admin_task").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  quizId: integer("quiz_id").references(() => quizzes.id),
  score: integer("score").notNull(),
  answers: jsonb("answers").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  fullName: true,
  phone: true,
  college: true,
  academicYear: true,
  governorate: true,
});

export const insertSummarySchema = createInsertSchema(summaries).pick({
  week: true,
  day: true,
  title: true,
  content: true,
  fileUrl: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  week: true,
  day: true,
  title: true,
  questions: true,
  isWeekly: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  userId: true,
  title: true,
  description: true,
  isAdminTask: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSummary = z.infer<typeof insertSummarySchema>;
export type Summary = typeof summaries.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type QuizResult = typeof quizResults.$inferSelect;
