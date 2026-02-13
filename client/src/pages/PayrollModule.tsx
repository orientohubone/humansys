import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calculator, 
  FileText, 
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Gift,
  CreditCard,
  PieChart,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
  UserCheck,
  Building,
  Clock,
  Percent,
  BookOpen,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { usePayroll } from '@/hooks/usePayroll';
import { useCollaborators } from '@/hooks/useCollaborators';

interface BenefitData {
  id: string;
  name: string;
  type: string;
  description: string;
  cost: number;
  enrolledEmployees: number;
  totalEmployees: number;
  status: 'active' | 'inactive';
}

const mockBenefitsData: BenefitData[] = [
  {
    id: '1',
    name: 'Plano de Saúde',
    type: 'health',
    description: 'Cobertura médica completa',
    cost: 450,
    enrolledEmployees: 25,
    totalEmployees: 30,
    status: 'active'
  },
  {
    id: '2',
    name: 'Vale Refeição',
    type: 'meal',
    description: 'R$ 30/dia para alimentação',
    cost: 600,
    enrolledEmployees: 30,
    totalEmployees: 30,
    status: 'active'
  },
  {
    id: '3',
    name: 'Seguro de Vida',
    type: 'insurance',
    description: 'Proteção para colaboradores',
    cost: 80,
    enrolledEmployees: 28,
    totalEmployees: 30,
    status: 'active'
  },
  {
    id: '4',
    name: 'Academia Corporativa',
    type: 'wellness',
    description: 'Acesso a rede de academias',
    cost: 120,
    enrolledEmployees: 15,
    totalEmployees: 30,
    status: 'active'
  }
];

// Brazilian tax calculation functions based on 2025 rates
const calculateINSS = (grossSalary: number): number => {
  if (grossSalary <= 1412.00) return grossSalary * 0.075;
  if (grossSalary <= 2666.68) return grossSalary * 0.09;
  if (grossSalary <= 4000.03) return grossSalary * 0.12;
  if (grossSalary <= 7786.02) return grossSalary * 0.14;
  return 1090.04; // Maximum INSS contribution
};

const calculateIRRF = (grossSalary: number, inssDeduction: number): number => {
  const taxableIncome = grossSalary - inssDeduction;
  
  if (taxableIncome <= 2259.20) return 0;
  if (taxableIncome <= 2826.65) return (taxableIncome * 0.075) - 169.44;
  if (taxableIncome <= 3751.05) return (taxableIncome * 0.15) - 381.44;
  if (taxableIncome <= 4664.68) return (taxableIncome * 0.225) - 662.77;
  return (taxableIncome * 0.275) - 896.00;
};

const calculateFGTS = (grossSalary: number): number => {
  return grossSalary * 0.08; // 8% FGTS (employer cost)
};

// CBO-based risk factors for additional taxes
const getCBORiskFactor = (cbo: string): number => {
  const riskMapping: Record<string, number> = {
    '1112-05': 0.01, // Executive - low risk
    '3171-05': 0.015, // Developer - low-medium risk
    '1423-10': 0.01, // HR Manager - low risk
    '2522-10': 0.015, // Accountant - low-medium risk
    // Add more CBO codes as needed
  };
  
  return riskMapping[cbo] || 0.02; // Default 2% for unknown CBOs
};

