import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GetSpecialistsQueryDto } from './dto/get-specialists.dto';
import { Specialist } from './specialist.entity';

interface SpecialistsFile {
  specialists: Specialist[];
}

interface SpecialistListResponse {
  items: Specialist[];
  total: number;
  hasMore: boolean;
}

@Injectable()
export class SpecialistsService {
  // Store data under backend/data relative to the backend working directory.
  private readonly dbFile = join(process.cwd(), 'data', 'specialists.json');

  private async ensureDbFile(): Promise<void> {
    try {
      await fs.access(this.dbFile);
    } catch {
      await fs.mkdir(dirname(this.dbFile), { recursive: true });
      await fs.writeFile(this.dbFile, JSON.stringify({ specialists: [] }, null, 2), 'utf8');
    }
  }

  private async readFile(): Promise<SpecialistsFile> {
    await this.ensureDbFile();
    try {
      const content = await fs.readFile(this.dbFile, 'utf8');
      const parsed = JSON.parse(content) as SpecialistsFile;
      return { specialists: parsed.specialists ?? [] };
    } catch {
      return { specialists: [] };
    }
  }

  private async writeFile(specialists: Specialist[]): Promise<void> {
    await this.ensureDbFile();
    await fs.writeFile(this.dbFile, JSON.stringify({ specialists }, null, 2), 'utf8');
  }

  private hydrateSpecialist(s: Specialist, index: number): Specialist {
    const experienceYears = s.experienceYears ?? (3 + (index % 7));
    const clientsCount = s.clientsCount ?? Math.max(10, Math.round(s.reviewsCount * 0.2));
    const sessionsCount = s.sessionsCount ?? clientsCount + 12;
    const countryCode = s.countryCode ?? 'US';
    const slotPresets = [
      ['Today, 9:00 AM', 'Today, 1:00 PM', 'Tomorrow, 9:30 AM'],
      ['Today, 10:30 AM', 'Today, 4:00 PM', 'Tomorrow, 11:00 AM'],
      ['Today, 12:00 PM', 'Tomorrow, 8:30 AM', 'Tomorrow, 6:00 PM'],
      ['Today, 3:00 PM', 'Tomorrow, 10:00 AM', 'Fri, 2:00 PM'],
      ['Tomorrow, 7:30 AM', 'Tomorrow, 12:30 PM', 'Sat, 9:00 AM']
    ];
    const availabilitySlots =
      s.availabilitySlots ?? slotPresets[index % slotPresets.length];

    return {
      ...s,
      experienceYears,
      clientsCount,
      sessionsCount,
      countryCode,
      availabilitySlots
    };
  }

  private applySorting(
    specialists: Specialist[],
    sortBy: GetSpecialistsQueryDto['sortBy'],
    sortDirection: GetSpecialistsQueryDto['sortDirection']
  ): Specialist[] {
    if (!sortBy) return specialists;
    const direction = sortDirection === 'asc' ? 1 : -1;
    return [...specialists].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (a.pricePerSession - b.pricePerSession) * direction;
        case 'age':
          return (a.age - b.age) * direction;
        case 'name':
          return a.name.localeCompare(b.name) * direction;
        case 'rating':
        default:
          return (a.rating - b.rating) * direction;
      }
    });
  }

  private applyFilters(
    specialists: Specialist[],
    filters: GetSpecialistsQueryDto
  ): Specialist[] {
    const { gender, minAge, maxAge, minPrice, maxPrice } = filters;

    if (minAge !== undefined && maxAge !== undefined && minAge > maxAge) {
      throw new BadRequestException('minAge cannot be greater than maxAge');
    }
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }

    return specialists.filter((specialist) => {
      if (gender && specialist.gender !== gender) return false;
      if (typeof minAge === 'number' && specialist.age < minAge) return false;
      if (typeof maxAge === 'number' && specialist.age > maxAge) return false;
      if (typeof minPrice === 'number' && specialist.pricePerSession < minPrice) return false;
      if (typeof maxPrice === 'number' && specialist.pricePerSession > maxPrice) return false;
      return true;
    });
  }

  async listSpecialists(query: GetSpecialistsQueryDto): Promise<SpecialistListResponse> {
    const data = await this.readFile();
    const hydrated = data.specialists.map((s, idx) => this.hydrateSpecialist(s, idx));
    const filtered = this.applyFilters(hydrated, query);
    const sorted = this.applySorting(filtered, query.sortBy, query.sortDirection ?? 'desc');

    const limit = 10;
    const offset = query.offset ?? 0;

    const items = sorted.slice(offset, offset + limit);
    const total = sorted.length;
    const hasMore = offset + limit < total;

    return { items, total, hasMore };
  }
}

