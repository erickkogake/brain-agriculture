import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService, DashboardStats } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Obter estatísticas do dashboard',
    description: `
      Retorna métricas agregadas para o dashboard:
      - Total de fazendas cadastradas
      - Total de hectares registrados
      - Distribuição por estado (gráfico de pizza)
      - Distribuição por cultura plantada (gráfico de pizza)
      - Distribuição por uso do solo: agricultável vs vegetação (gráfico de pizza)
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas do dashboard retornadas com sucesso.',
  })
  getStats(): Promise<DashboardStats> {
    return this.dashboardService.getStats();
  }
}
