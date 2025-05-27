/**
 * Supabase Client for Atlas-ERP v2
 *
 * This module provides a type-safe wrapper around the Supabase client
 * optimized for Astro's Islands Architecture.
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Define Supabase response types
export interface SupabaseRecord<T = unknown> {
  id: string;
  [key: string]: unknown;
}

export type SupabaseInputRecord<T = unknown> = Omit<T, 'id'> & {
  id?: string;
};

// Create a singleton instance of the Supabase client
let supabaseInstance: SupabaseClient | null = null;

/**
 * Initialize the Supabase client
 * @returns The Supabase client instance
 */
export async function initSupabaseDB(): Promise<SupabaseClient> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Get connection details from environment variables
  const url = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase URL or key not provided in environment variables');
  }

  try {
    // Create a new Supabase client
    supabaseInstance = createClient(url, key);
    console.log(`Connected to Supabase at ${url}`);
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    throw error;
  }
}

/**
 * Get the Supabase client instance
 * @returns The Supabase client instance
 */
export async function getSupabaseDB(): Promise<SupabaseClient> {
  if (!supabaseInstance) {
    return initSupabaseDB();
  }
  return supabaseInstance;
}

/**
 * Query records from the database
 * @param table The table to query
 * @param options Query options
 * @returns Array of records
 */
export async function query<T extends SupabaseRecord>(
  table: string,
  options: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  } = {}
): Promise<T[]> {
  const db = await getSupabaseDB();

  try {
    let queryBuilder = db.from(table).select(options.select || '*');

    // Apply filters
    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value);
      });
    }

    // Apply ordering
    if (options.orderBy) {
      queryBuilder = queryBuilder.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      });
    }

    // Apply limit
    if (options.limit) {
      queryBuilder = queryBuilder.limit(options.limit);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error(`Error querying ${table}:`, error);
      throw error;
    }

    return (data as T[]) || [];
  } catch (error) {
    console.error(`Error querying ${table}:`, error);
    throw error;
  }
}

/**
 * Create a new record in the database
 * @param table The table to insert into
 * @param record The record to create
 * @returns The created record
 */
export async function create<T extends SupabaseRecord>(
  table: string,
  record: SupabaseInputRecord<T>
): Promise<T> {
  const db = await getSupabaseDB();

  try {
    const { data, error } = await db.from(table).insert(record).select().single();

    if (error) {
      console.error(`Error creating record in ${table}:`, error);
      throw error;
    }

    return data as T;
  } catch (error) {
    console.error(`Error creating record in ${table}:`, error);
    throw error;
  }
}

/**
 * Update a record in the database
 * @param table The table containing the record
 * @param id The record ID
 * @param updates The updates to apply
 * @returns The updated record
 */
export async function update<T extends SupabaseRecord>(
  table: string,
  id: string,
  updates: Partial<SupabaseInputRecord<T>>
): Promise<T> {
  const db = await getSupabaseDB();

  try {
    const { data, error } = await db.from(table).update(updates).eq('id', id).select().single();

    if (error) {
      console.error(`Error updating record ${id} in ${table}:`, error);
      throw error;
    }

    return data as T;
  } catch (error) {
    console.error(`Error updating record ${id} in ${table}:`, error);
    throw error;
  }
}

/**
 * Delete a record from the database
 * @param table The table containing the record
 * @param id The record ID
 * @returns The deleted record
 */
export async function remove<T extends SupabaseRecord>(
  table: string,
  id: string
): Promise<T | null> {
  const db = await getSupabaseDB();

  try {
    const { data, error } = await db.from(table).delete().eq('id', id).select().single();

    if (error) {
      console.error(`Error deleting record ${id} from ${table}:`, error);
      throw error;
    }

    return data as T | null;
  } catch (error) {
    console.error(`Error deleting record ${id} from ${table}:`, error);
    throw error;
  }
}

/**
 * Get a direct Supabase client instance (for API routes)
 * @returns The Supabase client instance
 */
export async function getSupabaseClient(): Promise<SupabaseClient> {
  return getSupabaseDB();
}

// Create and export a direct client instance for API routes
const url = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

// Export a direct client instance for API routes
export const supabase = url && key ? createClient(url, key) : (null as any);

// Export the client
const supabaseClient = {
  init: initSupabaseDB,
  get: getSupabaseDB,
  query,
  create,
  update,
  remove,
};

export default supabaseClient;
