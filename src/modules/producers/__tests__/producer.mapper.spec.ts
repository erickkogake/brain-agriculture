import { ProducerMapper } from '../mappers/producer.mapper';
import { DocumentType } from '../entities/producer.entity';

const mockProducer: any = {
  id: 'uuid-1',
  document: '52998224725',
  documentType: DocumentType.CPF,
  name: 'João da Silva',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
  farms: [
    {
      id: 'farm-1',
      name: 'Fazenda Santa Maria',
      city: 'Ribeirão Preto',
      state: 'SP',
      totalArea: '1000',
      arableArea: '600',
      vegetationArea: '300',
    },
  ],
};

describe('ProducerMapper', () => {
  const mapper = new ProducerMapper();

  describe('toResponse', () => {
    it('should map all base fields correctly', () => {
      const result = mapper.toResponse(mockProducer);

      expect(result.id).toBe('uuid-1');
      expect(result.document).toBe('52998224725');
      expect(result.documentType).toBe(DocumentType.CPF);
      expect(result.name).toBe('João da Silva');
    });

    it('should compute farmsCount from farms array', () => {
      const result = mapper.toResponse(mockProducer);

      expect(result.farmsCount).toBe(1);
    });

    it('should map farm fields and coerce area numbers', () => {
      const result = mapper.toResponse(mockProducer);

      expect(result.farms[0].id).toBe('farm-1');
      expect(result.farms[0].totalArea).toBe(1000);
      expect(result.farms[0].arableArea).toBe(600);
      expect(result.farms[0].vegetationArea).toBe(300);
    });

    it('should handle producer with no farms', () => {
      const noFarms = { ...mockProducer, farms: [] };
      const result = mapper.toResponse(noFarms);

      expect(result.farmsCount).toBe(0);
      expect(result.farms).toHaveLength(0);
    });

    it('should handle undefined farms gracefully', () => {
      const noFarms = { ...mockProducer, farms: undefined };
      const result = mapper.toResponse(noFarms);

      expect(result.farmsCount).toBe(0);
      expect(result.farms).toHaveLength(0);
    });
  });

  describe('toResponseList', () => {
    it('should map an array of producers', () => {
      const result = mapper.toResponseList([mockProducer, mockProducer]);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('uuid-1');
    });

    it('should return empty array for empty input', () => {
      expect(mapper.toResponseList([])).toHaveLength(0);
    });
  });
});
