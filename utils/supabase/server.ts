import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const createClient = async (
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) => {
  void cookieStore;
  return getSupabaseServerClient();
};
