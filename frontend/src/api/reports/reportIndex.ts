import { REPORTS_SOURCE } from './reportConfig';
import type { ReportsApi } from './reportContract';
import { httpReportsApi } from './reportsApi.http';;
import { servicesReportsApi } from './reportsApi.services';

const sources: Record<typeof REPORTS_SOURCE, ReportsApi> = {
  services: servicesReportsApi,
  backend: httpReportsApi,
};

export const reportsApi: ReportsApi = sources[REPORTS_SOURCE];
export type { ReportsApi } from './reportContract';