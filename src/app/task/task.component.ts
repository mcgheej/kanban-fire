import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Task } from './task';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
}
