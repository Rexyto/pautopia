# PAUtopia

<div align="center">

![React](https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/-React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JSON](https://img.shields.io/badge/-JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![Discord](https://img.shields.io/badge/-Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

---

Plataforma web educativa diseñada para ayudar a estudiantes de 2º de Bachillerato en su preparación para la Prueba de Acceso a la Universidad (PAU) en España.

## Web

> **¿Eres estudiante o quieres visitar la página? Accede directamente aquí:**
>
> ### [pautopia.duckdns.org](https://pautopia.duckdns.org)

---

## Descripción

PAUtopia es una aplicación web completa que centraliza recursos educativos, lecturas obligatorias, apuntes, herramientas de estudio y sistemas de evaluación. Incluye funcionalidades como gestión de lecturas con preguntas de comprensión, materiales de apoyo organizados por asignaturas, sistema de ranking de estudiantes, y un sistema de sugerencias integrado con Discord.

## Autor

Creado por **Rexy** en colaboración con **La Tiza de Rosa**.

## Características Principales

- **Gestión de Lecturas**: Sistema completo para administrar obras literarias con preguntas de comprensión y materiales adicionales
- **Apuntes por Asignatura**: Recursos organizados para Biología, Tecnología, Matemáticas, Filosofía, Lengua, Inglés, Historia, Física, Química y **Cultura Audiovisual**
- **Sistema de Exámenes**: Herramienta interactiva para evaluar conocimientos disponible para Historia de España y Cultura Audiovisual, con modo quiz tipo test y modo repaso con buscador y filtros
- **Apps Educativas**: Calculadoras y herramientas auxiliares (VigaCalc, WaveCalc, RLCCalc, Conceptuando la Historia)
- **Ranking de Estudiantes**: Sistema de clasificación basado en puntos
- **Biblioteca de Frases**: Colección de citas memorables de profesores
- **Sistema de Sugerencias**: Integrado con webhook de Discord para recibir feedback de usuarios
- **Contador de Visitas**: Registro de estudiantes que han utilizado la plataforma

---

## Para estudiantes que se enfrentarán a la PAU en el futuro

Este proyecto nació para ayudar a estudiantes de 2º de Bachillerato, y la idea es que **siga vivo y creciendo** más allá de su creador original.

Si estás preparando tu PAU y quieres contribuir, ya sea añadiendo apuntes de tu comunidad, nuevas lecturas, preguntas, recursos, o mejoras técnicas — **eres más que bienvenido/a a hacerlo**. Este repositorio es tuyo también.

El objetivo es simple: que cada generación deje el proyecto un poco mejor de como lo encontró, para que los que vengan detrás lo tengan más fácil.

---

## Licencia y Uso del Código

Este proyecto es **de uso libre** bajo las siguientes condiciones:

- Puedes **ver, clonar y modificar** el código libremente para uso personal o educativo.
- Puedes **usar partes del proyecto** como referencia o aprendizaje sin restricciones.
- Si quieres **publicar una versión modificada o derivada** de este proyecto, te pedimos que en lugar de hacerlo por separado, **abras un Pull Request en este repositorio**. Así el proyecto original se beneficia de tus mejoras, y tú recibes crédito oficial por tu contribución.
- No está permitido **redistribuir este proyecto como propio** sin reconocer su origen.

> En resumen: úsalo, apréndelo, mejóralo, pero si lo publicas, hazlo aquí y te damos los créditos que mereces.

---

## Contribuir

¿Quieres mejorar PAUtopia? Ya seas desarrollador, estudiante con apuntes útiles o simplemente alguien con buenas ideas, hay sitio para ti.

### ¿Cómo contribuir?

1. Haz **fork** del repositorio
2. Crea una rama para tu aportación (`git checkout -b feature/MiAportacion`)
3. Haz **commit** de tus cambios (`git commit -m 'Añadir [descripción de tu aportación]'`)
4. Haz **push** a tu rama (`git push origin feature/MiAportacion`)
5. Abre un **Pull Request** describiendo qué has añadido o mejorado

### ¿Qué tipo de contribuciones se aceptan?

- Nuevos apuntes o recursos por asignatura
- Lecturas obligatorias de otras comunidades autónomas
- Preguntas de comprensión para las lecturas existentes
- Corrección de errores o bugs
- Mejoras de funcionalidad o diseño
- Adaptaciones para otras comunidades autónomas

Todos los contribuidores serán reconocidos en la sección de créditos del proyecto.

---

## Créditos y Contribuidores

| Rol | Persona |
|-----|---------|
| Creador y desarrollador principal | **Rexy** |
| Colaboración en contenidos | **La Tiza de Rosa** |
| Primera contribuidora externa — Cultura Audiovisual | **Haiko** |

*¿Has contribuido al proyecto? Tu nombre estará aquí.*

---

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)
- Navegador web moderno

## Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/Rexyto/pautopia.git
cd pautopia
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/TU_WEBHOOK_ID/TU_WEBHOOK_TOKEN
```

Para obtener la URL del webhook de Discord:
1. Ve a tu servidor de Discord
2. Configuración del Canal > Integraciones > Webhooks
3. Crear webhook y copiar la URL

### 4. Crear estructura de datos
Crear la carpeta `data` en la raíz del proyecto:
```bash
mkdir data
```

Dentro de `data`, crear los siguientes archivos JSON (consultar la sección "Estructura de Datos" para ver el contenido de cada archivo):

**Archivos obligatorios:**
- `lecturas.json`
- `preguntas_1.json`, `preguntas_2.json`, `preguntas_3.json`, `preguntas_4.json`
- `materiales_1.json`, `materiales_2.json`, `materiales_3.json`, `materiales_4.json`
- `ranking.json`
- `visitas.json`
- `conceptos.json`
- `conceptos_cultura_audiovisual.json`
- `apps-versions.json`

**Archivo generado automáticamente:**
- `sugerencias.json` (se crea al recibir la primera sugerencia)

### 5. Preparar recursos estáticos
Asegurarse de que la carpeta `public` contenga:
- `logo.png` - Logo de la aplicación
- `rexy.png` - Imagen del creador
- `VigaCalc.png` y `VigaCalc.apk` - App VigaCalc
- `Conceptuando_la_historia.png` y `Conceptuando_la_historia.apk` - App Conceptuando
- Archivos PDF de las lecturas mencionados en `materiales_{id}.json`
- PDFs de Cultura Audiovisual (ver tabla de nombres en la sección correspondiente)

## Estructura de Datos

### conceptos.json
Base de datos de conceptos históricos para el sistema de exámenes tipo test de Historia de España.

```json
{
  "conceptos": [
    {
      "categoria": "Político",
      "nombre": "Absolutismo",
      "definicion": "Sistema de gobierno en el que el monarca concentra todos los poderes del Estado sin limitación legal."
    }
  ]
}
```

---

### conceptos_cultura_audiovisual.json
Base de datos de conceptos de Cultura Audiovisual. Contiene 70 conceptos repartidos en 5 categorías: Historia de la Fotografía, Imagen Fija y Lenguajes, Teoría del Color, Leyes de la Gestalt y Publicidad.

```json
{
  "conceptos": [
    {
      "categoria": "Historia de la Fotografía",
      "nombre": "Daguerrotipo",
      "definicion": "Proceso fotográfico presentado por Louis Daguerre en 1839..."
    }
  ]
}
```

---

### lecturas.json
Almacena información sobre las obras literarias obligatorias de PAU.

**Campos:**
- `id`: Identificador único de la lectura (string)
- `titulo`: Título de la obra (string)
- `autor`: Nombre del autor (string)
- `evaluacion`: Evaluación correspondiente (string, opcional)
- `temas`: Array de temas principales de la obra (array, opcional)
- `descripcion`: Descripción breve de la obra (string, opcional)

**Ejemplo:**
```json
[
  {
    "id": "1",
    "titulo": "Campos de Castilla",
    "autor": "Antonio Machado",
    "evaluacion": "Primera evaluación",
    "temas": [
      "El simbolismo en la obra Campos de Castilla",
      "Análisis de los temas principales",
      "Castilla como visión crítica de España"
    ],
    "descripcion": "Obra esencial de Antonio Machado que combina paisaje, simbolismo y reflexión social."
  }
]
```

**Lecturas actuales en el sistema:**
1. Campos de Castilla - Antonio Machado
2. Bodas de sangre - Federico García Lorca
3. Entre visillos - Carmen Martín Gaite
4. La Fundación - Antonio Buero Vallejo

---

### preguntas_{lecturaId}.json
Preguntas de comprensión para cada lectura. Crear un archivo por cada lectura usando su ID.

```json
[
  {
    "id": "1",
    "texto": "¿Qué simbolismo encontramos en Campos de Castilla?",
    "respuesta": "El paisaje castellano funciona como símbolo del alma española...",
    "lecturaId": "1"
  }
]
```

---

### materiales_{lecturaId}.json
Materiales adicionales (videos, documentos, enlaces) para cada lectura.

```json
[
  {
    "id": "1",
    "titulo": "Biografía de Antonio Machado",
    "grupo": "Contexto",
    "enlace": "https://www.biografiasyvidas.com/biografia/m/machado_antonio.htm",
    "descripcion": "Vida y obra del poeta",
    "lecturaId": "1"
  }
]
```

---

### ranking.json
```json
[
  { "nombre": "Julia", "puntos": 31 },
  { "nombre": "Antonio", "puntos": 31 }
]
```

---

### visitas.json
```json
{ "total": 0 }
```

---

### apps-versions.json
```json
{
  "VigaCalc": { "app": "VigaCalc", "version": "1.0" },
  "Conceptuando_la_historia": { "app": "Conceptuando_la_historia", "version": "1.0" }
}
```

---

## PDFs de Cultura Audiovisual

Los archivos deben colocarse en `public/` con los siguientes nombres exactos:

| Contenido | Nombre del archivo |
|-----------|-------------------|
| Historia de la Fotografía | `cultura-audiovisual-historia-fotografia.pdf` |
| La Imagen Fija y sus Lenguajes | `cultura-audiovisual-imagen-fija-lenguajes.pdf` |
| Leyes de la Gestalt | `cultura-audiovisual-leyes-gestalt.pdf` |
| Teoría del Color | `cultura-audiovisual-teoria-color.pdf` |
| La Publicidad | `cultura-audiovisual-publicidad.pdf` |

---

## Ejecución

### Modo Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en: `http://localhost:5173`

