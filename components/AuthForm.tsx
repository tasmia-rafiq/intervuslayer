"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/components/FormField";

const authFormSchema = (type: FormType) =>
  z.object({
    name: type === "sign-up" ? z.string().min(3, "Name must be at least 3 characters") : z.string().optional(),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

const benefits = [
  "Role-specific mock interviews",
  "Voice-based AI interviewer",
  "Structured feedback reports",
  "Retake weak areas with intention",
];

export default function AuthForm({ type }: { type: FormType }) {
  const router = useRouter();
  const isSignIn = type === "sign-in";
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = values;

        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredentials.user.getIdToken();

        if (!idToken) {
          toast.error("Sign in failed. Please try again.");
          return;
        }

        await signIn({ email, idToken });

        toast.success("Signed in successfully.");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please check your details and try again.");
    }
  };

  return (
    <main className="relative min-h-screen px-6 pb-16 pt-32 text-[#F4F1EA]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.07),transparent_34%),linear-gradient(to_bottom,#050706,#060807_45%,#040504)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[72px_72px]" />

      <section className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-6xl items-center gap-40 lg:grid-cols-[1fr_480px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <div className="mb-3 text-[#a7e1f3]">
            {isSignIn ? "Welcome back" : "Start your interview practice system"}
          </div>

          <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.055em]">
            {isSignIn
              ? "Continue improving your interview performance."
              : "Build sharper answers before the real interview."}
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-[#a8b2b3]">
            Practice live, review your score, and turn vague interview prep into
            a measurable improvement loop.
          </p>

          <div className="mt-10 grid max-w-xl gap-3">
            {benefits.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-md border border-white/[0.07] bg-(--color-bg)/80 px-4 py-3"
              >
                <span className="size-2 rounded-full bg-(--color-accent)" />
                <span className="text-sm text-[#a8b2b3]">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-md border border-white/8 bg-(--color-bg)/80 p-5">
            <p className="text-sm text-[#8e979b]">Report preview</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-(--color-accent)/10 text-2xl font-semibold">
                78
              </div>
              <div>
                <p className="font-semibold text-[#F4F1EA]">Good clarity</p>
                <p className="mt-1 text-sm text-[#a8b2b3]">
                  Improve technical depth with concrete examples.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[26px] border border-white/8 bg-(--color-bg)/90 p-2 shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur"
        >
          <div className="rounded-[20px] border border-white/6 bg-[#050607]/60 p-6 sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <Image src="/logo.png" alt="IntervU Slayer" width={34} height={30} />
              <div>
                <p className="text-sm font-semibold">IntervU Slayer</p>
                <p className="text-xs text-[#8e979b]">
                  {isSignIn ? "Sign in to continue" : "Create your account"}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                {isSignIn ? "Sign in" : "Create account"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#b2bcbd]">
                {isSignIn
                  ? "Access your interviews, reports, and practice history."
                  : "Start practicing with role-specific interviews and structured feedback."}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {!isSignIn && (
                  <FormField
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="Your name"
                  />
                )}

                <FormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                />

                <FormField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl bg-(--color-accent) text-sm font-semibold text-[#030e11] transition hover:-translate-y-0.5 hover:bg-[#5ed5ea] disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Please wait..."
                    : isSignIn
                      ? "Sign in"
                      : "Create account"}
                </Button>
              </form>
            </Form>

            <p className="mt-7 text-center text-sm text-[#a8b2b3]">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
              <Link
                href={isSignIn ? "/sign-up" : "/sign-in"}
                className="ml-1 font-semibold text-[#a7e1f3] transition hover:text-(--color-accent)"
              >
                {isSignIn ? "Create one" : "Sign in"}
              </Link>
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}