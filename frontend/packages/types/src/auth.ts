export type LoginPayload = {
  email: string;
  password?: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
};

export type UpdateProfilePayload = {
  name?: string;
  email?: string;
  phone?: string;
  cccd_number?: string;
};

export type UpdatePasswordPayload = {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};