### Modo Producción
```bash
npm run build
npm start
```
El servidor Express se ejecutará en el puerto `5555`. Acceder a: `http://localhost:5555`

## Estructura del Proyecto

```
pautopia/
├── src/
│   ├── api.ts
│   ├── types.ts
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── components/
│   │   ├── Accordion.tsx
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── SugerenciasModal.tsx
│   │   └── UnavailableModal.tsx
│   ├── hooks/
│   │   └── useDownloadFile.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Lecturas.tsx
│   │   ├── Frases.tsx
│   │   ├── Ranking.tsx
│   │   ├── Creditos.tsx
│   │   ├── Apps.tsx
│   │   ├── VigaCalc.tsx
│   │   ├── WaveCalc.tsx
│   │   ├── ConceptuandoHistoria.tsx
│   │   ├── rlccalc.tsx
│   │   ├── apuntes/
│   │   │   ├── ApuntesIndex.tsx
│   │   │   ├── Biologia.tsx
│   │   │   ├── Tecnologia.tsx
│   │   │   ├── Mates.tsx
│   │   │   ├── Filosofia.tsx
│   │   │   ├── Lengua.tsx
│   │   │   ├── Ingles.tsx
│   │   │   ├── Historia.tsx
│   │   │   ├── Fisica.tsx
│   │   │   ├── Quimica.tsx
│   │   │   └── CulturaAudiovisual.tsx
│   │   └── examinate/
│   │       ├── ExaminateIndex.tsx
│   │       ├── Historia.tsx
│   │       ├── Conceptos.tsx
│   │       ├── CulturaAudiovisual.tsx
│   │       ├── ConceptosCulturaAudiovisual.tsx
│   │       ├── RepasarConceptosHistoria.tsx
│   │       └── RepasarConceptosCulturaAudiovisual.tsx
│   └── styles/
│       ├── apuntes.css
│       ├── repasar.css
│       └── sugerencias.css
├── public/
│   ├── logo.png
│   ├── rexy.png
│   ├── VigaCalc.png / VigaCalc.apk
│   ├── Conceptuando_la_historia.png / .apk
│   ├── cultura-audiovisual-historia-fotografia.pdf
│   ├── cultura-audiovisual-imagen-fija-lenguajes.pdf
│   ├── cultura-audiovisual-leyes-gestalt.pdf
│   ├── cultura-audiovisual-teoria-color.pdf
│   ├── cultura-audiovisual-publicidad.pdf
│   └── *.pdf (lecturas)
├── data/
│   ├── lecturas.json
│   ├── conceptos.json
│   ├── conceptos_cultura_audiovisual.json
│   ├── ranking.json
│   ├── visitas.json
│   ├── apps-versions.json
│   ├── preguntas_1.json ... preguntas_4.json
│   ├── materiales_1.json ... materiales_4.json
│   └── sugerencias.json        # Se crea automáticamente
├── server.js
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .env                         # No incluido en el repositorio
└── README.md
```

