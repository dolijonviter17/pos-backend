import { Schema, Document, Model, model } from "mongoose";

export interface IBarang extends Document {
  nama_barang: string;
  stok: number;
  jumlah_terjual: number;
  tanggal_transaksi: string;
  jenis_barang: string;
}

const BarangSchema: Schema = new Schema({
  nama_barang: { type: String, require: true },
  stok: { type: Number, require: true },
  jumlah_terjual: { type: Number, require: true },
  tanggal_transaksi: { type: String, require: true },
  jenis_barang: { type: String, require: true },
});

export const BarangModel: Model<IBarang> = model<IBarang>(
  "Barang",
  BarangSchema
);

export const getBarang = () => BarangModel.find();
export const getBarangByName = (nama_barang: string) =>
  BarangModel.findOne({ nama_barang });

export const createBarang = (values: Record<string, any>) =>
  new BarangModel(values).save().then((barang) => barang.toObject());

export const deleteBarangById = (id: string) =>
  BarangModel.findOneAndDelete({ _id: id });
export const getBarangById = (id: string) => BarangModel.findById(id);

// export const getUserBySessionToken = (sessionToken: string) =>
//   UserModel.findOne({
//     "authentication.sessionToken": sessionToken,
//   });
// export const getUserById = (id: string) => UserModel.findById(id);
// export const createUser = (values: Record<string, any>) =>
//   new UserModel(values).save().then((user) => user.toObject());

// export const updateUserById = (id: string, values: Record<string, any>) =>
//   UserModel.findByIdAndUpdate(id, values);
