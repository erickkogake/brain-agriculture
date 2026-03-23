import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { FarmsService } from '../farms.service';
import { FarmRepository } from '../repositories/farm.repository';
import { FarmFactory } from '../factories/farm.factory';
import { Farm } from '../entities/farm.entity';
import { ProducersService } from '../../producers/producers.service';
import { DocumentType } from '../../producers/entities/producer.entity';

const mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };

const mockProducer = {
  id: 'producer-uuid-1',
  document: '52998224725',
  documentType: DocumentType.CPF,
  name: 'João da Silva',
  farms: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockFarm: Farm = {
  id: 'farm-uuid-1',
  name: 'Fazenda Santa Maria',
  city: 'Ribeirão Preto',
  state: 'SP',
  totalArea: 1000,
  arableArea: 600,
  vegetationArea: 300,
  producerId: 'producer-uuid-1',
  producer: mockProducer as any,
  harvests: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockFarmRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByProducerId: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
};

const mockFarmFactory = {
  build: jest.fn(),
};

const mockProducersService = {
  findOne: jest.fn(),
};

describe('FarmsService', () => {
  let service: FarmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmsService,
        { provide: FarmRepository, useValue: mockFarmRepository },
        { provide: FarmFactory, useValue: mockFarmFactory },
        { provide: ProducersService, useValue: mockProducersService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<FarmsService>(FarmsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const validDto = {
      producerId: 'producer-uuid-1',
      name: 'Fazenda Santa Maria',
      city: 'Ribeirão Preto',
      state: 'SP',
      totalArea: 1000,
      arableArea: 600,
      vegetationArea: 300,
    };

    it('should create a farm with valid areas', async () => {
      mockProducersService.findOne.mockResolvedValue(mockProducer);
      mockFarmFactory.build.mockReturnValue(mockFarm);
      mockFarmRepository.save.mockResolvedValue(mockFarm);

      const result = await service.create(validDto);

      expect(mockProducersService.findOne).toHaveBeenCalledWith('producer-uuid-1');
      expect(mockFarmFactory.build).toHaveBeenCalledWith(validDto);
      expect(result).toEqual(mockFarm);
    });

    it('should throw BadRequestException when arable + vegetation exceeds total', async () => {
      mockProducersService.findOne.mockResolvedValue(mockProducer);

      await expect(
        service.create({ ...validDto, arableArea: 700, vegetationArea: 400 }),
      ).rejects.toThrow(BadRequestException);

      expect(mockFarmRepository.save).not.toHaveBeenCalled();
    });

    it('should allow areas that exactly match total', async () => {
      mockProducersService.findOne.mockResolvedValue(mockProducer);
      mockFarmFactory.build.mockReturnValue(mockFarm);
      mockFarmRepository.save.mockResolvedValue(mockFarm);

      await expect(
        service.create({ ...validDto, arableArea: 600, vegetationArea: 400 }),
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundException when producer does not exist', async () => {
      mockProducersService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.create(validDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all farms', async () => {
      mockFarmRepository.findAll.mockResolvedValue([mockFarm]);

      const result = await service.findAll();

      expect(result).toEqual([mockFarm]);
    });
  });

  describe('findByProducer', () => {
    it('should return farms filtered by producer', async () => {
      mockProducersService.findOne.mockResolvedValue(mockProducer);
      mockFarmRepository.findByProducerId.mockResolvedValue([mockFarm]);

      const result = await service.findByProducer('producer-uuid-1');

      expect(mockFarmRepository.findByProducerId).toHaveBeenCalledWith('producer-uuid-1');
      expect(result).toEqual([mockFarm]);
    });

    it('should throw NotFoundException when producer does not exist', async () => {
      mockProducersService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.findByProducer('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a farm by ID', async () => {
      mockFarmRepository.findById.mockResolvedValue(mockFarm);

      const result = await service.findOne('farm-uuid-1');

      expect(result).toEqual(mockFarm);
      expect(mockFarmRepository.findById).toHaveBeenCalledWith('farm-uuid-1');
    });

    it('should throw NotFoundException when farm not found', async () => {
      mockFarmRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw BadRequestException when updated areas exceed total', async () => {
      mockFarmRepository.findById.mockResolvedValue(mockFarm);

      await expect(
        service.update('farm-uuid-1', { arableArea: 800, vegetationArea: 300 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update farm name successfully', async () => {
      const updated = { ...mockFarm, name: 'Fazenda Nova' };
      mockFarmRepository.findById.mockResolvedValue(mockFarm);
      mockFarmRepository.save.mockResolvedValue(updated);

      const result = await service.update('farm-uuid-1', { name: 'Fazenda Nova' });

      expect(result.name).toBe('Fazenda Nova');
    });

    it('should uppercase state on update', async () => {
      const updated = { ...mockFarm, state: 'MG' };
      mockFarmRepository.findById.mockResolvedValue(mockFarm);
      mockFarmRepository.save.mockResolvedValue(updated);

      await service.update('farm-uuid-1', { state: 'mg' });

      expect(mockFarmRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'MG' }),
      );
    });
  });

  describe('remove', () => {
    it('should remove a farm', async () => {
      mockFarmRepository.findById.mockResolvedValue(mockFarm);
      mockFarmRepository.remove.mockResolvedValue(mockFarm);

      await service.remove('farm-uuid-1');

      expect(mockFarmRepository.remove).toHaveBeenCalledWith(mockFarm);
    });

    it('should throw NotFoundException when farm not found', async () => {
      mockFarmRepository.findById.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
