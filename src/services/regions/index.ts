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

async function createRegencies(data_prov: any[]) {
  if (data_prov.length === 0) return [];

  const values: any[] = [];
  const placeholders = data_prov.map((prov, index) => {
    const offset = index * 3;
    values.push(prov.code, prov.name, prov.province_id);
    return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
  });

  const result = await pool.query(
    `
      INSERT INTO m_regencies (code, name, province_id)
      VALUES ${placeholders.join(", ")} RETURNING *
    `,
    values,
  );
  return result.rows;
}

async function createVillages(data_prov: any[]) {
  if (data_prov.length === 0) return [];

  const values: any[] = [];
  const placeholders = data_prov.map((prov, index) => {
    const offset = index * 3;
    values.push(prov.code, prov.name, prov.district_id);
    return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
  });

  const result = await pool.query(
    `
      INSERT INTO m_villages (code, name, district_id)
      VALUES ${placeholders.join(", ")} RETURNING *
    `,
    values,
  );
  return result.rows;
}

async function createDistrict(data_prov: any[]) {
  if (data_prov.length === 0) return [];

  const values: any[] = [];
  const placeholders = data_prov.map((prov, index) => {
    const offset = index * 3;
    values.push(prov.code, prov.name, prov.regency_id);
    return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
  });

  const result = await pool.query(
    `
      INSERT INTO m_districts (code, name, regency_id)
      VALUES ${placeholders.join(", ")} RETURNING *
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

const getRegenciesByProvinceId = async (requestParams: any): Promise<any> => {
  try {
    const { province_id } = requestParams;
    if (!province_id) {
      return executionError(400, "province_id cannot be empty");
    }
    const existing = await pool.query(
      "SELECT * FROM m_regencies WHERE province_id = $1 ORDER BY name",
      [province_id],
    );
    if (existing.rowCount) {
      return existing.rows;
    }
    const regencies_data = await pool.query(
      "SELECT * FROM m_provinces where id = $1",
      [province_id],
    );
    const total = regencies_data.rowCount;
    if (total) {
      const fetch_data = await axios.get(
        `https://wilayah.id/api/regencies/${regencies_data.rows[0].code}.json`,
      );
      const { data: regencies } = fetch_data.data;

      if (regencies.length === 0) {
        return [];
      }
      const map_data = regencies.map((data: any) => ({
        ...data,
        province_id,
      }));
      const create_data = await createRegencies(map_data);
      return create_data;
    }
    return [];
  } catch (error) {
    throw error;
  }
};

const getDistrictsByRegencyId = async (requestParams: any): Promise<any> => {
  try {
    const { regency_id } = requestParams;
    if (!regency_id) {
      return executionError(400, "regency_id cannot be empty");
    }
    const existing = await pool.query(
      "SELECT * FROM m_districts WHERE regency_id = $1 ORDER BY name",
      [regency_id],
    );

    if (existing.rowCount) {
      return existing.rows;
    }
    const regencies_data = await pool.query(
      "SELECT * FROM m_regencies where id = $1",
      [regency_id],
    );
    const total = regencies_data.rowCount;
    if (total) {
      const fetch_data = await axios.get(
        `https://wilayah.id/api/districts/${regencies_data.rows[0].code}.json`,
      );
      const { data: regencies } = fetch_data.data;
      if (regencies.length === 0) {
        return [];
      }
      const map_data = regencies.map((data: any) => ({
        ...data,
        regency_id,
      }));

      const create_data = await createDistrict(map_data);
      return create_data;
    }
    return [];
  } catch (error) {
    throw error;
  }
};

const getVillagesByDistrictId = async (requestParams: any): Promise<any> => {
  try {
    const { district_id } = requestParams;
    if (!district_id) {
      return executionError(400, "district_id cannot be empty");
    }
    const existing = await pool.query(
      "SELECT * FROM m_villages WHERE district_id = $1 ORDER BY name",
      [district_id],
    );
    if (existing.rowCount) {
      return existing.rows;
    }

    const regencies_data = await pool.query(
      "SELECT * FROM m_districts where id = $1",
      [district_id],
    );
    const total = regencies_data.rowCount;
    if (total) {
      const fetch_data = await axios.get(
        `https://wilayah.id/api/villages/${regencies_data.rows[0].code}.json`,
      );
      const { data: regencies } = fetch_data.data;
      if (regencies.length === 0) {
        [];
      }
      const map_data = regencies.map((data: any) => ({
        ...data,
        district_id,
      }));

      const create_data = await createVillages(map_data);
      return create_data;
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export default {
  getProvinces,
  getProvinceById,
  getRegenciesByProvinceId,
  getDistrictsByRegencyId,
  getVillagesByDistrictId,
};
