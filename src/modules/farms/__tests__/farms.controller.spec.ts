import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FarmsController } from '../farms.controller';
import { FarmsService } from '../farms.service';
import { Farm } from '../entities/farm.entity';

const mockFarm: Farm = {
  id: 'farm-uuid-1',
  name: 'Fazenda Santa Maria',
  city: 'Ribeirão Preto',
  state: 'SP',
  totalArea: 1000,
  arableArea: 600,
  vegetationArea: 300,
  producerId: 'producer-uuid-1',
  producer: null,
  harvests: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockFarmsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByProducer: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('FarmsController', () => {
  let controller: FarmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmsController],
      providers: [{ provide: FarmsService, useValue: mockFarmsService }],
    }).compile();

    controller = module.get<FarmsController>(FarmsController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto = {
      producerId: 'producer-uuid-1',
      name: 'Fazenda Santa Maria',
      city: 'Ribeirão Preto',
      state: 'SP',
      totalArea: 1000,
      arableArea: 600,
      vegetationArea: 300,
    };

    it('should create a farm and return it', async () => {
      mockFarmsService.create.mockResolvedValue(mockFarm);

      const result = await controller.create(dto);

      expect(result).toEqual(mockFarm);
      expect(mockFarmsService.create).toHaveBeenCalledWith(dto);
    });

    it('should propagate BadRequestException when areas are invalid', async () => {
      mockFarmsService.create.mockRejectedValue(new BadRequestException('Áreas inválidas.'));

      await expect(
        controller.create({ ...dto, arableArea: 900, vegetationArea: 900 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should propagate NotFoundException when producer not found', async () => {
      mockFarmsService.create.mockRejectedValue(new NotFoundException());

      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all farms when no producerId is given', async () => {
      mockFarmsService.findAll.mockResolvedValue([mockFarm]);

      const result = await controller.findAll(undefined);

      expect(result).toEqual([mockFarm]);
      expect(mockFarmsService.findAll).toHaveBeenCalledTimes(1);
      expect(mockFarmsService.findByProducer).not.toHaveBeenCalled();
    });

    it('should filter by producer when producerId is provided', async () => {
      mockFarmsService.findByProducer.mockResolvedValue([mockFarm]);

      const result = await controller.findAll('producer-uuid-1');

      expect(result).toEqual([mockFarm]);
      expect(mockFarmsService.findByProducer).toHaveBeenCalledWith('producer-uuid-1');
      expect(mockFarmsService.findAll).not.toHaveBeenCalled();
    });

    it('should return empty array when no farms exist', async () => {
      mockFarmsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(undefined);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a farm by id', async () => {
      mockFarmsService.findOne.mockResolvedValue(mockFarm);

      const result = await controller.findOne('farm-uuid-1');

      expect(result).toEqual(mockFarm);
      expect(mockFarmsService.findOne).toHaveBeenCalledWith('farm-uuid-1');
    });

    it('should propagate NotFoundException', async () => {
      mockFarmsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update farm and return it', async () => {
      const updated = { ...mockFarm, name: 'Fazenda Nova' };
      mockFarmsService.update.mockResolvedValue(updated);

      const result = await controller.update('farm-uuid-1', { name: 'Fazenda Nova' });

      expect(result.name).toBe('Fazenda Nova');
      expect(mockFarmsService.update).toHaveBeenCalledWith('farm-uuid-1', { name: 'Fazenda Nova' });
    });

    it('should propagate BadRequestException on invalid areas', async () => {
      mockFarmsService.update.mockRejectedValue(new BadRequestException());

      await expect(
        controller.update('farm-uuid-1', { arableArea: 999, vegetationArea: 999 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should propagate NotFoundException when farm not found', async () => {
      mockFarmsService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('invalid', { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a farm successfully', async () => {
      mockFarmsService.remove.mockResolvedValue(undefined);

      await expect(controller.remove('farm-uuid-1')).resolves.toBeUndefined();
      expect(mockFarmsService.remove).toHaveBeenCalledWith('farm-uuid-1');
    });

    it('should propagate NotFoundException when farm not found', async () => {
      mockFarmsService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
