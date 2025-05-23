import { Criminal } from "@/types";

/**
 * Specialized database for efficient criminal record management
 * Optimized for fast lookups by various identifiers
 */
export class CriminalDatabase {
  private criminals: Map<string, Criminal> = new Map();
  private nameIndex: Map<string, Set<string>> = new Map(); // partial name -> set of ids
  private threatLevelIndex: Map<string, Set<string>> = new Map(); // threatLevel -> set of ids
  private statusIndex: Map<string, Set<string>> = new Map(); // status -> set of ids

  /**
   * Add a criminal to the database
   */
  add(criminal: Criminal): boolean {
    if (this.criminals.has(criminal.id)) {
      return false;
    }
    
    // Store criminal
    this.criminals.set(criminal.id, criminal);
    
    // Index by name for partial search
    const nameLower = criminal.name.toLowerCase();
    for (let i = 0; i < nameLower.length; i++) {
      for (let j = i + 1; j <= nameLower.length; j++) {
        const substring = nameLower.substring(i, j);
        if (substring.length > 2) { // Only index substrings of length > 2
          if (!this.nameIndex.has(substring)) {
            this.nameIndex.set(substring, new Set());
          }
          this.nameIndex.get(substring)!.add(criminal.id);
        }
      }
    }
    
    // Index by threat level
    if (!this.threatLevelIndex.has(criminal.threatLevel)) {
      this.threatLevelIndex.set(criminal.threatLevel, new Set());
    }
    this.threatLevelIndex.get(criminal.threatLevel)!.add(criminal.id);
    
    // Index by status
    if (!this.statusIndex.has(criminal.status)) {
      this.statusIndex.set(criminal.status, new Set());
    }
    this.statusIndex.get(criminal.status)!.add(criminal.id);
    
    return true;
  }

  /**
   * Update an existing criminal record
   */
  update(id: string, updatedCriminal: Partial<Criminal>): boolean {
    if (!this.criminals.has(id)) {
      return false;
    }

    const currentCriminal = this.criminals.get(id)!;
    
    // If name is changing, update name index
    if (updatedCriminal.name && updatedCriminal.name !== currentCriminal.name) {
      // Remove from old name index
      const oldNameLower = currentCriminal.name.toLowerCase();
      for (let i = 0; i < oldNameLower.length; i++) {
        for (let j = i + 1; j <= oldNameLower.length; j++) {
          const substring = oldNameLower.substring(i, j);
          if (substring.length > 2 && this.nameIndex.has(substring)) {
            this.nameIndex.get(substring)!.delete(id);
            if (this.nameIndex.get(substring)!.size === 0) {
              this.nameIndex.delete(substring);
            }
          }
        }
      }
      
      // Add to new name index
      const newNameLower = updatedCriminal.name.toLowerCase();
      for (let i = 0; i < newNameLower.length; i++) {
        for (let j = i + 1; j <= newNameLower.length; j++) {
          const substring = newNameLower.substring(i, j);
          if (substring.length > 2) {
            if (!this.nameIndex.has(substring)) {
              this.nameIndex.set(substring, new Set());
            }
            this.nameIndex.get(substring)!.add(id);
          }
        }
      }
    }

    // If threat level is changing, update threat level index
    if (updatedCriminal.threatLevel && updatedCriminal.threatLevel !== currentCriminal.threatLevel) {
      // Remove from old threat level index
      this.threatLevelIndex.get(currentCriminal.threatLevel)!.delete(id);
      if (this.threatLevelIndex.get(currentCriminal.threatLevel)!.size === 0) {
        this.threatLevelIndex.delete(currentCriminal.threatLevel);
      }
      
      // Add to new threat level index
      if (!this.threatLevelIndex.has(updatedCriminal.threatLevel)) {
        this.threatLevelIndex.set(updatedCriminal.threatLevel, new Set());
      }
      this.threatLevelIndex.get(updatedCriminal.threatLevel)!.add(id);
    }

    // If status is changing, update status index
    if (updatedCriminal.status && updatedCriminal.status !== currentCriminal.status) {
      // Remove from old status index
      this.statusIndex.get(currentCriminal.status)!.delete(id);
      if (this.statusIndex.get(currentCriminal.status)!.size === 0) {
        this.statusIndex.delete(currentCriminal.status);
      }
      
      // Add to new status index
      if (!this.statusIndex.has(updatedCriminal.status)) {
        this.statusIndex.set(updatedCriminal.status, new Set());
      }
      this.statusIndex.get(updatedCriminal.status)!.add(id);
    }

    // Update criminal data
    this.criminals.set(id, { ...currentCriminal, ...updatedCriminal });
    return true;
  }

  /**
   * Remove a criminal from the database
   */
  remove(id: string): boolean {
    if (!this.criminals.has(id)) {
      return false;
    }

    const criminal = this.criminals.get(id)!;
    
    // Remove from indexes
    const nameLower = criminal.name.toLowerCase();
    for (let i = 0; i < nameLower.length; i++) {
      for (let j = i + 1; j <= nameLower.length; j++) {
        const substring = nameLower.substring(i, j);
        if (substring.length > 2 && this.nameIndex.has(substring)) {
          this.nameIndex.get(substring)!.delete(id);
          if (this.nameIndex.get(substring)!.size === 0) {
            this.nameIndex.delete(substring);
          }
        }
      }
    }
    
    // Remove from threat level index
    this.threatLevelIndex.get(criminal.threatLevel)!.delete(id);
    if (this.threatLevelIndex.get(criminal.threatLevel)!.size === 0) {
      this.threatLevelIndex.delete(criminal.threatLevel);
    }
    
    // Remove from status index
    this.statusIndex.get(criminal.status)!.delete(id);
    if (this.statusIndex.get(criminal.status)!.size === 0) {
      this.statusIndex.delete(criminal.status);
    }
    
    // Remove criminal
    this.criminals.delete(id);
    return true;
  }

  /**
   * Get a criminal by ID
   */
  getById(id: string): Criminal | undefined {
    return this.criminals.get(id);
  }

  /**
   * Find criminals by partial name match
   */
  findByName(name: string): Criminal[] {
    const nameLower = name.toLowerCase();
    const matchedIds = new Set<string>();
    
    for (const [substring, ids] of this.nameIndex.entries()) {
      if (substring.includes(nameLower)) {
        ids.forEach(id => matchedIds.add(id));
      }
    }
    
    return Array.from(matchedIds).map(id => this.criminals.get(id)!);
  }

  /**
   * Find criminals by threat level
   */
  findByThreatLevel(threatLevel: string): Criminal[] {
    if (!this.threatLevelIndex.has(threatLevel)) {
      return [];
    }
    
    return Array.from(this.threatLevelIndex.get(threatLevel)!).map(id => this.criminals.get(id)!);
  }

  /**
   * Find criminals by status
   */
  findByStatus(status: string): Criminal[] {
    if (!this.statusIndex.has(status)) {
      return [];
    }
    
    return Array.from(this.statusIndex.get(status)!).map(id => this.criminals.get(id)!);
  }

  /**
   * Get all criminals
   */
  getAll(): Criminal[] {
    return Array.from(this.criminals.values());
  }

  /**
   * Get criminal count
   */
  size(): number {
    return this.criminals.size;
  }
}