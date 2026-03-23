import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProducersController } from '../producers.controller';
import { ProducersService } from '../producers.service';
import { Producer, DocumentType } from '../entities/producer.entity';

const mockProducer: Producer = {
  id: 'uuid-1',
  document: '52998224725',
  documentType: DocumentType.CPF,
  name: 'João da Silva',
  farms: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProducersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProducersController', () => {
  let controller: ProducersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [{ provide: ProducersService, useValue: mockProducersService }],
    }).compile();

    controller = module.get<ProducersController>(ProducersController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a producer and return it', async () => {
      mockProducersService.create.mockResolvedValue(mockProducer);

      const result = await controller.create({ document: '529.982.247-25', name: 'João da Silva' });

      expect(result).toEqual(mockProducer);
      expect(mockProducersService.create).toHaveBeenCalledTimes(1);
    });

    it('should propagate ConflictException from service', async () => {
      mockProducersService.create.mockRejectedValue(new ConflictException('Documento já cadastrado.'));

      await expect(
        controller.create({ document: '529.982.247-25', name: 'João da Silva' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should pass the correct DTO to service', async () => {
      mockProducersService.create.mockResolvedValue(mockProducer);
      const dto = { document: '529.982.247-25', name: 'João da Silva' };

      await controller.create(dto);

      expect(mockProducersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return array of producers', async () => {
      mockProducersService.findAll.mockResolvedValue([mockProducer]);

      const result = await controller.findAll();

      expect(result).toEqual([mockProducer]);
      expect(mockProducersService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no producers exist', async () => {
      mockProducersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return producer by id', async () => {
      mockProducersService.findOne.mockResolvedValue(mockProducer);

      const result = await controller.findOne('uuid-1');

      expect(result).toEqual(mockProducer);
      expect(mockProducersService.findOne).toHaveBeenCalledWith('uuid-1');
    });

    it('should propagate NotFoundException from service', async () => {
      mockProducersService.findOne.mockRejectedValue(new NotFoundException('Produtor não encontrado.'));

      await expect(controller.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a producer and return it', async () => {
      const updated = { ...mockProducer, name: 'João Atualizado' };
      mockProducersService.update.mockResolvedValue(updated);

      const result = await controller.update('uuid-1', { name: 'João Atualizado' });

      expect(result.name).toBe('João Atualizado');
      expect(mockProducersService.update).toHaveBeenCalledWith('uuid-1', { name: 'João Atualizado' });
    });

    it('should propagate NotFoundException when producer not found', async () => {
      mockProducersService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('invalid', { name: 'Test' })).rejects.toThrow(NotFoundException);
    });

    it('should propagate ConflictException when document is in use', async () => {
      mockProducersService.update.mockRejectedValue(new ConflictException('Documento já em uso.'));

      await expect(
        controller.update('uuid-1', { document: '529.982.247-25' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a producer successfully', async () => {
      mockProducersService.remove.mockResolvedValue(undefined);

      await expect(controller.remove('uuid-1')).resolves.toBeUndefined();
      expect(mockProducersService.remove).toHaveBeenCalledWith('uuid-1');
    });

    it('should propagate NotFoundException when producer not found', async () => {
      mockProducersService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
