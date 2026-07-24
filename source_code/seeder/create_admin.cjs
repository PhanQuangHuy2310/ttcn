require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const email = 'admin@gmail.com';
  const password = '1234567';
  const role = 'ADMIN';

  console.log(`Creating user: ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Administrator' }
  });

  if (error) {
    if (error.message.includes('already')) {
       console.log('User already exists in auth.users, getting ID...');
       const { data: list } = await supabase.auth.admin.listUsers();
       const found = list.users.find(u => u.email === email);
       if (found) {
         await updateProfile(found.id, email, 'Administrator', role);
       }
       return;
    }
    console.error('Error creating user:', error.message);
    return;
  }

  console.log('User created in auth.users. Updating public.users role...');
  await updateProfile(data.user.id, email, 'Administrator', role);
}

async function updateProfile(id, email, name, role) {
  const { error } = await supabase.from('users').upsert({
    id,
    email,
    full_name: name,
    role: role,
    is_active: true
  });
  if (error) {
    console.error('Error syncing profile:', error.message);
  } else {
    console.log(`Admin account ${email} is ready!`);
  }
}

main();
