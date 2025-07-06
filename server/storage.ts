import { users, summaries, quizzes, tasks, quizResults, type User, type Summary, type Quiz, type Task, type QuizResult, type InsertUser, type InsertSummary, type InsertQuiz, type InsertTask } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import * as schema from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { studentCode: string }): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Summaries
  getSummariesByWeek(week: number): Promise<Summary[]>;
  getSummary(week: number, day: number): Promise<Summary | undefined>;
  createSummary(summary: InsertSummary): Promise<Summary>;
  getAllSummaries(): Promise<Summary[]>;
  
  // Quizzes
  getQuiz(week: number, day?: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getAllQuizzes(): Promise<Quiz[]>;
  
  // Tasks
  getUserTasks(userId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  createAdminTask(task: Omit<InsertTask, 'userId'>): Promise<Task[]>;
  
  // Quiz Results
  saveQuizResult(result: { userId: number; quizId: number; score: number; answers: any }): Promise<QuizResult>;
  getUserQuizResults(userId: number): Promise<QuizResult[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser & { studentCode: string }): Promise<User> {
    const [user] = await db
      .insert(schema.users)
      .values({
        ...insertUser,
        createdAt: new Date(),
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(schema.users)
      .set(updates)
      .where(eq(schema.users.id, id))
      .returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(schema.users).orderBy(desc(schema.users.createdAt));
  }

  async getSummariesByWeek(week: number): Promise<Summary[]> {
    return await db
      .select()
      .from(schema.summaries)
      .where(eq(schema.summaries.week, week))
      .orderBy(schema.summaries.day);
  }

  async getSummary(week: number, day: number): Promise<Summary | undefined> {
    const summaries = await db
      .select()
      .from(schema.summaries)
      .where(and(eq(schema.summaries.week, week), eq(schema.summaries.day, day)));
    return summaries[0] || undefined;
  }

  async createSummary(insertSummary: InsertSummary): Promise<Summary> {
    const [summary] = await db
      .insert(schema.summaries)
      .values({
        ...insertSummary,
        createdAt: new Date(),
      })
      .returning();
    return summary;
  }

  async getAllSummaries(): Promise<Summary[]> {
    return await db
      .select()
      .from(schema.summaries)
      .orderBy(desc(schema.summaries.createdAt));
  }

  async getQuiz(week: number, day?: number): Promise<Quiz | undefined> {
    if (day !== undefined) {
      const quizzes = await db
        .select()
        .from(schema.quizzes)
        .where(and(eq(schema.quizzes.week, week), eq(schema.quizzes.day, day)));
      return quizzes[0] || undefined;
    } else {
      const quizzes = await db
        .select()
        .from(schema.quizzes)
        .where(and(eq(schema.quizzes.week, week), eq(schema.quizzes.isWeekly, true)));
      return quizzes[0] || undefined;
    }
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db
      .insert(schema.quizzes)
      .values({
        ...insertQuiz,
        createdAt: new Date(),
      })
      .returning();
    return quiz;
  }

  async getAllQuizzes(): Promise<Quiz[]> {
    return await db
      .select()
      .from(schema.quizzes)
      .orderBy(desc(schema.quizzes.createdAt));
  }

  async getUserTasks(userId: number): Promise<Task[]> {
    return await db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.userId, userId))
      .orderBy(desc(schema.tasks.createdAt));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(schema.tasks)
      .values({
        ...insertTask,
        createdAt: new Date(),
        isCompleted: false,
        isAdminTask: false,
      })
      .returning();
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const [task] = await db
      .update(schema.tasks)
      .set(updates)
      .where(eq(schema.tasks.id, id))
      .returning();
    return task || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(schema.tasks).where(eq(schema.tasks.id, id));
    return result.rowCount! > 0;
  }

  async createAdminTask(taskData: Omit<InsertTask, 'userId'>): Promise<Task[]> {
    const users = await this.getAllUsers();
    const tasks: Task[] = [];
    
    for (const user of users) {
      const [task] = await db
        .insert(schema.tasks)
        .values({
          ...taskData,
          userId: user.id,
          createdAt: new Date(),
          isCompleted: false,
          isAdminTask: true,
        })
        .returning();
      tasks.push(task);
    }
    
    return tasks;
  }

  async saveQuizResult(result: { userId: number; quizId: number; score: number; answers: any }): Promise<QuizResult> {
    const [quizResult] = await db
      .insert(schema.quizResults)
      .values({
        ...result,
        completedAt: new Date(),
      })
      .returning();
    return quizResult;
  }

  async getUserQuizResults(userId: number): Promise<QuizResult[]> {
    return await db
      .select()
      .from(schema.quizResults)
      .where(eq(schema.quizResults.userId, userId))
      .orderBy(desc(schema.quizResults.completedAt));
  }
}

export const storage = new DatabaseStorage();