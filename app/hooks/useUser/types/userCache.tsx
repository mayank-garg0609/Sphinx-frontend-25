export interface UserData {
  sphinx_id: string;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  applied_ca: boolean;
  created_at?: string;
  last_login?: string;
}
