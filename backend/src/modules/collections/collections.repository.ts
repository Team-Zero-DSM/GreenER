import { Pool } from 'pg';
import {
    Collection,
    EstimateParameter,
    RegionEnergyInfo,
    Service,
    type Region,
} from './collections.types.js';

export class CollectionsRepository {
    constructor(private readonly pool: Pool) {}

    async createRegion(data: Region): Promise<void> {
        await this.pool.query(
            `INSERT INTO regiao
       (codigo, pais, regiao, cidade, latitude, longitude, carbon_intensity, renewable_share_percent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                data.code,
                data.country,
                data.region,
                data.city,
                data.latitude,
                data.longitude,
                data.carbon_intensity_gco2e_per_kwh,
                data.renewable_share_percent,
            ],
        );
    }
    async createService(data: Service): Promise<void> {
        await this.pool.query(
            `INSERT INTO servico (external_id, nome, metrics_path, regiao_id)
     VALUES ($1, $2, $3, (SELECT id FROM regiao WHERE codigo = $4))`,
            [data.id, data.name, data.metrics_path, data.location.region_code],
        );
    }

    async createCollection(data: Collection): Promise<void> {
        await this.pool.query(
            `INSERT INTO coleta
       (servico_id, parametro_estimativa_id, coletado_em, intervalo_metrica_segundos,
        cpu_percent, memory_gb, disk_gb, network_gb,
        cpu_watts, memory_watts, disk_watts, network_watts,
        potencia_estimada_w, energia_estimada_kwh, carbon_intensity, co2e_estimado_g)
     VALUES
       ($1, $2, COALESCE($3, now()), $4,
        $5, $6, $7, $8,
        $9, $10, $11, $12,
        $13, $14, $15, $16)`,
            [
                data.service_id,
                data.estimate_parameter_id,
                data.collected_at ?? null,
                data.metric_interval_seconds,
                data.cpu_percent,
                data.memory_gb,
                data.disk_gb,
                data.network_gb,
                data.cpu_watts,
                data.memory_watts,
                data.disk_watts,
                data.network_watts,
                data.estimated_power_w,
                data.estimated_energy_kwh,
                data.carbon_intensity,
                data.estimated_co2e_g,
            ],
        );
    }

    async existsByCode(code: string): Promise<boolean> {
        const result = await this.pool.query(`SELECT 1 FROM regiao WHERE codigo = $1`, [code]);
        return (result.rowCount ?? 0) > 0;
    }

    async existsByExternal_id(external_id: string): Promise<boolean> {
        const result = await this.pool.query(`SELECT 1 FROM servico WHERE external_id = $1`, [
            external_id,
        ]);
        return (result.rowCount ?? 0) > 0;
    }

    async findActiveEstimateParameter(): Promise<EstimateParameter | null> {
        const result = await this.pool.query<EstimateParameter>(
            `SELECT id,
            cpu_max_watts,
            ram_watts_per_gb,
            disk_watts_per_gb,
            network_watts_per_gb,
            ativo AS active
     FROM parametro_estimativa
     WHERE ativo = true`,
        );
        return result.rows[0] ?? null;
    }

    async findEnergyInfoByCode(code: string): Promise<RegionEnergyInfo | null> {
        const result = await this.pool.query<RegionEnergyInfo>(
            `SELECT carbon_intensity, renewable_share_percent
     FROM regiao
     WHERE codigo = $1`,
            [code],
        );
        return result.rows[0] ?? null;
    }

    async updateServiceRegion(externalId: string, regionCode: string): Promise<boolean> {
        const result = await this.pool.query(
            `UPDATE servico
     SET regiao_id = (SELECT id FROM regiao WHERE codigo = $2)
     WHERE external_id = $1
       AND regiao_id IS DISTINCT FROM (SELECT id FROM regiao WHERE codigo = $2)`,
            [externalId, regionCode],
        );
        return (result.rowCount ?? 0) > 0;
    }
}
