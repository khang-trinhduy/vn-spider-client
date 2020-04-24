import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  {
    path: 'bank',
    loadChildren: () => import('./bank/bank.module').then((m) => m.BankModule),
  },
  {
    path: '',
    loadChildren: () => import('./bank/bank.module').then((m) => m.BankModule),
  },
  {
    path: 'spider',
    loadChildren: () => import('./spider/spider.module').then((m) => m.SpiderModule),
  },
  {
    path: '**',
    redirectTo: 'bank',
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
