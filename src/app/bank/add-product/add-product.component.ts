import { Component, OnInit, Output } from '@angular/core'
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { BankService } from 'src/app/shared/services/bank.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { EventEmitter } from '@angular/core'
import { Bank } from 'src/app/shared/models/bank'
import { ProductService } from 'src/app/shared/services/product.service'
import { Subscription } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { AddContentComponent } from '../add-content/add-content.component'

@Component({
  selector: 'add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.sass'],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup
  banks: Bank[]
  observers: Subscription[] = []

  @Output('onSave') onSave = new EventEmitter()

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private bankService: BankService,
    private productService: ProductService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.observers.push(
      this.bankService.getAll('name', 'desc', 1).subscribe((res) => (this.banks = res.items))
    )
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      bank: ['', Validators.required],
      content: [[], Validators.required],
      tag: ['', Validators.required],
    })
  }

  save() {
    this.productService.post(this.productForm.value).subscribe((res) => {
      this._snackbar.open('Product created', 'Ok', { duration: 2500 })
      this.onSave.emit('ok')
      this.productForm.reset()
    })
  }

  addContent() {
    const dialogRef = this.dialog.open(AddContentComponent, {
      height: 'auto',
      width: 'auto',
    })
    let contents = this.productForm.get('content')
    console.log(contents.value)

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (contents.value.length <= 0) {
          this.productForm.patchValue({ content: [res] })
        } else {
          this.productForm.patchValue({ content: [...contents.value, res] })
        }
      }
    })
    console.log(this.productForm)
  }
}
