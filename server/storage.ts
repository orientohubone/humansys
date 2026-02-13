import { db } from "./db";
import { 
  users, collaborators, trainings, documents, feedbacks, onboardingProcesses, businessContext, jobVacancies, jobApplications,
  strategicContexts, orgChartPositions, competencyProfiles, strategicSimulations, strategicAlerts, growthHealthMetrics, developmentPlans, strategicRoadmaps,
  payroll, timesheet, systemVersions
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import type { 
  User, 
  UpdateUser, 
  InsertUser, 
  Collaborator, 
  InsertCollaborator, 
  Training, 
  InsertTraining,
  Document,
  InsertDocument,
  Feedback,
  InsertFeedback,
  Payroll,
  InsertPayroll,
  Timesheet,
  InsertTimesheet,
  OnboardingProcess,
  InsertOnboardingProcess,
  BusinessContext,
  InsertBusinessContext,
  JobVacancy,
  InsertJobVacancy,
  JobApplication,
  InsertJobApplication,
  StrategicContext,
  InsertStrategicContext,
  OrgChartPosition,
  InsertOrgChartPosition,
  CompetencyProfile,
  InsertCompetencyProfile,
  StrategicSimulation,
  InsertStrategicSimulation,
  StrategicAlert,
  InsertStrategicAlert,
  GrowthHealthMetrics,
  InsertGrowthHealthMetrics,
  DevelopmentPlan,
  InsertDevelopmentPlan,
  StrategicRoadmap,
  InsertStrategicRoadmap,
  SystemVersion,
  InsertSystemVersion
} from "@shared/schema";

// Interface para o storage
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: string, data: UpdateUser): Promise<User | null>;
  updateUserRole(id: string, role: string): Promise<User | null>;
  updateUserStatus(id: string, status: string): Promise<User | null>;
  updateUserCredits(id: string, usedCredits: number): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  
  // Collaborator operations
  getCollaborators(userId: string): Promise<Collaborator[]>;
  getCollaborator(id: string): Promise<Collaborator | undefined>;
  createCollaborator(insertCollaborator: InsertCollaborator): Promise<Collaborator>;
  updateCollaborator(id: string, data: Partial<Collaborator>): Promise<Collaborator | null>;
  deleteCollaborator(id: string): Promise<boolean>;

  // Training operations
  getTrainings(userId: string): Promise<Training[]>;
  getTraining(id: string): Promise<Training | undefined>;
  createTraining(insertTraining: InsertTraining): Promise<Training>;
  updateTraining(id: string, data: Partial<Training>): Promise<Training | null>;
  deleteTraining(id: string): Promise<boolean>;

  // Document operations
  getDocuments(userId: string): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(insertDocument: InsertDocument): Promise<Document>;
  updateDocument(id: string, data: Partial<Document>): Promise<Document | null>;
  deleteDocument(id: string): Promise<boolean>;

  // Feedback operations
  getFeedbacks(userId: string): Promise<Feedback[]>;
  getFeedback(id: string): Promise<Feedback | undefined>;
  createFeedback(insertFeedback: InsertFeedback): Promise<Feedback>;
  updateFeedback(id: string, data: Partial<Feedback>): Promise<Feedback | null>;
  deleteFeedback(id: string): Promise<boolean>;

  // Payroll operations
  getPayrolls(userId: string): Promise<Payroll[]>;
  getPayroll(id: string): Promise<Payroll | undefined>;
  createPayroll(insertPayroll: InsertPayroll): Promise<Payroll>;
  updatePayroll(id: string, data: Partial<Payroll>): Promise<Payroll | null>;
  deletePayroll(id: string): Promise<boolean>;

  // Timesheet operations
  getTimesheets(userId: string): Promise<Timesheet[]>;
  getTimesheet(id: string): Promise<Timesheet | undefined>;
  createTimesheet(insertTimesheet: InsertTimesheet): Promise<Timesheet>;
  updateTimesheet(id: string, data: Partial<Timesheet>): Promise<Timesheet | null>;
  deleteTimesheet(id: string): Promise<boolean>;

  // Onboarding operations
  getOnboardingProcesses(userId: string): Promise<OnboardingProcess[]>;
  getOnboardingProcess(id: string): Promise<OnboardingProcess | undefined>;
  createOnboardingProcess(insertProcess: InsertOnboardingProcess): Promise<OnboardingProcess>;
  updateOnboardingProcess(id: string, data: Partial<OnboardingProcess>): Promise<OnboardingProcess | null>;
  deleteOnboardingProcess(id: string): Promise<boolean>;
  
  // Business Context operations for BrainSys IAO
  getBusinessContext(userId: string): Promise<BusinessContext | undefined>;
  createBusinessContext(insertContext: InsertBusinessContext): Promise<BusinessContext>;
  updateBusinessContext(userId: string, data: Partial<BusinessContext>): Promise<BusinessContext | null>;
  deleteBusinessContext(userId: string): Promise<boolean>;
  
  // Training Enrollment operations
  getTrainingEnrollment(trainingId: string, userId: string): Promise<any | undefined>;

  // Job Vacancies operations
  getJobVacancies(): Promise<JobVacancy[]>;
  getJobVacanciesByUser(userId: string): Promise<JobVacancy[]>;
  getJobVacancy(id: string): Promise<JobVacancy | undefined>;
  createJobVacancy(insertVacancy: InsertJobVacancy): Promise<JobVacancy>;
  updateJobVacancy(id: string, data: Partial<JobVacancy>): Promise<JobVacancy | null>;
  deleteJobVacancy(id: string): Promise<boolean>;

  // Job Applications operations
  getAllJobApplications(userId: string): Promise<JobApplication[]>;
  getJobApplications(vacancyId: string): Promise<JobApplication[]>;
  getJobApplication(id: string): Promise<JobApplication | undefined>;
  createJobApplication(insertApplication: InsertJobApplication): Promise<JobApplication>;
  updateJobApplication(id: string, data: Partial<JobApplication>): Promise<JobApplication | null>;
  deleteJobApplication(id: string): Promise<boolean>;
  createTrainingEnrollment(enrollment: any): Promise<any>;
  getActiveOrganizationalContext(userId: string): Promise<any | undefined>;
  createOrganizationalContext(userId: string, context: any): Promise<any>;
  
  // Multi-tenant operations
  getAllCollaborators(): Promise<Collaborator[]>;
  
  // Company operations for FounderDashboard
  getCompanies(): Promise<any[]>;
  createCompany(data: any): Promise<any>;
  
  // Gamification operations
  getGamification(userId: string): Promise<any | undefined>;
  createGamification(data: any): Promise<any>;
  
  // Certificate Templates
  getCertificateTemplates(userId: string): Promise<any[]>;
  createCertificateTemplate(data: any): Promise<any>;
  
  // ========== STRATEGIC VISION OPERATIONS (FOUNDERS ONLY) ==========
  
  // Strategic Context operations
  getStrategicContext(tenantId: string): Promise<StrategicContext | undefined>;
  createStrategicContext(insertContext: InsertStrategicContext): Promise<StrategicContext>;
  updateStrategicContext(id: string, tenantId: string, data: Partial<StrategicContext>): Promise<StrategicContext | null>;
  deleteStrategicContext(id: string, tenantId: string): Promise<boolean>;
  
  // Org Chart Position operations
  getOrgChartPositions(tenantId: string): Promise<OrgChartPosition[]>;
  getOrgChartPosition(id: string, tenantId: string): Promise<OrgChartPosition | undefined>;
  createOrgChartPosition(insertPosition: InsertOrgChartPosition): Promise<OrgChartPosition>;
  updateOrgChartPosition(id: string, tenantId: string, data: Partial<OrgChartPosition>): Promise<OrgChartPosition | null>;
  deleteOrgChartPosition(id: string, tenantId: string): Promise<boolean>;
  
  // Competency Profile operations
  getCompetencyProfile(orgChartPositionId: string, tenantId: string): Promise<CompetencyProfile | undefined>;
  createCompetencyProfile(insertProfile: InsertCompetencyProfile): Promise<CompetencyProfile>;
  updateCompetencyProfile(id: string, tenantId: string, data: Partial<CompetencyProfile>): Promise<CompetencyProfile | null>;
  deleteCompetencyProfile(id: string, tenantId: string): Promise<boolean>;
  
  // Strategic Simulation operations
  getSimulations(tenantId: string): Promise<StrategicSimulation[]>;
  getSimulation(id: string, tenantId: string): Promise<StrategicSimulation | undefined>;
  createSimulation(insertSimulation: InsertStrategicSimulation): Promise<StrategicSimulation>;
  updateSimulation(id: string, tenantId: string, data: Partial<StrategicSimulation>): Promise<StrategicSimulation | null>;
  deleteSimulation(id: string, tenantId: string): Promise<boolean>;
  
  // Strategic Alert operations
  getActiveAlerts(tenantId: string): Promise<StrategicAlert[]>;
  getAlert(id: string, tenantId: string): Promise<StrategicAlert | undefined>;
  createAlert(insertAlert: InsertStrategicAlert): Promise<StrategicAlert>;
  updateAlert(id: string, tenantId: string, data: Partial<StrategicAlert>): Promise<StrategicAlert | null>;
  acknowledgeAlert(id: string, tenantId: string, userId: string): Promise<StrategicAlert | null>;
  resolveAlert(id: string, tenantId: string): Promise<StrategicAlert | null>;
  deleteAlert(id: string, tenantId: string): Promise<boolean>;
  
  // Growth Health Metrics operations
  getLatestHealthMetrics(tenantId: string): Promise<GrowthHealthMetrics | undefined>;
  getHealthMetricsHistory(tenantId: string): Promise<GrowthHealthMetrics[]>;
  createHealthMetrics(insertMetrics: InsertGrowthHealthMetrics): Promise<GrowthHealthMetrics>;
  
  // Development Plan operations
  getDevelopmentPlans(tenantId: string): Promise<DevelopmentPlan[]>;
  getDevelopmentPlan(id: string, tenantId: string): Promise<DevelopmentPlan | undefined>;
  getDevelopmentPlanByPosition(orgChartPositionId: string, tenantId: string): Promise<DevelopmentPlan | undefined>;
  createDevelopmentPlan(insertPlan: InsertDevelopmentPlan): Promise<DevelopmentPlan>;
  updateDevelopmentPlan(id: string, tenantId: string, data: Partial<DevelopmentPlan>): Promise<DevelopmentPlan | null>;
  deleteDevelopmentPlan(id: string, tenantId: string): Promise<boolean>;
  
  // Strategic Roadmap operations
  getRoadmaps(tenantId: string): Promise<StrategicRoadmap[]>;
  getRoadmap(id: string, tenantId: string): Promise<StrategicRoadmap | undefined>;
  createRoadmap(insertRoadmap: InsertStrategicRoadmap): Promise<StrategicRoadmap>;
  updateRoadmap(id: string, tenantId: string, data: Partial<StrategicRoadmap>): Promise<StrategicRoadmap | null>;
  deleteRoadmap(id: string, tenantId: string): Promise<boolean>;
  
  // System Versions operations (Founder Dashboard changelog)
  listSystemVersions(params: { 
    tenantId: string; 
    limit?: number; 
    category?: string; 
    search?: string; 
    sinceVersion?: string; 
  }): Promise<SystemVersion[]>;
  getSystemVersion(id: string, tenantId: string): Promise<SystemVersion | undefined>;
  createSystemVersion(insertVersion: InsertSystemVersion): Promise<SystemVersion>;
}

