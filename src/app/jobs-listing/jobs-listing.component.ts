import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jobs-listing',
  templateUrl: './jobs-listing.component.html',
  styleUrls: ['./jobs-listing.component.css']
})
export class JobsListingComponent implements OnInit {
  displayedColumns: string[] = ['jobs'];
  jobs: Job[] = [];
  dataSource = new MatTableDataSource<Job>(this.jobs);
  expVal: string;
  locVal: string;
  skillsVal: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    // Fetching data from API
    this.getJobsList().subscribe(
      (response: any) => {
        if (response && response.data) {
          this.jobs = response.data;
          this.dataSource.data = this.jobs;
        }
      }
    );
  }

  // API endpoint
  getJobsList() {
    return this.http.get("https://nut-case.s3.amazonaws.com/jobs.json");
  }

  clear(type: string) {
    if(type == 'exp') {
      this.expVal = '';
    } else if(type == 'loc') {
      this.locVal = '';
    } else if(type == 'skill') {
      this.skillsVal = '';
    }
    this.applyFilter();
  }

  // to search or filter from the list
  applyFilter() {
    this.dataSource.data = this.jobs.filter(
      (job) => {

        if (!this.expVal && !this.locVal && !this.skillsVal) {
          return true;
        }

        let startExp: number;
        let endExp: number;

        if (job.experience) {
          const experience = job.experience.trim();
          startExp = +experience.slice(0, experience.indexOf('-')).trim();
          endExp = +experience.slice(experience.indexOf('-') + 1, experience.lastIndexOf(' ')).trim();
        }

        if (job.experience && (+this.expVal >= startExp && +this.expVal <= endExp)) {
          if (this.locVal && job.location) {
            if (job.location.toLowerCase().indexOf(this.locVal.toLowerCase()) >= 0) {
              if (this.skillsVal && job.skills) {
                if (job.skills.toLowerCase().indexOf(this.skillsVal.toLowerCase()) >= 0) {
                  return true;
                } else {
                  return false;
                }
              } else if(this.skillsVal) {
                return false;
              }
              return true;
            } else {
              return false;
            }
          } else if (this.skillsVal && job.skills) {
            if (job.skills.toLowerCase().indexOf(this.skillsVal.toLowerCase()) >= 0) {
              return true;
            } else {
              return false;
            }
          } else if(this.skillsVal || this.locVal) {
            return false;
          }
          return true;
        } else if (this.locVal && job.location && !this.expVal) {
          if (job.location.toLowerCase().indexOf(this.locVal.toLowerCase()) >= 0) {
            if (this.skillsVal && job.skills) {
              if (job.skills.toLowerCase().indexOf(this.skillsVal.toLowerCase()) >= 0) {
                return true;
              } else {
                return false;
              }
            } else if(this.skillsVal) {
              return false;
            }
            return true;
          }
          return false;
        } else if (this.skillsVal && job.skills && !this.locVal) {
          if (job.skills.toLowerCase().indexOf(this.skillsVal.toLowerCase()) >= 0) {
            return true;
          } else {
            return false;
          }
        }
        return false;
      }
    );
  }
}

// type interface for API response data
interface Job {
  _id: string,
  title: string,
  applylink: string,
  jd: string,
  companyname: string,
  location: string,
  experience: string,
  salary: string,
  type: string,
  skills: string,
  startdate: string,
  enddate: string,
  created: string,
  source: string,
  timestamp: number,
  __v: number
}
