
import { supabase } from '../supabase';
import { AITool, BlogPost, Category, SiteSettings } from '../types';
import { MOCK_TOOLS, CATEGORIES, MOCK_POSTS, INITIAL_SITE_SETTINGS } from '../constants';

export const supabaseService = {
  // Tools
  async getTools() {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data as AITool[];
  },

  async getToolBySlug(slug: string) {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as AITool;
  },

  async upsertTool(tool: AITool) {
    const { data, error } = await supabase
      .from('tools')
      .upsert({
        ...tool,
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase upsertTool error:', error);
      throw error;
    }
    return data as AITool;
  },

  async deleteTool(id: string) {
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Category[];
  },

  async upsertCategory(category: Category) {
    const { data, error } = await supabase
      .from('categories')
      .upsert(category)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Blog Posts
  async getPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data as BlogPost[];
  },

  async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  async upsertPost(post: BlogPost) {
    const { data, error } = await supabase
      .from('posts')
      .upsert({
        ...post,
        // Ensure author is sent as a JSON object if the column is JSONB
        author: typeof post.author === 'string' ? JSON.parse(post.author) : post.author
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase upsertPost error:', error);
      throw error;
    }
    return data as BlogPost;
  },

  async deletePost(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Settings
  async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'site-settings')
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data?.value as SiteSettings | undefined;
  },

  async updateSettings(settings: SiteSettings) {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ id: 'site-settings', value: settings })
      .select()
      .single();

    if (error) throw error;
    return data.value as SiteSettings;
  },

  // Profiles / Users
  async getProfiles(page: number = 1, pageSize: number = 20) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('id'); // Or created_at if added

    if (error) throw error;
    return { data, count };
  },

  async upsertProfile(profile: any) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProfile(id: string) {
    // Attempt the secure RPC method first (which deletes from auth.users cascading to profiles)
    const { error } = await supabase.rpc('delete_user_by_admin', { target_user_id: id });

    if (error) {
      console.warn('RPC delete failed, falling back to direct profile deletion:', error);
      // Fallback for mock data or if RPC is not yet created
      const { error: fallbackError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (fallbackError) throw fallbackError;
    }
  },

  async searchTools(query: string) {
    if (!query || query.length < 2) return [];
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .eq('status', 'active')
      .limit(8);

    if (error) throw error;
    return data as AITool[];
  },

  async searchPosts(query: string) {
    if (!query || query.length < 2) return [];
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .limit(5);

    if (error) throw error;
    return data as BlogPost[];
  },

  async getCurrentUserRole() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('❌ FATAL AUTH CHECK ERROR:', error);
      console.error('Checking ID:', user.id);
      return 'User'; // Default to User if profile not found
    }
    return data.role as 'Admin' | 'User';
  },

  // Initial Seeding (Helper for first time setup)
  async seedInitialData() {
    try {
      // Check if tools exist
      const { count: toolCount } = await supabase.from('tools').select('*', { count: 'exact', head: true });
      if (toolCount === 0) {
        await supabase.from('tools').insert(MOCK_TOOLS);
      }

      // Check if categories exist
      const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
      if (catCount === 0) {
        await supabase.from('categories').insert(CATEGORIES);
      }

      // Check if settings exist
      const { count: settingsCount } = await supabase.from('settings').select('*', { count: 'exact', head: true });
      if (settingsCount === 0) {
        await supabase.from('settings').insert({ id: 'site-settings', value: INITIAL_SITE_SETTINGS });
      }

      // Check if posts exist
      const { count: postsCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
      if (postsCount === 0 && MOCK_POSTS.length > 0) {
        await supabase.from('posts').insert(MOCK_POSTS);
      }

      console.log('Initial seeding check complete');
    } catch (err) {
      console.error('Seeding failed:', err);
    }
  }
};
