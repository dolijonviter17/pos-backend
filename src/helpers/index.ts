import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt, {
  Jwt,
  JwtPayload,
  Secret,
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from "jsonwebtoken";
const SECRET = "FOODORDER-REST-API";

interface CustomJwtPayload extends JwtPayload {
  id: string; // Adjust this according to your JWT payload structure
  email: string;
}
export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

export const randomBytes = () => crypto.randomBytes(64).toString("base64");
export const randomBytesPayment = () =>
  crypto.randomBytes(32).toString("base64");

export const numberPonselFormat = (ponsel: string) => {
  ponsel.indexOf("8") == 0 ? (ponsel = ponsel.replace("8", "08")) : ponsel;
  ponsel.indexOf("0") == 0 ? (ponsel = ponsel.replace("0", "62")) : ponsel;
  ponsel.indexOf("+") == 0 ? (ponsel = ponsel.replace("+", "")) : ponsel;
  return ponsel;
};

export const isNoPonselWithCodeCountry = (noponsel: string) => {
  return noponsel.indexOf("0") == 0
    ? (noponsel = noponsel.replace("0", "62"))
    : "62" + noponsel;
};

export const isNumberPonsel = (phone: string): boolean => {
  phone.indexOf("62") == 0 ? (phone = phone.replace("62", "0")) : phone;
  if (!phone || !/^08[1-9][0-9]{7,10}$/.test(phone)) {
    return false;
  }
  return true;
};

export const mergeStringWithCharacter = (str: string): string => {
  if (!str) return "";
  let cleanedStr = str.trim().replace(/\s+/g, " ");
  let lowercase = cleanedStr.toLocaleLowerCase();
  if (!lowercase.includes(" ")) return lowercase;
  let newStr = lowercase.replace(/ /g, "-");
  return newStr;
};

export const capitalizeWords = (input: string): string => {
  if (!input) return "";
  let cleanedStr = input.trim().replace(/\s+/g, " ");
  return cleanedStr
    .toLowerCase() // Convert the entire string to lowercase first
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back into a string
};

export const isBodyEmpty = (obj: any) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const getQtySUm = (data: [], id: number) => {
  let unique = data.filter((d: any) => d);
};

export const getDateMaximum = (day = 0) => {
  var date = new Date();
  if (day === undefined) return date;
  date.setDate(date.getDate() + day);
  return date;
};

export const getDateTime = (value: any) => {
  const checkTime = (i: any) => {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  };
  let date = new Date(value);
  let tgl = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let month = date.getMonth();
  let bln = month + 1 < 10 ? "0" + (month + 1) : month + 1;
  let year = date.getFullYear() + "-" + bln + "-" + tgl;
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  let time = `${h}:${m}:${s}`;
  return `${year}T${time}`;
};

export const compareDates = (a: any, b: any, key: any, isSort: boolean) => {
  if (isSort) {
    var current = a;
    a = b;
    b = current;
  }
  const dateA = getDateTime(a?.[key]);
  const dateB = getDateTime(b?.[key]);

  if (dateA < dateB) {
    return -1;
  }
  if (dateA > dateB) {
    return 1;
  }
  return 0;
};

export const originalDate = (val: any) => {
  const date = new Date(val.replace(" ", "T"));
  date.setMinutes(date.getMinutes() + 10);
  const format = date.toISOString().slice(0, 19);
  return format;
};

export const generateKodeOrder = (prefix: string): string => {
  let xday = new Date().getDate();
  let xmonth = new Date().getMonth() + 1;
  let xyear = new Date().getFullYear();
  let xh = new Date().getHours();
  let xi = new Date().getMinutes();
  let xs = new Date().getSeconds();
  let hariIni =
    xyear +
    ("0" + xmonth).slice(-2) +
    ("0" + xday).slice(-2) +
    ("0" + xh).slice(-2) +
    ("0" + xi).slice(-2) +
    ("0" + xs).slice(-2);
  var kodeorder = prefix + hariIni;
  return kodeorder;
};

export const seckretPrivate = (): string => {
  let str = "CE";
  let xmonth = new Date().getMonth() + 1;
  let xyear = new Date().getFullYear();
  let key = str + xyear + xmonth;
  return key;
};

export const lowerCase = (input: string): string => {
  if (!input) return "";
  return input.toLowerCase(); // Convert the entire string to lowercase first
};

export const capitalizeFirstLetter = (word: string): string => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const getDataWithWhere = (by: any, keyValue: any) => {
  let qw = "";
  for (let i = 0; i < Object.keys(by).length; i++) {
    if (i == 0) {
      if (Object.keys(by)[i] == keyValue) {
        qw +=
          " WHERE " +
          Object.keys(by)[i] +
          " ilike '%" +
          lowerCase(by[Object.keys(by)[i]]) +
          "%'";
      } else {
        qw +=
          " WHERE " + Object.keys(by)[i] + "='" + by[Object.keys(by)[i]] + "'";
      }
    } else {
      if (Object.keys(by)[i] == keyValue) {
        qw +=
          " AND " +
          Object.keys(by)[i] +
          " ilike '%" +
          lowerCase(by[Object.keys(by)[i]]) +
          "%'";
      } else {
        qw +=
          " AND " + Object.keys(by)[i] + "='" + by[Object.keys(by)[i]] + "'";
      }
    }
  }
  return qw;

  // var jumlah = query('SELECT count(*) FROM obatalkes_m ' + qw + '');

  // let results = query(
  //   'SELECT * FROM obatalkes_m ' +
  //     qw +
  //     ' ORDER BY obatalkes_nama ASC limit $1 offset $2',
  //   [limit, offset]
  // );
};

export const generateId = (date: Date, sequence: number): string => {
  if (!Number.isInteger(sequence) || sequence < 0 || sequence > 999) {
    throw new Error("Nomor urut harus berupa angka bulat antara 0 dan 999");
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const number = String(sequence).padStart(3, "0");
  return `${year}${month}${day}${number}`;
};
export const bcryptCsfPassword = (password: string, hash: string) => {
  let curr_hash = hash;
  curr_hash = curr_hash.replace("$2y$", "$2b$"); // Convert Laravel's format to Node.js compatible
  let check_password = bcrypt.compare(password, curr_hash);
  return check_password;
};

export const getUserIdFromToken = (token: string): any | null => {
  try {
    const decoded = jwt.verify(token, seckretPrivate()) as CustomJwtPayload;
    if (decoded && decoded.id && decoded.email) {
      return decoded;
    }
    return null;
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof TokenExpiredError) {
      console.error("Token has expired:", error.message);
      throw new Error(error.message);
    } else if (error instanceof JsonWebTokenError) {
      console.error("JWT error:", error.message);
      throw new Error(error.message);
    } else if (error instanceof NotBeforeError) {
      console.error("Token not active yet:", error.message);
      throw new Error(error.message);
    } else {
      console.error("Token verification failed:", error);
      return null;
    }
  }
};
