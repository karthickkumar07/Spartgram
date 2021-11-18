import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  email = null;
  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    auth.getuser().subscribe((user) => {
      console.log("user is :", user);
      this.email = user?.email;
    });
  }

  ngOnInit(): void {}

  async handleSignout() {
    try {
      await this.auth.signout();
      this.router.navigateByUrl("/signin");
      this.toastr.info("signin to continue");
      this.email = null;
    } catch (err) {
      console.log(err);
      this.toastr.error("problem in signout");
    }
  }
}
