import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  if (typeof window !== 'undefined') {
    console.warn('Supabase env vars missing. Check your .env.local file.')
  }
}

export const supabase = createClient(
  SUPABASE_URL || '',
  SUPABASE_KEY || ''
)

// ── Auth ──────────────────────────────────────────────────────
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  if (data.user) {
    await supabase.from('profiles')
      .update({ username, display_name: username })
      .eq('id', data.user.id)
  }
  return data
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  return supabase.auth.signOut()
}

// ── Profile ───────────────────────────────────────────────────
export async function loadProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export async function updateProfile(userId, updates) {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
  if (error) throw error
}

// ── Workouts ──────────────────────────────────────────────────
export async function saveWorkout(userId, workout, moves) {
  const { data, error } = await supabase
    .from('workouts')
    .insert({
      user_id:   userId,
      name:      workout.name,
      category:  workout.cat,
      duration:  workout.dur,
      calories:  workout.cal,
      is_public: true,
    })
    .select()
    .single()
  if (error) throw error

  // Save sets
  if (moves && moves.length > 0) {
    const setRows = []
    moves.forEach(move => {
      move.sets.forEach((s, i) => {
        setRows.push({
          workout_id: data.id,
          exercise:   move.name,
          set_number: i + 1,
          reps:       s.reps,
          weight:     s.weight,
          note:       s.note,
          done:       s.done,
        })
      })
    })
    await supabase.from('workout_sets').insert(setRows)
  }

  // Post to activity feed
  await supabase.from('activity_posts').insert({
    user_id:      userId,
    post_type:    'workout',
    title:        workout.name,
    content:      `${workout.dur} min - ${workout.cal} kcal burned`,
    reference_id: data.id,
  })

  return data
}

export async function loadTodayWorkouts(userId) {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('workouts')
    .select('*, workout_sets(*)')
    .eq('user_id', userId)
    .gte('logged_at', today)
    .order('logged_at', { ascending: false })
  return data || []
}

// ── Meals ─────────────────────────────────────────────────────
export async function saveMeal(userId, meal) {
  const { data, error } = await supabase
    .from('meals')
    .insert({
      user_id:   userId,
      name:      meal.name,
      calories:  meal.cal,
      protein:   meal.protein,
      carbs:     meal.carbs,
      fat:       meal.fat,
      servings:  meal.servings,
      per_unit:  meal.per,
      is_public: true,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function loadTodayMeals(userId) {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', today)
    .order('logged_at', { ascending: false })
  return data || []
}

// ── Matches ───────────────────────────────────────────────────
export async function getSuggestedMatches() {
  const { data } = await supabase.rpc('get_suggested_matches', { limit_count: 30 })
  return data || []
}

export async function sendMatchRequest(fromUserId, toUserId) {
  const { error } = await supabase
    .from('match_requests')
    .insert({ from_user_id: fromUserId, to_user_id: toUserId })
  if (error) throw error
}

export async function respondToMatch(matchId, accept) {
  await supabase
    .from('match_requests')
    .update({ status: accept ? 'accepted' : 'declined' })
    .eq('id', matchId)
}

export async function loadMyMatches(userId) {
  const { data } = await supabase
    .from('match_requests')
    .select('*, from_user:profiles!match_requests_from_user_id_fkey(*), to_user:profiles!match_requests_to_user_id_fkey(*)')
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .eq('status', 'accepted')
  return (data || []).map(m => ({
    ...m,
    partner: m.from_user_id === userId ? m.to_user : m.from_user
  }))
}

export async function loadPendingRequests(userId) {
  const { data } = await supabase
    .from('match_requests')
    .select('*, from_user:profiles!match_requests_from_user_id_fkey(*)')
    .eq('to_user_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  return data || []
}

// ── Messages ──────────────────────────────────────────────────
export async function loadMessages(matchId) {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true })
  return data || []
}

export async function sendMessage(matchId, senderId, content) {
  const { error } = await supabase
    .from('messages')
    .insert({ match_id: matchId, sender_id: senderId, content })
  if (error) throw error
}

export function subscribeMessages(matchId, callback) {
  return supabase
    .channel('messages:' + matchId)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'messages',
      filter: `match_id=eq.${matchId}`,
    }, payload => callback(payload.new))
    .subscribe()
}

export function subscribeMatchRequests(userId, callback) {
  return supabase
    .channel('match_requests:' + userId)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'match_requests',
      filter: `to_user_id=eq.${userId}`,
    }, payload => callback(payload.new))
    .subscribe()
}

// ── Feed ──────────────────────────────────────────────────────
export async function loadFeed() {
  const { data } = await supabase
    .from('activity_posts')
    .select('*, author:profiles(*), post_likes(user_id)')
    .order('created_at', { ascending: false })
    .limit(50)
  return data || []
}

export async function toggleLike(postId, userId) {
  const { data } = await supabase
    .from('post_likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  if (data) {
    await supabase.from('post_likes').delete()
      .eq('post_id', postId).eq('user_id', userId)
  } else {
    await supabase.from('post_likes').insert({ post_id: postId, user_id: userId })
  }
}
