import { Citizen } from "@/types";

export interface CitizenRegistryADT {
  add(citizen: Citizen): boolean;
  update(id: string, updatedData: Partial<Citizen>): boolean;
  remove(id: string): boolean;
  getById(id: string): Citizen | null;
  findByName(partialName: string): Citizen[];
  getAll(): Citizen[];
  size(): number;
}

export class CitizenRegistry implements CitizenRegistryADT {
  private citizens: Map<string, Citizen> = new Map();
  private emailIndex: Map<string, string> = new Map();
  private nameIndex: Map<string, Set<string>> = new Map();

  //add citizen
  add(citizen: Citizen): boolean {
    if (this.emailIndex.has(citizen.email)) return false;

    this.citizens.set(citizen.id, citizen);
    this.emailIndex.set(citizen.email, citizen.id);

    const nameLower = citizen.name.toLowerCase();
    for (let i = 0; i < nameLower.length; i++) {
      for (let j = i + 1; j <= nameLower.length; j++) {
        const substring = nameLower.substring(i, j);
        if (substring.length > 2) {
          if (!this.nameIndex.has(substring)) {
            this.nameIndex.set(substring, new Set());
          }
          this.nameIndex.get(substring)?.add(citizen.id);
        }
      }
    }

    return true;
  }

  //update citizen
  update(id: string, updatedCitizen: Partial<Citizen>): boolean {
    if (!this.citizens.has(id)) return false;

    const currentCitizen = this.citizens.get(id)!;

    if (updatedCitizen.email && updatedCitizen.email !== currentCitizen.email) {
      if (this.emailIndex.has(updatedCitizen.email)) return false;
      this.emailIndex.delete(currentCitizen.email);
      this.emailIndex.set(updatedCitizen.email, id);
    }

    if (updatedCitizen.name && updatedCitizen.name !== currentCitizen.name) {
      const oldNameLower = currentCitizen.name.toLowerCase();
      for (let i = 0; i < oldNameLower.length; i++) {
        for (let j = i + 1; j <= oldNameLower.length; j++) {
          const substring = oldNameLower.substring(i, j);
          if (substring.length > 2) {
            const ids = this.nameIndex.get(substring);
            if (ids) {
              ids.delete(id);
              if (ids.size === 0) this.nameIndex.delete(substring);
            }
          }
        }
      }

      const newNameLower = updatedCitizen.name.toLowerCase();
      for (let i = 0; i < newNameLower.length; i++) {
        for (let j = i + 1; j <= newNameLower.length; j++) {
          const substring = newNameLower.substring(i, j);
          if (substring.length > 2) {
            if (!this.nameIndex.has(substring)) {
              this.nameIndex.set(substring, new Set());
            }
            this.nameIndex.get(substring)?.add(id);
          }
        }
      }
    }

    this.citizens.set(id, { ...currentCitizen, ...updatedCitizen });
    return true;
  }

  //remove citizen
  remove(id: string): boolean {
    if (!this.citizens.has(id)) return false;

    const citizen = this.citizens.get(id)!;
    this.emailIndex.delete(citizen.email);

    const nameLower = citizen.name.toLowerCase();
    for (let i = 0; i < nameLower.length; i++) {
      for (let j = i + 1; j <= nameLower.length; j++) {
        const substring = nameLower.substring(i, j);
        if (substring.length > 2) {
          const ids = this.nameIndex.get(substring);
          if (ids) {
            ids.delete(id);
            if (ids.size === 0) this.nameIndex.delete(substring);
          }
        }
      }
    }

    this.citizens.delete(id);
    return true;
  }

  //search from id
  getById(id: string): Citizen | null {
    return this.citizens.get(id) ?? null;
  }

  //search from name
  findByName(name: string): Citizen[] {
    const nameLower = name.toLowerCase();
    const matchedIds = new Set<string>();

    for (const [substring, ids] of this.nameIndex.entries()) {
      if (substring.includes(nameLower)) {
        ids.forEach(id => matchedIds.add(id));
      }
    }

    return Array.from(matchedIds).map(id => this.citizens.get(id)!);
  }

  //display all added citizen
  getAll(): Citizen[] {
    return Array.from(this.citizens.values());
  }

  //count of added citizen
  size(): number {
    return this.citizens.size;
  }
}
