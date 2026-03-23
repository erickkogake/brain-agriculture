import { Injectable } from '@nestjs/common';
import { Farm } from '../../farms/entities/farm.entity';
import { Crop } from '../../crops/entities/crop.entity';
import { IPieChartItem, IDashboardStats } from '../interfaces';

@Injectable()
export class DashboardMapper {
  toStats(
    totalProducers: number,
    farms: Farm[],
    crops: Crop[],
  ): IDashboardStats {
    const totalFarms = farms.length;
    const totalHectares = this.round(farms.reduce((sum, f) => sum + Number(f.totalArea), 0));

    const byState = this.groupToPieChart(
      farms.map((f) => f.state),
      totalFarms,
    );

    const byCrop = this.groupToPieChart(
      crops.map((c) => c.type),
      crops.length,
    );

    const totalArable = this.round(farms.reduce((sum, f) => sum + Number(f.arableArea), 0));
    const totalVegetation = this.round(farms.reduce((sum, f) => sum + Number(f.vegetationArea), 0));
    const landUseTotal = totalArable + totalVegetation;

    const byLandUse: IPieChartItem[] = [
      {
        label: 'Área Agricultável',
        value: totalArable,
        percentage: landUseTotal > 0 ? this.round((totalArable / landUseTotal) * 100) : 0,
      },
      {
        label: 'Área de Vegetação',
        value: totalVegetation,
        percentage: landUseTotal > 0 ? this.round((totalVegetation / landUseTotal) * 100) : 0,
      },
    ];

    return {
      overview: { totalProducers, totalFarms, totalHectares },
      byState,
      byCrop,
      byLandUse,
    };
  }

  private groupToPieChart(labels: string[], total: number): IPieChartItem[] {
    const map = new Map<string, number>();
    labels.forEach((label) => map.set(label, (map.get(label) ?? 0) + 1));

    return Array.from(map.entries())
      .map(([label, value]) => ({
        label,
        value,
        percentage: total > 0 ? this.round((value / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
