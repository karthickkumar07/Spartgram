import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private auth: AngularFireAuth) {}

  signup(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }
  signin(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  getuser() {
    return this.auth.authState;
  }
  signout() {
    return this.auth.signOut();
  }
}
