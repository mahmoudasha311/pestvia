export interface AuthenticatedUser {
  id: string;
  role: 'admin' | 'editor';
}
