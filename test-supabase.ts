import { createClient } from '@supabase/supabase-js';

const url = 'https://gkwkcrhwypghvphuqegz.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrd2tjcmh3eXBnaHZwaHVxZWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NzUzNjIsImV4cCI6MjA4NzA1MTM2Mn0.M3LUU_1pxgO4jomVvNlWHvIo34we3elkIR-K_APnH5Q';

const supabase = createClient(url, key);

async function test() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*');
    console.log("data:", data);
    console.log("error:", error);
}

test();
