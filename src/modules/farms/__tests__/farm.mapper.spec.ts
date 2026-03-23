import { FarmMapper } from '../mappers/farm.mapper';

const mockFarm: any = {
  id: 'farm-1',
  name: 'Fazenda Santa Maria',
  city: 'Ribeirão Preto',
  state: 'SP',
  totalArea: '1000',
  arableArea: '600',
  vegetationArea: '300',
  producerId: 'producer-1',
  producer: { name: 'João da Silva' },
  harvests: [{ id: 'h1' }, { id: 'h2' }],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
};

describe('FarmMapper', () => {
  const mapper = new FarmMapper();

  describe('toResponse', () => {
    it('should map all base fields', () => {
      const result = mapper.toResponse(mockFarm);

      expect(result.id).toBe('farm-1');
      expect(result.name).toBe('Fazenda Santa Maria');
      expect(result.city).toBe('Ribeirão Preto');
      expect(result.state).toBe('SP');
    });

    it('should coerce decimal area strings to numbers', () => {
      const result = mapper.toResponse(mockFarm);

      expect(result.totalArea).toBe(1000);
      expect(result.arableArea).toBe(600);
      expect(result.vegetationArea).toBe(300);
    });

    it('should compute usagePercent correctly', () => {
      const result = mapper.toResponse(mockFarm);

      expect(result.usagePercent).toBe(90);
    });

    it('should return zero usagePercent when totalArea is zero', () => {
      const zeroFarm = { ...mockFarm, totalArea: '0' };
      const result = mapper.toResponse(zeroFarm);

      expect(result.usagePercent).toBe(0);
    });

    it('should include producerName from relation', () => {
      const result = mapper.toResponse(mockFarm);

      expect(result.producerName).toBe('João da Silva');
    });

    it('should handle missing producer relation', () => {
      const noProducer = { ...mockFarm, producer: undefined };
      const result = mapper.toResponse(noProducer);

      expect(result.producerName).toBeUndefined();
    });

    it('should count harvests', () => {
      const result = mapper.toResponse(mockFarm);

      expect(result.harvestsCount).toBe(2);
    });
  });

  describe('toResponseList', () => {
    it('should map a list of farms', () => {
      const result = mapper.toResponseList([mockFarm, mockFarm]);

      expect(result).toHaveLength(2);
    });

    it('should return empty array for empty input', () => {
      expect(mapper.toResponseList([])).toHaveLength(0);
    });
  });
});
