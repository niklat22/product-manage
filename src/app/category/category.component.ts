import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ProjectSettingsService } from '../project-settings.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  
  form: FormGroup;
  submitted: boolean;
  projectSetting: string;
  categories: any;
  CategoryName: any;
  display: string;
  loading: boolean;
  

  
  colours: any[]
  showTags: any[] =[];
  validColours = true;
  loader: boolean;

  constructor(private projectService: ProjectSettingsService, private formBuilder: FormBuilder, public toastr: ToastrManager) { }

  ngOnInit(): void {
  this.colours=[
    {
      name: 'Black'
    },
    {
      name: 'White'
    },
    {
      name: 'Yellow'
    },
    {
      name: 'Green'
    },
    {
      name: 'Blue'
    },
    {
      name: 'Red'
    }
  ]
    this.form = this.formBuilder.group({
      category: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', [Validators.required,  Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
      colours: this.formBuilder.array([]),
      tags: []
    });
    this.projectSetting = localStorage.getItem('project')
    this.getCategories();   
  }
  getCategories(){
    this.projectService.getCategories().subscribe((res) => {
      this.loader = true;
      if(res.type){
        this.categories = res.data;
        this.categories.map((c) => c.products !== 0 ? c.products : 0)
        this.loader = false;
      }
    }); 
  }

  get productForm() { return this.form.controls; }
  openModal(category: any) {
    this.CategoryName = category
    this.display = "block";
  }

  onCloseHandled() {
    this.display = "none";
  }

  addCheck(addColour: any){
    this.form.value.colours.push(addColour)
  }

  addTags(tags: any){
    this.showTags.push(tags);
  }

  onSubmit(){
    this.submitted = true;
    if(this.form.value.colours.length == 0){
      this.validColours = false;
      return;
    }

    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.projectService.productAdd(this.form.value, this.showTags).subscribe((res: any) => {
      this.loader = true;
      if(res.type == 'success'){
        this.toastr.successToastr('Successfully Add Product.', 'Success!');
        this.loader = false;
        this.form.reset();
        this.submitted = false;
        this.onCloseHandled();
        this.getCategories();   
      }
    });
    }
}
