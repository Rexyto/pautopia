import express from 'express';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import dotenv from 'dotenv';       
dotenv.config();  

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5555;
const DATA_DIR = join(__dirname, 'data');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(join(__dirname, 'dist')));

// CORS middleware - IMPORTANTE: debe ir ANTES de las rutas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
  
  // Manejar peticiones OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

await fs.mkdir(DATA_DIR, { recursive: true });

const getDataPath = (file) => join(DATA_DIR, file);

async function readJSON(file, defaultValue = []) {
  try {
    const data = await fs.readFile(getDataPath(file), 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

async function writeJSON(file, data) {
  await fs.writeFile(getDataPath(file), JSON.stringify(data, null, 2));
}

// =====================================================
// RATE LIMITING SIMPLE PARA SUGERENCIAS
// =====================================================

const sugerenciasRateLimit = new Map();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutos
const MAX_SUGERENCIAS_POR_VENTANA = 3; // Máximo 3 sugerencias cada 5 minutos

function checkRateLimit(ip) {
  const now = Date.now();
  const userLimit = sugerenciasRateLimit.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  // Si pasó el tiempo, resetear
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  // Verificar si excede el límite
  if (userLimit.count >= MAX_SUGERENCIAS_POR_VENTANA) {
    const minutosRestantes = Math.ceil((userLimit.resetTime - now) / 60000);
    return {
      allowed: false,
      error: `Has enviado muchas sugerencias. Espera ${minutosRestantes} minuto(s) para enviar otra.`
    };
  }
  
  // Incrementar contador
  userLimit.count++;
  sugerenciasRateLimit.set(ip, userLimit);
  
  return { allowed: true };
}

// Limpiar rate limits antiguos cada 10 minutos
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of sugerenciasRateLimit.entries()) {
    if (now > data.resetTime) {
      sugerenciasRateLimit.delete(ip);
    }
  }
}, 10 * 60 * 1000);

// =====================================================
// FIN DE RATE LIMITING
// =====================================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Visit counter endpoint
app.post('/api/visitas', async (req, res) => {
  try {
    const COOKIE_NAME = 'visitor_session';
    const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

    let sessionId = req.cookies[COOKIE_NAME];

    if (!sessionId) {
      sessionId = crypto.randomUUID();

      const visitas = await readJSON('visitas.json', { total: 0 });
      visitas.total += 1;
      await writeJSON('visitas.json', visitas);

      res.cookie(COOKIE_NAME, sessionId, {
        maxAge: COOKIE_MAX_AGE,
        httpOnly: true,
        sameSite: 'lax'
      });

      return res.json(visitas);
    }

    const visitas = await readJSON('visitas.json', { total: 0 });
    res.json(visitas);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar visitas' });
  }
});

app.get('/api/visitas', async (req, res) => {
  const visitas = await readJSON('visitas.json', { total: 0 });
  res.json(visitas);
});

// Apps version endpoint - ahora lee desde JSON
app.get('/apps/version.json', async (req, res) => {
  const versions = await readJSON('apps-versions.json', {});
  const appName = req.query.app;
  
  if (appName) {
    if (versions[appName]) {
      res.json(versions[appName]);
    } else {
      res.status(404).json({ error: 'App not found' });
    }
  } else {
    res.json(versions); // devuelve todas las apps
  }
});

app.get('/api/lecturas', async (req, res) => {
  const lecturas = await readJSON('lecturas.json');
  res.json(lecturas);
});

app.post('/api/lecturas', async (req, res) => {
  const lecturas = await readJSON('lecturas.json');
  const newLectura = { ...req.body, id: Date.now().toString() };
  lecturas.push(newLectura);
  await writeJSON('lecturas.json', lecturas);
  res.json(newLectura);
});

