import { 
  users, 
  summaries, 
  quizzes, 
  tasks, 
  quizResults,
  type User, 
  type InsertUser,
  type Summary,
  type InsertSummary,
  type Quiz,
  type InsertQuiz,
  type Task,
  type InsertTask,
  type QuizResult
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private summaries: Map<number, Summary>;
  private quizzes: Map<number, Quiz>;
  private tasks: Map<number, Task>;
  private quizResults: Map<number, QuizResult>;
  private currentUserId: number;
  private currentSummaryId: number;
  private currentQuizId: number;
  private currentTaskId: number;
  private currentQuizResultId: number;

  constructor() {
    this.users = new Map();
    this.summaries = new Map();
    this.quizzes = new Map();
    this.tasks = new Map();
    this.quizResults = new Map();
    this.currentUserId = 1;
    this.currentSummaryId = 1;
    this.currentQuizId = 1;
    this.currentTaskId = 1;
    this.currentQuizResultId = 1;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser & { studentCode: string }): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      planType: "free",
      isActive: false,
      isAdmin: false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Summaries
  async getSummariesByWeek(week: number): Promise<Summary[]> {
    return Array.from(this.summaries.values()).filter(summary => summary.week === week);
  }

  async getSummary(week: number, day: number): Promise<Summary | undefined> {
    return Array.from(this.summaries.values()).find(
      summary => summary.week === week && summary.day === day
    );
  }

  async createSummary(insertSummary: InsertSummary): Promise<Summary> {
    const id = this.currentSummaryId++;
    const summary: Summary = {
      ...insertSummary,
      id,
      createdAt: new Date(),
    };
    this.summaries.set(id, summary);
    return summary;
  }

  async getAllSummaries(): Promise<Summary[]> {
    return Array.from(this.summaries.values());
  }

  // Quizzes
  async getQuiz(week: number, day?: number): Promise<Quiz | undefined> {
    return Array.from(this.quizzes.values()).find(
      quiz => quiz.week === week && quiz.day === day
    );
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentQuizId++;
    const quiz: Quiz = {
      ...insertQuiz,
      id,
      createdAt: new Date(),
    };
    this.quizzes.set(id, quiz);
    return quiz;
  }

  async getAllQuizzes(): Promise<Quiz[]> {
    return Array.from(this.quizzes.values());
  }

  // Tasks
  async getUserTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      task => task.userId === userId || task.isAdminTask
    );
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = {
      ...insertTask,
      id,
      isCompleted: false,
      isAdminTask: false,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async createAdminTask(taskData: Omit<InsertTask, 'userId'>): Promise<Task[]> {
    const allUsers = Array.from(this.users.values());
    const createdTasks: Task[] = [];

    // Create the task for all users
    for (const user of allUsers) {
      const id = this.currentTaskId++;
      const task: Task = {
        ...taskData,
        id,
        userId: user.id,
        isCompleted: false,
        isAdminTask: true,
        createdAt: new Date(),
      };
      this.tasks.set(id, task);
      createdTasks.push(task);
    }

    return createdTasks;
  }

  // Quiz Results
  async saveQuizResult(result: { userId: number; quizId: number; score: number; answers: any }): Promise<QuizResult> {
    const id = this.currentQuizResultId++;
    const quizResult: QuizResult = {
      ...result,
      id,
      completedAt: new Date(),
    };
    this.quizResults.set(id, quizResult);
    return quizResult;
  }

  async getUserQuizResults(userId: number): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values()).filter(result => result.userId === userId);
  }
}

export const storage = new MemStorage();
