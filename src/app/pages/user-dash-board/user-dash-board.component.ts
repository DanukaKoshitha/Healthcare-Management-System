import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../service/AppointmentService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../../model/Appointment';
import { Doctor } from '../../model/Doctor';

@Component({
  selector: 'app-user-dash-board',
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './user-dash-board.component.html',
  styleUrl: './user-dash-board.component.css',
  providers : [AppointmentService],
  standalone : true
})

export class UserDashBoardComponent implements OnInit{

  constructor(private appointmentService: AppointmentService){}

  appointmentList : Appointment[] = [];
  doctorMap : Map<number, Doctor> = new Map();

  ngOnInit() {
      this.appointmentService.getAllAppointments().subscribe((res : Appointment[]) =>{
        this.appointmentList.push(...res)

        const doctorIds = [...new Set(res.map(a => a.doctorId))];

        doctorIds.forEach(id => {
            this.appointmentService.getDoctorById(id).subscribe((doc : Doctor) =>{
                this.doctorMap.set(id , doc);
            })
        });
      });
  }

  deleteAppointment(id : number){
    this.appointmentService.deleteAppointment(id).subscribe({
      next : (res) =>{
        if (res === true) {
          this.appointmentList = this.appointmentList.filter(appointment => appointment.id !== id);
        } else {
          console.error("Failed to delete appointment.");
        }
      },
      error: err => {
        console.error("Error deleting appointment:", err);
      }
    })
  }
}
