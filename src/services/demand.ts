import IDemand from 'interfaces/models/demand';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import apiService, { ApiService } from './api';

export class DemandService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<IDemand>> {
    return this.apiService.get('/demand', params);
  }

  public save(model: Partial<IDemand>): Observable<IDemand> {
    return this.apiService.post('/demand', model);
  }

  public delete(id: number): Observable<void> {
    return this.apiService.delete(`/demand/${id}`);
  }
}

const demandService = new DemandService(apiService);
export default demandService;
