import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from './entities/producer.entity';

@ApiTags('producers')
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo produtor rural', description: 'Cadastra um novo produtor rural com CPF ou CNPJ válido.' })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso.', type: Producer })
  @ApiResponse({ status: 400, description: 'Dados inválidos (CPF/CNPJ inválido, campos obrigatórios ausentes).' })
  @ApiResponse({ status: 409, description: 'Produtor com este documento já cadastrado.' })
  create(@Body() createProducerDto: CreateProducerDto): Promise<Producer> {
    return this.producersService.create(createProducerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores', description: 'Retorna todos os produtores com suas fazendas, safras e culturas.' })
  @ApiResponse({ status: 200, description: 'Lista de produtores retornada com sucesso.', type: [Producer] })
  findAll(): Promise<Producer[]> {
    return this.producersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produtor por ID' })
  @ApiParam({ name: 'id', description: 'UUID do produtor' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado.', type: Producer })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Producer> {
    return this.producersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produtor' })
  @ApiParam({ name: 'id', description: 'UUID do produtor' })
  @ApiResponse({ status: 200, description: 'Produtor atualizado com sucesso.', type: Producer })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  @ApiResponse({ status: 409, description: 'Documento já em uso por outro produtor.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ): Promise<Producer> {
    return this.producersService.update(id, updateProducerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir produtor' })
  @ApiParam({ name: 'id', description: 'UUID do produtor' })
  @ApiResponse({ status: 204, description: 'Produtor excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.producersService.remove(id);
  }
}