export const PayrollModule: React.FC = () => {
  const { toast } = useToast();
  const { payrolls, loading: payrollLoading, createPayroll, updatePayroll, deletePayroll } = usePayroll();
  const { collaborators, isLoading: collaboratorsLoading } = useCollaborators();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('2025-07');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showNewPayrollModal, setShowNewPayrollModal] = useState(false);
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [overtimeHours, setOvertimeHours] = useState<Record<string, number>>({});
  const [bonuses, setBonuses] = useState<Record<string, number>>({});

  // Helper to get collaborator base salary
  const getCollaboratorBaseSalary = (collaboratorId: string): number => {
    // This is a simplified approach - in real scenarios, salary data might come from collaborators table
    // For now, we'll use a default value that can be overridden in the form
    return 5000;
  };

  const handleGeneratePayroll = async () => {
    if (selectedCollaborators.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um colaborador para gerar a folha.",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    
    try {
      const [year, month] = selectedPeriod.split('-').map(Number);
      
      for (const collabId of selectedCollaborators) {
        const collaborator = collaborators.find(c => c.id === collabId);
        if (!collaborator) continue;
        
        const overtime = overtimeHours[collabId] || 0;
        const bonus = bonuses[collabId] || 0;
        const baseSalary = getCollaboratorBaseSalary(collabId);
        const overtimeRate = baseSalary / 220 * 1.5;
        const overtimeAmount = overtime * overtimeRate;
        
        const grossSalary = baseSalary + overtimeAmount + bonus;
        const inssDeduction = calculateINSS(grossSalary);
        const irrfDeduction = Math.max(0, calculateIRRF(grossSalary, inssDeduction));
        const totalDeductions = inssDeduction + irrfDeduction;
        const netSalary = grossSalary - totalDeductions;
        
        await createPayroll({
          collaborator_id: collabId,
          period_month: month,
          period_year: year,
          base_salary: baseSalary,
          overtime_hours: overtime,
          overtime_rate: overtimeRate,
          bonuses: bonus,
          gross_salary: grossSalary,
          inss_deduction: inssDeduction,
          irrf_deduction: irrfDeduction,
          total_deductions: totalDeductions,
          net_salary: netSalary,
          status: 'pending'
        });
      }
      
      toast({
        title: "Folha gerada com sucesso!",
        description: `${selectedCollaborators.length} colaboradores processados com cálculo automático de impostos.`
      });
      
      // Reset form
      setShowNewPayrollModal(false);
      setSelectedCollaborators([]);
      setOvertimeHours({});
      setBonuses({});
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar folha de pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const toggleCollaboratorSelection = (collaboratorId: string) => {
    setSelectedCollaborators(prev => 
      prev.includes(collaboratorId)
        ? prev.filter(id => id !== collaboratorId)
        : [...prev, collaboratorId]
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    
    const labels = {
      pending: 'Pendente',
      approved: 'Aprovado',
      paid: 'Pago'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  // Map payrolls from API to display format with collaborator data
  const mappedPayrolls = useMemo(() => {
    return payrolls.map(payroll => {
      const collaborator = collaborators.find(c => c.id === payroll.collaborator_id);
      return {
        ...payroll,
        employee: {
          name: collaborator?.name || 'Desconhecido',
          position: collaborator?.role || '-',
          department: collaborator?.department || '-'
        },
        period: `${String(payroll.period_month).padStart(2, '0')}/${payroll.period_year}`,
        baseSalary: payroll.base_salary,
        overtime: (payroll.overtime_hours || 0) * (payroll.overtime_rate || 0),
        bonuses: payroll.bonuses || 0,
        grossSalary: payroll.gross_salary,
        deductions: payroll.total_deductions || 0,
        netSalary: payroll.net_salary
      };
    });
  }, [payrolls, collaborators]);

  const filteredPayrollData = useMemo(() => {
    const [year, month] = selectedPeriod.split('-').map(Number);
    
    return mappedPayrolls.filter(item => {
      const matchesSearch = item.employee.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchesPeriod = item.period_month === month && item.period_year === year;
      
      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [mappedPayrolls, searchTerm, selectedStatus, selectedPeriod]);

  const totalPayroll = useMemo(() => 
    filteredPayrollData.reduce((sum, item) => sum + item.netSalary, 0),
    [filteredPayrollData]
  );
  
  const totalBenefitsCost = mockBenefitsData.reduce((sum, benefit) => 
    sum + (benefit.cost * benefit.enrolledEmployees), 0
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 xs:space-y-6 p-3 xs:p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-0">
          <div>
            <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white">
              Salários e Benefícios
            </h1>
            <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gestão completa da folha e benefícios
            </p>
          </div>
        <div className="flex gap-2 xs:gap-3 w-full xs:w-auto flex-col xs:flex-row">
          <Button variant="outline" className="w-full xs:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setShowNewPayrollModal(true)} className="w-full xs:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nova Folha
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
        <Card className="bg-white dark:bg-gray-900/50">
          <CardContent className="flex items-center p-3 xs:p-4 gap-2 xs:gap-4">
            <div className="flex items-center justify-center w-10 xs:w-12 h-10 xs:h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex-shrink-0">
              <DollarSign className="h-5 xs:h-6 w-5 xs:w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400">Folha</p>
              <p className="text-lg xs:text-2xl font-bold text-gray-900 dark:text-white truncate">
                R$ {totalPayroll.toLocaleString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50">
          <CardContent className="flex items-center p-3 xs:p-4 gap-2 xs:gap-4">
            <div className="flex items-center justify-center w-10 xs:w-12 h-10 xs:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
              <Gift className="h-5 xs:h-6 w-5 xs:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400">Benefícios</p>
              <p className="text-lg xs:text-2xl font-bold text-gray-900 dark:text-white truncate">
                R$ {totalBenefitsCost.toLocaleString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50">
          <CardContent className="flex items-center p-3 xs:p-4 gap-2 xs:gap-4">
            <div className="flex items-center justify-center w-10 xs:w-12 h-10 xs:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
              <Users className="h-5 xs:h-6 w-5 xs:w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400">Colabs</p>
              <p className="text-lg xs:text-2xl font-bold text-gray-900 dark:text-white">
                {payrolls.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50">
          <CardContent className="flex items-center p-3 xs:p-4 gap-2 xs:gap-4">
            <div className="flex items-center justify-center w-10 xs:w-12 h-10 xs:h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex-shrink-0">
              <TrendingUp className="h-5 xs:h-6 w-5 xs:w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-lg xs:text-2xl font-bold text-gray-900 dark:text-white truncate">
                R$ {(totalPayroll + totalBenefitsCost).toLocaleString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="payroll" className="space-y-4 xs:space-y-6">
        <TabsList className="w-full h-auto flex flex-wrap gap-1 xs:gap-2 p-1 xs:p-2 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg">
          <TabsTrigger value="payroll" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3 flex-1 xs:flex-initial min-w-fit text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">Folha</TabsTrigger>
          <TabsTrigger value="benefits" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3 flex-1 xs:flex-initial min-w-fit text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">Benefícios</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3 flex-1 xs:flex-initial min-w-fit text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">Relatórios</TabsTrigger>
        </TabsList>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-3 xs:space-y-6">
          {/* Filters */}
          <Card className="bg-white dark:bg-gray-900/50">
            <CardContent className="p-3 xs:p-4 sm:p-6">
              <div className="flex flex-col gap-3 xs:gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-xs xs:text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 xs:gap-3">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="text-xs xs:text-sm">
                      <Calendar className="h-4 w-4" />
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-07">Jul 2025</SelectItem>
                      <SelectItem value="2025-06">Jun 2025</SelectItem>
                      <SelectItem value="2025-05">Mai 2025</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="text-xs xs:text-sm">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payroll Table */}
          <Card>
            <CardHeader>
              <CardTitle>Folha de Pagamento - {selectedPeriod}</CardTitle>
              <CardDescription>
                Lista de pagamentos para o período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                        Colaborador
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                        Salário Base
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                        Horas Extras
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                        Bônus
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                        Bruto
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                        Descontos
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                        Líquido
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollLoading ? (
                      // Loading skeleton
                      Array.from({ length: 3 }).map((_, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-4 px-4" colSpan={9}>
                            <Skeleton className="h-16 w-full" />
                          </td>
                        </tr>
                      ))
                    ) : filteredPayrollData.length === 0 ? (
                      // Empty state
                      <tr>
                        <td colSpan={9} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <FileText className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                              Nenhuma folha de pagamento encontrada
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                              Gere uma nova folha ou ajuste os filtros
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredPayrollData.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {item.employee.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {item.employee.position}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          R$ {item.baseSalary.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-4">
                          R$ {item.overtime.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-4">
                          R$ {item.bonuses.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          R$ {item.grossSalary.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-4 text-red-600 dark:text-red-400">
                          R$ {item.deductions.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-4 font-bold text-green-600 dark:text-green-400">
                          R$ {item.netSalary.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestão de Benefícios</CardTitle>
                  <CardDescription>
                    Configure e monitore os benefícios oferecidos
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Benefício
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
                {mockBenefitsData.map((benefit) => (
                  <motion.div
                    key={benefit.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                              <Gift className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {benefit.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {benefit.type}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {benefit.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          {benefit.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Custo/mês:</span>
                            <span className="font-medium">R$ {benefit.cost}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Participação:</span>
                            <span className="font-medium">
                              {benefit.enrolledEmployees}/{benefit.totalEmployees}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${(benefit.enrolledEmployees / benefit.totalEmployees) * 100}%` 
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Total: R$ {(benefit.cost * benefit.enrolledEmployees).toLocaleString('pt-BR')}
                          </span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-3 xs:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Distribuição de Custos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Salários</span>
                    <span className="font-medium">
                      R$ {totalPayroll.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Benefícios</span>
                    <span className="font-medium">
                      R$ {totalBenefitsCost.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="font-semibold text-gray-900 dark:text-white">Total Geral</span>
                    <span className="font-bold text-lg">
                      R$ {(totalPayroll + totalBenefitsCost).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Alertas e Pendências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">
                      1 folha pendente de aprovação
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-sm text-green-800 dark:text-green-200">
                      Todos os benefícios ativos
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Payroll Modal */}
      <Dialog open={showNewPayrollModal} onOpenChange={setShowNewPayrollModal}>
        <DialogContent className="w-full max-w-2xl sm:max-w-4xl max-h-[90vh] overflow-y-auto mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg xs:text-xl">
              <Calculator className="h-5 w-5" />
              Nova Folha
            </DialogTitle>
            <DialogDescription className="text-xs xs:text-sm">
              Selecione colaboradores para gerar folha com impostos automáticos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 xs:space-y-6">
            {/* Period Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
              <div>
                <Label htmlFor="payroll-period">Período de Referência</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-08">Agosto 2025</SelectItem>
                    <SelectItem value="2025-07">Julho 2025</SelectItem>
                    <SelectItem value="2025-06">Junho 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Cálculo automático via CBO
                </Badge>
              </div>
            </div>

            {/* Collaborators Selection */}
            <div>
              <Label className="text-sm xs:text-base font-medium">
                Colaboradores ({selectedCollaborators.length})
              </Label>
              <div className="mt-2 xs:mt-3 space-y-2 xs:space-y-3 max-h-64 xs:max-h-80 overflow-y-auto border rounded-lg p-2 xs:p-3 sm:p-4">
                {collaboratorsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Carregando colaboradores...</span>
                  </div>
                ) : collaborators.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Nenhum colaborador encontrado</p>
                    <p className="text-sm text-gray-400 mt-1">Cadastre colaboradores primeiro</p>
                  </div>
                ) : (
                  collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className={`p-2 xs:p-3 sm:p-4 border rounded-lg transition-all cursor-pointer text-sm xs:text-base ${
                      selectedCollaborators.includes(collaborator.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleCollaboratorSelection(collaborator.id)}
                  >
                    <div className="flex items-start xs:items-center justify-between gap-2 xs:gap-3">
                      <div className="flex items-start xs:items-center space-x-2 xs:space-x-3 flex-1 min-w-0">
                        <Checkbox
                          checked={selectedCollaborators.includes(collaborator.id)}
                          onChange={() => toggleCollaboratorSelection(collaborator.id)}
                          className="mt-1 xs:mt-0 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-medium text-xs xs:text-sm truncate">{collaborator.name}</h4>
                          <p className="text-xs text-gray-500">{collaborator.role}</p>
                          <p className="text-xs text-gray-500">{collaborator.department}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-medium text-xs xs:text-sm">R$ {getCollaboratorBaseSalary(collaborator.id).toLocaleString('pt-BR')}</p>
                        <p className="text-xs text-gray-500">base</p>
                      </div>
                    </div>

                    {/* Additional inputs for selected collaborators */}
                    {selectedCollaborators.includes(collaborator.id) && (
                      <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 xs:pt-3 sm:pt-4 border-t grid grid-cols-2 gap-2 xs:gap-3">
                        <div>
                          <Label className="text-xs">H. Extras</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={overtimeHours[collaborator.id] || ''}
                            onChange={(e) => setOvertimeHours(prev => ({
                              ...prev,
                              [collaborator.id]: parseFloat(e.target.value) || 0
                            }))}
                            className="h-7 xs:h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Bônus</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={bonuses[collaborator.id] || ''}
                            onChange={(e) => setBonuses(prev => ({
                              ...prev,
                              [collaborator.id]: parseFloat(e.target.value) || 0
                            }))}
                            className="h-7 xs:h-8 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* Tax Calculation Preview */}
            {selectedCollaborators.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 rounded-lg">
                <h4 className="font-medium mb-2 xs:mb-3 flex items-center gap-2 text-xs xs:text-sm">
                  <Percent className="h-4 w-4" />
                  Cálculos Tributários
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 text-xs xs:text-sm">
                  <div className="text-center">
                    <p className="text-gray-500">INSS</p>
                    <p className="font-medium text-xs">7,5%-14%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">IRRF</p>
                    <p className="font-medium text-xs">0%-27,5%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">FGTS</p>
                    <p className="font-medium text-xs">8%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Taxa CBO</p>
                    <p className="font-medium text-xs">1%-2%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Cálculos automáticos baseados no governo e CBO
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewPayrollModal(false)}
              disabled={isCalculating}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGeneratePayroll}
              disabled={selectedCollaborators.length === 0 || isCalculating}
              className="min-w-[120px]"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Calculando...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Gerar Folha
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  );
};