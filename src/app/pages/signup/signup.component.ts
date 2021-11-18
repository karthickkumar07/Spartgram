import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { NgForm } from "@angular/forms";
import { finalize } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFireDatabase } from "@angular/fire/database";
import { readAndCompressImage } from "browser-image-resizer";
import { imageConfig } from "src/utils/config";
import { v4 as uuidv4 } from "uuid";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  picture: string =
    "https://atlas-content-cdn.pixelsquid.com/assets_v2/148/1481238072640148648/jpeg-600/G03.jpg?modifiedAt=1";
  uploadPercent: number = null;
  constructor(
    private auth: AuthService,
    private router: Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  onSubmit(f: NgForm) {
    const { email, password, username, country, bio, name } = f.form.value;

    this.auth
      .signup(email, password)
      .then((res) => {
        console.log(res);
        const { uid } = res.user;
        this.db.object(`/users/${uid}`).set({
          // object is a path refernce
          id: uid,
          name: name,
          email: email,
          instauserName: username,
          country: country,
          bio: bio,
          picture: this.picture,
        });
      })
      .then(() => {
        this.router.navigateByUrl("/");
        this.toastr.success("successfully signned up!");
      })
      .catch((err) => {
        console.log(err);
        this.toastr.error("signnedup failed");
      });
  }

  async uploadFile(event) {
    const file = event.target.files[0];

    let resizedImage = await readAndCompressImage(file, imageConfig);
    const filepath = uuidv4(); // rename the image with uuid TODO:

    const fileRef = this.storage.ref(filepath);
    const task = this.storage.upload(filepath, resizedImage);

    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent = percentage;
    });
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.picture = url;
            this.toastr.success("image uploaded successfully");
          });
        })
      )
      .subscribe();
  }
}
