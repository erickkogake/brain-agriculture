import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseUUIDPipe, HttpCode, HttpStatus, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CropsService } from './crops.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';

@ApiTags('crops')
@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar cultura plantada' })
  @ApiResponse({ status: 201, type: Crop })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  create(@Body() dto: CreateCropDto): Promise<Crop> {
    return this.cropsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar culturas' })
  @ApiQuery({ name: 'harvestId', required: false, description: 'Filtrar por safra' })
  @ApiResponse({ status: 200, type: [Crop] })
  findAll(@Query('harvestId') harvestId?: string): Promise<Crop[]> {
    if (harvestId) return this.cropsService.findByHarvest(harvestId);
    return this.cropsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cultura por ID' })
  @ApiParam({ name: 'id', description: 'UUID da cultura' })
  @ApiResponse({ status: 200, type: Crop })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Crop> {
    return this.cropsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar cultura' })
  @ApiParam({ name: 'id', description: 'UUID da cultura' })
  @ApiResponse({ status: 200, type: Crop })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCropDto): Promise<Crop> {
    return this.cropsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir cultura' })
  @ApiParam({ name: 'id', description: 'UUID da cultura' })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.cropsService.remove(id);
  }
}
