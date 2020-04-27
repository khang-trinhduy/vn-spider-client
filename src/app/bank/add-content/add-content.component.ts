import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.component.html',
  styleUrls: ['./add-content.component.sass'],
})
export class AddContentComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddContentComponent>, private fb: FormBuilder) {}
  contentForm: FormGroup
  ngOnInit() {
    this.contentForm = this.fb.group({
      name: ['', Validators.required],
      content: ['', Validators.required],
      tags: [[], Validators.required],
    })
  }

  save() {
    this.dialogRef.close(this.contentForm.value)
  }
  cancel() {
    this.dialogRef.close(undefined)
  }
}