// PostgreSQL Database Storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, data: UpdateUser): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ ...data, updated_at: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || null;
  }

  async updateUserRole(id: string, role: string): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ role: role, updated_at: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || null;
  }

  async updateUserStatus(id: string, status: string): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ status: status, updated_at: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || null;
  }

  async updateUserCredits(id: string, usedCredits: number): Promise<User | null> {
    const user = await this.getUser(id);
    if (!user) return null;
    
    const remainingCredits = Math.max(0, (user.total_credits || 1000) - usedCredits);
    
    const [updatedUser] = await db
      .update(users)
      .set({ 
        used_credits: usedCredits, 
        remaining_credits: remainingCredits, 
        updated_at: new Date() 
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser || null;
  }

  async deleteUser(id: string): Promise<boolean> {
    // First delete related records (collaborators, etc.) to maintain referential integrity
    await db.delete(collaborators).where(eq(collaborators.user_id, id));
    await db.delete(trainings).where(eq(trainings.user_id, id));
    await db.delete(documents).where(eq(documents.user_id, id));
    await db.delete(feedbacks).where(eq(feedbacks.user_id, id));
    await db.delete(onboardingProcesses).where(eq(onboardingProcesses.user_id, id));
    await db.delete(businessContext).where(eq(businessContext.user_id, id));
    
    // Finally delete the user
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Collaborator operations
  async getCollaborators(userId: string): Promise<Collaborator[]> {
    return await db.select().from(collaborators).where(eq(collaborators.user_id, userId));
  }

  async getCollaborator(id: string): Promise<Collaborator | undefined> {
    const [collaborator] = await db.select().from(collaborators).where(eq(collaborators.id, id));
    return collaborator || undefined;
  }

  async createCollaborator(insertCollaborator: InsertCollaborator): Promise<Collaborator> {
    const [collaborator] = await db
      .insert(collaborators)
      .values(insertCollaborator)
      .returning();
    return collaborator;
  }

  async updateCollaborator(id: string, data: Partial<Collaborator>): Promise<Collaborator | null> {
    const [collaborator] = await db
      .update(collaborators)
      .set({ ...data, updated_at: new Date() })
      .where(eq(collaborators.id, id))
      .returning();
    return collaborator || null;
  }

  async deleteCollaborator(id: string): Promise<boolean> {
    const result = await db.delete(collaborators).where(eq(collaborators.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Training operations
  async getTrainings(userId: string): Promise<Training[]> {
    const dbTrainings = await db.select().from(trainings).where(eq(trainings.user_id, userId));
    
    // If no trainings in database, return mock data for demonstration
    if (dbTrainings.length === 0) {
      return [
        {
          id: 'mock-training-1',
          title: 'Liderança Estratégica',
          description: 'Desenvolva habilidades essenciais de liderança para gestores e supervisores',
          duration: '4 horas',
          instructor: 'Dr. Maria Santos',
          status: 'active' as const,
          participants: 24,
          user_id: userId,
          created_at: new Date('2024-01-15'),
          updated_at: new Date('2024-01-15')
        },
        {
          id: 'mock-training-2',
          title: 'Comunicação Eficaz',
          description: 'Técnicas avançadas de comunicação interpessoal e apresentação',
          duration: '6 horas',
          instructor: 'Prof. João Silva',
          status: 'active' as const,
          participants: 18,
          user_id: userId,
          created_at: new Date('2024-01-10'),
          updated_at: new Date('2024-01-10')
        }
      ];
    }
    
    return dbTrainings;
  }

  async getTraining(id: string): Promise<Training | undefined> {
    const [training] = await db.select().from(trainings).where(eq(trainings.id, id));
    return training || undefined;
  }

  async createTraining(insertTraining: InsertTraining): Promise<Training> {
    const [training] = await db
      .insert(trainings)
      .values(insertTraining)
      .returning();
    return training;
  }

  async updateTraining(id: string, data: Partial<Training>): Promise<Training | null> {
    const [training] = await db
      .update(trainings)
      .set({ ...data, updated_at: new Date() })
      .where(eq(trainings.id, id))
      .returning();
    return training || null;
  }

  async deleteTraining(id: string): Promise<boolean> {
    const result = await db.delete(trainings).where(eq(trainings.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Document operations
  async getDocuments(userId: string): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.user_id, userId));
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document || undefined;
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values(insertDocument)
      .returning();
    return document;
  }

  async updateDocument(id: string, data: Partial<Document>): Promise<Document | null> {
    const [document] = await db
      .update(documents)
      .set({ ...data, updated_at: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return document || null;
  }

  async deleteDocument(id: string): Promise<boolean> {
    const result = await db.delete(documents).where(eq(documents.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Feedback operations
  async getFeedbacks(userId: string): Promise<Feedback[]> {
    return await db.select().from(feedbacks).where(eq(feedbacks.user_id, userId));
  }

  async getFeedback(id: string): Promise<Feedback | undefined> {
    const [feedback] = await db.select().from(feedbacks).where(eq(feedbacks.id, id));
    return feedback || undefined;
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [feedback] = await db
      .insert(feedbacks)
      .values(insertFeedback)
      .returning();
    return feedback;
  }

  async updateFeedback(id: string, data: Partial<Feedback>): Promise<Feedback | null> {
    const [feedback] = await db
      .update(feedbacks)
      .set({ ...data, updated_at: new Date() })
      .where(eq(feedbacks.id, id))
      .returning();
    return feedback || null;
  }

  async deleteFeedback(id: string): Promise<boolean> {
    const result = await db.delete(feedbacks).where(eq(feedbacks.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Payroll operations
  async getPayrolls(userId: string): Promise<Payroll[]> {
    return await db.select().from(payroll).where(eq(payroll.user_id, userId));
  }

  async getPayroll(id: string): Promise<Payroll | undefined> {
    const [payrollRecord] = await db.select().from(payroll).where(eq(payroll.id, id));
    return payrollRecord || undefined;
  }

  async createPayroll(insertPayroll: InsertPayroll): Promise<Payroll> {
    const [payrollRecord] = await db
      .insert(payroll)
      .values(insertPayroll)
      .returning();
    return payrollRecord;
  }

  async updatePayroll(id: string, data: Partial<Payroll>): Promise<Payroll | null> {
    const [payrollRecord] = await db
      .update(payroll)
      .set({ ...data, updated_at: new Date() })
      .where(eq(payroll.id, id))
      .returning();
    return payrollRecord || null;
  }

  async deletePayroll(id: string): Promise<boolean> {
    const result = await db.delete(payroll).where(eq(payroll.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Timesheet operations
  async getTimesheets(userId: string): Promise<Timesheet[]> {
    return await db.select().from(timesheet).where(eq(timesheet.user_id, userId));
  }

  async getTimesheet(id: string): Promise<Timesheet | undefined> {
    const [timesheetRecord] = await db.select().from(timesheet).where(eq(timesheet.id, id));
    return timesheetRecord || undefined;
  }

  async createTimesheet(insertTimesheet: InsertTimesheet): Promise<Timesheet> {
    const [timesheetRecord] = await db
      .insert(timesheet)
      .values(insertTimesheet)
      .returning();
    return timesheetRecord;
  }

  async updateTimesheet(id: string, data: Partial<Timesheet>): Promise<Timesheet | null> {
    const [timesheetRecord] = await db
      .update(timesheet)
      .set({ ...data, updated_at: new Date() })
      .where(eq(timesheet.id, id))
      .returning();
    return timesheetRecord || null;
  }

  async deleteTimesheet(id: string): Promise<boolean> {
    const result = await db.delete(timesheet).where(eq(timesheet.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Onboarding operations
  async getOnboardingProcesses(userId: string): Promise<OnboardingProcess[]> {
    return await db.select().from(onboardingProcesses).where(eq(onboardingProcesses.user_id, userId));
  }

  async getOnboardingProcess(id: string): Promise<OnboardingProcess | undefined> {
    const [process] = await db.select().from(onboardingProcesses).where(eq(onboardingProcesses.id, id));
    return process || undefined;
  }

  async createOnboardingProcess(insertProcess: InsertOnboardingProcess): Promise<OnboardingProcess> {
    const [process] = await db
      .insert(onboardingProcesses)
      .values(insertProcess)
      .returning();
    return process;
  }

  async updateOnboardingProcess(id: string, data: Partial<OnboardingProcess>): Promise<OnboardingProcess | null> {
    const [process] = await db
      .update(onboardingProcesses)
      .set({ ...data, updated_at: new Date() })
      .where(eq(onboardingProcesses.id, id))
      .returning();
    return process || null;
  }

  async deleteOnboardingProcess(id: string): Promise<boolean> {
    const result = await db.delete(onboardingProcesses).where(eq(onboardingProcesses.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Business Context operations for BrainSys IAO calibration
  async getBusinessContext(userId: string): Promise<BusinessContext | undefined> {
    const [context] = await db.select().from(businessContext).where(eq(businessContext.user_id, userId));
    return context || undefined;
  }

  async createBusinessContext(insertContext: InsertBusinessContext): Promise<BusinessContext> {
    const [context] = await db
      .insert(businessContext)
      .values(insertContext)
      .returning();
    return context;
  }

  async updateBusinessContext(userId: string, data: Partial<BusinessContext>): Promise<BusinessContext | null> {
    // Remove user_id and timestamps from data to avoid conflicts
    const { user_id, id, created_at, updated_at, ...updateData } = data as any;
    
    const [context] = await db
      .update(businessContext)
      .set({ ...updateData, updated_at: new Date() })
      .where(eq(businessContext.user_id, userId))
      .returning();
    return context || null;
  }

  async deleteBusinessContext(userId: string): Promise<boolean> {
    const result = await db.delete(businessContext).where(eq(businessContext.user_id, userId));
    return (result.rowCount || 0) > 0;
  }

  // Training Enrollment operations
  async getTrainingEnrollment(trainingId: string, userId: string): Promise<any | undefined> {
    // Since training enrollments are not implemented yet, return undefined
    return undefined;
  }

  async createTrainingEnrollment(enrollment: any): Promise<any> {
    // Mock implementation for now - in a real app, this would save to trainingEnrollments table
    return {
      id: crypto.randomUUID(),
      ...enrollment,
      created_at: new Date(),
      enrollment_date: new Date()
    };
  }

  async getActiveOrganizationalContext(userId: string): Promise<any | undefined> {
    return this.getBusinessContext(userId);
  }

  async createOrganizationalContext(userId: string, context: any): Promise<any> {
    return this.createBusinessContext({
      user_id: userId,
      ...context
    });
  }

  // Job Vacancies operations
  async getJobVacancies(): Promise<JobVacancy[]> {
    return await db.select().from(jobVacancies).orderBy(jobVacancies.created_at);
  }

  async getJobVacanciesByUser(userId: string): Promise<JobVacancy[]> {
    return await db.select().from(jobVacancies).where(eq(jobVacancies.user_id, userId)).orderBy(jobVacancies.created_at);
  }

  async getJobVacancy(id: string): Promise<JobVacancy | undefined> {
    const [vacancy] = await db.select().from(jobVacancies).where(eq(jobVacancies.id, id));
    return vacancy;
  }

  async createJobVacancy(insertVacancy: InsertJobVacancy): Promise<JobVacancy> {
    const [vacancy] = await db.insert(jobVacancies).values(insertVacancy).returning();
    return vacancy;
  }

  async updateJobVacancy(id: string, data: Partial<JobVacancy>): Promise<JobVacancy | null> {
    const [vacancy] = await db.update(jobVacancies).set(data).where(eq(jobVacancies.id, id)).returning();
    return vacancy || null;
  }

  async deleteJobVacancy(id: string): Promise<boolean> {
    const result = await db.delete(jobVacancies).where(eq(jobVacancies.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Job Applications operations
  async getAllJobApplications(userId: string): Promise<JobApplication[]> {
    console.log('📝 getAllJobApplications: Buscando applications para userId:', userId);
    
    const applications = await db
      .select({
        id: jobApplications.id,
        vacancy_id: jobApplications.vacancy_id,
        candidate_name: jobApplications.candidate_name,
        candidate_email: jobApplications.candidate_email,
        candidate_phone: jobApplications.candidate_phone,
        linkedin_url: jobApplications.linkedin_url,
        portfolio_url: jobApplications.portfolio_url,
        resume_url: jobApplications.resume_url,
        cover_letter: jobApplications.cover_letter,
        experience_years: jobApplications.experience_years,
        current_salary: jobApplications.current_salary,
        expected_salary: jobApplications.expected_salary,
        availability: jobApplications.availability,
        status: jobApplications.status,
        applied_at: jobApplications.applied_at,
        notes: jobApplications.notes,
        score: jobApplications.score,
        created_at: jobApplications.created_at,
        updated_at: jobApplications.updated_at,
      })
      .from(jobApplications)
      .innerJoin(jobVacancies, eq(jobApplications.vacancy_id, jobVacancies.id))
      .where(eq(jobVacancies.user_id, userId))
      .orderBy(jobApplications.applied_at);
    
    console.log('✅ getAllJobApplications: Encontradas', applications.length, 'applications');
    return applications;
  }

  async getJobApplications(vacancyId: string): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).where(eq(jobApplications.vacancy_id, vacancyId)).orderBy(jobApplications.applied_at);
  }

  async getJobApplication(id: string): Promise<JobApplication | undefined> {
    const [application] = await db.select().from(jobApplications).where(eq(jobApplications.id, id));
    return application;
  }

  async createJobApplication(insertApplication: InsertJobApplication): Promise<JobApplication> {
    const [application] = await db.insert(jobApplications).values(insertApplication).returning();
    return application;
  }

  async updateJobApplication(id: string, data: Partial<JobApplication>): Promise<JobApplication | null> {
    const [application] = await db.update(jobApplications).set(data).where(eq(jobApplications.id, id)).returning();
    return application || null;
  }

  async deleteJobApplication(id: string): Promise<boolean> {
    const result = await db.delete(jobApplications).where(eq(jobApplications.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Training Enrollment operations  
  async createTrainingEnrollment(enrollment: any): Promise<any> {
    return { id: 'mock-enrollment', ...enrollment, status: 'enrolled' };
  }

  async getActiveOrganizationalContext(userId: string): Promise<any | undefined> {
    const context = await db.select().from(businessContext).where(eq(businessContext.user_id, userId));
    return context[0] || undefined;
  }

  async createOrganizationalContext(userId: string, context: any): Promise<any> {
    const [newContext] = await db.insert(businessContext).values({
      user_id: userId,
      ...context
    }).returning();
    return newContext;
  }

  // Multi-tenant operations
  async getAllCollaborators(): Promise<Collaborator[]> {
    return await db.select().from(collaborators);
  }

  // Company operations for FounderDashboard
  async getCompanies(): Promise<any[]> {
    return [
      { id: '1', name: 'TechCorp', plan: 'Enterprise', status: 'active', users: 150 },
      { id: '2', name: 'InnovateHub', plan: 'Pro', status: 'active', users: 75 },
      { id: '3', name: 'StartupXYZ', plan: 'Starter', status: 'trial', users: 25 }
    ];
  }

  async createCompany(data: any): Promise<any> {
    return { id: Date.now().toString(), ...data, status: 'active' };
  }

  // Gamification operations
  async getGamification(userId: string): Promise<any | undefined> {
    return { 
      userId, 
      points: 0, 
      badges: [], 
      level: 1, 
      achievements: [] 
    };
  }

  async createGamification(data: any): Promise<any> {
    return { id: Date.now().toString(), ...data };
  }

  // Certificate Templates
  async getCertificateTemplates(userId: string): Promise<any[]> {
    return [
      { id: '1', name: 'Certificado de Conclusão', type: 'completion', userId },
      { id: '2', name: 'Certificado de Participação', type: 'participation', userId }
    ];
  }

  async createCertificateTemplate(data: any): Promise<any> {
    return { id: Date.now().toString(), ...data };
  }

  // ========== STRATEGIC VISION IMPLEMENTATIONS ==========

  // Strategic Context operations
  async getStrategicContext(tenantId: string): Promise<StrategicContext | undefined> {
    const [context] = await db
      .select()
      .from(strategicContexts)
      .where(eq(strategicContexts.tenant_id, tenantId));
    return context || undefined;
  }

  async createStrategicContext(insertContext: InsertStrategicContext): Promise<StrategicContext> {
    const [context] = await db
      .insert(strategicContexts)
      .values(insertContext)
      .returning();
    return context;
  }

  async updateStrategicContext(id: string, tenantId: string, data: Partial<StrategicContext>): Promise<StrategicContext | null> {
    const [context] = await db
      .update(strategicContexts)
      .set({ ...data, updated_at: new Date() })
      .where(and(
        eq(strategicContexts.id, id),
        eq(strategicContexts.tenant_id, tenantId)
      ))
      .returning();
    return context || null;
  }

  async deleteStrategicContext(id: string): Promise<boolean> {
    const result = await db
      .delete(strategicContexts)
      .where(eq(strategicContexts.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Org Chart Position operations
  async getOrgChartPositions(tenantId: string): Promise<OrgChartPosition[]> {
    return await db
      .select()
      .from(orgChartPositions)
      .where(eq(orgChartPositions.tenant_id, tenantId));
  }

  async getOrgChartPosition(id: string, tenantId: string): Promise<OrgChartPosition | undefined> {
    const [position] = await db
      .select()
      .from(orgChartPositions)
      .where(and(
        eq(orgChartPositions.id, id),
        eq(orgChartPositions.tenant_id, tenantId)
      ));
    return position || undefined;
  }

  async createOrgChartPosition(insertPosition: InsertOrgChartPosition): Promise<OrgChartPosition> {
    const [position] = await db
      .insert(orgChartPositions)
      .values(insertPosition)
      .returning();
    return position;
  }

  async updateOrgChartPosition(id: string, tenantId: string, data: Partial<OrgChartPosition>): Promise<OrgChartPosition | null> {
    const [position] = await db
      .update(orgChartPositions)
      .set({ ...data, updated_at: new Date() })
      .where(and(
        eq(orgChartPositions.id, id),
        eq(orgChartPositions.tenant_id, tenantId)
      ))
      .returning();
    return position || null;
  }

  async deleteOrgChartPosition(id: string, tenantId: string): Promise<boolean> {
    const result = await db
      .delete(orgChartPositions)
      .where(and(
        eq(orgChartPositions.id, id),
        eq(orgChartPositions.tenant_id, tenantId)
      ));
    return (result.rowCount || 0) > 0;
  }

  // Competency Profile operations
  async getCompetencyProfile(orgChartPositionId: string, tenantId: string): Promise<CompetencyProfile | undefined> {
    const [profile] = await db
      .select()
      .from(competencyProfiles)
      .where(and(
        eq(competencyProfiles.org_chart_position_id, orgChartPositionId),
        eq(competencyProfiles.tenant_id, tenantId)
      ));
    return profile || undefined;
  }

  async createCompetencyProfile(insertProfile: InsertCompetencyProfile): Promise<CompetencyProfile> {
    const [profile] = await db
      .insert(competencyProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateCompetencyProfile(id: string, tenantId: string, data: Partial<CompetencyProfile>): Promise<CompetencyProfile | null> {
    const [profile] = await db
      .update(competencyProfiles)
      .set({ ...data, updated_at: new Date() })
      .where(and(
        eq(competencyProfiles.id, id),
        eq(competencyProfiles.tenant_id, tenantId)
      ))
      .returning();
    return profile || null;
  }

  async deleteCompetencyProfile(id: string): Promise<boolean> {
    const result = await db
      .delete(competencyProfiles)
      .where(eq(competencyProfiles.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Strategic Simulation operations
  async getSimulations(tenantId: string): Promise<StrategicSimulation[]> {
    return await db
      .select()
      .from(strategicSimulations)
      .where(eq(strategicSimulations.tenant_id, tenantId));
  }

  async getSimulation(id: string): Promise<StrategicSimulation | undefined> {
    const [simulation] = await db
      .select()
      .from(strategicSimulations)
      .where(eq(strategicSimulations.id, id));
    return simulation || undefined;
  }

  async createSimulation(insertSimulation: InsertStrategicSimulation): Promise<StrategicSimulation> {
    const [simulation] = await db
      .insert(strategicSimulations)
      .values(insertSimulation)
      .returning();
    return simulation;
  }

  async updateSimulation(id: string, tenantId: string, data: Partial<StrategicSimulation>): Promise<StrategicSimulation | null> {
    const [simulation] = await db
      .update(strategicSimulations)
      .set(data)
      .where(and(
        eq(strategicSimulations.id, id),
        eq(strategicSimulations.tenant_id, tenantId)
      ))
      .returning();
    return simulation || null;
  }

  async deleteSimulation(id: string): Promise<boolean> {
    const result = await db
      .delete(strategicSimulations)
      .where(eq(strategicSimulations.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Strategic Alert operations
  async getActiveAlerts(tenantId: string): Promise<StrategicAlert[]> {
    return await db
      .select()
      .from(strategicAlerts)
      .where(
        and(
          eq(strategicAlerts.tenant_id, tenantId),
          eq(strategicAlerts.status, 'active')
        )
      );
  }

  async getAlert(id: string): Promise<StrategicAlert | undefined> {
    const [alert] = await db
      .select()
      .from(strategicAlerts)
      .where(eq(strategicAlerts.id, id));
    return alert || undefined;
  }

  async createAlert(insertAlert: InsertStrategicAlert): Promise<StrategicAlert> {
    const [alert] = await db
      .insert(strategicAlerts)
      .values(insertAlert)
      .returning();
    return alert;
  }

  async updateAlert(id: string, data: Partial<StrategicAlert>): Promise<StrategicAlert | null> {
    const [alert] = await db
      .update(strategicAlerts)
      .set(data)
      .where(eq(strategicAlerts.id, id))
      .returning();
    return alert || null;
  }

  async acknowledgeAlert(id: string, tenantId: string, userId: string): Promise<StrategicAlert | null> {
    const [alert] = await db
      .update(strategicAlerts)
      .set({
        status: 'acknowledged',
        acknowledged_by: userId,
        acknowledged_at: new Date()
      })
      .where(and(
        eq(strategicAlerts.id, id),
        eq(strategicAlerts.tenant_id, tenantId)
      ))
      .returning();
    return alert || null;
  }

  async resolveAlert(id: string, tenantId: string): Promise<StrategicAlert | null> {
    const [alert] = await db
      .update(strategicAlerts)
      .set({
        status: 'resolved',
        resolved_at: new Date()
      })
      .where(and(
        eq(strategicAlerts.id, id),
        eq(strategicAlerts.tenant_id, tenantId)
      ))
      .returning();
    return alert || null;
  }

  async deleteAlert(id: string): Promise<boolean> {
    const result = await db
      .delete(strategicAlerts)
      .where(eq(strategicAlerts.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Growth Health Metrics operations
  async getLatestHealthMetrics(tenantId: string): Promise<GrowthHealthMetrics | undefined> {
    const [metrics] = await db
      .select()
      .from(growthHealthMetrics)
      .where(eq(growthHealthMetrics.tenant_id, tenantId))
      .orderBy(desc(growthHealthMetrics.created_at))
      .limit(1);
    return metrics || undefined;
  }

  async getHealthMetricsHistory(tenantId: string): Promise<GrowthHealthMetrics[]> {
    return await db
      .select()
      .from(growthHealthMetrics)
      .where(eq(growthHealthMetrics.tenant_id, tenantId))
      .orderBy(desc(growthHealthMetrics.created_at));
  }

  async createHealthMetrics(insertMetrics: InsertGrowthHealthMetrics): Promise<GrowthHealthMetrics> {
    const [metrics] = await db
      .insert(growthHealthMetrics)
      .values(insertMetrics)
      .returning();
    return metrics;
  }

  // Development Plan operations
  async getDevelopmentPlans(tenantId: string): Promise<DevelopmentPlan[]> {
    return await db
      .select()
      .from(developmentPlans)
      .where(eq(developmentPlans.tenant_id, tenantId));
  }

  async getDevelopmentPlan(id: string, tenantId: string): Promise<DevelopmentPlan | undefined> {
    const [plan] = await db
      .select()
      .from(developmentPlans)
      .where(and(
        eq(developmentPlans.id, id),
        eq(developmentPlans.tenant_id, tenantId)
      ));
    return plan || undefined;
  }

  async getDevelopmentPlanByPosition(orgChartPositionId: string, tenantId: string): Promise<DevelopmentPlan | undefined> {
    const [plan] = await db
      .select()
      .from(developmentPlans)
      .where(eq(developmentPlans.org_chart_position_id, orgChartPositionId));
    return plan || undefined;
  }

  async createDevelopmentPlan(insertPlan: InsertDevelopmentPlan): Promise<DevelopmentPlan> {
    const [plan] = await db
      .insert(developmentPlans)
      .values(insertPlan)
      .returning();
    return plan;
  }

  async updateDevelopmentPlan(id: string, tenantId: string, data: Partial<DevelopmentPlan>): Promise<DevelopmentPlan | null> {
    const [plan] = await db
      .update(developmentPlans)
      .set({ ...data, updated_at: new Date() })
      .where(and(
        eq(developmentPlans.id, id),
        eq(developmentPlans.tenant_id, tenantId)
      ))
      .returning();
    return plan || null;
  }

  async deleteDevelopmentPlan(id: string): Promise<boolean> {
    const result = await db
      .delete(developmentPlans)
      .where(eq(developmentPlans.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Strategic Roadmap operations
  async getRoadmaps(tenantId: string): Promise<StrategicRoadmap[]> {
    return await db
      .select()
      .from(strategicRoadmaps)
      .where(eq(strategicRoadmaps.tenant_id, tenantId));
  }

  async getRoadmap(id: string, tenantId: string): Promise<StrategicRoadmap | undefined> {
    const [roadmap] = await db
      .select()
      .from(strategicRoadmaps)
      .where(and(
        eq(strategicRoadmaps.id, id),
        eq(strategicRoadmaps.tenant_id, tenantId)
      ));
    return roadmap || undefined;
  }

  async createRoadmap(insertRoadmap: InsertStrategicRoadmap): Promise<StrategicRoadmap> {
    const [roadmap] = await db
      .insert(strategicRoadmaps)
      .values(insertRoadmap)
      .returning();
    return roadmap;
  }

  async updateRoadmap(id: string, tenantId: string, data: Partial<StrategicRoadmap>): Promise<StrategicRoadmap | null> {
    const [roadmap] = await db
      .update(strategicRoadmaps)
      .set({ ...data, updated_at: new Date() })
      .where(and(
        eq(strategicRoadmaps.id, id),
        eq(strategicRoadmaps.tenant_id, tenantId)
      ))
      .returning();
    return roadmap || null;
  }

  async deleteRoadmap(id: string): Promise<boolean> {
    const result = await db
      .delete(strategicRoadmaps)
      .where(eq(strategicRoadmaps.id, id));
    return (result.rowCount || 0) > 0;
  }

  // System Versions operations (Founder Dashboard changelog)
  async listSystemVersions(params: { 
    tenantId: string; 
    limit?: number; 
    category?: string; 
    search?: string; 
    sinceVersion?: string; 
  }): Promise<SystemVersion[]> {
    const { tenantId, limit = 50, category, search } = params;
    
    console.log('📋 listSystemVersions:', { tenantId, limit, category, search });
    
    let query = db
      .select()
      .from(systemVersions)
      .where(eq(systemVersions.tenant_id, tenantId))
      .orderBy(desc(systemVersions.release_date))
      .limit(limit);
    
    const results = await query;
    
    console.log(`✅ Found ${results.length} system versions`);
    return results;
  }

  async getSystemVersion(id: string, tenantId: string): Promise<SystemVersion | undefined> {
    const [version] = await db
      .select()
      .from(systemVersions)
      .where(and(
        eq(systemVersions.id, id),
        eq(systemVersions.tenant_id, tenantId)
      ));
    return version || undefined;
  }

  async createSystemVersion(insertVersion: InsertSystemVersion): Promise<SystemVersion> {
    console.log('🆕 createSystemVersion:', insertVersion.version, insertVersion.title);
    const [version] = await db
      .insert(systemVersions)
      .values(insertVersion)
      .returning();
    console.log('✅ System version created:', version.id);
    return version;
  }
}

export const storage = new DatabaseStorage();