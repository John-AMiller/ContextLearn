import { supabase } from '@/utils/supabase';
import { UserStreak } from '@/utils/supabase';

export const updateStreak = async (userId: string): Promise<UserStreak | null> => {
  try {
    // Get current streak data
    const { data: currentStreak, error: fetchError } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // If no streak exists, create one
    if (!currentStreak) {
      const { data, error } = await supabase
        .from('user_streaks')
        .insert({
          user_id: userId,
          current_streak: 1,
          longest_streak: 1,
          last_practice_date: today,
        })
        .select()
        .single();

      return data;
    }

    // If already practiced today, return current
    if (currentStreak.last_practice_date === today) {
      return currentStreak;
    }

    // Calculate new streak
    let newStreak = 1;
    if (currentStreak.last_practice_date === yesterday) {
      // Continue streak
      newStreak = currentStreak.current_streak + 1;
    }

    const newLongest = Math.max(newStreak, currentStreak.longest_streak);

    // Update streak
    const { data, error } = await supabase
      .from('user_streaks')
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_practice_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating streak:', error);
    return null;
  }
};

export const getStreak = async (userId: string): Promise<UserStreak | null> => {
  try {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Check if streak is broken
    if (data) {
      const lastPractice = new Date(data.last_practice_date);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - lastPractice.getTime()) / 86400000);

      // If more than 1 day has passed, streak is broken
      if (daysDiff > 1) {
        // Reset current streak but keep longest
        const { data: updated } = await supabase
          .from('user_streaks')
          .update({
            current_streak: 0,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .select()
          .single();

        return updated;
      }
    }

    return data;
  } catch (error) {
    console.error('Error getting streak:', error);
    return null;
  }
};