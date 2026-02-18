import { Lectura, Pregunta, Material } from './types';

const API_BASE = '/api';

export const api = {
  async getLecturas(): Promise<Lectura[]> {
    const res = await fetch(`${API_BASE}/lecturas`);
    return res.json();
  },

  async createLectura(lectura: Omit<Lectura, 'id'>): Promise<Lectura> {
    const res = await fetch(`${API_BASE}/lecturas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lectura),
    });
    return res.json();
  },

  async updateLectura(id: string, lectura: Partial<Lectura>): Promise<Lectura> {
    const res = await fetch(`${API_BASE}/lecturas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lectura),
    });
    return res.json();
  },

  async deleteLectura(id: string): Promise<void> {
    await fetch(`${API_BASE}/lecturas/${id}`, { method: 'DELETE' });
  },

  async getPreguntas(lecturaId: string): Promise<Pregunta[]> {
    const res = await fetch(`${API_BASE}/preguntas/${lecturaId}`);
    return res.json();
  },

  async createPregunta(lecturaId: string, pregunta: Omit<Pregunta, 'id'>): Promise<Pregunta> {
    const res = await fetch(`${API_BASE}/preguntas/${lecturaId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pregunta),
    });
    return res.json();
  },

  async deletePregunta(lecturaId: string, id: string): Promise<void> {
    await fetch(`${API_BASE}/preguntas/${lecturaId}/${id}`, { method: 'DELETE' });
  },

  async getMateriales(lecturaId: string): Promise<Material[]> {
    const res = await fetch(`${API_BASE}/materiales/${lecturaId}`);
    return res.json();
  },

  async createMaterial(lecturaId: string, material: Omit<Material, 'id'>): Promise<Material> {
    const res = await fetch(`${API_BASE}/materiales/${lecturaId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(material),
    });
    return res.json();
  },

  async deleteMaterial(lecturaId: string, id: string): Promise<void> {
    await fetch(`${API_BASE}/materiales/${lecturaId}/${id}`, { method: 'DELETE' });
  },

  async incrementarVisitas(): Promise<{ total: number }> {
    const res = await fetch(`${API_BASE}/visitas`, {
      method: 'POST',
    });
    return res.json();
  },

  async getVisitas(): Promise<{ total: number }> {
    const res = await fetch(`${API_BASE}/visitas`);
    return res.json();
  },

  async enviarSugerencia(nombre: string, sugerencia: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/sugerencias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, sugerencia }),
    });
    if (!res.ok) {
      throw new Error('Error al enviar la sugerencia');
    }
    return res.json();
  },
};