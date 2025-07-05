"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterFormData,
  registerSchema,
} from "../../../schemas/registerSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text, Flex } from "@radix-ui/themes";
import { toast } from "sonner";
import Image from "next/image";
import logo from "@/public/image/logo.webp";
import caRegister from "@/public/image/caRegister.webp";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("🚀 Submitting Registration:", data);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("✅ Registered:", result);
        reset();
        toast.success("Account created successfully!");
      } else {
        const error = await res.json();
        toast.error(error.message || "Registration failed.");
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      toast.error("Check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-black px-4 bg-cover bg-no-repeat relative">
      <Image
        src={caRegister}
        alt="ascended"
        placeholder="blur"
        blurDataURL={caRegister.blurDataURL}
        className="h-[960px] w-auto object-contain absolute bottom-0 left-24"
      />

      <div className="flex justify-end items-center w-full z-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-black/50 text-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white space-y-6 font-main mr-36 h-[70vh] overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #2d2d2d", // thumb color (light gray) on dark track
          }}
        >
          <Flex direction="column" gap="2">
            <div className="flex items-center gap-3 justify-center">
              <Image
                src={logo}
                alt="Sphinx Logo"
                className="w-6 h-6 bg-white"
                placeholder="blur"
                blurDataURL={logo.blurDataURL}
              />
              <Text size="7" weight="bold">
                Sphinx'25
              </Text>
            </div>

            <div className="text-center pt-6">
              <Text size="5" weight="bold">
                Campus Ambassador Registration
              </Text>
            </div>

            <div className="space-y-4 pt-4">
              {[
                ["name", "Full Name"],
                ["age", "Age"],
                ["phone", "Phone Number"],
                ["email", "Email Address"],
                ["college", "College Name"],
                ["college_city", "College City"],
                ["college_state", "College State"],
                ["collegeId", "College ID"],
                ["branch", "Branch"],
                ["graduation_year", "Graduation Year"],
              ].map(([key, label]) => (
                <div key={key} className="flex flex-col gap-2 text-zinc-300">
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    {...register(key as keyof RegisterFormData)}
                  />
                  {errors[key as keyof RegisterFormData] && (
                    <span className="text-red-400 text-sm">
                      {errors[
                        key as keyof RegisterFormData
                      ]?.message?.toString()}
                    </span>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-2 text-zinc-300">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  {...register("gender")}
                  className="bg-transparent text-white border border-white rounded-md py-2 px-3"
                >
                  <option value="" disabled hidden>
                    Select your gender
                  </option>
                  <option value="male" className="text-black">
                    Male
                  </option>
                  <option value="female" className="text-black">
                    Female
                  </option>
                  <option value="other" className="text-black">
                    Other
                  </option>
                </select>
                {errors.gender && (
                  <span className="text-red-400 text-sm">
                    {errors.gender.message?.toString()}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-semibold py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </div>
          </Flex>
        </form>
      </div>
    </div>
  );
}
