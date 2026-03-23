import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCropDto } from './create-crop.dto';

export class UpdateCropDto extends PartialType(OmitType(CreateCropDto, ['harvestId'] as const)) {}
