import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CropsService } from '../crops.service';
import { CropRepository } from '../repositories/crop.repository';
import { Crop, CropType } from '../entities/crop.entity';
import { HarvestsService } from '../../harvests/harvests.service';

const mockLogger = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };

const mockHarvest = {
  id: 'harvest-uuid-1',
  name: 'Safra 2024',
  year: 2024,
  farmId: 'farm-uuid-1',
  crops: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCrop: Crop = {
  id: 'crop-uuid-1',
  type: CropType.SOJA,
  description: null,
  plantedArea: 500,
  harvestId: 'harvest-uuid-1',
  harvest: mockHarvest as any,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCropRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByHarvestId: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
};

const mockHarvestsService = {
  findOne: jest.fn(),
};

describe('CropsService', () => {
  let service: CropsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropsService,
        { provide: CropRepository, useValue: mockCropRepository },
        { provide: HarvestsService, useValue: mockHarvestsService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<CropsService>(CropsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto = { harvestId: 'harvest-uuid-1', type: CropType.SOJA, plantedArea: 500 };

    it('should create a crop successfully', async () => {
      mockHarvestsService.findOne.mockResolvedValue(mockHarvest);
      mockCropRepository.create.mockReturnValue(mockCrop);
      mockCropRepository.save.mockResolvedValue(mockCrop);

      const result = await service.create(dto);

      expect(mockHarvestsService.findOne).toHaveBeenCalledWith('harvest-uuid-1');
      expect(mockCropRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockCrop);
    });

    it('should create a crop without plantedArea', async () => {
      const dtoNoArea = { harvestId: 'harvest-uuid-1', type: CropType.MILHO };
      const cropNoArea = { ...mockCrop, plantedArea: null };
      mockHarvestsService.findOne.mockResolvedValue(mockHarvest);
      mockCropRepository.create.mockReturnValue(cropNoArea);
      mockCropRepository.save.mockResolvedValue(cropNoArea);

      const result = await service.create(dtoNoArea);

      expect(result.plantedArea).toBeNull();
    });

    it('should create crops of all valid types', async () => {
      for (const type of Object.values(CropType)) {
        const typedDto = { harvestId: 'harvest-uuid-1', type };
        const typedCrop = { ...mockCrop, type };
        mockHarvestsService.findOne.mockResolvedValue(mockHarvest);
        mockCropRepository.create.mockReturnValue(typedCrop);
        mockCropRepository.save.mockResolvedValue(typedCrop);

        const result = await service.create(typedDto);

        expect(result.type).toBe(type);
      }
    });

    it('should throw NotFoundException when harvest does not exist', async () => {
      mockHarvestsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(mockCropRepository.save).not.toHaveBeenCalled();
    });

    it('should log crop creation', async () => {
      mockHarvestsService.findOne.mockResolvedValue(mockHarvest);
      mockCropRepository.create.mockReturnValue(mockCrop);
      mockCropRepository.save.mockResolvedValue(mockCrop);

      await service.create(dto);

      expect(mockLogger.log).toHaveBeenCalledWith(
        'Creating crop',
        expect.objectContaining({ context: 'CropsService', type: CropType.SOJA }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all crops', async () => {
      mockCropRepository.findAll.mockResolvedValue([mockCrop]);

      const result = await service.findAll();

      expect(result).toEqual([mockCrop]);
    });

    it('should return empty array when no crops exist', async () => {
      mockCropRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByHarvest', () => {
    it('should return crops filtered by harvestId', async () => {
      mockHarvestsService.findOne.mockResolvedValue(mockHarvest);
      mockCropRepository.findByHarvestId.mockResolvedValue([mockCrop]);

      const result = await service.findByHarvest('harvest-uuid-1');

      expect(mockCropRepository.findByHarvestId).toHaveBeenCalledWith('harvest-uuid-1');
      expect(result).toEqual([mockCrop]);
    });

    it('should throw NotFoundException when harvest does not exist', async () => {
      mockHarvestsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.findByHarvest('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should return empty array when harvest has no crops', async () => {
      mockHarvestsService.findOne.mockResolvedValue(mockHarvest);
      mockCropRepository.findByHarvestId.mockResolvedValue([]);

      const result = await service.findByHarvest('harvest-uuid-1');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a crop by ID', async () => {
      mockCropRepository.findById.mockResolvedValue(mockCrop);

      const result = await service.findOne('crop-uuid-1');

      expect(result).toEqual(mockCrop);
      expect(mockCropRepository.findById).toHaveBeenCalledWith('crop-uuid-1');
    });

    it('should throw NotFoundException when crop not found', async () => {
      mockCropRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should throw with correct message', async () => {
      mockCropRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('abc')).rejects.toThrow(
        'Cultura com ID abc não encontrada.',
      );
    });
  });

  describe('update', () => {
    it('should update crop type', async () => {
      const updated = { ...mockCrop, type: CropType.MILHO };
      mockCropRepository.findById.mockResolvedValue(mockCrop);
      mockCropRepository.save.mockResolvedValue(updated);

      const result = await service.update('crop-uuid-1', { type: CropType.MILHO });

      expect(result.type).toBe(CropType.MILHO);
    });

    it('should update crop plantedArea', async () => {
      const updated = { ...mockCrop, plantedArea: 750 };
      mockCropRepository.findById.mockResolvedValue(mockCrop);
      mockCropRepository.save.mockResolvedValue(updated);

      const result = await service.update('crop-uuid-1', { plantedArea: 750 });

      expect(result.plantedArea).toBe(750);
    });

    it('should throw NotFoundException when crop not found', async () => {
      mockCropRepository.findById.mockResolvedValue(null);

      await expect(service.update('invalid', { type: CropType.CAFE })).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCropRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a crop successfully', async () => {
      mockCropRepository.findById.mockResolvedValue(mockCrop);
      mockCropRepository.remove.mockResolvedValue(mockCrop);

      await service.remove('crop-uuid-1');

      expect(mockCropRepository.remove).toHaveBeenCalledWith(mockCrop);
    });

    it('should throw NotFoundException when crop not found', async () => {
      mockCropRepository.findById.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
      expect(mockCropRepository.remove).not.toHaveBeenCalled();
    });
  });
});
