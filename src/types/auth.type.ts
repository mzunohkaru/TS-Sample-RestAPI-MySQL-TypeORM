export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export type JwtPayload = {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
};
