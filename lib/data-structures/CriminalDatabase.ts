import { Criminal } from "@/types";

export interface CriminalDatabaseADT {
  add(criminal: Criminal): boolean;
  update(id: string, updatedCriminal: Partial<Criminal>): boolean;
  remove(id: string): boolean;
  getById(id: string): Criminal | undefined;
  findByName(partialName: string): Criminal[];
  findByThreatLevel(threatLevel: string): Criminal[];
  findByStatus(status: string): Criminal[];
  getAll(): Criminal[];
  size(): number;
}


export class CriminalDatabase implements CriminalDatabaseADT {
  private criminals: Map<string, Criminal> = new Map();
  private nameIndex: Map<string, Set<string>> = new Map(); // partial name -> set of ids
  private threatLevelIndex: Map<string, Set<string>> = new Map(); // threatLevel -> set of ids
  private statusIndex: Map<string, Set<string>> = new Map(); // status -> set of ids


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


  getById(id: string): Criminal | undefined {
    return this.criminals.get(id);
  }


  
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

  

  findByThreatLevel(threatLevel: string): Criminal[] {
    if (!this.threatLevelIndex.has(threatLevel)) {
      return [];
    }
    
    return Array.from(this.threatLevelIndex.get(threatLevel)!).map(id => this.criminals.get(id)!);
  }

  

  findByStatus(status: string): Criminal[] {
    if (!this.statusIndex.has(status)) {
      return [];
    }
    
    return Array.from(this.statusIndex.get(status)!).map(id => this.criminals.get(id)!);
  }


  
  getAll(): Criminal[] {
    return Array.from(this.criminals.values());
  }


  
  size(): number {
    return this.criminals.size;
  }
}