export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const idleFormState: FormState = {
  status: "idle",
};
