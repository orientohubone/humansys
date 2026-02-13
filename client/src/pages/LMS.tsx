import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Edit, Trash2, Upload, Video, File, Users, Clock, Play, X, MessageCircle, FileText, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  number: number;
  title: string;
  content: string;
  videoUrl?: string;
  attachments: Array<{ id: string; name: string; url: string }>;
  comments: Array<{ id: string; author: string; text: string; date: string }>;
  feedback: string;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface LMSCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  instructor: string;
  linkedCertificate?: string;
  modules: CourseModule[];
  createdAt: Date;
}

const mockCertificates = [
  { id: 'cert1', name: 'Certificado de Conclusão - Python' },
  { id: 'cert2', name: 'Certificado de Conclusão - Gestão' },
  { id: 'cert3', name: 'Certificado de Conclusão - Liderança' },
  { id: 'cert4', name: 'Certificado de Competência - Comunicação' }
];

const LMSContent = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<LMSCourse[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<LMSCourse | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [editingLesson, setEditingLesson] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Iniciante',
    duration: '',
    instructor: '',
    linkedCertificate: ''
  });

  const [moduleData, setModuleData] = useState({
    title: '',
    description: ''
  });

  const [lessonData, setLessonData] = useState({
    number: 1,
    title: '',
    content: '',
    videoUrl: '',
    feedback: ''
  });

  const [courseIntroLessons, setCourseIntroLessons] = useState<Lesson[]>([]);
  const [editingIntroLesson, setEditingIntroLesson] = useState<Lesson | null>(null);
  const [introLessonForm, setIntroLessonForm] = useState({
    number: 1,
    title: '',
    content: '',
    videoUrl: '',
    feedback: '',
    attachmentName: '',
    attachmentFile: null as File | null
  });

  const [newComment, setNewComment] = useState('');
  const [attachmentLink, setAttachmentLink] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [courseDialogTab, setCourseDialogTab] = useState('info');

  const handleCreateCourse = () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, descrição e categoria",
        variant: "destructive"
      });
      return;
    }

    const newCourse: LMSCourse = {
      id: Date.now().toString(),
      ...formData,
      modules: [],
      createdAt: new Date()
    };

    setCourses([...courses, newCourse]);
    toast({
      title: "Curso criado!",
      description: `Curso "${formData.title}" foi criado com sucesso.`
    });

    setFormData({ title: '', description: '', category: '', difficulty: 'Iniciante', duration: '', instructor: '', linkedCertificate: '' });
    setShowCreateDialog(false);
  };

  const handleAddModule = () => {
    if (!selectedCourse || !moduleData.title) {
      toast({
        title: "Erro",
        description: "Preencha o título do módulo",
        variant: "destructive"
      });
      return;
    }

    const newModule: CourseModule = {
      id: Date.now().toString(),
      ...moduleData,
      lessons: []
    };

    const updatedCourses = courses.map(c =>
      c.id === selectedCourse.id
        ? { ...c, modules: [...c.modules, newModule] }
        : c
    );

    setCourses(updatedCourses);
    setSelectedCourse({ ...selectedCourse, modules: [...selectedCourse.modules, newModule] });

    toast({
      title: "Módulo adicionado!",
      description: `Módulo "${moduleData.title}" foi adicionado.`
    });

    setModuleData({ title: '', description: '' });
    setShowModuleDialog(false);
  };

  const handleAddLesson = () => {
    if (!selectedModule || !lessonData.title || !lessonData.content) {
      toast({
        title: "Erro",
        description: "Preencha título e conteúdo da aula",
        variant: "destructive"
      });
      return;
    }

    const newLesson: Lesson = {
      id: Date.now().toString(),
      number: lessonData.number,
      title: lessonData.title,
      content: lessonData.content,
      videoUrl: lessonData.videoUrl,
      attachments: [],
      comments: [],
      feedback: lessonData.feedback
    };

    if (editingLesson && selectedLesson) {
      const updatedCourses = courses.map(c =>
        c.id === selectedCourse?.id
          ? {
              ...c,
              modules: c.modules.map(m =>
                m.id === selectedModule.id
                  ? {
                      ...m,
                      lessons: m.lessons.map(l =>
                        l.id === selectedLesson.id ? newLesson : l
                      )
                    }
                  : m
              )
            }
          : c
      );
      setCourses(updatedCourses);
      toast({
        title: "Aula atualizada!",
        description: `Aula "${lessonData.title}" foi atualizada.`
      });
      setEditingLesson(false);
    } else {
      const updatedCourses = courses.map(c =>
        c.id === selectedCourse?.id
          ? {
              ...c,
              modules: c.modules.map(m =>
                m.id === selectedModule.id
                  ? { ...m, lessons: [...m.lessons, newLesson] }
                  : m
              )
            }
          : c
      );
      setCourses(updatedCourses);
      toast({
        title: "Aula criada!",
        description: `Aula "${lessonData.title}" foi adicionada.`
      });
    }

    setLessonData({ number: 1, title: '', content: '', videoUrl: '', feedback: '' });
    setShowLessonDialog(false);
    setSelectedLesson(null);
  };

  const handleAddComment = (lessonId: string) => {
    if (!newComment.trim()) return;

    const updatedCourses = courses.map(c =>
      c.id === selectedCourse?.id
        ? {
            ...c,
            modules: c.modules.map(m =>
              m.id === selectedModule?.id
                ? {
                    ...m,
                    lessons: m.lessons.map(l =>
                      l.id === lessonId
                        ? {
                            ...l,
                            comments: [
                              ...l.comments,
                              {
                                id: Date.now().toString(),
                                author: 'Você',
                                text: newComment,
                                date: new Date().toLocaleDateString('pt-BR')
                              }
                            ]
                          }
                        : l
                    )
                  }
                : m
            )
          }
        : c
    );
    setCourses(updatedCourses);
    setNewComment('');
    toast({
      title: "Comentário adicionado!",
      description: "Seu comentário foi publicado."
    });
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (!selectedModule) return;

    const updatedCourses = courses.map(c =>
      c.id === selectedCourse?.id
        ? {
            ...c,
            modules: c.modules.map(m =>
              m.id === selectedModule.id
                ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
                : m
            )
          }
        : c
    );

    setCourses(updatedCourses);
    toast({
      title: "Aula removida",
      description: "A aula foi deletada com sucesso."
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    if (!selectedCourse) return;

    const updatedCourses = courses.map(c =>
      c.id === selectedCourse.id
        ? { ...c, modules: c.modules.filter(m => m.id !== moduleId) }
        : c
    );

    setCourses(updatedCourses);
    setSelectedCourse(updatedCourses.find(c => c.id === selectedCourse.id)!);
    toast({
      title: "Módulo removido",
      description: "O módulo foi deletado com sucesso."
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter(c => c.id !== courseId));
    toast({
      title: "Curso removido",
      description: "O curso foi deletado com sucesso."
    });
  };

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4">
        <div>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-6 xs:h-8 w-6 xs:w-8 text-emerald-600" />
            Gerenciador de Cursos LMS
          </h1>
          <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400 mt-1">
            Crie e gerencie suas aulas, módulos e certificados
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedCourse(null);
            setShowCreateDialog(true);
          }}
          className="text-xs xs:text-sm bg-emerald-600 hover:bg-emerald-700 w-full xs:w-auto"
          data-testid="create-course-btn"
        >
          <Plus className="h-4 w-4 mr-1" />
          Novo Curso
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-3 xs:pt-4">
            <div className="text-center">
              <p className="text-lg xs:text-2xl font-bold text-emerald-600">{courses.length}</p>
              <p className="text-xs xs:text-sm text-muted-foreground mt-1">Cursos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-3 xs:pt-4">
            <div className="text-center">
              <p className="text-lg xs:text-2xl font-bold text-blue-600">{courses.reduce((sum, c) => sum + c.modules.length, 0)}</p>
              <p className="text-xs xs:text-sm text-muted-foreground mt-1">Módulos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-3 xs:pt-4">
            <div className="text-center">
              <p className="text-lg xs:text-2xl font-bold text-purple-600">{courses.reduce((sum, c) => sum + c.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0)}</p>
              <p className="text-xs xs:text-sm text-muted-foreground mt-1">Aulas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Nenhum curso criado ainda</p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="text-xs xs:text-sm"
            >
              Criar Primeiro Curso
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={courses[0]?.id} className="w-full">
          <TabsList className="grid w-full grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 h-auto p-2 bg-gray-100 dark:bg-gray-800">
            {courses.map((course) => (
              <TabsTrigger
                key={course.id}
                value={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setSelectedModule(null);
                }}
                className="text-xs xs:text-sm dark:text-white"
              >
                {course.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {courses.map((course) => (
            <TabsContent key={course.id} value={course.id} className="space-y-4 xs:space-y-6 mt-4 xs:mt-6">
              {/* Course Header */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4">
                    <div>
                      <CardTitle className="text-xl xs:text-2xl">{course.title}</CardTitle>
                      <CardDescription className="text-xs xs:text-sm mt-2">{course.description}</CardDescription>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs xs:text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded">
                          {course.category}
                        </span>
                        <span className="text-xs xs:text-sm px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 rounded">
                          {course.difficulty}
                        </span>
                        {course.linkedCertificate && (
                          <span className="text-xs xs:text-sm px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 rounded flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Certificado Vinculado
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            title: course.title,
                            description: course.description,
                            category: course.category,
                            difficulty: course.difficulty,
                            duration: course.duration,
                            instructor: course.instructor,
                            linkedCertificate: course.linkedCertificate || ''
                          });
                          setSelectedCourse(course);
                          setShowCreateDialog(true);
                        }}
                        className="text-xs dark:bg-gray-700"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-xs text-red-600 dark:text-red-400 dark:bg-gray-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Modules */}
              <div className="space-y-3 xs:space-y-4">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4">
                  <h3 className="text-lg xs:text-xl font-semibold text-gray-900 dark:text-white">Módulos</h3>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedModule(null);
                      setModuleData({ title: '', description: '' });
                      setShowModuleDialog(true);
                    }}
                    className="text-xs xs:text-sm bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Novo Módulo
                  </Button>
                </div>

                {course.modules.length === 0 ? (
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="py-8 text-center">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Nenhum módulo ainda</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3 xs:space-y-4">
                    {course.modules.map((module) => (
                      <Card key={module.id} className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                        <CardHeader className="pb-3 xs:pb-4">
                          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-base xs:text-lg">{module.title}</CardTitle>
                              <CardDescription className="text-xs xs:text-sm mt-1">{module.description}</CardDescription>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{module.lessons.length} aula(s)</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedModule(module);
                                  setSelectedLesson(null);
                                  setLessonData({ number: module.lessons.length + 1, title: '', content: '', videoUrl: '', feedback: '' });
                                  setShowLessonDialog(true);
                                }}
                                className="text-xs dark:bg-gray-700"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Aula
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteModule(module.id)}
                                className="text-xs text-red-600 dark:text-red-400 dark:bg-gray-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        {/* Lessons */}
                        {module.lessons.length > 0 && (
                          <CardContent className="space-y-3 xs:space-y-4 border-t dark:border-gray-700 pt-3 xs:pt-4">
                            {module.lessons.map((lesson) => (
                              <div key={lesson.id} className="p-3 xs:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700">
                                <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-4">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-start gap-2">
                                      <p className="text-xs xs:text-sm font-semibold text-emerald-600">Aula {lesson.number}:</p>
                                      <p className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">{lesson.title}</p>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{lesson.content}</p>
                                    
                                    {/* Lesson Info */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {lesson.videoUrl && (
                                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded flex items-center gap-1">
                                          <Video className="h-3 w-3" />
                                          Vídeo
                                        </span>
                                      )}
                                      {lesson.attachments.length > 0 && (
                                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded flex items-center gap-1">
                                          <File className="h-3 w-3" />
                                          {lesson.attachments.length} anexo(s)
                                        </span>
                                      )}
                                      {lesson.comments.length > 0 && (
                                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 rounded flex items-center gap-1">
                                          <MessageCircle className="h-3 w-3" />
                                          {lesson.comments.length}
                                        </span>
                                      )}
                                      {lesson.feedback && (
                                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 rounded flex items-center gap-1">
                                          <FileText className="h-3 w-3" />
                                          Feedback
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedLesson(lesson);
                                        setEditingLesson(true);
                                        setLessonData({
                                          number: lesson.number,
                                          title: lesson.title,
                                          content: lesson.content,
                                          videoUrl: lesson.videoUrl || '',
                                          feedback: lesson.feedback
                                        });
                                        setShowLessonDialog(true);
                                      }}
                                      className="text-xs dark:bg-gray-700"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedLesson(lesson);
                                        setSelectedModule(module);
                                      }}
                                      className="text-xs dark:bg-gray-700"
                                      data-testid={`view-lesson-${lesson.id}`}
                                    >
                                      <Play className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteLesson(lesson.id)}
                                      className="text-xs text-red-600 dark:text-red-400 dark:bg-gray-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Create/Edit Course Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="w-full max-w-md sm:max-w-2xl mx-auto max-h-[90vh] overflow-y-auto dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-lg xs:text-xl">{selectedCourse ? 'Editar Curso' : 'Criar Novo Curso'}</DialogTitle>
          </DialogHeader>

          <Tabs value={courseDialogTab} onValueChange={setCourseDialogTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="info" className="text-xs xs:text-sm dark:text-white">Informações</TabsTrigger>
              <TabsTrigger value="content" className="text-xs xs:text-sm dark:text-white">Conteúdo Introdutório</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-3 xs:space-y-4 py-4">
            <div>
              <label className="text-xs xs:text-sm font-medium">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Python Avançado"
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
              />
            </div>

            <div>
              <label className="text-xs xs:text-sm font-medium">Descrição *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o conteúdo do curso..."
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs xs:text-sm font-medium">Categoria *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Desenvolvimento"
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                />
              </div>
              <div>
                <label className="text-xs xs:text-sm font-medium">Dificuldade</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                >
                  <option>Iniciante</option>
                  <option>Intermediário</option>
                  <option>Avançado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs xs:text-sm font-medium">Duração</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Ex: 8 semanas"
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                />
              </div>
              <div>
                <label className="text-xs xs:text-sm font-medium">Instrutor</label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  placeholder="Ex: João Silva"
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs xs:text-sm font-medium">Certificado Vinculado</label>
              <select
                value={formData.linkedCertificate}
                onChange={(e) => setFormData({ ...formData, linkedCertificate: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
              >
                <option value="">Selecione um certificado...</option>
                {mockCertificates.map((cert) => (
                  <option key={cert.id} value={cert.id}>
                    {cert.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">O certificado será liberado quando o curso for concluído</p>
            </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-3 xs:space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
                <h4 className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white">Aulas do Curso ({courseIntroLessons.length})</h4>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingIntroLesson(null);
                    setIntroLessonForm({
                      number: courseIntroLessons.length + 1,
                      title: '',
                      content: '',
                      videoUrl: '',
                      feedback: '',
                      attachmentName: '',
                      attachmentFile: null
                    });
                  }}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 w-full xs:w-auto"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Nova Aula
                </Button>
              </div>

              {courseIntroLessons.length > 0 && (
                <div className="space-y-2">
                  {courseIntroLessons.map((lesson) => (
                    <div key={lesson.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                      <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs xs:text-sm font-semibold text-emerald-600">Aula {lesson.number}: {lesson.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">{lesson.content}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {lesson.videoUrl && <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-900 dark:text-red-100 rounded">Vídeo</span>}
                            {lesson.attachments.length > 0 && <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 rounded">{lesson.attachments.length} anexo(s)</span>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingIntroLesson(lesson);
                              setIntroLessonForm({
                                number: lesson.number,
                                title: lesson.title,
                                content: lesson.content,
                                videoUrl: lesson.videoUrl || '',
                                feedback: lesson.feedback,
                                attachmentName: '',
                                attachmentFile: null
                              });
                            }}
                            className="text-xs dark:bg-gray-700"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCourseIntroLessons(courseIntroLessons.filter(l => l.id !== lesson.id));
                            }}
                            className="text-xs text-red-600 dark:text-red-400 dark:bg-gray-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t dark:border-gray-700 pt-4">
                <h4 className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white mb-3">{editingIntroLesson ? 'Editar Aula' : 'Criar Nova Aula'}</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium">Número</label>
                      <input
                        type="number"
                        value={introLessonForm.number}
                        onChange={(e) => setIntroLessonForm({ ...introLessonForm, number: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border rounded text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Título *</label>
                      <input
                        type="text"
                        value={introLessonForm.title}
                        onChange={(e) => setIntroLessonForm({ ...introLessonForm, title: e.target.value })}
                        placeholder="Ex: Introdução"
                        className="w-full px-2 py-1 border rounded text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium">Conteúdo *</label>
                    <textarea
                      value={introLessonForm.content}
                      onChange={(e) => setIntroLessonForm({ ...introLessonForm, content: e.target.value })}
                      placeholder="Conteúdo da aula..."
                      className="w-full px-2 py-1 border rounded text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium">URL Vídeo</label>
                    <input
                      type="url"
                      value={introLessonForm.videoUrl}
                      onChange={(e) => setIntroLessonForm({ ...introLessonForm, videoUrl: e.target.value })}
                      placeholder="https://youtu.be/..."
                      className="w-full px-2 py-1 border rounded text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium">Upload Anexo</label>
                    <div className="border-2 border-dashed rounded p-2 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 mt-1 text-center">
                      <input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setIntroLessonForm({
                              ...introLessonForm,
                              attachmentFile: e.target.files[0],
                              attachmentName: e.target.files[0].name
                            });
                          }
                        }}
                        className="hidden"
                        id="intro-attachment"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => document.getElementById('intro-attachment')?.click()}
                        className="text-xs w-full dark:bg-gray-800"
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Selecionar Arquivo
                      </Button>
                      {introLessonForm.attachmentName && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">✓ {introLessonForm.attachmentName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium">Feedback</label>
                    <textarea
                      value={introLessonForm.feedback}
                      onChange={(e) => setIntroLessonForm({ ...introLessonForm, feedback: e.target.value })}
                      placeholder="Observações..."
                      className="w-full px-2 py-1 border rounded text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                      rows={2}
                    />
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      if (!introLessonForm.title || !introLessonForm.content) {
                        toast({
                          title: "Campos obrigatórios",
                          description: "Preencha título e conteúdo",
                          variant: "destructive"
                        });
                        return;
                      }

                      const newLesson: Lesson = {
                        id: editingIntroLesson?.id || Date.now().toString(),
                        number: introLessonForm.number,
                        title: introLessonForm.title,
                        content: introLessonForm.content,
                        videoUrl: introLessonForm.videoUrl,
                        feedback: introLessonForm.feedback,
                        attachments: editingIntroLesson?.attachments || [],
                        comments: editingIntroLesson?.comments || []
                      };

                      if (editingIntroLesson) {
                        setCourseIntroLessons(courseIntroLessons.map(l => l.id === editingIntroLesson.id ? newLesson : l));
                        setEditingIntroLesson(null);
                      } else {
                        setCourseIntroLessons([...courseIntroLessons, newLesson]);
                      }

                      setIntroLessonForm({
                        number: courseIntroLessons.length + 1,
                        title: '',
                        content: '',
                        videoUrl: '',
                        feedback: '',
                        attachmentName: '',
                        attachmentFile: null
                      });

                      toast({
                        title: editingIntroLesson ? "Aula atualizada!" : "Aula criada!",
                        description: `"${introLessonForm.title}" foi adicionada com sucesso.`
                      });
                    }}
                    className="w-full text-xs bg-emerald-600 hover:bg-emerald-700"
                  >
                    {editingIntroLesson ? 'Atualizar Aula' : 'Criar Aula'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 flex flex-col xs:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setSelectedCourse(null);
                setCourseIntroLessons([]);
                setEditingIntroLesson(null);
              }}
              className="w-full xs:w-auto text-xs xs:text-sm dark:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCourse}
              className="w-full xs:w-auto text-xs xs:text-sm bg-emerald-600 hover:bg-emerald-700"
              data-testid="save-course"
            >
              {selectedCourse ? 'Atualizar Curso' : 'Criar Curso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Module Dialog */}
      <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
        <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-lg xs:text-xl">Novo Módulo</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 xs:space-y-4 py-4">
            <div>
              <label className="text-xs xs:text-sm font-medium">Título *</label>
              <input
                type="text"
                value={moduleData.title}
                onChange={(e) => setModuleData({ ...moduleData, title: e.target.value })}
                placeholder="Ex: Fundamentos"
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
              />
            </div>

            <div>
              <label className="text-xs xs:text-sm font-medium">Descrição</label>
              <textarea
                value={moduleData.description}
                onChange={(e) => setModuleData({ ...moduleData, description: e.target.value })}
                placeholder="Descrição do módulo..."
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 flex flex-col xs:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowModuleDialog(false)}
              className="w-full xs:w-auto text-xs xs:text-sm dark:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddModule}
              className="w-full xs:w-auto text-xs xs:text-sm bg-emerald-600 hover:bg-emerald-700"
              data-testid="save-module"
            >
              Adicionar Módulo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Lesson Dialog */}
      <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
        <DialogContent className="w-full max-w-md sm:max-w-2xl mx-auto max-h-[90vh] overflow-y-auto dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-lg xs:text-xl">{editingLesson ? 'Editar Aula' : 'Criar Nova Aula'}</DialogTitle>
            <DialogDescription className="text-xs xs:text-sm">Complete todos os campos para criar uma aula estruturada</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 xs:space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs xs:text-sm font-medium">Número da Aula</label>
                <input
                  type="number"
                  value={lessonData.number}
                  onChange={(e) => setLessonData({ ...lessonData, number: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                />
              </div>
              <div>
                <label className="text-xs xs:text-sm font-medium">Título da Aula *</label>
                <input
                  type="text"
                  value={lessonData.title}
                  onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                  placeholder="Ex: Introdução"
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs xs:text-sm font-medium">Conteúdo da Aula *</label>
              <textarea
                value={lessonData.content}
                onChange={(e) => setLessonData({ ...lessonData, content: e.target.value })}
                placeholder="Escreva o conteúdo principal da aula aqui..."
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                rows={4}
              />
            </div>

            <div>
              <label className="text-xs xs:text-sm font-medium">URL do Vídeo</label>
              <input
                type="url"
                value={lessonData.videoUrl}
                onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })}
                placeholder="https://youtu.be/... ou link do vídeo"
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
              />
            </div>

            <div>
              <label className="text-xs xs:text-sm font-medium">Feedback/Observações</label>
              <textarea
                value={lessonData.feedback}
                onChange={(e) => setLessonData({ ...lessonData, feedback: e.target.value })}
                placeholder="Deixe feedback ou observações importantes sobre esta aula..."
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                rows={3}
              />
            </div>

            <div className="border-t dark:border-gray-700 pt-4">
              <h4 className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white mb-3">Anexos</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    placeholder="Nome do arquivo"
                    className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  <input
                    type="url"
                    value={attachmentLink}
                    onChange={(e) => setAttachmentLink(e.target.value)}
                    placeholder="Link do arquivo"
                    className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (attachmentName && attachmentLink && selectedLesson) {
                      const updatedCourses = courses.map(c =>
                        c.id === selectedCourse?.id
                          ? {
                              ...c,
                              modules: c.modules.map(m =>
                                m.id === selectedModule?.id
                                  ? {
                                      ...m,
                                      lessons: m.lessons.map(l =>
                                        l.id === selectedLesson.id
                                          ? {
                                              ...l,
                                              attachments: [
                                                ...l.attachments,
                                                {
                                                  id: Date.now().toString(),
                                                  name: attachmentName,
                                                  url: attachmentLink
                                                }
                                              ]
                                            }
                                          : l
                                      )
                                    }
                                  : m
                              )
                            }
                          : c
                      );
                      setCourses(updatedCourses);
                      setAttachmentName('');
                      setAttachmentLink('');
                      toast({
                        title: "Anexo adicionado!",
                        description: `"${attachmentName}" foi adicionado.`
                      });
                    }
                  }}
                  className="w-full text-xs"
                  disabled={!attachmentName || !attachmentLink || !selectedLesson}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Adicionar Anexo
                </Button>
                {selectedLesson?.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedLesson.attachments.map((att) => (
                      <div key={att.id} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2">
                          <File className="h-3 w-3 text-blue-600" />
                          <span className="text-xs text-blue-900 dark:text-blue-100">{att.name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (selectedLesson) {
                              const updatedCourses = courses.map(c =>
                                c.id === selectedCourse?.id
                                  ? {
                                      ...c,
                                      modules: c.modules.map(m =>
                                        m.id === selectedModule?.id
                                          ? {
                                              ...m,
                                              lessons: m.lessons.map(l =>
                                                l.id === selectedLesson.id
                                                  ? {
                                                      ...l,
                                                      attachments: l.attachments.filter(a => a.id !== att.id)
                                                    }
                                                  : l
                                              )
                                            }
                                          : m
                                      )
                                    }
                                  : c
                              );
                              setCourses(updatedCourses);
                            }
                          }}
                          className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-4">
              <h4 className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white mb-3">Comentários</h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newComment.trim() && selectedLesson) {
                        const updatedCourses = courses.map(c =>
                          c.id === selectedCourse?.id
                            ? {
                                ...c,
                                modules: c.modules.map(m =>
                                  m.id === selectedModule?.id
                                    ? {
                                        ...m,
                                        lessons: m.lessons.map(l =>
                                          l.id === selectedLesson.id
                                            ? {
                                                ...l,
                                                comments: [
                                                  ...l.comments,
                                                  {
                                                    id: Date.now().toString(),
                                                    author: 'Você',
                                                    text: newComment,
                                                    date: new Date().toLocaleDateString('pt-BR')
                                                  }
                                                ]
                                              }
                                            : l
                                        )
                                      }
                                    : m
                                )
                              }
                            : c
                        );
                        setCourses(updatedCourses);
                        setNewComment('');
                      }
                    }}
                    placeholder="Adicione um comentário (Enter para enviar)"
                    className="flex-1 px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (newComment.trim() && selectedLesson) {
                        const updatedCourses = courses.map(c =>
                          c.id === selectedCourse?.id
                            ? {
                                ...c,
                                modules: c.modules.map(m =>
                                  m.id === selectedModule?.id
                                    ? {
                                        ...m,
                                        lessons: m.lessons.map(l =>
                                          l.id === selectedLesson.id
                                            ? {
                                                ...l,
                                                comments: [
                                                  ...l.comments,
                                                  {
                                                    id: Date.now().toString(),
                                                    author: 'Você',
                                                    text: newComment,
                                                    date: new Date().toLocaleDateString('pt-BR')
                                                  }
                                                ]
                                              }
                                            : l
                                        )
                                      }
                                    : m
                                )
                              }
                            : c
                        );
                        setCourses(updatedCourses);
                        setNewComment('');
                      }
                    }}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                {selectedLesson?.comments.length > 0 && (
                  <div className="max-h-40 overflow-y-auto space-y-2 pt-2 border-t dark:border-gray-700">
                    {selectedLesson.comments.map((comment) => (
                      <div key={comment.id} className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-medium text-green-900 dark:text-green-100">{comment.author}</p>
                            <p className="text-xs text-green-800 dark:text-green-200 mt-1">{comment.text}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (selectedLesson) {
                                const updatedCourses = courses.map(c =>
                                  c.id === selectedCourse?.id
                                    ? {
                                        ...c,
                                        modules: c.modules.map(m =>
                                          m.id === selectedModule?.id
                                            ? {
                                                ...m,
                                                lessons: m.lessons.map(l =>
                                                  l.id === selectedLesson.id
                                                    ? {
                                                        ...l,
                                                        comments: l.comments.filter(cm => cm.id !== comment.id)
                                                      }
                                                    : l
                                                )
                                              }
                                            : m
                                        )
                                      }
                                    : c
                                );
                                setCourses(updatedCourses);
                              }
                            }}
                            className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{comment.date}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 flex flex-col xs:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setShowLessonDialog(false);
                setEditingLesson(false);
                setSelectedLesson(null);
              }}
              className="w-full xs:w-auto text-xs xs:text-sm dark:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddLesson}
              className="w-full xs:w-auto text-xs xs:text-sm bg-emerald-600 hover:bg-emerald-700"
              data-testid="save-lesson"
            >
              {editingLesson ? 'Atualizar Aula' : 'Criar Aula'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const LMS = () => {
  return (
    <DashboardLayout>
      <LMSContent />
    </DashboardLayout>
  );
};
