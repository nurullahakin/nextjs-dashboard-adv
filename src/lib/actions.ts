"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import {
  insertInvoice,
  updateInvoice as updateInvoiceData,
  deleteInvoice as deleteInvoiceData,
  getUserByEmail,
  createUser,
} from "@/lib/data";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for persistence
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Persist data
  try {
    await insertInvoice({ customerId, amount: amountInCents, status, date });
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return {
      message: "Persistence Error: Failed to Create Invoice.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await updateInvoiceData(id, { customerId, amount: amountInCents, status });
  } catch (error) {
    console.error(error);
    return {
      message: "Persistence Error: Failed to Update Invoice.",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  // throw new Error('Simulated Persistence Error: Failed to Delete Invoice.');
  await deleteInvoiceData(id);
  revalidatePath("/dashboard/invoices");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

type RegisterUserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
  values?: {
    name?: string;
    email?: string;
    password?: string;
  };
};

export async function registerUser(
  prevState: RegisterUserState | undefined,
  formData: FormData,
): Promise<RegisterUserState> {
  const registerUserSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long."),
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
  });

  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = registerUserSchema.safeParse({
    name: values.name,
    email: values.email,
    password: values.password,
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Invalid Fields. Failed to Create Account.",
      values,
    };
  }

  const { name, email, password } = parsed.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      errors: {
        email: ["An account with this email already exists."],
      },
      message: "An account with this email already exists.",
      values,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await createUser({ name, email, password: hashedPassword });
  } catch (error) {
    console.error("Registration Error:", error);
    return {
      message: "Something went wrong while creating your account.",
    };
  }

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });

  return {
    message: null,
  };
}
