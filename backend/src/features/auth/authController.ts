import { authService } from "./authService.js";
import { RegistrationSchema, LoginSchema } from "./authSchema.js";
import z from "zod";

export async function Register(input: unknown) {
  const parsed = RegistrationSchema.safeParse(input);
  if (!parsed.success) return { error: z.treeifyError(parsed.error) };

  try {
    const user = await authService.register(parsed.data);
    return { data: { id: user.id, email: user.email, name: user.name } };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Registration failure" };
  }
}

export async function Login(input: unknown) {
  const parsed = LoginSchema.safeParse(input);
  if (!parsed.success) return { error: z.treeifyError(parsed.error) };

  try {
    const result = await authService.login(parsed.data);
    return { data: result };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Login failure" };
  }
}

export async function FindByEmail(email: string){
  try{
    const user = await authService.findByEmail(email)
    return user;
  }catch(err){
    if(err instanceof Error) return { error: err.message }
    return { error: 'Failed to fetch user'}
  }
}
