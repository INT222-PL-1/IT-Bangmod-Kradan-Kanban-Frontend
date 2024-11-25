import { parseJwtPayload } from "../utils";

export class User {
  constructor(jwtToken) {
    const userData = parseJwtPayload(jwtToken)

    this.iss = userData.iss
    this.oid = userData.oid
    this.name = userData.name

    if (userData.iss.includes('79845616-9df0-43e0-8842-e300feb2642a')) {
      this.email = userData.preferred_username
      this.idToken = jwtToken
    } else {
      this.role = userData.role
      this.email = userData.email
    }
  }
}
