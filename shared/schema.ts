import { pgTable, text, serial, integer, boolean, uuid, timestamp, jsonb, real, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Core users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  full_name: varchar("full_name", { length: 255 }),
  position: varchar("position", { length: 255 }),
  company_name: varchar("company_name", { length: 255 }),
  company_cnpj: varchar("company_cnpj", { length: 50 }),
  avatar_url: text("avatar_url"),
  role: varchar("role", { length: 100 }).default("user"),
  status: varchar("status", { length: 50 }).default("active"),
  phone: varchar("phone", { length: 50 }),
  department: varchar("department", { length: 255 }),
  bio: text("bio"),
  // Credits system fields
  plan_type: varchar("plan_type", { length: 50 }).default("trial"),
  total_credits: integer("total_credits").default(1000),
  used_credits: integer("used_credits").default(0),
  remaining_credits: integer("remaining_credits").default(1000),
  trial_ends_at: timestamp("trial_ends_at"),
  // Multi-tenant isolation
  tenant_id: varchar("tenant_id", { length: 255 }),
  is_founder: boolean("is_founder").default(false),
  // Email verification
  email_verified: boolean("email_verified").default(false),
  email_verification_token: varchar("email_verification_token", { length: 255 }),
  email_verification_sent_at: timestamp("email_verification_sent_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Collaborators table
export const collaborators = pgTable("collaborators", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  tenant_id: varchar("tenant_id", { length: 255 }).notNull(), // Multi-tenant isolation
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
  status: text("status").notNull().default("active"),
  phone: text("phone"),
  location: text("location"),
  join_date: timestamp("join_date").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Companies table for founder dashboard
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  domain: text("domain"),
  plan_type: text("plan_type").notNull().default("starter"),
  status: text("status").notNull().default("active"),
  mrr: real("mrr"),
  arr: real("arr"),
  trial_ends_at: timestamp("trial_ends_at"),
  subscription_started_at: timestamp("subscription_started_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// User roles table
export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  role: text("role").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Documents table
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("general"),
  version: text("version").notNull().default("1.0"),
  file_url: text("file_url"),
  file_size: integer("file_size"),
  pages: integer("pages"),
  access_level: text("access_level").notNull().default("all"),
  download_count: integer("download_count").notNull().default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Feedbacks table
export const feedbacks = pgTable("feedbacks", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  from_user_id: uuid("from_user_id").notNull(),
  to_collaborator_id: uuid("to_collaborator_id").notNull().references(() => collaborators.id),
  type: text("type").notNull().default("performance"),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  rating: integer("rating"),
  status: text("status").notNull().default("sent"),
  anonymous: boolean("anonymous").notNull().default(false),
  urgent: boolean("urgent").notNull().default(false),
  send_email: boolean("send_email").notNull().default(false),
  send_notification: boolean("send_notification").notNull().default(false),
  notification_method: text("notification_method").notNull().default("notification"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Certificate templates table
export const certificateTemplates = pgTable("certificate_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull().default("completion"),
  template_url: text("template_url"),
  auto_fill_data: jsonb("auto_fill_data"),
  active: boolean("active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Business context table for BrainSys IAO calibration
export const businessContext = pgTable("business_context", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id).unique(),
  company_industry: varchar("company_industry", { length: 255 }),
  company_size: varchar("company_size", { length: 100 }),
  company_culture: text("company_culture"),
  business_goals: text("business_goals"),
  target_audience: text("target_audience"),
  core_values: text("core_values"),
  organizational_structure: text("organizational_structure"),
  communication_style: varchar("communication_style", { length: 100 }),
  management_approach: varchar("management_approach", { length: 100 }),
  performance_metrics: text("performance_metrics"),
  training_priorities: text("training_priorities"),
  compliance_requirements: text("compliance_requirements"),
  technology_stack: text("technology_stack"),
  market_position: text("market_position"),
  competitive_advantages: text("competitive_advantages"),
  growth_stage: varchar("growth_stage", { length: 100 }),
  geographical_presence: text("geographical_presence"),
  language_preferences: varchar("language_preferences", { length: 100 }).default("pt-BR"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Payroll table for salary management
export const payroll = pgTable("payroll", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  collaborator_id: uuid("collaborator_id").notNull().references(() => collaborators.id),
  period_month: integer("period_month").notNull(),
  period_year: integer("period_year").notNull(),
  base_salary: real("base_salary").notNull(),
  overtime_hours: real("overtime_hours").default(0),
  overtime_rate: real("overtime_rate").default(0),
  bonuses: real("bonuses").default(0),
  commissions: real("commissions").default(0),
  gross_salary: real("gross_salary").notNull(),
  inss_deduction: real("inss_deduction").default(0),
  irrf_deduction: real("irrf_deduction").default(0),
  other_deductions: real("other_deductions").default(0),
  total_deductions: real("total_deductions").default(0),
  net_salary: real("net_salary").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, paid
  payment_date: timestamp("payment_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Benefits table
export const benefits = pgTable("benefits", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // health, dental, meal, transport, gym, etc
  provider: text("provider"),
  cost_per_employee: real("cost_per_employee"),
  company_contribution: real("company_contribution"),
  employee_contribution: real("employee_contribution"),
  eligibility_criteria: jsonb("eligibility_criteria"),
  active: boolean("active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Employee benefits assignment
export const employee_benefits = pgTable("employee_benefits", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  collaborator_id: uuid("collaborator_id").notNull().references(() => collaborators.id),
  benefit_id: uuid("benefit_id").notNull().references(() => benefits.id),
  enrolled_date: timestamp("enrolled_date").defaultNow(),
  status: text("status").notNull().default("active"), // active, suspended, cancelled
  monthly_cost: real("monthly_cost"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Timesheet table for digital time tracking
export const timesheet = pgTable("timesheet", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  collaborator_id: uuid("collaborator_id").notNull().references(() => collaborators.id),
  date: timestamp("date").notNull(),
  clock_in: timestamp("clock_in"),
  clock_out: timestamp("clock_out"),
  break_start: timestamp("break_start"),
  break_end: timestamp("break_end"),
  total_hours: real("total_hours"),
  overtime_hours: real("overtime_hours"),
  location: text("location"),
  ip_address: text("ip_address"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Trainings table (modernized with AI content generation)
export const trainings = pgTable("trainings", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  duration: text("duration"),
  instructor: text("instructor"),
  status: text("status").notNull().default("active"),
  category: text("category").notNull().default("general"),
  difficulty: text("difficulty").notNull().default("beginner"), // beginner, intermediate, advanced
  training_type: text("training_type").notNull().default("course"), // course, simulation, workshop
  participants: integer("participants").notNull().default(0),
  rating: real("rating"),
  thumbnail: text("thumbnail"),
  // AI-generated content fields
  ai_generated: boolean("ai_generated").notNull().default(false),
  organizational_context: jsonb("organizational_context"), // Company-specific context
  learning_objectives: jsonb("learning_objectives"), // AI-generated objectives
  content_modules: jsonb("content_modules"), // Dynamic content modules
  simulations: jsonb("simulations"), // Workplace simulations
  assessment_criteria: jsonb("assessment_criteria"), // AI-generated assessments
  personalization_data: jsonb("personalization_data"), // User-specific adaptations
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Training Content Templates (for AI generation)
export const trainingContentTemplates = pgTable("training_content_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  template_type: text("template_type").notNull(), // simulation, course, workshop
  content_structure: jsonb("content_structure"), // Template structure
  ai_prompts: jsonb("ai_prompts"), // AI generation prompts
  variables: jsonb("variables"), // Customizable variables
  difficulty_levels: jsonb("difficulty_levels"), // Content by difficulty
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Training Simulations (workplace challenges)
export const trainingSimulations = pgTable("training_simulations", {
  id: uuid("id").primaryKey().defaultRandom(),
  training_id: uuid("training_id").notNull().references(() => trainings.id),
  user_id: uuid("user_id").notNull().references(() => users.id),
  simulation_name: text("simulation_name").notNull(),
  scenario_description: text("scenario_description").notNull(),
  challenge_type: text("challenge_type").notNull(), // leadership, communication, problem-solving
  workplace_context: jsonb("workplace_context"), // Real workplace scenarios
  decision_points: jsonb("decision_points"), // Interactive decision points
  feedback_mechanisms: jsonb("feedback_mechanisms"), // AI feedback
  success_metrics: jsonb("success_metrics"), // Performance tracking
  difficulty_level: text("difficulty_level").notNull().default("beginner"),
  estimated_duration: text("estimated_duration"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Training Enrollments (user progress)
export const trainingEnrollments = pgTable("training_enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  training_id: uuid("training_id").notNull().references(() => trainings.id),
  user_id: uuid("user_id").notNull().references(() => users.id),
  collaborator_id: uuid("collaborator_id").references(() => collaborators.id),
  enrollment_date: timestamp("enrollment_date").defaultNow(),
  status: text("status").notNull().default("enrolled"), // enrolled, in-progress, completed, dropped
  progress: integer("progress").notNull().default(0), // 0-100
  current_module: text("current_module"),
  completion_date: timestamp("completion_date"),
  final_score: real("final_score"),
  badges_earned: jsonb("badges_earned"),
  ai_feedback: jsonb("ai_feedback"), // Personalized AI feedback
  performance_analytics: jsonb("performance_analytics"), // Learning analytics
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Organizational Context (for AI personalization)
export const organizationalContexts = pgTable("organizational_contexts", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  context_name: text("context_name").notNull(),
  industry: text("industry"),
  company_size: text("company_size"),
  company_culture: jsonb("company_culture"), // Values, practices, etc.
  common_challenges: jsonb("common_challenges"), // Typical workplace challenges
  role_definitions: jsonb("role_definitions"), // Company-specific roles
  communication_style: text("communication_style"),
  performance_metrics: jsonb("performance_metrics"), // KPIs and success metrics
  training_priorities: jsonb("training_priorities"), // Focus areas
  compliance_requirements: jsonb("compliance_requirements"), // Legal/industry requirements
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Onboarding processes table
export const onboardingProcesses = pgTable("onboarding_processes", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  collaborator_id: uuid("collaborator_id").notNull().references(() => collaborators.id),
  status: text("status").notNull().default("not-started"),
  progress: integer("progress").notNull().default(0),
  current_step: text("current_step").notNull().default("welcome"),
  start_date: timestamp("start_date").defaultNow(),
  position: text("position").notNull(),
  department: text("department").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// User credits table
export const userCredits = pgTable("user_credits", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  total: integer("total").notNull().default(0),
  used: integer("used").notNull().default(0),
  remaining: integer("remaining").notNull().default(0),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Gamification table
export const gamification = pgTable("gamification", {
  user_id: uuid("user_id").primaryKey().references(() => users.id),
  total_points: integer("total_points").notNull().default(0),
  level: integer("level").notNull().default(1),
  total_badges: integer("total_badges").notNull().default(0),
  rank: integer("rank").notNull().default(0),
  current_streak: integer("current_streak").notNull().default(0),
  longest_streak: integer("longest_streak").notNull().default(0),
  next_level_progress: real("next_level_progress").notNull().default(0),
  recent_achievements: jsonb("recent_achievements"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateUserSchema = createInsertSchema(users).omit({
  id: true,
  email: true,
  password: true,
  created_at: true,
  updated_at: true,
}).partial();

export const selectUserSchema = createInsertSchema(users);

export const insertCollaboratorSchema = createInsertSchema(collaborators).omit({
  id: true,
  created_at: true,
  updated_at: true,
  tenant_id: true, // Generated on server
  user_id: true, // Provided separately
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertFeedbackSchema = createInsertSchema(feedbacks).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertCertificateTemplateSchema = createInsertSchema(certificateTemplates).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertPayrollSchema = createInsertSchema(payroll).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertBenefitSchema = createInsertSchema(benefits).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertEmployeeBenefitSchema = createInsertSchema(employee_benefits).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertTimesheetSchema = createInsertSchema(timesheet).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertTrainingSchema = createInsertSchema(trainings).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// New training-related schemas
export const insertTrainingContentTemplateSchema = createInsertSchema(trainingContentTemplates).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertTrainingSimulationSchema = createInsertSchema(trainingSimulations).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertTrainingEnrollmentSchema = createInsertSchema(trainingEnrollments).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertOrganizationalContextSchema = createInsertSchema(organizationalContexts).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertOnboardingProcessSchema = createInsertSchema(onboardingProcesses).omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true, // Generated on server
});

export const insertBusinessContextSchema = createInsertSchema(businessContext).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>; 
export type User = typeof users.$inferSelect;
export type Training = typeof trainings.$inferSelect;
export type TrainingContentTemplate = typeof trainingContentTemplates.$inferSelect;
export type TrainingSimulation = typeof trainingSimulations.$inferSelect;
export type TrainingEnrollment = typeof trainingEnrollments.$inferSelect;
export type OrganizationalContext = typeof organizationalContexts.$inferSelect;
export type InsertTraining = z.infer<typeof insertTrainingSchema>;
export type InsertTrainingContentTemplate = z.infer<typeof insertTrainingContentTemplateSchema>;
export type InsertTrainingSimulation = z.infer<typeof insertTrainingSimulationSchema>;
export type InsertTrainingEnrollment = z.infer<typeof insertTrainingEnrollmentSchema>;
export type InsertOrganizationalContext = z.infer<typeof insertOrganizationalContextSchema>;
export type InsertCollaborator = z.infer<typeof insertCollaboratorSchema>;
export type Collaborator = typeof collaborators.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedbacks.$inferSelect;
export type InsertCertificateTemplate = z.infer<typeof insertCertificateTemplateSchema>;
export type CertificateTemplate = typeof certificateTemplates.$inferSelect;

export type InsertPayroll = z.infer<typeof insertPayrollSchema>;
export type Payroll = typeof payroll.$inferSelect;

export type InsertBenefit = z.infer<typeof insertBenefitSchema>;
export type Benefit = typeof benefits.$inferSelect;

export type InsertEmployeeBenefit = z.infer<typeof insertEmployeeBenefitSchema>;
export type EmployeeBenefit = typeof employee_benefits.$inferSelect;

export type InsertTimesheet = z.infer<typeof insertTimesheetSchema>;
export type Timesheet = typeof timesheet.$inferSelect;

export type InsertOnboardingProcess = z.infer<typeof insertOnboardingProcessSchema>;
export type OnboardingProcess = typeof onboardingProcesses.$inferSelect;
export type InsertBusinessContext = z.infer<typeof insertBusinessContextSchema>;
export type BusinessContext = typeof businessContext.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type UserRole = typeof userRoles.$inferSelect;
export type UserCredits = typeof userCredits.$inferSelect;
export type Gamification = typeof gamification.$inferSelect;

// Job Vacancies table for recruitment
export const jobVacancies = pgTable("job_vacancies", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  department: varchar("department", { length: 100 }),
  location: varchar("location", { length: 100 }),
  type: varchar("type", { length: 50 }).notNull(), // full-time, part-time, contract
  level: varchar("level", { length: 50 }), // junior, pleno, senior
  description: text("description").notNull(),
  requirements: text("requirements").array(), // JSON array of requirements
  salary_range: varchar("salary_range", { length: 100 }),
  benefits: text("benefits").array(), // JSON array of benefits
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, paused, closed
  company_logo: varchar("company_logo", { length: 500 }), // URL to company logo
  application_deadline: timestamp("application_deadline"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Job Applications table for candidate applications
export const jobApplications = pgTable("job_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  vacancy_id: uuid("vacancy_id").notNull().references(() => jobVacancies.id),
  candidate_name: varchar("candidate_name", { length: 255 }).notNull(),
  candidate_email: varchar("candidate_email", { length: 255 }).notNull(),
  candidate_phone: varchar("candidate_phone", { length: 50 }),
  linkedin_url: varchar("linkedin_url", { length: 500 }),
  portfolio_url: varchar("portfolio_url", { length: 500 }),
  resume_url: varchar("resume_url", { length: 500 }), // CV file URL
  cover_letter: text("cover_letter"),
  experience_years: integer("experience_years"),
  current_salary: real("current_salary"),
  expected_salary: real("expected_salary"),
  availability: varchar("availability", { length: 100 }), // immediate, 30_days, etc
  status: varchar("status", { length: 20 }).notNull().default("applied"), // applied, reviewing, interview, approved, rejected
  applied_at: timestamp("applied_at").defaultNow(),
  reviewed_at: timestamp("reviewed_at"),
  notes: text("notes"), // Internal recruiter notes
});

// Insert schemas for job vacancies and applications
export const insertJobVacancySchema = createInsertSchema(jobVacancies).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  applied_at: true,
  reviewed_at: true,
});

export type JobVacancy = typeof jobVacancies.$inferSelect;
export type InsertJobVacancy = z.infer<typeof insertJobVacancySchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;

// ========================================
// STRATEGIC VISION MODULE - CHESS ORCHESTRATION
// Only accessible to founders - high-risk strategic information
// ========================================

// 1. Strategic Contexts - Company strategic context and market position
export const strategicContexts = pgTable("strategic_contexts", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenant_id: varchar("tenant_id", { length: 255 }).notNull(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  // Company Identification
  company_name: varchar("company_name", { length: 255 }).notNull(),
  sector: varchar("sector", { length: 255 }),
  business_model: varchar("business_model", { length: 100 }), // B2B, B2C, SaaS, Marketplace, etc
  founding_year: integer("founding_year"),
  headquarters: varchar("headquarters", { length: 255 }),
  branches: text("branches").array(),
  // Current Moment
  stage: varchar("stage", { length: 50 }), // seed, early, scaleup, growth, mature
  current_arr: real("current_arr"),
  growth_rate: real("growth_rate"), // % MoM or YoY
  headcount: integer("headcount"),
  funding_round: varchar("funding_round", { length: 100 }),
  // Market Context
  market_size_tam: real("market_size_tam"),
  market_size_sam: real("market_size_sam"),
  market_size_som: real("market_size_som"),
  competitors: text("competitors").array(),
  competitive_advantage: text("competitive_advantage"),
  market_trends: text("market_trends").array(),
  threats: text("threats").array(),
  opportunities: text("opportunities").array(),
  // Strategic Objectives
  vision_3_5_years: text("vision_3_5_years"),
  growth_objectives: text("growth_objectives"),
  challenges: text("challenges").array(),
  strategic_priorities: text("strategic_priorities").array(), // Top 5
  // Culture and Values
  core_values: text("core_values").array(),
  leadership_style: varchar("leadership_style", { length: 100 }),
  process_maturity: integer("process_maturity"), // 1-10
  cultural_practices: text("cultural_practices").array(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 2. Org Chart Positions - Dynamic hierarchical organization structure
export const orgChartPositions = pgTable("org_chart_positions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenant_id: varchar("tenant_id", { length: 255 }).notNull(),
  strategic_context_id: uuid("strategic_context_id").notNull().references(() => strategicContexts.id),
  collaborator_id: uuid("collaborator_id").references(() => collaborators.id), // Optional link to actual collaborator
  // Position Info
  position_name: varchar("position_name", { length: 255 }).notNull(),
  department: varchar("department", { length: 100 }).notNull(),
  seniority: varchar("seniority", { length: 50 }), // junior, pleno, senior, lead, director, vp, c-level
  reports_to: uuid("reports_to").references(() => orgChartPositions.id), // Self-reference for hierarchy
  direct_reports_count: integer("direct_reports_count").default(0),
  // Time Tracking
  months_in_company: integer("months_in_company"),
  months_in_position: integer("months_in_position"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 3. Competency Profiles - Hard & soft skills per position
export const competencyProfiles = pgTable("competency_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenant_id: varchar("tenant_id", { length: 255 }).notNull(),
  org_chart_position_id: uuid("org_chart_position_id").notNull().references(() => orgChartPositions.id),
  // Skills (JSON arrays: [{skill, proficiency/level, certifications}])
  hard_skills: jsonb("hard_skills"), // Technical competencies (1-4: Basic, Intermediate, Advanced, Expert)
  soft_skills: jsonb("soft_skills"), // Behavioral competencies (1-4: Emergent, Developed, Strong, Exceptional)
  // Individual Context
  engagement_level: integer("engagement_level"), // 1-10
  growth_potential: varchar("growth_potential", { length: 20 }), // high, medium, low
  growth_potential_reason: text("growth_potential_reason"),
  exit_risk: varchar("exit_risk", { length: 20 }), // high, medium, low
  exit_risk_indicators: text("exit_risk_indicators").array(),
  critical_gaps: text("critical_gaps").array(), // Skills missing for next level
  current_projects: text("current_projects").array(), // 2-3 main responsibilities
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 4. Strategic Simulations - Scenario planning and what-if analysis
export const strategicSimulations = pgTable("strategic_simulations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenant_id: varchar("tenant_id", { length: 255 }).notNull(),
  strategic_context_id: uuid("strategic_context_id").notNull().references(() => strategicContexts.id),
  created_by: uuid("created_by").notNull().references(() => users.id),
  // Simulation Details
  simulation_type: varchar("simulation_type", { length: 50 }).notNull(), // promotion, growth, layoff, new_office, loss_key_person, restructure
  scenario_description: text("scenario_description").notNull(),
  input_parameters: jsonb("input_parameters"), // Simulation inputs
  // AI Analysis Results
  primary_analysis: jsonb("primary_analysis"), // {capacity_impact, morale_impact, skill_gaps, backfill_needs}
  cascade_effects: jsonb("cascade_effects"), // {level_1, level_2, level_3}
  scenarios: jsonb("scenarios"), // [{type: optimistic/realistic/pessimistic, probability, description}]
  mitigation_plan: jsonb("mitigation_plan"), // {risks[], preventive_actions[], metrics[], timeline}
  benchmarks: jsonb("benchmarks"), // Market comparisons
  // Status
  status: varchar("status", { length: 20 }).notNull().default("draft"), // draft, running, completed
  results: jsonb("results"), // Full AI-generated results
  created_at: timestamp("created_at").defaultNow(),
  completed_at: timestamp("completed_at"),
});

// 5. Strategic Alerts - Weak signals and organizational health warnings
export const strategicAlerts = pgTable("strategic_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenant_id: varchar("tenant_id", { length: 255 }).notNull(),
  strategic_context_id: uuid("strategic_context_id").notNull().references(() => strategicContexts.id),
  // Alert Classification
  alert_type: varchar("alert_type", { length: 50 }).notNull(), // talent, structural, strategic
  cluster: varchar("cluster", { length: 100 }), // Specific issue category
  severity: varchar("severity", { length: 20 }).notNull(), // green, yellow, red
  // Alert Content
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  impact_assessment: text("impact_assessment"),
  urgency: varchar("urgency", { length: 20 }).notNull(), // low, medium, high, critical
  recommendations: text("recommendations").array(),
  affected_positions: text("affected_positions").array(), // Array of org_chart_position_ids
  // Alert Lifecycle
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, acknowledged, resolved, dismissed
  acknowledged_by: uuid("acknowledged_by").references(() => users.id),
  acknowledged_at: timestamp("acknowledged_at"),
  resolved_at: timestamp("resolved_at"),
  created_at: timestamp("created_at").defaultNow(),
});

// 6. Growth Health Metrics - Quarterly health index tracking
export const growthHealthMetrics = pgTable("growth_health_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenant_id: varchar("tenant_id", { length: 255 }).notNull(),
  strategic_context_id: uuid("strategic_context_id").notNull().references(() => strategicContexts.id),
  // Period
  period_start: timestamp("period_start").notNull(),
  period_end: timestamp("period_end").notNull(),
  // Financial Health (0-25 points)
  financial_health_score: real("financial_health_score").notNull().default(0),
  financial_metrics: jsonb("financial_metrics"), // {runway, margins, cac_payback, rule_of_40}
  // Operational Health (0-25 points)
  operational_health_score: real("operational_health_score").notNull().default(0),
  operational_metrics: jsonb("operational_metrics"), // {nps, churn, time_to_market, tech_debt}
  // Organizational Health (0-25 points)
  organizational_health_score: real("organizational_health_score").notNull().default(0),
  organizational_metrics: jsonb("organizational_metrics"), // {enps, turnover, time_to_hire, diversity, ld_investment}
  // Strategic Health (0-25 points)
  strategic_health_score: real("strategic_health_score").notNull().default(0),
  strategic_metrics: jsonb("strategic_metrics"), // {vision_clarity, roadmap_quality, innovation_pipeline, competitive_advantage}
  // Total Score (0-100)
  total_score: real("total_score").notNull().default(0),
  created_at: timestamp("created_at").defaultNow(),
});

// 7. Development Plans - Individual development plans and succession planning
export const developmentPlans = pgTable("development_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenant_id: varchar("tenant_id", { length: 255 }).notNull(),
  org_chart_position_id: uuid("org_chart_position_id").notNull().references(() => orgChartPositions.id),
  created_by: uuid("created_by").notNull().references(() => users.id),
  created_for: uuid("created_for").references(() => users.id), // The person this PDI is for
  // Gap Analysis
  gap_analysis: jsonb("gap_analysis"), // {current_competencies, needed_competencies, priority_gaps}
  // Development Goals
  short_term_goals: text("short_term_goals").array(), // 3-6 months
  medium_term_goals: text("medium_term_goals").array(), // 6-12 months
  actions: jsonb("actions"), // [{type, description, timeline, resources}]
  progress_metrics: text("progress_metrics").array(),
  // Succession Planning
  succession_candidates: jsonb("succession_candidates"), // [{candidate_id, readiness, gaps, preparation_plan}]
  // Status
  status: varchar("status", { length: 20 }).notNull().default("draft"), // draft, active, completed
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 8. Strategic Roadmaps - Hiring and growth roadmaps
export const strategicRoadmaps = pgTable("strategic_roadmaps", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenant_id: varchar("tenant_id", { length: 255 }).notNull(),
  strategic_context_id: uuid("strategic_context_id").notNull().references(() => strategicContexts.id),
  // Roadmap Details
  objective: text("objective").notNull(),
  timeline_months: integer("timeline_months").notNull(),
  // Headcount Planning
  headcount_needs: jsonb("headcount_needs"), // [{area, seniority, skills[], quantity, priority}]
  // Structural Changes
  structural_changes: jsonb("structural_changes"), // [{type: new_layers/restructure/new_departments, details}]
  // Hiring Sequence
  hiring_sequence: jsonb("hiring_sequence"), // [{order, position, jd, budget, timing}]
  // Risk Assessment
  growth_risks: jsonb("growth_risks"), // [{bottleneck, organizational_debt}]
  // Budget
  total_budget_estimate: real("total_budget_estimate"),
  // Status
  status: varchar("status", { length: 20 }).notNull().default("draft"), // draft, approved, in_progress, completed
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Strategic Vision Insert Schemas
export const insertStrategicContextSchema = createInsertSchema(strategicContexts).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertOrgChartPositionSchema = createInsertSchema(orgChartPositions).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertCompetencyProfileSchema = createInsertSchema(competencyProfiles).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertStrategicSimulationSchema = createInsertSchema(strategicSimulations).omit({
  id: true,
  created_at: true,
  completed_at: true,
});

export const insertStrategicAlertSchema = createInsertSchema(strategicAlerts).omit({
  id: true,
  created_at: true,
  acknowledged_at: true,
  resolved_at: true,
});

export const insertGrowthHealthMetricsSchema = createInsertSchema(growthHealthMetrics).omit({
  id: true,
  created_at: true,
});

export const insertDevelopmentPlanSchema = createInsertSchema(developmentPlans).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertStrategicRoadmapSchema = createInsertSchema(strategicRoadmaps).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Strategic Vision Types
export type StrategicContext = typeof strategicContexts.$inferSelect;
export type InsertStrategicContext = z.infer<typeof insertStrategicContextSchema>;

export type OrgChartPosition = typeof orgChartPositions.$inferSelect;
export type InsertOrgChartPosition = z.infer<typeof insertOrgChartPositionSchema>;

export type CompetencyProfile = typeof competencyProfiles.$inferSelect;
export type InsertCompetencyProfile = z.infer<typeof insertCompetencyProfileSchema>;

export type StrategicSimulation = typeof strategicSimulations.$inferSelect;
export type InsertStrategicSimulation = z.infer<typeof insertStrategicSimulationSchema>;

export type StrategicAlert = typeof strategicAlerts.$inferSelect;
export type InsertStrategicAlert = z.infer<typeof insertStrategicAlertSchema>;

export type GrowthHealthMetrics = typeof growthHealthMetrics.$inferSelect;
export type InsertGrowthHealthMetrics = z.infer<typeof insertGrowthHealthMetricsSchema>;

export type DevelopmentPlan = typeof developmentPlans.$inferSelect;
export type InsertDevelopmentPlan = z.infer<typeof insertDevelopmentPlanSchema>;

export type StrategicRoadmap = typeof strategicRoadmaps.$inferSelect;
export type InsertStrategicRoadmap = z.infer<typeof insertStrategicRoadmapSchema>;

// System Versions table (for Founder Dashboard changelog)
export const systemVersions = pgTable("system_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenant_id: varchar("tenant_id", { length: 255 }).notNull(),
  version: varchar("version", { length: 50 }).notNull(), // Semantic versioning: 1.0.0, 1.1.0, etc
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  changes: jsonb("changes").notNull(), // Array of {category, description, links?}
  release_date: timestamp("release_date").notNull().defaultNow(),
  author_id: uuid("author_id").references(() => users.id),
  impact_tags: text("impact_tags").array(), // ['critical', 'security', 'feature', etc]
  created_at: timestamp("created_at").defaultNow(),
});

// System Versions Zod Schemas
export const insertSystemVersionSchema = createInsertSchema(systemVersions).omit({
  id: true,
  created_at: true,
});

// System Versions Types
export type SystemVersion = typeof systemVersions.$inferSelect;
export type InsertSystemVersion = z.infer<typeof insertSystemVersionSchema>;