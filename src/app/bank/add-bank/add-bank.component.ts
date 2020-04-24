import { Component, OnInit, Output } from '@angular/core'
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { BankService } from 'src/app/shared/services/bank.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { EventEmitter } from '@angular/core'

@Component({
  selector: 'add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.sass'],
})
export class AddBankComponent implements OnInit {
  form: FormGroup

  @Output('onSave') onSave = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private bankService: BankService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      link: [''],
    })
  }

  save() {
    this.bankService.post(this.form.value).subscribe((res) => {
      this._snackbar.open('Bank created', 'Ok', { duration: 2500 })
      this.onSave.emit('ok')
      this.form.reset()
    })
  }
}
