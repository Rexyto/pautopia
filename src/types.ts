export interface Lectura {
  id: string;
  titulo: string;
  autor?: string;
  enlaceOnline?: string;
  descripcion?: string;
}

export interface Pregunta {
  id: string;
  texto: string;
  respuesta: string;
  lecturaId: string;
}

export interface Material {
  id: string;
  titulo: string;
  grupo: string;
  enlace?: string;
  descripcion?: string;
  lecturaId: string;
  archivo?: string;
}
