require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestUser(email, role) {
  const password = 'password123';
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Test ' + role }
  });

  if (error && !error.message.includes('already')) {
    console.error('Error creating auth user:', error.message);
    return;
  }

  let uid;
  if (error && error.message.includes('already')) {
    const { data: list } = await supabase.auth.admin.listUsers();
    uid = list.users.find(u => u.email === email).id;
  } else {
    uid = data.user.id;
  }

  await supabase.from('users').upsert({
    id: uid,
    email: email,
    full_name: 'Test ' + role,
    role: role,
    is_active: true
  });
  
  console.log(`Created ${role} user: ${email} with password: ${password}`);
}

async function run() {
  await createTestUser('teacher@test.com', 'TEACHER');
  await createTestUser('student@test.com', 'STUDENT');
}
run();
