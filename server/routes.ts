import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSummarySchema, insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User Registration
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Generate unique student code
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const studentCode = `STB-${year}-${random}`;
      
      const user = await storage.createUser({
        ...userData,
        studentCode,
      });
      
      res.json({ success: true, user: { id: user.id, studentCode: user.studentCode } });
    } catch (error) {
      res.status(400).json({ message: "فشل في إنشاء المستخدم", error: error.message });
    }
  });

  // Get current user info
  app.get("/api/users/me", async (req, res) => {
    try {
      // In a real app, you'd get user ID from JWT token or session
      const userId = parseInt(req.headers['x-user-id'] as string);
      if (!userId) {
        return res.status(401).json({ message: "غير مصرح" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "المستخدم غير موجود" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "خطأ في الخادم", error: error.message });
    }
  });

  // Tasks Management
  app.get("/api/tasks", async (req, res) => {
    try {
      const userId = parseInt(req.headers['x-user-id'] as string);
      if (!userId) {
        return res.status(401).json({ message: "غير مصرح" });
      }
      
      const tasks = await storage.getUserTasks(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "فشل في جلب المهام", error: error.message });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const userId = parseInt(req.headers['x-user-id'] as string);
      if (!userId) {
        return res.status(401).json({ message: "غير مصرح" });
      }
      
      const taskData = {
        userId,
        title: req.body.title,
        description: req.body.description || null,
        isAdminTask: false,
      };
      
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "فشل في إضافة المهمة", error: error.message });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const updates = req.body;
      
      const task = await storage.updateTask(taskId, updates);
      if (!task) {
        return res.status(404).json({ message: "المهمة غير موجودة" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "فشل في تحديث المهمة", error: error.message });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      
      const success = await storage.deleteTask(taskId);
      if (!success) {
        return res.status(404).json({ message: "المهمة غير موجودة" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "فشل في حذف المهمة", error: error.message });
    }
  });

  // Summaries Management
  app.get("/api/summaries", async (req, res) => {
    try {
      const week = req.query.week ? parseInt(req.query.week as string) : undefined;
      
      if (week) {
        const summaries = await storage.getSummariesByWeek(week);
        res.json(summaries);
      } else {
        const summaries = await storage.getAllSummaries();
        res.json(summaries);
      }
    } catch (error) {
      res.status(500).json({ message: "فشل في جلب الملخصات", error: error.message });
    }
  });

  app.get("/api/summaries/:week/:day", async (req, res) => {
    try {
      const week = parseInt(req.params.week);
      const day = parseInt(req.params.day);
      
      const summary = await storage.getSummary(week, day);
      if (!summary) {
        return res.status(404).json({ message: "الملخص غير موجود" });
      }
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "فشل في جلب الملخص", error: error.message });
    }
  });

  // Quiz Management
  app.get("/api/quizzes/:week", async (req, res) => {
    try {
      const week = parseInt(req.params.week);
      const day = req.query.day ? parseInt(req.query.day as string) : undefined;
      
      const quiz = await storage.getQuiz(week, day);
      if (!quiz) {
        return res.status(404).json({ message: "الاختبار غير موجود" });
      }
      
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "فشل في جلب الاختبار", error: error.message });
    }
  });

  app.post("/api/quiz-results", async (req, res) => {
    try {
      const userId = parseInt(req.headers['x-user-id'] as string);
      if (!userId) {
        return res.status(401).json({ message: "غير مصرح" });
      }
      
      const { quizId, score, answers } = req.body;
      
      const result = await storage.saveQuizResult({
        userId,
        quizId,
        score,
        answers,
      });
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "فشل في حفظ نتيجة الاختبار", error: error.message });
    }
  });

  // Admin Routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      // In a real app, verify admin permissions here
      const adminEmail = req.headers['x-admin-email'] as string;
      if (adminEmail !== "admin@studyboss.com") {
        return res.status(403).json({ message: "غير مصرح لك بالوصول" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "فشل في جلب المستخدمين", error: error.message });
    }
  });

  app.patch("/api/admin/users/:id/activate", async (req, res) => {
    try {
      const adminEmail = req.headers['x-admin-email'] as string;
      if (adminEmail !== "admin@studyboss.com") {
        return res.status(403).json({ message: "غير مصرح لك بالوصول" });
      }
      
      const userId = parseInt(req.params.id);
      const { planType } = req.body;
      
      const user = await storage.updateUser(userId, {
        planType,
        isActive: true,
      });
      
      if (!user) {
        return res.status(404).json({ message: "المستخدم غير موجود" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "فشل في تفعيل المستخدم", error: error.message });
    }
  });

  app.get("/api/admin/summaries", async (req, res) => {
    try {
      const adminEmail = req.headers['x-admin-email'] as string;
      if (adminEmail !== "admin@studyboss.com") {
        return res.status(403).json({ message: "غير مصرح لك بالوصول" });
      }
      
      const summaries = await storage.getAllSummaries();
      res.json(summaries);
    } catch (error) {
      res.status(500).json({ message: "فشل في جلب الملخصات", error: error.message });
    }
  });

  app.post("/api/admin/summaries", async (req, res) => {
    try {
      const adminEmail = req.headers['x-admin-email'] as string;
      if (adminEmail !== "admin@studyboss.com") {
        return res.status(403).json({ message: "غير مصرح لك بالوصول" });
      }
      
      const summaryData = insertSummarySchema.parse(req.body);
      const summary = await storage.createSummary(summaryData);
      res.json(summary);
    } catch (error) {
      res.status(400).json({ message: "فشل في إضافة الملخص", error: error.message });
    }
  });

  app.post("/api/admin/tasks", async (req, res) => {
    try {
      const adminEmail = req.headers['x-admin-email'] as string;
      if (adminEmail !== "admin@studyboss.com") {
        return res.status(403).json({ message: "غير مصرح لك بالوصول" });
      }
      
      const { title, description } = req.body;
      
      const tasks = await storage.createAdminTask({
        title,
        description,
        isAdminTask: true,
      });
      
      res.json({ success: true, tasksCreated: tasks.length });
    } catch (error) {
      res.status(400).json({ message: "فشل في إضافة المهمة الإدارية", error: error.message });
    }
  });

  app.post("/api/admin/quizzes", async (req, res) => {
    try {
      const adminEmail = req.headers['x-admin-email'] as string;
      if (adminEmail !== "admin@studyboss.com") {
        return res.status(403).json({ message: "غير مصرح لك بالوصول" });
      }
      
      const quizData = req.body;
      const quiz = await storage.createQuiz(quizData);
      res.json(quiz);
    } catch (error) {
      res.status(400).json({ message: "فشل في إضافة الاختبار", error: error.message });
    }
  });

  // Student progress and analytics
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const tasks = await storage.getUserTasks(userId);
      const quizResults = await storage.getUserQuizResults(userId);
      
      const completedTasks = tasks.filter(task => task.isCompleted).length;
      const totalTasks = tasks.length;
      const averageQuizScore = quizResults.length > 0 
        ? quizResults.reduce((sum, result) => sum + result.score, 0) / quizResults.length 
        : 0;
      
      res.json({
        completedTasks,
        totalTasks,
        taskCompletionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        averageQuizScore,
        totalQuizzesTaken: quizResults.length,
      });
    } catch (error) {
      res.status(500).json({ message: "فشل في جلب بيانات التقدم", error: error.message });
    }
  });

  // File download endpoint for summaries
  app.get("/api/download/summary/:week/:day", async (req, res) => {
    try {
      const week = parseInt(req.params.week);
      const day = parseInt(req.params.day);
      
      const summary = await storage.getSummary(week, day);
      if (!summary) {
        return res.status(404).json({ message: "الملخص غير موجود" });
      }
      
      // In a real app, this would handle file downloads from Firebase Storage
      res.json({
        title: summary.title,
        content: summary.content,
        downloadUrl: summary.fileUrl || null,
      });
    } catch (error) {
      res.status(500).json({ message: "فشل في تحميل الملخص", error: error.message });
    }
  });

  // Search functionality
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "مطلوب نص البحث" });
      }
      
      const summaries = await storage.getAllSummaries();
      const quizzes = await storage.getAllQuizzes();
      
      const filteredSummaries = summaries.filter(summary =>
        summary.title.toLowerCase().includes(query.toLowerCase()) ||
        (summary.content && summary.content.toLowerCase().includes(query.toLowerCase()))
      );
      
      const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(query.toLowerCase())
      );
      
      res.json({
        summaries: filteredSummaries,
        quizzes: filteredQuizzes,
      });
    } catch (error) {
      res.status(500).json({ message: "فشل في البحث", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
