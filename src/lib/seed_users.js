const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const defaultUsers = [
  { email: 'venzaba25@gmail.com', password: 'admin1', role: 'admin', name: 'Venz Admin' },
  { email: 'venzaba26@gmail.com', password: 'owner1', role: 'owner', name: 'Venz Owner' },
  { email: 'gamesme0001@gmail.com', password: 'password123', role: 'client', name: 'Game Client' }
];

async function seed() {
  console.log("🚀 Starting User Seeding...");

  for (const u of defaultUsers) {
    console.log(`Creating user: ${u.email}...`);
    
    // 1. Create User in Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.name }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`- User ${u.email} already exists in Auth.`);
      } else {
        console.error(`- Error creating auth user ${u.email}:`, authError.message);
        continue;
      }
    }

    // 2. Fetch the user manually to get ID (if it already existed)
    let finalUserId = authUser?.user?.id;
    if (!finalUserId) {
       const { data: existing } = await supabase.auth.admin.listUsers();
       finalUserId = existing.users.find(x => x.email === u.email)?.id;
    }

    // 3. Update the Role in public.users (in case trigger set 'owner' default)
    if (finalUserId) {
      const { error: roleError } = await supabase
        .from('users')
        .update({ role: u.role, full_name: u.name })
        .eq('id', finalUserId);
      
      if (roleError) {
        console.error(`- Error updating role for ${u.email}:`, roleError.message);
      } else {
        console.log(`- Success: ${u.email} is now a ${u.role}.`);
      }
    }
  }

  console.log("✅ Seeding complete!");
}

seed();
