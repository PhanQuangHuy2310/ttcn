import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oxqeacydayefsvtsqams.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cWVhY3lkYXllZnN2dHNxYW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNTUwNDAsImV4cCI6MjA5MTczMTA0MH0.dNlUVLLo3Y1MJlXYf5H6duYXUSxB-maQQEWe0ziJtXI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'le.cong.dung.gv3@dhdedu.edu.vn',
        password: '123456'
    });

    if (error) {
        console.error("Login failed:", error.message);
        return;
    }

    const token = data.session.access_token;
    const parts = token.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    console.log(JSON.stringify(payload, null, 2));
}

main().catch(console.error);
