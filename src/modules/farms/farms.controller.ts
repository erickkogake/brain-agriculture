import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseUUIDPipe, HttpCode, HttpStatus, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';

@ApiTags('farms')
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova fazenda', description: 'Cadastra uma nova fazenda vinculada a um produtor. Valida que a soma das áreas não ultrapasse a área total.' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso.', type: Farm })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou áreas incompatíveis.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  create(@Body() createFarmDto: CreateFarmDto): Promise<Farm> {
    return this.farmsService.create(createFarmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar fazendas' })
  @ApiQuery({ name: 'producerId', required: false, description: 'Filtrar por produtor' })
  @ApiResponse({ status: 200, type: [Farm] })
  findAll(@Query('producerId') producerId?: string): Promise<Farm[]> {
    if (producerId) return this.farmsService.findByProducer(producerId);
    return this.farmsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fazenda por ID' })
  @ApiParam({ name: 'id', description: 'UUID da fazenda' })
  @ApiResponse({ status: 200, type: Farm })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Farm> {
    return this.farmsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar fazenda' })
  @ApiParam({ name: 'id', description: 'UUID da fazenda' })
  @ApiResponse({ status: 200, type: Farm })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFarmDto: UpdateFarmDto,
  ): Promise<Farm> {
    return this.farmsService.update(id, updateFarmDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir fazenda' })
  @ApiParam({ name: 'id', description: 'UUID da fazenda' })
  @ApiResponse({ status: 204, description: 'Fazenda excluída com sucesso.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.farmsService.remove(id);
  }
}
