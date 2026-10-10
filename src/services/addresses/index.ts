import { getDateTime, getUserIdFromToken } from "../../helpers";
import { pool } from "../../database/pool";

import { executionError } from "../responseHandling";

const myAddress = async (requestHeaders: any): Promise<any> => {
  try {
    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(404, "token not found");
    }
    const data = getUserIdFromToken(authHeader);
    if (!data) {
      return executionError(401, "token not valid");
    }
    const findAdddress = await pool.query(
      "SELECT id, customer_id,name,address,detail,longitude,latitude FROM m_customer_addresses where customer_id = $1 and deleted = false order by id desc",
      [data.id]
    );
    // if (findAdddress.rows.length === 0) {
    //   return executionError(404, "Address not found");
    // }
    return findAdddress.rows;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const getAddressDetailsByCustomerId = async (
  requestParams: any,
  requestHeaders: any
): Promise<any> => {
  try {
    const { address_id } = requestParams;

    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(404, "token not found");
    }
    if (!address_id) {
      return executionError(401, "Errors Your not Eligible");
    }

    const userLogin = getUserIdFromToken(authHeader);
    if (!userLogin) {
      return executionError(401, "token not valid");
    }

    let customer_data = await pool.query(
      "SELECT * FROM m_customers WHERE id = $1",
      [userLogin.id]
    );
    if (customer_data.rows.length === 0) {
      return executionError(404, "customer not found");
    }
    let customer_address = await pool.query(
      "SELECT * FROM m_customer_addresses WHERE id = $1 AND customer_id = $2 and deleted = false",
      [address_id, userLogin.id]
    );
    if (customer_address.rows.length === 0) {
      return executionError(404, "Address not found");
    }

    // let data_response = {
    //   customer_address.rows[0],
    // };

    return customer_address.rows;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const addAddressByCustomerId = async (
  requestBody: any,
  requestHeaders: any
): Promise<any> => {
  try {
    const { name, address, detail, longitude, latitude } = requestBody;

    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(404, "token not found");
    }
    if (!name) {
      return executionError(404, "name not found");
    }
    if (!address) {
      return executionError(404, "address not found");
    }
    if (!detail) {
      return executionError(404, "detail not found");
    }
    if (!longitude) {
      return executionError(404, "longitude not found");
    }
    if (!latitude) {
      return executionError(404, "latitude not found");
    }
    const userLogin = getUserIdFromToken(authHeader);
    if (!userLogin) {
      return executionError(401, "token not valid");
    }

    let customer_data = await pool.query(
      "SELECT * FROM m_customers WHERE id = $1",
      [userLogin.id]
    );
    if (customer_data.rows.length === 0) {
      return executionError(404, "customer not found");
    }
    let today = new Date();

    let insert_address = await pool.query(
      "INSERT INTO m_customer_addresses (customer_id, deleted, create_at, update_at, name, address, detail, longitude, latitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        userLogin.id,
        false,
        getDateTime(today),
        getDateTime(today),
        name,
        address,
        detail,
        longitude,
        latitude,
      ]
    );

    return insert_address.rows[0];
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const updateAddressByCustomerAddressId = async (
  requestParams: any,
  requestBody: any,
  requestHeaders: any
): Promise<any> => {
  try {
    const { address_id } = requestParams;

    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(404, "token not found");
    }
    if (!address_id) {
      return executionError(404, "address_id not be empty");
    }

    const userLogin = getUserIdFromToken(authHeader);
    if (!userLogin) {
      return executionError(401, "token not valid");
    }

    let customer_data = await pool.query(
      "SELECT id FROM m_customers WHERE id = $1",
      [userLogin.id]
    );
    if (customer_data.rows.length === 0) {
      return executionError(404, "customer not found");
    }
    let find_address_by_customer = await pool.query(
      "SELECT * FROM m_customer_addresses WHERE id = $1 AND customer_id = $2",
      [address_id, userLogin.id]
    );
    if (find_address_by_customer.rows.length === 0) {
      return executionError(404, "address not found");
    }
    const { name, address, detail, longitude, latitude } =
      find_address_by_customer.rows[0];
    let in_name = requestBody.name ? requestBody.name : name;
    let in_address = requestBody.address ? requestBody.address : address;
    let in_detail = requestBody.detail ? requestBody.detail : detail;
    let in_longitude = requestBody.longitude
      ? requestBody.longitude
      : longitude;
    let in_latitude = requestBody.latitude ? requestBody.latitude : latitude;
    if (!in_name) {
      return executionError(404, "name not be empty");
    }
    if (!in_address) {
      return executionError(404, "address not be empty");
    }
    if (!in_detail) {
      return executionError(404, "detail not be empty");
    }
    if (!in_longitude) {
      return executionError(404, "longitude not be empty");
    }
    if (!in_latitude) {
      return executionError(404, "latitude not be empty");
    }

    let today = new Date();
    let update_address = await pool.query(
      "UPDATE m_customer_addresses SET update_at = $1, name $2, address = $3, detail = $4, longitude = $5, latitude = $6 WHERE id = $7 AND customer_id = $8 RETURNING *",
      [
        getDateTime(today),
        in_name,
        in_address,
        in_detail,
        in_longitude,
        in_latitude,
        address_id,
        userLogin.id,
      ]
    );

    return update_address.rows[0];
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const deleteAddressByCustomerAddressId = async (
  requestParams: any,
  requestHeaders: any
): Promise<any> => {
  try {
    const { address_id } = requestParams;

    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(404, "token not found");
    }
    if (!address_id) {
      return executionError(404, "address_id not be empty");
    }

    const userLogin = getUserIdFromToken(authHeader);
    if (!userLogin) {
      return executionError(401, "token not valid");
    }

    let customer_data = await pool.query(
      "SELECT id FROM m_customers WHERE id = $1",
      [userLogin.id]
    );
    if (customer_data.rows.length === 0) {
      return executionError(404, "customer not found");
    }
    let find_address_by_customer = await pool.query(
      "SELECT * FROM m_customer_addresses WHERE id = $1 AND customer_id = $2",
      [address_id, userLogin.id]
    );
    if (find_address_by_customer.rows.length === 0) {
      return executionError(404, "address not found");
    }
    await pool.query(
      "DELETE FROM m_customer_addresses WHERE id = $1 AND customer_id = $2 RETURNING *",
      [address_id, userLogin.id]
    );
    let response_data = { address_id, message: "Address deleted" };

    return response_data;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

export default {
  myAddress,
  getAddressDetailsByCustomerId,
  addAddressByCustomerId,
  updateAddressByCustomerAddressId,
  deleteAddressByCustomerAddressId,
};
