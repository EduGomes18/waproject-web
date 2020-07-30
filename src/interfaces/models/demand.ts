export default interface IDemand {
  id?: number;
  name: string;
  description?: string;
  quantity?: number;
  value?: number;

  createdDate?: Date;
  updatedDate?: Date;
}
