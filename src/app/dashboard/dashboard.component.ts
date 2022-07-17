import { Component, OnInit } from '@angular/core';
import { ProjectSettingsService } from '../project-settings.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  project: string;

  constructor() { }

  ngOnInit(): void {
    this.project = localStorage.getItem('project')
  }
}
