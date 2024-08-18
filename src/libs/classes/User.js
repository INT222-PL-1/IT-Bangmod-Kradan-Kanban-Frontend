import { parseJwtPayload } from "../utils";

export class User {
  constructor(jwtToken) {
    const userData = parseJwtPayload(jwtToken)
    this.name = userData.name
    this.role = userData.role
    this.email = userData.email
  }
}