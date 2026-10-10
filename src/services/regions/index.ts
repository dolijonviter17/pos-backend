import axios from "axios";
import { pool } from "../../database/pool";
import { executionError } from "../responseHandling";

// Define an interface for the expected JWT payload

// ================================== // ==================

async function createProvinces(data_prov: any[]) {
  if (data_prov.length === 0) return [];

  const values: any[] = [];
  const placeholders = data_prov.map((prov, index) => {
    const offset = index * 2;
    values.push(prov.code, prov.name);
    return `($${offset + 1}, $${offset + 2})`;
  });

  const result = await pool.query(
    `
      INSERT INTO m_provinces (code, name)
      VALUES ${placeholders.join(", ")}
      RETURNING id, name, name
    `,
    values,
  );
  return result.rows;
}

const getProvinces = async (): Promise<any> => {
  try {
    const provinces = await pool.query("SELECT * FROM m_provinces", []);
    const total = provinces.rowCount;
    if (total === 0) {
      const fetch_data = await axios.get(
        "https://wilayah.id/api/provinces.json",
      );
      const { data } = fetch_data.data;
      const create_data = await createProvinces(data);
      return create_data;
    }

    return provinces.rows;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const getProvinceById = async (requestParams: any): Promise<any> => {
  try {
    const { province_id } = requestParams;
    if (!province_id) {
      return executionError(404, "province_id is empty");
    }
    const province_with_id = await pool.query(
      "SELECT * FROM m_provinces WHERE id = $1",
      [province_id],
    );
    const province_data =
      province_with_id.rowCount === 0 ? null : province_with_id.rows[0];
    return province_data;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

export default {
  getProvinces,
  getProvinceById,
};
