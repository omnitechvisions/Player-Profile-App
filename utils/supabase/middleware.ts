import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export const createClient = (request: NextRequest) => {
  return updateSession(request);
};
