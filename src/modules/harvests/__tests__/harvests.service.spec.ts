import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HarvestsService } from '../harvests.service';
import { HarvestRepository } from '../repositories/harvest.repository';
import { Harvest } from '../entities/harvest.entity';
import { FarmsService } from '../../farms/farms.service';

const mockLogger = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };

const mockFarm = {
  id: 'farm-uuid-1',
  name: 'Fazenda Santa Maria',
  city: 'Ribeirão Preto',
  state: 'SP',
  totalArea: 1000,
  arableArea: 600,
  vegetationArea: 300,
  producerId: 'producer-uuid-1',
  harvests: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockHarvest: Harvest = {
  id: 'harvest-uuid-1',
  name: 'Safra 2024',
  year: 2024,
  farmId: 'farm-uuid-1',
  farm: mockFarm as any,
  crops: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockHarvestRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByFarmId: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
};

const mockFarmsService = {
  findOne: jest.fn(),
};

describe('HarvestsService', () => {
  let service: HarvestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestsService,
        { provide: HarvestRepository, useValue: mockHarvestRepository },
        { provide: FarmsService, useValue: mockFarmsService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<HarvestsService>(HarvestsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto = { farmId: 'farm-uuid-1', name: 'Safra 2024', year: 2024 };

    it('should create a harvest successfully', async () => {
      mockFarmsService.findOne.mockResolvedValue(mockFarm);
      mockHarvestRepository.create.mockReturnValue(mockHarvest);
      mockHarvestRepository.save.mockResolvedValue(mockHarvest);

      const result = await service.create(dto);

      expect(mockFarmsService.findOne).toHaveBeenCalledWith('farm-uuid-1');
      expect(mockHarvestRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockHarvest);
    });

    it('should throw NotFoundException when farm does not exist', async () => {
      mockFarmsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(mockHarvestRepository.save).not.toHaveBeenCalled();
    });

    it('should log harvest creation', async () => {
      mockFarmsService.findOne.mockResolvedValue(mockFarm);
      mockHarvestRepository.create.mockReturnValue(mockHarvest);
      mockHarvestRepository.save.mockResolvedValue(mockHarvest);

      await service.create(dto);

      expect(mockLogger.log).toHaveBeenCalledWith(
        'Creating harvest',
        expect.objectContaining({ context: 'HarvestsService' }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all harvests', async () => {
      mockHarvestRepository.findAll.mockResolvedValue([mockHarvest]);

      const result = await service.findAll();

      expect(result).toEqual([mockHarvest]);
    });

    it('should return empty array when no harvests exist', async () => {
      mockHarvestRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByFarm', () => {
    it('should return harvests filtered by farmId', async () => {
      mockFarmsService.findOne.mockResolvedValue(mockFarm);
      mockHarvestRepository.findByFarmId.mockResolvedValue([mockHarvest]);

      const result = await service.findByFarm('farm-uuid-1');

      expect(mockHarvestRepository.findByFarmId).toHaveBeenCalledWith('farm-uuid-1');
      expect(result).toEqual([mockHarvest]);
    });

    it('should throw NotFoundException when farm does not exist', async () => {
      mockFarmsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.findByFarm('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a harvest by ID', async () => {
      mockHarvestRepository.findById.mockResolvedValue(mockHarvest);

      const result = await service.findOne('harvest-uuid-1');

      expect(result).toEqual(mockHarvest);
      expect(mockHarvestRepository.findById).toHaveBeenCalledWith('harvest-uuid-1');
    });

    it('should throw NotFoundException when harvest not found', async () => {
      mockHarvestRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should throw with correct message', async () => {
      mockHarvestRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('abc')).rejects.toThrow(
        'Safra com ID abc não encontrada.',
      );
    });
  });

  describe('update', () => {
    it('should update harvest name', async () => {
      const updated = { ...mockHarvest, name: 'Safra 2025' };
      mockHarvestRepository.findById.mockResolvedValue(mockHarvest);
      mockHarvestRepository.save.mockResolvedValue(updated);

      const result = await service.update('harvest-uuid-1', { name: 'Safra 2025' });

      expect(result.name).toBe('Safra 2025');
    });

    it('should update harvest year', async () => {
      const updated = { ...mockHarvest, year: 2025 };
      mockHarvestRepository.findById.mockResolvedValue(mockHarvest);
      mockHarvestRepository.save.mockResolvedValue(updated);

      const result = await service.update('harvest-uuid-1', { year: 2025 });

      expect(result.year).toBe(2025);
    });

    it('should throw NotFoundException when harvest not found', async () => {
      mockHarvestRepository.findById.mockResolvedValue(null);

      await expect(service.update('invalid', { name: 'Test' })).rejects.toThrow(NotFoundException);
      expect(mockHarvestRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a harvest successfully', async () => {
      mockHarvestRepository.findById.mockResolvedValue(mockHarvest);
      mockHarvestRepository.remove.mockResolvedValue(mockHarvest);

      await service.remove('harvest-uuid-1');

      expect(mockHarvestRepository.remove).toHaveBeenCalledWith(mockHarvest);
    });

    it('should throw NotFoundException when harvest not found', async () => {
      mockHarvestRepository.findById.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
      expect(mockHarvestRepository.remove).not.toHaveBeenCalled();
    });
  });
});
