export type ProducerDocumentType = 'CPF' | 'CNPJ';

export type ProducerWithFarmCount = {
  id: string;
  name: string;
  document: string;
  documentType: ProducerDocumentType;
  farmCount: number;
};
