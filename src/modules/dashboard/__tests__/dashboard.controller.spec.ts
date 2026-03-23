import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from '../dashboard.controller';
import { DashboardService } from '../dashboard.service';
import { IDashboardStats } from '../interfaces';

const mockStats: IDashboardStats = {
  overview: {
    totalProducers: 6,
    totalFarms: 11,
    totalHectares: 25600,
  },
  byState: [
    { label: 'SP', value: 3, percentage: 27.3 },
    { label: 'GO', value: 3, percentage: 27.3 },
    { label: 'MG', value: 2, percentage: 18.2 },
    { label: 'BA', value: 3, percentage: 27.3 },
  ],
  byCrop: [
    { label: 'Soja', value: 18, percentage: 54.5 },
    { label: 'Milho', value: 9, percentage: 27.3 },
    { label: 'Algodão', value: 4, percentage: 12.1 },
    { label: 'Café', value: 2, percentage: 6.1 },
  ],
  byLandUse: [
    { label: 'Área Agricultável', value: 17100, percentage: 72.5 },
    { label: 'Área de Vegetação', value: 6500, percentage: 27.5 },
  ],
};

const mockDashboardService = {
  getStats: jest.fn(),
};

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [{ provide: DashboardService, useValue: mockDashboardService }],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return dashboard statistics', async () => {
      mockDashboardService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(result).toEqual(mockStats);
      expect(mockDashboardService.getStats).toHaveBeenCalledTimes(1);
    });

    it('should return correct overview structure', async () => {
      mockDashboardService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(result.overview).toHaveProperty('totalProducers');
      expect(result.overview).toHaveProperty('totalFarms');
      expect(result.overview).toHaveProperty('totalHectares');
    });

    it('should return correct chart data arrays', async () => {
      mockDashboardService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(Array.isArray(result.byState)).toBe(true);
      expect(Array.isArray(result.byCrop)).toBe(true);
      expect(Array.isArray(result.byLandUse)).toBe(true);
    });

    it('should return pie chart items with label, value and percentage', async () => {
      mockDashboardService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      result.byState.forEach((item) => {
        expect(item).toHaveProperty('label');
        expect(item).toHaveProperty('value');
        expect(item).toHaveProperty('percentage');
      });
    });

    it('should handle empty data gracefully', async () => {
      const emptyStats: IDashboardStats = {
        overview: { totalProducers: 0, totalFarms: 0, totalHectares: 0 },
        byState: [],
        byCrop: [],
        byLandUse: [],
      };
      mockDashboardService.getStats.mockResolvedValue(emptyStats);

      const result = await controller.getStats();

      expect(result.overview.totalFarms).toBe(0);
      expect(result.byState).toHaveLength(0);
    });

    it('should propagate errors from service', async () => {
      mockDashboardService.getStats.mockRejectedValue(new Error('Database error'));

      await expect(controller.getStats()).rejects.toThrow('Database error');
    });
  });
});
