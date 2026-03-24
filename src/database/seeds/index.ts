import { DataSource } from 'typeorm';
import { Producer, DocumentType } from '../../modules/producers/entities/producer.entity';
import { Farm } from '../../modules/farms/entities/farm.entity';
import { Harvest } from '../../modules/harvests/entities/harvest.entity';
import { Crop, CropType } from '../../modules/crops/entities/crop.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'brain_agriculture',
  entities: [Producer, Farm, Harvest, Crop],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const producerRepo = dataSource.getRepository(Producer);
  const farmRepo = dataSource.getRepository(Farm);
  const harvestRepo = dataSource.getRepository(Harvest);
  const cropRepo = dataSource.getRepository(Crop);

  await cropRepo.clear();
  await harvestRepo.clear();
  await farmRepo.clear();
  await producerRepo.clear();

  const producers = await producerRepo.save([
    { document: '52998224725', documentType: DocumentType.CPF, name: 'João Carlos da Silva' },
    { document: '11222333000181', documentType: DocumentType.CNPJ, name: 'Agro Minas Gerais Ltda' },
    { document: '98765432100', documentType: DocumentType.CPF, name: 'Maria Aparecida Santos' },
    { document: '47960950000121', documentType: DocumentType.CNPJ, name: 'Grupo Rural Goiás S.A.' },
    { document: '86798286020', documentType: DocumentType.CPF, name: 'Pedro Henrique Oliveira' },
    { document: '28538680000131', documentType: DocumentType.CNPJ, name: 'Fazendas do Cerrado Ltda' },
  ]);

  const farms = await farmRepo.save([
    { producerId: producers[0].id, name: 'Fazenda Santa Maria', city: 'Ribeirão Preto', state: 'SP', totalArea: 1500, arableArea: 900, vegetationArea: 400 },
    { producerId: producers[0].id, name: 'Sítio Esperança', city: 'Piracicaba', state: 'SP', totalArea: 300, arableArea: 180, vegetationArea: 80 },
    { producerId: producers[1].id, name: 'Fazenda Boa Vista', city: 'Uberlândia', state: 'MG', totalArea: 3200, arableArea: 2000, vegetationArea: 800 },
    { producerId: producers[1].id, name: 'Fazenda Rio Verde', city: 'Uberaba', state: 'MG', totalArea: 2100, arableArea: 1400, vegetationArea: 500 },
    { producerId: producers[2].id, name: 'Chácara São José', city: 'Campinas', state: 'SP', totalArea: 200, arableArea: 100, vegetationArea: 70 },
    { producerId: producers[3].id, name: 'Fazenda Cerrado I', city: 'Rio Verde', state: 'GO', totalArea: 5000, arableArea: 3500, vegetationArea: 1000 },
    { producerId: producers[3].id, name: 'Fazenda Cerrado II', city: 'Jataí', state: 'GO', totalArea: 4200, arableArea: 2800, vegetationArea: 1000 },
    { producerId: producers[3].id, name: 'Fazenda Planície', city: 'Mineiros', state: 'GO', totalArea: 2800, arableArea: 1800, vegetationArea: 700 },
    { producerId: producers[4].id, name: 'Fazenda Nova Esperança', city: 'Barreiras', state: 'BA', totalArea: 1800, arableArea: 1100, vegetationArea: 500 },
    { producerId: producers[5].id, name: 'Fazenda Serra Verde', city: 'Luís Eduardo Magalhães', state: 'BA', totalArea: 2500, arableArea: 1600, vegetationArea: 600 },
    { producerId: producers[5].id, name: 'Fazenda Soja Dourada', city: 'Formosa do Rio Preto', state: 'BA', totalArea: 3800, arableArea: 2600, vegetationArea: 900 },
  ]);

  const harvests = await harvestRepo.save([
    { farmId: farms[0].id, name: 'Safra 2022', year: 2022 },
    { farmId: farms[0].id, name: 'Safra 2023', year: 2023 },
    { farmId: farms[0].id, name: 'Safra 2024', year: 2024 },
    { farmId: farms[1].id, name: 'Safra 2023', year: 2023 },
    { farmId: farms[1].id, name: 'Safra 2024', year: 2024 },
    { farmId: farms[2].id, name: 'Safra 2022', year: 2022 },
    { farmId: farms[2].id, name: 'Safra 2023', year: 2023 },
    { farmId: farms[2].id, name: 'Safra 2024', year: 2024 },
    { farmId: farms[3].id, name: 'Safra 2023', year: 2023 },
    { farmId: farms[3].id, name: 'Safra 2024', year: 2024 },
    { farmId: farms[5].id, name: 'Safra 2022', year: 2022 },
    { farmId: farms[5].id, name: 'Safra 2023', year: 2023 },
    { farmId: farms[5].id, name: 'Safra 2024', year: 2024 },
    { farmId: farms[8].id, name: 'Safra 2023', year: 2023 },
    { farmId: farms[8].id, name: 'Safra 2024', year: 2024 },
    { farmId: farms[10].id, name: 'Safra 2022', year: 2022 },
    { farmId: farms[10].id, name: 'Safra 2023', year: 2023 },
    { farmId: farms[10].id, name: 'Safra 2024', year: 2024 },
  ]);

  await cropRepo.save([
    { harvestId: harvests[0].id, type: CropType.SOJA, plantedArea: 500 },
    { harvestId: harvests[0].id, type: CropType.MILHO, plantedArea: 300 },
    { harvestId: harvests[1].id, type: CropType.SOJA, plantedArea: 600 },
    { harvestId: harvests[1].id, type: CropType.CANA_DE_ACUCAR, plantedArea: 200 },
    { harvestId: harvests[2].id, type: CropType.SOJA, plantedArea: 700 },
    { harvestId: harvests[2].id, type: CropType.MILHO, plantedArea: 150 },
    { harvestId: harvests[3].id, type: CropType.CAFE, plantedArea: 100 },
    { harvestId: harvests[4].id, type: CropType.CAFE, plantedArea: 120 },
    { harvestId: harvests[4].id, type: CropType.MILHO, plantedArea: 50 },
    { harvestId: harvests[5].id, type: CropType.SOJA, plantedArea: 1200 },
    { harvestId: harvests[5].id, type: CropType.MILHO, plantedArea: 600 },
    { harvestId: harvests[6].id, type: CropType.SOJA, plantedArea: 1400 },
    { harvestId: harvests[6].id, type: CropType.ALGODAO, plantedArea: 400 },
    { harvestId: harvests[7].id, type: CropType.SOJA, plantedArea: 1500 },
    { harvestId: harvests[7].id, type: CropType.MILHO, plantedArea: 400 },
    { harvestId: harvests[8].id, type: CropType.SOJA, plantedArea: 900 },
    { harvestId: harvests[8].id, type: CropType.SORGO, plantedArea: 300 },
    { harvestId: harvests[9].id, type: CropType.SOJA, plantedArea: 1000 },
    { harvestId: harvests[10].id, type: CropType.SOJA, plantedArea: 2000 },
    { harvestId: harvests[10].id, type: CropType.MILHO, plantedArea: 1000 },
    { harvestId: harvests[11].id, type: CropType.SOJA, plantedArea: 2200 },
    { harvestId: harvests[11].id, type: CropType.ALGODAO, plantedArea: 800 },
    { harvestId: harvests[12].id, type: CropType.SOJA, plantedArea: 2500 },
    { harvestId: harvests[12].id, type: CropType.MILHO, plantedArea: 700 },
    { harvestId: harvests[13].id, type: CropType.SOJA, plantedArea: 700 },
    { harvestId: harvests[13].id, type: CropType.ALGODAO, plantedArea: 300 },
    { harvestId: harvests[14].id, type: CropType.SOJA, plantedArea: 800 },
    { harvestId: harvests[15].id, type: CropType.SOJA, plantedArea: 1500 },
    { harvestId: harvests[15].id, type: CropType.MILHO, plantedArea: 800 },
    { harvestId: harvests[16].id, type: CropType.SOJA, plantedArea: 1800 },
    { harvestId: harvests[16].id, type: CropType.ALGODAO, plantedArea: 600 },
    { harvestId: harvests[17].id, type: CropType.SOJA, plantedArea: 2000 },
    { harvestId: harvests[17].id, type: CropType.MILHO, plantedArea: 500 },
  ]);

  console.log(`Seed concluído: ${producers.length} produtores, ${farms.length} fazendas, ${harvests.length} safras`);

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed falhou:', err);
  process.exit(1);
});
