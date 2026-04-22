import { createClient } from "@supabase/supabase-js";

const demoUsers = [
  { fullName: "Maya Thompson", username: "mayaedge" },
  { fullName: "Liam Carter", username: "liamserve" },
  { fullName: "Zoe Martin", username: "zoepeak" },
  { fullName: "Noah Patel", username: "noahnet" },
  { fullName: "Avery Brooks", username: "averylane" },
  { fullName: "Ella Chen", username: "ellaspin" },
  { fullName: "Mason Reid", username: "masonkick" },
  { fullName: "Sophia James", username: "sophiaset" },
  { fullName: "Ethan Wells", username: "ethanhoops" },
  { fullName: "Chloe Fraser", username: "chloetrack" },
  { fullName: "Lucas Ford", username: "lucasvolley" },
  { fullName: "Harper Singh", username: "harperrally" },
  { fullName: "Benjamin Ross", username: "benjab" },
  { fullName: "Grace Moore", username: "gracepace" },
  { fullName: "Daniel Cruz", username: "danielfc" },
  { fullName: "Scarlett Kim", username: "scarletthoops" },
  { fullName: "Jackson Lee", username: "jackace" },
  { fullName: "Aria Gomez", username: "ariavibe" },
  { fullName: "Henry Cole", username: "henryride" },
  { fullName: "Lily Grant", username: "lilysmash" },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function listAllUsers() {
  const users = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    const batch = data.users ?? [];
    users.push(...batch);

    if (batch.length < perPage) {
      break;
    }

    page += 1;
  }

  return users;
}

async function main() {
  const allUsers = await listAllUsers();
  const existingDemoUsers = allUsers.filter((user) =>
    user.email?.endsWith("@demo.local"),
  );

  for (const user of existingDemoUsers) {
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      throw error;
    }
  }

  for (const demoUser of demoUsers) {
    const email = `${demoUser.username}@demo.local`;

    const { error } = await supabase.auth.admin.createUser({
      email,
      password: "Password123!",
      email_confirm: true,
      user_metadata: {
        full_name: demoUser.fullName,
        username: demoUser.username,
      },
      app_metadata: {
        provider: "email",
        providers: ["email"],
      },
    });

    if (error) {
      throw error;
    }

    console.log(`Created demo auth user: ${email}`);
  }

  console.log(
    `Demo auth users seeded successfully: ${demoUsers.length} users with password Password123!`,
  );
}

main().catch((error) => {
  console.error("Failed to seed demo auth users.");
  console.error(error);
  process.exit(1);
});
