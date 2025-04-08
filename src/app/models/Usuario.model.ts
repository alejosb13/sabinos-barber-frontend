export interface Usuario {
  id?: number;

  nombre_completo: string;
  email: string;
  password: string;
  role_id?: number;

  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}
