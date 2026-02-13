import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { storage } from '../storage';
import { updateUserSchema } from '@shared/schema';

const router = express.Router();

// Configuração do multer para upload de avatares
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.params.userId || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `user_${timestamp}${ext}`);
  }
});

const upload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use apenas imagens (JPEG, PNG, GIF, WebP).'));
    }
  }
});

// GET /api/users/:id - Obter dados do usuário
router.get('/:id', async (req, res) => {
  try {
    console.log('👤 GET /api/users/:id - userId:', req.params.id);
    
    const user = await storage.getUser(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }

    // Remover senha antes de retornar
    const { password, ...userWithoutPassword } = user;
    
    console.log('✅ Usuário encontrado:', userWithoutPassword.email);
    res.json({ 
      success: true, 
      data: userWithoutPassword 
    });
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// PUT /api/users/:id - Atualizar dados do usuário
router.put('/:id', async (req, res) => {
  try {
    console.log('📝 PUT /api/users/:id - userId:', req.params.id);
    console.log('📝 Dados recebidos:', req.body);
    
    // Validar dados com Zod
    const validatedData = updateUserSchema.parse(req.body);
    
    const updatedUser = await storage.updateUser(req.params.id, validatedData);
    
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }

    // Remover senha antes de retornar
    const { password, ...userWithoutPassword } = updatedUser;
    
    console.log('✅ Usuário atualizado:', userWithoutPassword.email);
    res.json({ 
      success: true, 
      data: userWithoutPassword,
      message: 'Perfil atualizado com sucesso' 
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados inválidos',
        errors: error.errors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// POST /api/users/:id/avatar - Upload de avatar
router.post('/:id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    console.log('📸 POST /api/users/:id/avatar - userId:', req.params.id);
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nenhum arquivo enviado' 
      });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    console.log('📸 Avatar salvo em:', avatarUrl);
    
    // Atualizar URL do avatar no banco de dados
    const updatedUser = await storage.updateUser(req.params.id, {
      avatar_url: avatarUrl
    });
    
    if (!updatedUser) {
      // Remover arquivo se usuário não encontrado
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }

    console.log('✅ Avatar atualizado para usuário:', updatedUser.email);
    res.json({ 
      success: true, 
      data: { avatar_url: avatarUrl },
      message: 'Avatar atualizado com sucesso' 
    });
  } catch (error) {
    console.error('❌ Erro ao fazer upload do avatar:', error);
    
    // Remover arquivo em caso de erro
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('❌ Erro ao remover arquivo:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

export default router;