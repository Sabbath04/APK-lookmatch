export interface LoginResponseDTO {
  token: string;
  user: {
    id: number;
    username: string;
    roles: string[];
  };
}