## API REST Endpoints

### Lecturas
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/lecturas` | Obtiene todas las lecturas |
| `POST` | `/api/lecturas` | Crea una nueva lectura |
| `PUT` | `/api/lecturas/:id` | Actualiza una lectura |
| `DELETE` | `/api/lecturas/:id` | Elimina una lectura |

### Preguntas
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/preguntas/:lecturaId` | Obtiene las preguntas de una lectura |
| `POST` | `/api/preguntas/:lecturaId` | Crea una nueva pregunta |
| `DELETE` | `/api/preguntas/:lecturaId/:id` | Elimina una pregunta |

### Materiales
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/materiales/:lecturaId` | Obtiene los materiales de una lectura |
| `POST` | `/api/materiales/:lecturaId` | Crea un nuevo material |
| `DELETE` | `/api/materiales/:lecturaId/:id` | Elimina un material |

### Otros
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/ranking` | Clasificación de estudiantes |
| `GET` | `/api/visitas` | Contador de visitas |
| `POST` | `/api/visitas` | Registra una nueva visita |
| `POST` | `/api/sugerencias` | Envía una sugerencia |
| `GET` | `/apps/version.json` | Versiones de las apps |
| `GET` | `/health` | Estado del servidor |

## Sistema de Sugerencias

- Formulario modal accesible desde un botón flotante en la página principal
- Rate limiting: máximo 3 sugerencias cada 5 minutos por IP
- Sanitización de entrada para prevenir ataques
- Integración con Discord mediante webhook para notificaciones en tiempo real
- Almacenamiento local de respaldo en `sugerencias.json`

## Variables de Entorno

```env
DISCORD_WEBHOOK_URL=url_del_webhook_de_discord
NODE_ENV=development
```

## Seguridad

- Cookies de sesión HTTP-only con SameSite=lax
- Sanitización de entrada en el sistema de sugerencias
- Rate limiting para prevenir spam
- Validación de datos en servidor
- Variables sensibles en `.env` (no incluido en el repositorio)

## Limitaciones Conocidas

- Almacenamiento basado en archivos JSON (no escalable para grandes volúmenes)
- Sin sistema de autenticación de usuarios
- Sin base de datos relacional
- Rate limiting en memoria (se reinicia al reiniciar el servidor)

---

<div align="center">
  Desarrollado por <strong>Rexy</strong> para ayudar a la gente a la hora de enfrentarse a la PAU
  <br><br>
  <a href="https://pautopia.duckdns.org">pautopia.duckdns.org</a>
</div>