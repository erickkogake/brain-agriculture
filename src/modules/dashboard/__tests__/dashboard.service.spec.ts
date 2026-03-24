import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DashboardService } from '../dashboard.service';
import { DashboardMapper } from '../mappers/dashboard.mapper';
import { Farm } from '../../farms/entities/farm.entity';
import { Crop, CropType } from '../../crops/entities/crop.entity';
import { Producer } from '../../producers/entities/producer.entity';

const mockLogger = { log: jest.fn(), error: jest.fn() };

const mockFarms = [
  { id: '1', state: 'SP', totalArea: 1000, arableArea: 600, vegetationArea: 300 },
  { id: '2', state: 'SP', totalArea: 500, arableArea: 200, vegetationArea: 100 },
  { id: '3', state: 'MG', totalArea: 800, arableArea: 400, vegetationArea: 200 },
  { id: '4', state: 'GO', totalArea: 300, arableArea: 100, vegetationArea: 50 },
];

const mockCrops = [
  { id: '1', type: CropType.SOJA },
  { id: '2', type: CropType.SOJA },
  { id: '3', type: CropType.MILHO },
  { id: '4', type: CropType.CAFE },
];

const mockFarmRepo = { find: jest.fn() };
const mockCropRepo = { find: jest.fn() };
const mockProducerRepo = { count: jest.fn() };

describe('DashboardService', () => {
  let service: DashboardService;
  let mapper: DashboardMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        DashboardMapper,
        { provide: getRepositoryToken(Farm), useValue: mockFarmRepo },
        { provide: getRepositoryToken(Crop), useValue: mockCropRepo },
        { provide: getRepositoryToken(Producer), useValue: mockProducerRepo },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    mapper = module.get<DashboardMapper>(DashboardMapper);
    jest.clearAllMocks();

    mockProducerRepo.count.mockResolvedValue(3);
    mockFarmRepo.find.mockResolvedValue(mockFarms);
    mockCropRepo.find.mockResolvedValue(mockCrops);
  });

  describe('getStats', () => {
    it('should return correct overview totals', async () => {
      const result = await service.getStats();

      expect(result.overview.totalFarms).toBe(4);
      expect(result.overview.totalProducers).toBe(3);
      expect(result.overview.totalHectares).toBe(2600);
    });

    it('should group farms by state correctly', async () => {
      const result = await service.getStats();
      const sp = result.byState.find((s) => s.label === 'SP');
      const mg = result.byState.find((s) => s.label === 'MG');
      const go = result.byState.find((s) => s.label === 'GO');

      expect(sp.value).toBe(2);
      expect(mg.value).toBe(1);
      expect(go.value).toBe(1);
    });

    it('should calculate state percentages correctly', async () => {
      const result = await service.getStats();
      const sp = result.byState.find((s) => s.label === 'SP');

      expect(sp.percentage).toBe(50);
    });

    it('should group crops by type correctly', async () => {
      const result = await service.getStats();
      const soja = result.byCrop.find((c) => c.label === CropType.SOJA);
      const milho = result.byCrop.find((c) => c.label === CropType.MILHO);

      expect(soja.value).toBe(2);
      expect(milho.value).toBe(1);
    });

    it('should calculate land use correctly', async () => {
      const result = await service.getStats();
      const arable = result.byLandUse.find((l) => l.label === 'Área Agricultável');
      const vegetation = result.byLandUse.find((l) => l.label === 'Área de Vegetação');

      expect(arable.value).toBe(1300);
      expect(vegetation.value).toBe(650);
    });

    it('should sort byState by value descending', async () => {
      const result = await service.getStats();

      for (let i = 0; i < result.byState.length - 1; i++) {
        expect(result.byState[i].value).toBeGreaterThanOrEqual(result.byState[i + 1].value);
      }
    });

    it('should handle empty data gracefully', async () => {
      mockProducerRepo.count.mockResolvedValue(0);
      mockFarmRepo.find.mockResolvedValue([]);
      mockCropRepo.find.mockResolvedValue([]);

      const result = await service.getStats();

      expect(result.overview.totalFarms).toBe(0);
      expect(result.overview.totalHectares).toBe(0);
      expect(result.byState).toHaveLength(0);
      expect(result.byCrop).toHaveLength(0);
    });

    it('should delegate mapping to DashboardMapper', async () => {
      const mapSpy = jest.spyOn(mapper, 'toStats');

      await service.getStats();

      expect(mapSpy).toHaveBeenCalledWith(3, mockFarms, mockCrops);
    });
  });
});
