import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BookOpen, Users, Clock, Star, CheckCircle, Play, Lock, GraduationCap, Plus, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CourseEnrollment {
  courseId: string;
  status: 'enrolled' | 'in-progress' | 'completed';
  progress: number;
  enrolledDate: Date;
}

const TrainingContent = () => {
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const mockCourses = [
    {
      id: '1',
      title: 'Introdução à Liderança',
      description: 'Aprenda os fundamentos de liderança eficaz',
      category: 'Desenvolvimento',
      difficulty: 'Iniciante',
      duration: '4 semanas',
      instructor: 'Carlos Silva',
      rating: 4.8,
      reviews: 234,
      participants: 1205,
      thumbnail: '🎯',
      modules: 8,
      lessons: 24,
      price: 'Grátis'
    },
    {
      id: '2',
      title: 'Comunicação Estratégica',
      description: 'Desenvolva habilidades avançadas de comunicação',
      category: 'Comunicação',
      difficulty: 'Intermediário',
      duration: '6 semanas',
      instructor: 'Marina Costa',
      rating: 4.9,
      reviews: 189,
      participants: 856,
      thumbnail: '💬',
      modules: 10,
      lessons: 35,
      price: 'Grátis'
    },
    {
      id: '3',
      title: 'Gestão de Projetos Ágil',
      description: 'Domine as metodologias ágeis e scrum',
      category: 'Gestão',
      difficulty: 'Avançado',
      duration: '8 semanas',
      instructor: 'Roberto Martins',
      rating: 4.7,
      reviews: 312,
      participants: 1523,
      thumbnail: '📊',
      modules: 12,
      lessons: 48,
      price: 'Grátis'
    },
    {
      id: '4',
      title: 'Inteligência Emocional',
      description: 'Desenvolvimento pessoal através da IE',
      category: 'Bem-estar',
      difficulty: 'Iniciante',
      duration: '3 semanas',
      instructor: 'Dra. Lucia Ferreira',
      rating: 4.9,
      reviews: 456,
      participants: 2341,
      thumbnail: '❤️',
      modules: 6,
      lessons: 18,
      price: 'Grátis'
    },
    {
      id: '5',
      title: 'Vendas B2B Avançado',
      description: 'Técnicas de venda para grandes negócios',
      category: 'Vendas',
      difficulty: 'Avançado',
      duration: '5 semanas',
      instructor: 'Felipe Souza',
      rating: 4.6,
      reviews: 178,
      participants: 543,
      thumbnail: '💼',
      modules: 9,
      lessons: 32,
      price: 'Grátis'
    },
    {
      id: '6',
      title: 'Compliance e Ética',
      description: 'Conhecimento obrigatório de compliance',
      category: 'Conformidade',
      difficulty: 'Iniciante',
      duration: '2 semanas',
      instructor: 'Advogada Ana Paula',
      rating: 4.5,
      reviews: 123,
      participants: 3421,
      thumbnail: '⚖️',
      modules: 5,
      lessons: 12,
      price: 'Grátis'
    }
  ];

  const handleEnroll = (courseId: string) => {
    const existingEnrollment = enrollments.find(e => e.courseId === courseId);
    if (!existingEnrollment) {
      setEnrollments([...enrollments, {
        courseId,
        status: 'enrolled',
        progress: 0,
        enrolledDate: new Date()
      }]);
      toast({
        title: "Inscrição confirmada!",
        description: "Você pode agora começar este curso."
      });
    }
  };

  const handleStartCourse = (courseId: string) => {
    setEnrollments(enrollments.map(e =>
      e.courseId === courseId ? { ...e, status: 'in-progress' } : e
    ));
    toast({
      title: "Curso iniciado!",
      description: "Boa sorte em seu aprendizado!"
    });
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.courseId === courseId);
  };

  const getEnrollmentStatus = (courseId: string) => {
    return enrollments.find(e => e.courseId === courseId)?.status;
  };

  const filteredCourses = mockCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enrolledCourses = enrollments.filter(e => e.status !== 'completed').length;
  const completedCourses = enrollments.filter(e => e.status === 'completed').length;

  return (
    <div className="space-y-4 xs:space-y-6">
        {/* Header */}
        <div className="space-y-2 xs:space-y-4">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
            <div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-6 xs:h-8 w-6 xs:w-8 text-emerald-600" />
                Treinamentos
              </h1>
              <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400 mt-1">
                Desenvolva suas habilidades com nossos cursos
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-3 xs:pt-4">
                <div className="text-center">
                  <p className="text-lg xs:text-2xl font-bold text-emerald-600">{mockCourses.length}</p>
                  <p className="text-xs xs:text-sm text-muted-foreground mt-1">Disponíveis</p>
                </div>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-3 xs:pt-4">
                <div className="text-center">
                  <p className="text-lg xs:text-2xl font-bold text-blue-600">{enrolledCourses}</p>
                  <p className="text-xs xs:text-sm text-muted-foreground mt-1">Em andamento</p>
                </div>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-3 xs:pt-4">
                <div className="text-center">
                  <p className="text-lg xs:text-2xl font-bold text-green-600">{completedCourses}</p>
                  <p className="text-xs xs:text-sm text-muted-foreground mt-1">Concluídos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3 xs:grid-cols-3">
            <TabsTrigger value="available" className="text-xs xs:text-sm">Disponíveis</TabsTrigger>
            <TabsTrigger value="enrolled" className="text-xs xs:text-sm">Meus Cursos</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs xs:text-sm">Concluídos</TabsTrigger>
          </TabsList>

          {/* Available Courses Tab */}
          <TabsContent value="available" className="space-y-3 xs:space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar curso..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  data-testid="search-courses"
                />
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
              {filteredCourses.map((course) => {
                const enrolled = isEnrolled(course.id);
                const status = getEnrollmentStatus(course.id);

                return (
                  <Card
                    key={course.id}
                    className="hover:shadow-lg transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden flex flex-col"
                    data-testid={`course-card-${course.id}`}
                  >
                    {/* Thumbnail */}
                    <div className="h-32 xs:h-40 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-emerald-900 flex items-center justify-center text-4xl xs:text-5xl">
                      {course.thumbnail}
                    </div>

                    <CardHeader className="pb-2 xs:pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-sm xs:text-base line-clamp-2">{course.title}</CardTitle>
                          <CardDescription className="text-xs xs:text-sm mt-1 line-clamp-1">
                            {course.category}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                          <Star className="h-3 w-3 fill-current" />
                          {course.rating}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 pb-3 xs:pb-4">
                      <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Metadata */}
                      <div className="space-y-2 mb-3 xs:mb-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>{course.participants.toLocaleString()} participantes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-3 w-3" />
                          <span>{course.modules} módulos • {course.lessons} lições</span>
                        </div>
                      </div>

                      {/* Difficulty Badge */}
                      <div className="mb-3 xs:mb-4">
                        <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                          course.difficulty === 'Iniciante'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                            : course.difficulty === 'Intermediário'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200'
                            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                        }`}>
                          {course.difficulty}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-col xs:flex-row">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs w-full dark:bg-gray-700 dark:border-gray-600"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowDetailDialog(true);
                          }}
                          data-testid={`details-${course.id}`}
                        >
                          Detalhes
                        </Button>
                        {!enrolled ? (
                          <Button
                            size="sm"
                            className="text-xs w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700"
                            onClick={() => handleEnroll(course.id)}
                            data-testid={`enroll-${course.id}`}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Inscrever-se
                          </Button>
                        ) : status === 'enrolled' ? (
                          <Button
                            size="sm"
                            className="text-xs w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700"
                            onClick={() => handleStartCourse(course.id)}
                            data-testid={`start-${course.id}`}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Começar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="text-xs w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700"
                            disabled
                            data-testid={`in-progress-${course.id}`}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Em andamento
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="enrolled" className="space-y-3 xs:space-y-4">
            {enrollments.filter(e => e.status !== 'completed').length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="py-8 xs:py-12 text-center">
                  <GraduationCap className="h-10 xs:h-12 w-10 xs:w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Nenhum curso iniciado ainda</p>
                  <Button 
                    size="sm" 
                    onClick={() => {}}
                    className="text-xs xs:text-sm"
                  >
                    Explorar Cursos
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
                {enrollments
                  .filter(e => e.status !== 'completed')
                  .map(enrollment => {
                    const course = mockCourses.find(c => c.id === enrollment.courseId);
                    if (!course) return null;

                    return (
                      <Card key={enrollment.courseId} className="dark:bg-gray-800 dark:border-gray-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm xs:text-base">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 xs:space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium">Progresso</span>
                              <span className="text-muted-foreground">{enrollment.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-emerald-600 h-2 rounded-full transition-all"
                                style={{ width: `${enrollment.progress}%` }}
                              />
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full text-xs bg-blue-600 hover:bg-blue-700"
                            data-testid={`continue-${enrollment.courseId}`}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Continuar
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          {/* Completed Courses Tab */}
          <TabsContent value="completed" className="space-y-3 xs:space-y-4">
            {enrollments.filter(e => e.status === 'completed').length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="py-8 xs:py-12 text-center">
                  <CheckCircle className="h-10 xs:h-12 w-10 xs:w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">Nenhum curso concluído ainda</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
                {enrollments
                  .filter(e => e.status === 'completed')
                  .map(enrollment => {
                    const course = mockCourses.find(c => c.id === enrollment.courseId);
                    if (!course) return null;

                    return (
                      <Card key={enrollment.courseId} className="dark:bg-gray-800 dark:border-gray-700 border-green-500">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-sm xs:text-base">{course.title}</CardTitle>
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-xs xs:text-sm text-muted-foreground">Certificado de conclusão emitido</p>
                          <Button size="sm" variant="outline" className="w-full text-xs dark:bg-gray-700">
                            Certificado
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>

      {/* Course Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto dark:bg-gray-900">
          {selectedCourse && (
            <>
              <DialogHeader>
                <div className="text-4xl mb-3">{selectedCourse.thumbnail}</div>
                <DialogTitle className="text-lg xs:text-xl">{selectedCourse.title}</DialogTitle>
                <DialogDescription className="text-xs xs:text-sm">
                  {selectedCourse.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-3 xs:gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Duração</p>
                    <p className="font-medium text-xs xs:text-sm">{selectedCourse.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Dificuldade</p>
                    <p className="font-medium text-xs xs:text-sm">{selectedCourse.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Módulos</p>
                    <p className="font-medium text-xs xs:text-sm">{selectedCourse.modules}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lições</p>
                    <p className="font-medium text-xs xs:text-sm">{selectedCourse.lessons}</p>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Instrutor</p>
                  <p className="text-sm font-medium">{selectedCourse.instructor}</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-3 xs:p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(selectedCourse.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium">{selectedCourse.rating}</span>
                        <span className="text-xs text-muted-foreground">({selectedCourse.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 flex flex-col xs:flex-row">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailDialog(false)}
                  className="w-full xs:w-auto text-xs xs:text-sm dark:bg-gray-800"
                >
                  Fechar
                </Button>
                {!isEnrolled(selectedCourse.id) ? (
                  <Button
                    onClick={() => {
                      handleEnroll(selectedCourse.id);
                      setShowDetailDialog(false);
                    }}
                    className="w-full xs:w-auto text-xs xs:text-sm bg-emerald-600 hover:bg-emerald-700"
                    data-testid={`enroll-detail-${selectedCourse.id}`}
                  >
                    Inscrever-se
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleStartCourse(selectedCourse.id);
                      setShowDetailDialog(false);
                    }}
                    className="w-full xs:w-auto text-xs xs:text-sm bg-blue-600 hover:bg-blue-700"
                    data-testid={`start-detail-${selectedCourse.id}`}
                  >
                    Começar Curso
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const Training = () => {
  return (
    <DashboardLayout>
      <TrainingContent />
    </DashboardLayout>
  );
};
