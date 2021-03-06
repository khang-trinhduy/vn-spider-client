import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Routes, RouterModule } from '@angular/router'
import { ProductComponent } from './product/product.component'
import { BankComponent } from './bank/bank.component'
import { AddProductComponent } from './add-product/add-product.component'
import { AddBankComponent } from './add-bank/add-bank.component'
import { MaterialModule } from '../shared/modules/material.module'
import { BasicModule } from '../shared/modules/basic.module'
import { AddContentComponent } from './add-content/add-content.component'

const routes: Routes = [
  { path: 'product', component: ProductComponent },
  { path: '', component: BankComponent },
]

@NgModule({
  declarations: [
    ProductComponent,
    BankComponent,
    AddProductComponent,
    AddBankComponent,
    AddContentComponent,
  ],
  imports: [RouterModule.forChild(routes), CommonModule, MaterialModule, BasicModule],
  bootstrap: [BankComponent],
  entryComponents: [AddContentComponent],
})
export class BankModule {}
