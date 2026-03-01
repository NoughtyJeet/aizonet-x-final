import { supabase } from '../supabase';
import { ProgrammaticComparison, AITool } from '../types';
import { generateComparisonContent } from './geminiService';

export const comparisonService = {
  async getComparisons() {
    const { data, error } = await supabase
      .from('programmatic_comparisons')
      .select('*, tool1:tool_1_id(*), tool2:tool_2_id(*), tool3:tool_3_id(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as ProgrammaticComparison[];
  },

  async getComparisonBySlug(slug: string) {
    const { data, error } = await supabase
      .from('programmatic_comparisons')
      .select('*, tool1:tool_1_id(*), tool2:tool_2_id(*), tool3:tool_3_id(*)')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data as ProgrammaticComparison;
  },

  async generateCombinations() {
    const { data: tools, error } = await supabase.from('tools').select('*').eq('status', 'active');
    if (error) throw error;

    const byCategory: Record<string, AITool[]> = {};
    tools.forEach(tool => {
      if (!byCategory[tool.category]) byCategory[tool.category] = [];
      byCategory[tool.category].push(tool);
    });

    const newComparisons: any[] = [];
    
    for (const category in byCategory) {
      const catTools = byCategory[category];
      if (catTools.length < 2) continue;

      // Limit combinations to avoid massive table initially
      // Sort by rating to prioritize popular tools
      const sortedTools = [...catTools].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      
      for (let i = 0; i < Math.min(sortedTools.length, 8); i++) {
        for (let j = i + 1; j < Math.min(sortedTools.length, 9); j++) {
          const t1 = sortedTools[i];
          const t2 = sortedTools[j];
          const slug = `${t1.slug}-vs-${t2.slug}`;
          
          newComparisons.push({
            slug,
            tool_1_id: t1.id,
            tool_2_id: t2.id,
            status: 'pending'
          });
        }
      }
    }

    const { error: upsertError } = await supabase
      .from('programmatic_comparisons')
      .upsert(newComparisons.slice(0, 20), { onConflict: 'slug' });
    
    if (upsertError) throw upsertError;
  },

  async clearPendingComparisons() {
    const { error } = await supabase
      .from('programmatic_comparisons')
      .delete()
      .eq('status', 'pending');
    
    if (error) throw error;
  },

  async generateAIContent(id: string) {
    const { data: comp, error } = await supabase
      .from('programmatic_comparisons')
      .select('*, tool1:tool_1_id(*), tool2:tool_2_id(*), tool3:tool_3_id(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;

    const content = await generateComparisonContent(comp.tool1, comp.tool2, comp.tool3);
    
    const { error: updateError } = await supabase
      .from('programmatic_comparisons')
      .update({
        ai_content: JSON.stringify(content),
        seo_title: content.seoTitle || `${comp.tool1.name} vs ${comp.tool2.name}: Full Comparison (2026)`,
        seo_description: content.seoDescription || `Compare ${comp.tool1.name} and ${comp.tool2.name}. Features, pricing, pros, cons, and the final verdict for your AI workflow.`,
        faq_schema: content.faq || [],
        status: 'generated',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (updateError) throw updateError;
  },

  async updateComparison(id: string, updates: Partial<ProgrammaticComparison>) {
    const { error } = await supabase
      .from('programmatic_comparisons')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteComparison(id: string) {
    const { error } = await supabase
      .from('programmatic_comparisons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
