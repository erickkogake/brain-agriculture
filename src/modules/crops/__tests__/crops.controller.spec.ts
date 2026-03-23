import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CropsController } from '../crops.controller';
import { CropsService } from '../crops.service';
import { Crop, CropType } from '../entities/crop.entity';

const mockCrop: Crop = {
  id: 'crop-uuid-1',
  type: CropType.SOJA,
  description: null,
  plantedArea: 500,
  harvestId: 'harvest-uuid-1',
  harvest: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCropsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByHarvest: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CropsController', () => {
  let controller: CropsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropsController],
      providers: [{ provide: CropsService, useValue: mockCropsService }],
    }).compile();

    controller = module.get<CropsController>(CropsController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto = { harvestId: 'harvest-uuid-1', type: CropType.SOJA, plantedArea: 500 };

    it('should create a crop and return it', async () => {
      mockCropsService.create.mockResolvedValue(mockCrop);

      const result = await controller.create(dto);

      expect(result).toEqual(mockCrop);
      expect(mockCropsService.create).toHaveBeenCalledWith(dto);
    });

    it('should create a crop without plantedArea', async () => {
      const dtoWithoutArea = { harvestId: 'harvest-uuid-1', type: CropType.MILHO };
      const cropWithoutArea = { ...mockCrop, type: CropType.MILHO, plantedArea: null };
      mockCropsService.create.mockResolvedValue(cropWithoutArea);

      const result = await controller.create(dtoWithoutArea);

      expect(result.plantedArea).toBeNull();
    });

    it('should propagate NotFoundException when harvest not found', async () => {
      mockCropsService.create.mockRejectedValue(new NotFoundException());

      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all crops when no harvestId is given', async () => {
      mockCropsService.findAll.mockResolvedValue([mockCrop]);

      const result = await controller.findAll(undefined);

      expect(result).toEqual([mockCrop]);
      expect(mockCropsService.findAll).toHaveBeenCalledTimes(1);
      expect(mockCropsService.findByHarvest).not.toHaveBeenCalled();
    });

    it('should filter by harvest when harvestId is provided', async () => {
      mockCropsService.findByHarvest.mockResolvedValue([mockCrop]);

      const result = await controller.findAll('harvest-uuid-1');

      expect(result).toEqual([mockCrop]);
      expect(mockCropsService.findByHarvest).toHaveBeenCalledWith('harvest-uuid-1');
      expect(mockCropsService.findAll).not.toHaveBeenCalled();
    });

    it('should return empty array when harvest has no crops', async () => {
      mockCropsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(undefined);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a crop by id', async () => {
      mockCropsService.findOne.mockResolvedValue(mockCrop);

      const result = await controller.findOne('crop-uuid-1');

      expect(result).toEqual(mockCrop);
      expect(mockCropsService.findOne).toHaveBeenCalledWith('crop-uuid-1');
    });

    it('should propagate NotFoundException', async () => {
      mockCropsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update crop type and return it', async () => {
      const updated = { ...mockCrop, type: CropType.MILHO };
      mockCropsService.update.mockResolvedValue(updated);

      const result = await controller.update('crop-uuid-1', { type: CropType.MILHO });

      expect(result.type).toBe(CropType.MILHO);
      expect(mockCropsService.update).toHaveBeenCalledWith('crop-uuid-1', { type: CropType.MILHO });
    });

    it('should update crop plantedArea', async () => {
      const updated = { ...mockCrop, plantedArea: 800 };
      mockCropsService.update.mockResolvedValue(updated);

      const result = await controller.update('crop-uuid-1', { plantedArea: 800 });

      expect(result.plantedArea).toBe(800);
    });

    it('should propagate NotFoundException when crop not found', async () => {
      mockCropsService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('invalid', { type: CropType.CAFE })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a crop successfully', async () => {
      mockCropsService.remove.mockResolvedValue(undefined);

      await expect(controller.remove('crop-uuid-1')).resolves.toBeUndefined();
      expect(mockCropsService.remove).toHaveBeenCalledWith('crop-uuid-1');
    });

    it('should propagate NotFoundException when crop not found', async () => {
      mockCropsService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
