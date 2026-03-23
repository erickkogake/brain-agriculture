import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { HarvestsController } from '../harvests.controller';
import { HarvestsService } from '../harvests.service';
import { Harvest } from '../entities/harvest.entity';

const mockHarvest: Harvest = {
  id: 'harvest-uuid-1',
  name: 'Safra 2024',
  year: 2024,
  farmId: 'farm-uuid-1',
  farm: null,
  crops: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockHarvestsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByFarm: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('HarvestsController', () => {
  let controller: HarvestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestsController],
      providers: [{ provide: HarvestsService, useValue: mockHarvestsService }],
    }).compile();

    controller = module.get<HarvestsController>(HarvestsController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto = { farmId: 'farm-uuid-1', name: 'Safra 2024', year: 2024 };

    it('should create a harvest and return it', async () => {
      mockHarvestsService.create.mockResolvedValue(mockHarvest);

      const result = await controller.create(dto);

      expect(result).toEqual(mockHarvest);
      expect(mockHarvestsService.create).toHaveBeenCalledWith(dto);
    });

    it('should propagate NotFoundException when farm not found', async () => {
      mockHarvestsService.create.mockRejectedValue(new NotFoundException());

      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all harvests when no farmId is given', async () => {
      mockHarvestsService.findAll.mockResolvedValue([mockHarvest]);

      const result = await controller.findAll(undefined);

      expect(result).toEqual([mockHarvest]);
      expect(mockHarvestsService.findAll).toHaveBeenCalledTimes(1);
      expect(mockHarvestsService.findByFarm).not.toHaveBeenCalled();
    });

    it('should filter by farm when farmId is provided', async () => {
      mockHarvestsService.findByFarm.mockResolvedValue([mockHarvest]);

      const result = await controller.findAll('farm-uuid-1');

      expect(result).toEqual([mockHarvest]);
      expect(mockHarvestsService.findByFarm).toHaveBeenCalledWith('farm-uuid-1');
      expect(mockHarvestsService.findAll).not.toHaveBeenCalled();
    });

    it('should return empty array when no harvests exist', async () => {
      mockHarvestsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(undefined);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a harvest by id', async () => {
      mockHarvestsService.findOne.mockResolvedValue(mockHarvest);

      const result = await controller.findOne('harvest-uuid-1');

      expect(result).toEqual(mockHarvest);
      expect(mockHarvestsService.findOne).toHaveBeenCalledWith('harvest-uuid-1');
    });

    it('should propagate NotFoundException', async () => {
      mockHarvestsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update harvest name and return it', async () => {
      const updated = { ...mockHarvest, name: 'Safra 2025' };
      mockHarvestsService.update.mockResolvedValue(updated);

      const result = await controller.update('harvest-uuid-1', { name: 'Safra 2025' });

      expect(result.name).toBe('Safra 2025');
      expect(mockHarvestsService.update).toHaveBeenCalledWith('harvest-uuid-1', { name: 'Safra 2025' });
    });

    it('should update harvest year', async () => {
      const updated = { ...mockHarvest, year: 2025 };
      mockHarvestsService.update.mockResolvedValue(updated);

      const result = await controller.update('harvest-uuid-1', { year: 2025 });

      expect(result.year).toBe(2025);
    });

    it('should propagate NotFoundException when harvest not found', async () => {
      mockHarvestsService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('invalid', { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a harvest successfully', async () => {
      mockHarvestsService.remove.mockResolvedValue(undefined);

      await expect(controller.remove('harvest-uuid-1')).resolves.toBeUndefined();
      expect(mockHarvestsService.remove).toHaveBeenCalledWith('harvest-uuid-1');
    });

    it('should propagate NotFoundException when harvest not found', async () => {
      mockHarvestsService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
