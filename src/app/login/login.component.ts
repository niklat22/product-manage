import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectSettingsService } from '../project-settings.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private projectService: ProjectSettingsService
        // private alertService: AlertService
    ) { }

    ngOnInit() {
      this.form = this.formBuilder.group({
          email: ['', Validators.required],
          password: ['', Validators.required]
      });
    }

    get loginForm() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.projectService.login(this.form.value.email, this.form.value.password).subscribe(() => {});
          if (this.projectService.isLoggedIn() !== true) {
            this.form.reset();
            this.submitted = false;
          }
    }
}
