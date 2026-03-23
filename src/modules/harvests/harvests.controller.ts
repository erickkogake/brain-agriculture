import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseUUIDPipe, HttpCode, HttpStatus, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { HarvestsService } from './harvests.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Harvest } from './entities/harvest.entity';

@ApiTags('harvests')
@Controller('harvests')
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova safra' })
  @ApiResponse({ status: 201, type: Harvest })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  create(@Body() dto: CreateHarvestDto): Promise<Harvest> {
    return this.harvestsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar safras' })
  @ApiQuery({ name: 'farmId', required: false, description: 'Filtrar por fazenda' })
  @ApiResponse({ status: 200, type: [Harvest] })
  findAll(@Query('farmId') farmId?: string): Promise<Harvest[]> {
    if (farmId) return this.harvestsService.findByFarm(farmId);
    return this.harvestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar safra por ID' })
  @ApiParam({ name: 'id', description: 'UUID da safra' })
  @ApiResponse({ status: 200, type: Harvest })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Harvest> {
    return this.harvestsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar safra' })
  @ApiParam({ name: 'id', description: 'UUID da safra' })
  @ApiResponse({ status: 200, type: Harvest })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateHarvestDto): Promise<Harvest> {
    return this.harvestsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir safra' })
  @ApiParam({ name: 'id', description: 'UUID da safra' })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.harvestsService.remove(id);
  }
}
