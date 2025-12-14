interface Register {
  name: string;
  email: string;
  passwordHash: string;
}

interface Login {
  email: string;
  passwordHash: string;
}

export type { Register, Login };
