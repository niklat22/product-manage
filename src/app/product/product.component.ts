import { Component, Input, OnInit } from '@angular/core';
import { ProjectSettingsService } from '../project-settings.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() item = '';
  products: any;
  project: string;
  loader: boolean;
  constructor(private projectService: ProjectSettingsService) { }

  ngOnInit(): void {
    this.project = localStorage.getItem('project');
    
    this.projectService.getProducts().subscribe((res) => {
      this.loader = true;
      if(res.type){
        this.products = res.data;
        this.loader = false;
      }
    });  
  }



}
