export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  profile?: IProfile;
  updatedDate: Date;
  createdDate: Date;
}

export interface IProfile {
  id: number;
  gender: string;
  skill: string;
  user?: IUsers;
  todos?: ITodo[];
}

export interface ITodo {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  user?: IUser;
}

export interface IStudent {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  roollNo: string;
  courses?: ICource[];
}

export interface ICource {
  id: number;
  title: string;
  code: string;
}
// FOODS ORDERS
export interface ISuplier {
  id: number;
  suplierName: string;
  supplierContact: string;
  suplierEmail: string;
}

export interface ICustomer {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  user?: IUsers;
}

export interface IOrder {
  id: number;
  customer?: ICustomer;
  orderDate: Date;
  orderDetail: IOrderDetail;
}

export interface IOrderDetail {
  id: number;
  priceAtOrder: string;
  quantity: number;
  order: IOrder;
}

export interface IUsers {
  id: number;
  username: string;
  email: string;
  number_phone: string;
  first_name: string;
  last_name: string;
  password: string;
  salt: string;
  session_token: string;
  created_date: Date;
  updated_date: Date;
}
export interface IMenuCategory {
  id: number;
  menu_name: string;
  type_of_food: string;
  updated_date: Date;
  created_date: Date;
}

export interface IMaterial {
  id: number;
  material_name: string;
  order_date: Date;
  updated_date: Date;
  created_date: Date;
}
export interface IStockMaterial {
  id: number;
  material: number;
  qty_in: number;
  qty_out: number;
  updated_date: Date;
  created_date: Date;
}
// FOODS ORDERS
