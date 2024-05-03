import { Credentials, Authenticated } from ".";
import { SessionUser } from "src/types";

export class AuthService {
  public async login(credentials: Credentials): Promise<Authenticated> {
    return new Promise((resolve, reject) => {
      fetch("http://auth_service:3010/api/v0/authenticate", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((authenticated) => {
          console.log("resolved");
          resolve(authenticated);
        })
        .catch((err) => {
          console.log(err);
          reject(new Error("Unauthoriuzed"));
        });
    });
  }

  public async check(
    authHeader?: string,
    roles?: string[],
  ): Promise<SessionUser> {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        reject(new Error("Unauthorized"));
      } else {
        const tokens = authHeader.split(" ");
        if (tokens.length != 2 || tokens[0] !== "Bearer") {
          reject(new Error("Unauthorized"));
        } else {
          fetch(
            "http://auth_service:3010/api/v0/authenticate?accessToken=" +
              tokens[1],
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          )
            .then((res) => {
              if (!res.ok) {
                throw res;
              }
              return res.json();
            })
            .then((sessionUser) => {
              if (roles) {
                console.log(roles);
                if (!roles.includes(sessionUser.role)) {
                  reject(new Error("Unauthorised"));
                }
              }
              resolve({ id: sessionUser.id });
            })
            .catch((err) => {
              reject(new Error("Unauthorized"));
            });
        }
      }
    });
  }
}
