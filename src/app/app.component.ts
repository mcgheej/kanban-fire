import {
  CdkDragDrop,
  DragDropModule,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  runTransaction,
  updateDoc,
} from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import {
  TaskDialogComponent,
  TaskDialogResult,
} from './task-dialog/task-dialog.component';
import { Task, copyTaskWithoutId } from './task/task';
import { TaskComponent } from './task/task.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    TaskComponent,
    DragDropModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private store = inject(Firestore);
  private dialog = inject(MatDialog);

  todo = collectionData(collection(this.store, 'todo'), {
    idField: 'id',
  }) as Observable<Task[]>;
  inProgress = collectionData(collection(this.store, 'inProgress'), {
    idField: 'id',
  }) as Observable<Task[]>;
  done = collectionData(collection(this.store, 'done'), {
    idField: 'id',
  }) as Observable<Task[]>;

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {
          title: '',
          description: '',
        },
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        const collectionRef = collection(this.store, 'todo');
        addDoc(collectionRef, result.task);
      });
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        const docRef = doc(this.store, `${list}/${task.id}`);
        if (result.delete) {
          deleteDoc(docRef);
        } else {
          updateDoc(docRef, copyTaskWithoutId(task));
        }
      });
  }

  drop(ev: CdkDragDrop<Task[] | null>): void {
    if (ev) {
      const event = ev as CdkDragDrop<Task[]>;
      if (event.previousContainer === event.container) {
        return;
      }

      const item = event.previousContainer.data[event.previousIndex];
      const docRef = doc(
        this.store,
        `${event.previousContainer.id}/${item.id}`
      );
      const collectionRef = collection(this.store, event.container.id);
      console.log(item);
      runTransaction(this.store, () => {
        const promise = Promise.all([
          deleteDoc(docRef),
          addDoc(collectionRef, copyTaskWithoutId(item)),
        ]);
        return promise;
      });

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
