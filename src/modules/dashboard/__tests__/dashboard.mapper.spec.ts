import { DashboardMapper } from '../mappers/dashboard.mapper';
import { CropType } from '../../crops/entities/crop.entity';

const mockFarms: any[] = [
  { state: 'SP', totalArea: '1000', arableArea: '600', vegetationArea: '300' },
  { state: 'SP', totalArea: '500',  arableArea: '200', vegetationArea: '100' },
  { state: 'MG', totalArea: '800',  arableArea: '400', vegetationArea: '200' },
  { state: 'GO', totalArea: '300',  arableArea: '100', vegetationArea: '50'  },
];

const mockCrops: any[] = [
  { type: CropType.SOJA },
  { type: CropType.SOJA },
  { type: CropType.MILHO },
  { type: CropType.CAFE },
];

describe('DashboardMapper', () => {
  const mapper = new DashboardMapper();

  describe('toStats', () => {
    it('should compute overview totals correctly', () => {
      const result = mapper.toStats(3, mockFarms, mockCrops);

      expect(result.overview.totalProducers).toBe(3);
      expect(result.overview.totalFarms).toBe(4);
      expect(result.overview.totalHectares).toBe(2600);
    });

    it('should group farms by state', () => {
      const result = mapper.toStats(3, mockFarms, mockCrops);

      const sp = result.byState.find((s) => s.label === 'SP');
      expect(sp.value).toBe(2);
      expect(sp.percentage).toBe(50);
    });

    it('should sort byState descending by value', () => {
      const result = mapper.toStats(3, mockFarms, mockCrops);

      for (let i = 0; i < result.byState.length - 1; i++) {
        expect(result.byState[i].value).toBeGreaterThanOrEqual(result.byState[i + 1].value);
      }
    });

    it('should group crops by type', () => {
      const result = mapper.toStats(3, mockFarms, mockCrops);

      const soja = result.byCrop.find((c) => c.label === CropType.SOJA);
      const milho = result.byCrop.find((c) => c.label === CropType.MILHO);
      expect(soja.value).toBe(2);
      expect(milho.value).toBe(1);
    });

    it('should calculate land use areas', () => {
      const result = mapper.toStats(3, mockFarms, mockCrops);

      const arable = result.byLandUse.find((l) => l.label === 'Área Agricultável');
      const veg = result.byLandUse.find((l) => l.label === 'Área de Vegetação');

      expect(arable.value).toBe(1300);
      expect(veg.value).toBe(650);
    });

    it('should calculate land use percentages', () => {
      const result = mapper.toStats(3, mockFarms, mockCrops);

      const arable = result.byLandUse.find((l) => l.label === 'Área Agricultável');
      const veg = result.byLandUse.find((l) => l.label === 'Área de Vegetação');
      const total = arable.percentage + veg.percentage;

      expect(total).toBeCloseTo(100, 0);
    });

    it('should return empty arrays for empty input', () => {
      const result = mapper.toStats(0, [], []);

      expect(result.overview.totalFarms).toBe(0);
      expect(result.overview.totalHectares).toBe(0);
      expect(result.byState).toHaveLength(0);
      expect(result.byCrop).toHaveLength(0);
    });

    it('should return zero percentages when no land use data', () => {
      const result = mapper.toStats(0, [], []);

      result.byLandUse.forEach((item) => {
        expect(item.percentage).toBe(0);
      });
    });
  });
});
