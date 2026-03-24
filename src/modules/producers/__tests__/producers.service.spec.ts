import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ProducersService } from '../producers.service';
import { ProducerRepository } from '../repositories/producer.repository';
import { ProducerFactory } from '../factories/producer.factory';
import { Producer, DocumentType } from '../entities/producer.entity';

const mockLogger = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };

const mockProducer: Producer = {
  id: 'uuid-1',
  document: '52998224725',
  documentType: DocumentType.CPF,
  name: 'João da Silva',
  createdAt: new Date(),
  updatedAt: new Date(),
  farms: [],
};

const mockProducerRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByDocument: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
};

const mockProducerFactory = {
  build: jest.fn(),
};

describe('ProducersService', () => {
  let service: ProducersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        { provide: ProducerRepository, useValue: mockProducerRepository },
        { provide: ProducerFactory, useValue: mockProducerFactory },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a producer with valid CPF', async () => {
      mockProducerRepository.findByDocument.mockResolvedValue(null);
      mockProducerFactory.build.mockReturnValue(mockProducer);
      mockProducerRepository.save.mockResolvedValue(mockProducer);

      const result = await service.create({ document: '529.982.247-25', name: 'João da Silva' });

      expect(result).toEqual(mockProducer);
      expect(mockProducerFactory.build).toHaveBeenCalledWith('529.982.247-25', 'João da Silva');
      expect(mockProducerRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when document already exists', async () => {
      mockProducerRepository.findByDocument.mockResolvedValue(mockProducer);

      await expect(
        service.create({ document: '529.982.247-25', name: 'João da Silva' }),
      ).rejects.toThrow(ConflictException);

      expect(mockProducerRepository.save).not.toHaveBeenCalled();
    });

    it('should search by cleaned document', async () => {
      mockProducerRepository.findByDocument.mockResolvedValue(null);
      mockProducerFactory.build.mockReturnValue(mockProducer);
      mockProducerRepository.save.mockResolvedValue(mockProducer);

      await service.create({ document: '529.982.247-25', name: 'João da Silva' });

      expect(mockProducerRepository.findByDocument).toHaveBeenCalledWith('52998224725');
    });
  });

  describe('findAll', () => {
    it('should return all producers', async () => {
      mockProducerRepository.findAll.mockResolvedValue([mockProducer]);

      const result = await service.findAll();

      expect(result).toEqual([mockProducer]);
      expect(mockProducerRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no producers exist', async () => {
      mockProducerRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a producer by ID', async () => {
      mockProducerRepository.findById.mockResolvedValue(mockProducer);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual(mockProducer);
      expect(mockProducerRepository.findById).toHaveBeenCalledWith('uuid-1');
    });

    it('should throw NotFoundException when producer not found', async () => {
      mockProducerRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should throw with correct message', async () => {
      mockProducerRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('abc')).rejects.toThrow('Produtor com ID abc não encontrado.');
    });
  });

  describe('update', () => {
    it('should update producer name', async () => {
      const updated = { ...mockProducer, name: 'Maria Souza' };
      mockProducerRepository.findById.mockResolvedValue(mockProducer);
      mockProducerRepository.save.mockResolvedValue(updated);

      const result = await service.update('uuid-1', { name: 'Maria Souza' });

      expect(result.name).toBe('Maria Souza');
    });

    it('should throw NotFoundException when producer not found', async () => {
      mockProducerRepository.findById.mockResolvedValue(null);

      await expect(service.update('invalid', { name: 'Test' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when document belongs to another producer', async () => {
      const other = { ...mockProducer, id: 'uuid-2' };
      mockProducerRepository.findById.mockResolvedValue(mockProducer);
      mockProducerRepository.findByDocument.mockResolvedValue(other);

      await expect(
        service.update('uuid-1', { document: '529.982.247-25' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete a producer', async () => {
      mockProducerRepository.findById.mockResolvedValue(mockProducer);
      mockProducerRepository.remove.mockResolvedValue(mockProducer);

      await service.remove('uuid-1');

      expect(mockProducerRepository.remove).toHaveBeenCalledWith(mockProducer);
    });

    it('should throw NotFoundException when producer not found', async () => {
      mockProducerRepository.findById.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