app.put('/api/lecturas/:id', async (req, res) => {
  const lecturas = await readJSON('lecturas.json');
  const index = lecturas.findIndex(l => l.id === req.params.id);
  if (index !== -1) {
    lecturas[index] = { ...req.body, id: req.params.id };
    await writeJSON('lecturas.json', lecturas);
    res.json(lecturas[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/lecturas/:id', async (req, res) => {
  let lecturas = await readJSON('lecturas.json');
  lecturas = lecturas.filter(l => l.id !== req.params.id);
  await writeJSON('lecturas.json', lecturas);
  res.json({ success: true });
});

app.get('/api/preguntas/:lecturaId', async (req, res) => {
  const preguntas = await readJSON(`preguntas_${req.params.lecturaId}.json`);
  res.json(preguntas);
});

app.post('/api/preguntas/:lecturaId', async (req, res) => {
  const lecturaId = req.params.lecturaId;
  const preguntas = await readJSON(`preguntas_${lecturaId}.json`);
  const newPregunta = { ...req.body, id: Date.now().toString() };
  preguntas.push(newPregunta);
  await writeJSON(`preguntas_${lecturaId}.json`, preguntas);
  res.json(newPregunta);
});

app.delete('/api/preguntas/:lecturaId/:id', async (req, res) => {
  const lecturaId = req.params.lecturaId;
  let preguntas = await readJSON(`preguntas_${lecturaId}.json`);
  preguntas = preguntas.filter(p => p.id !== req.params.id);
  await writeJSON(`preguntas_${lecturaId}.json`, preguntas);
  res.json({ success: true });
});

app.get('/api/materiales/:lecturaId', async (req, res) => {
  const materiales = await readJSON(`materiales_${req.params.lecturaId}.json`);
  res.json(materiales);
});

app.post('/api/materiales/:lecturaId', async (req, res) => {
  const lecturaId = req.params.lecturaId;
  const materiales = await readJSON(`materiales_${lecturaId}.json`);
  const newMaterial = { ...req.body, id: Date.now().toString() };
  materiales.push(newMaterial);
  await writeJSON(`materiales_${lecturaId}.json`, materiales);
  res.json(newMaterial);
});

app.delete('/api/materiales/:lecturaId/:id', async (req, res) => {
  const lecturaId = req.params.lecturaId;
  let materiales = await readJSON(`materiales_${lecturaId}.json`);
  materiales = materiales.filter(m => m.id !== req.params.id);
  await writeJSON(`materiales_${lecturaId}.json`, materiales);
  res.json({ success: true });
});

app.get('/api/ranking', async (req, res) => {
  const ranking = await readJSON('ranking.json', []);
  res.json(ranking);
});

// =====================================================
// FUNCIONES DE SEGURIDAD PARA SUGERENCIAS
// =====================================================

// Sanitizar texto: eliminar caracteres peligrosos
function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  
  // Eliminar caracteres de control y especiales peligrosos
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Caracteres de control
    .replace(/[<>]/g, '') // Evitar HTML injection
    .replace(/`{3,}/g, '``') // Evitar romper formato de Discord
    .replace(/[@#:]/g, '') // Evitar menciones y emojis raros en Discord
    .trim();
}

// Validar nombre
function validateNombre(nombre) {
  if (!nombre || typeof nombre !== 'string') {
    return { valid: false, error: 'El nombre es requerido' };
  }
  
  const sanitized = sanitizeText(nombre);
  
  // Límite: 25 caracteres (sin contar espacios)
  const sinEspacios = sanitized.replace(/\s/g, '');
  if (sinEspacios.length > 25) {
    return { valid: false, error: 'El nombre no puede tener más de 25 caracteres (sin contar espacios)' };
  }
  
  if (sanitized.length < 2) {
    return { valid: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }
  
  // Solo letras, números, espacios y algunos caracteres básicos
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.]+$/.test(sanitized)) {
    return { valid: false, error: 'El nombre contiene caracteres no permitidos' };
  }
  
  return { valid: true, value: sanitized };
}

// Validar sugerencia
function validateSugerencia(sugerencia) {
  if (!sugerencia || typeof sugerencia !== 'string') {
    return { valid: false, error: 'La sugerencia es requerida' };
  }
  
  const sanitized = sanitizeText(sugerencia);
  
  if (sanitized.length < 10) {
    return { valid: false, error: 'La sugerencia debe tener al menos 10 caracteres' };
  }
  
  if (sanitized.length > 500) {
    return { valid: false, error: 'La sugerencia no puede tener más de 500 caracteres' };
  }
  
  return { valid: true, value: sanitized };
}

// Escapar texto para Discord (evitar que rompan el formato)
function escapeDiscord(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/>/g, '\\>');
}

// =====================================================
// ENDPOINT DE SUGERENCIAS CON DISCORD WEBHOOK
// =====================================================

// Sugerencias endpoint con Discord webhook
app.post('/api/sugerencias', async (req, res) => {
  try {
    const { nombre, sugerencia } = req.body;

    // Validar nombre
    const nombreValidation = validateNombre(nombre);
    if (!nombreValidation.valid) {
      return res.status(400).json({ error: nombreValidation.error });
    }
    const nombreLimpio = nombreValidation.value;

    // Validar sugerencia
    const sugerenciaValidation = validateSugerencia(sugerencia);
    if (!sugerenciaValidation.valid) {
      return res.status(400).json({ error: sugerenciaValidation.error });
    }
    const sugerenciaLimpia = sugerenciaValidation.value;

    // Obtener IP del usuario
    let ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress ||
             'IP desconocida';

    // Limpiar y formatear IP
    ip = ip.toString().replace('::ffff:', '');
    
    // Guardar IP original para rate limiting
    const ipParaRateLimit = ip;
    
    // Si es localhost, mostrarlo claramente
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
      ip = 'Localhost (prueba local)';
    }

    // Verificar rate limit (solo si no es localhost en desarrollo)
    if (ipParaRateLimit !== '::1' && ipParaRateLimit !== '127.0.0.1') {
      const rateLimitCheck = checkRateLimit(ipParaRateLimit);
      if (!rateLimitCheck.allowed) {
        return res.status(429).json({ error: rateLimitCheck.error });
      }
    }

    // URL del webhook de Discord desde variables de entorno
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('DISCORD_WEBHOOK_URL no está configurado en .env');
      return res.status(500).json({ error: 'Configuración del servidor incompleta' });
    }

    // Crear el embed para Discord
    const discordPayload = {
      content: '@everyone',
      embeds: [
        {
          title: 'Nueva Sugerencia en PAUtopía',
          color: 6723891, // Color morado #667eea en decimal
          fields: [
            {
              name: 'Usuario',
              value: escapeDiscord(nombreLimpio),
              inline: true
            },
            {
              name: 'IP',
              value: ip,
              inline: true
            },
            {
              name: 'Sugerencia',
              value: `\`\`\`\n${escapeDiscord(sugerenciaLimpia)}\n\`\`\``
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'PAUtopía - Sistema de Sugerencias'
          }
        }
      ]
    };

    // Enviar webhook a Discord
    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error('Discord API error:', discordResponse.status, errorText);
      throw new Error(`Discord API error: ${discordResponse.status}`);
    }

    // Crear archivo de sugerencias si no existe
    const sugerenciasPath = getDataPath('sugerencias.json');
    try {
      await fs.access(sugerenciasPath);
    } catch {
      // El archivo no existe, crearlo
      await writeJSON('sugerencias.json', []);
      console.log('Archivo sugerencias.json creado');
    }

    // Guardar también en archivo JSON local (opcional, como backup)
    const sugerencias = await readJSON('sugerencias.json', []);
    sugerencias.push({
      id: Date.now().toString(),
      nombre: nombreLimpio,
      sugerencia: sugerenciaLimpia,
      ip: ip,
      fecha: new Date().toISOString()
    });
    await writeJSON('sugerencias.json', sugerencias);

    console.log(`✅ Nueva sugerencia de ${nombreLimpio} guardada`);

    // Responder al cliente
    res.status(200).json({ 
      success: true,
      message: 'Sugerencia enviada correctamente' 
    });

  } catch (error) {
    console.error('❌ Error al procesar sugerencia:', error);
    res.status(500).json({ 
      error: 'Error al enviar la sugerencia',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});